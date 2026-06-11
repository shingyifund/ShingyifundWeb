"use server";

import { isAuthorizedAdminEmail } from "@/lib/admin-auth";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const BUCKET = "fundraising-reports";
const SELECT_COLS =
  "id, title, fiscal_year, file_url, file_path, file_name, file_size, created_at, updated_at";

export type FundraisingReportRecord = {
  id: string;
  title: string;
  fiscal_year: number;
  file_url: string;
  file_path: string;
  file_name: string | null;
  file_size: number | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ActionResult = {
  ok: boolean;
  message?: string;
};

async function getAuthorizedAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAuthorizedAdminEmail(user?.email)) return null;
  return user;
}

async function assertAdmin() {
  const user = await getAuthorizedAdmin();
  if (!user) throw new Error("Unauthorized");
}

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseYear(formData: FormData, key: string) {
  const value = Number(textValue(formData, key));
  if (!Number.isInteger(value) || value < 1 || value > 999) return null;
  return value;
}

function defaultTitle(year: number) {
  return `${year}年度勸募成果報告`;
}

function reportPayload(formData: FormData) {
  const fiscalYear = parseYear(formData, "fiscal_year");
  if (fiscalYear === null) return { error: "請輸入有效年度" as const };

  const title = textValue(formData, "title") ?? defaultTitle(fiscalYear);
  return { data: { title, fiscal_year: fiscalYear } };
}

function revalidateFundraisingReports() {
  revalidatePath("/transparency/fundraising");
  revalidatePath("/");
}

export async function listFundraisingReports(): Promise<FundraisingReportRecord[]> {
  await assertAdmin();

  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("fundraising_reports")
    .select(SELECT_COLS)
    .order("fiscal_year", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getFundraisingReportById(
  id: string,
): Promise<FundraisingReportRecord | null> {
  await assertAdmin();

  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("fundraising_reports")
    .select(SELECT_COLS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

async function uploadPdfFile(
  file: FormDataEntryValue | null,
  fiscalYear: number,
): Promise<
  | { ok: true; url: string; path: string; fileName: string; fileSize: number }
  | { ok: false; message: string }
> {
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "請選擇 PDF 檔案" };
  }

  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return { ok: false, message: "檔案格式需為 PDF" };
  }

  const supabase = await createAdminClient();
  const path = `${fiscalYear}-${crypto.randomUUID()}.pdf`;
  const bytes = await file.arrayBuffer();

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: "application/pdf", upsert: false });

  if (error) return { ok: false, message: error.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(data.path);

  return {
    ok: true,
    url: publicUrl,
    path: data.path,
    fileName: file.name,
    fileSize: file.size,
  };
}

export async function createFundraisingReport(
  formData: FormData,
): Promise<ActionResult> {
  const user = await getAuthorizedAdmin();
  if (!user) return { ok: false, message: "未授權" };

  const payload = reportPayload(formData);
  if ("error" in payload) return { ok: false, message: payload.error };

  const upload = await uploadPdfFile(formData.get("pdf_file"), payload.data.fiscal_year);
  if (!upload.ok) return { ok: false, message: upload.message };

  const supabase = await createAdminClient();
  const { error } = await supabase.from("fundraising_reports").insert({
    ...payload.data,
    file_url: upload.url,
    file_path: upload.path,
    file_name: upload.fileName,
    file_size: upload.fileSize,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    await supabase.storage.from(BUCKET).remove([upload.path]);
    return { ok: false, message: error.message };
  }

  revalidateFundraisingReports();
  return { ok: true };
}

export async function updateFundraisingReport(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const user = await getAuthorizedAdmin();
  if (!user) return { ok: false, message: "未授權" };

  const payload = reportPayload(formData);
  if ("error" in payload) return { ok: false, message: payload.error };

  const supabase = await createAdminClient();
  const { data: existing, error: fetchError } = await supabase
    .from("fundraising_reports")
    .select("file_path")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) return { ok: false, message: fetchError.message };
  if (!existing) return { ok: false, message: "找不到勸募成果報告" };

  const file = formData.get("pdf_file");
  const hasNewFile = file instanceof File && file.size > 0;
  const upload = hasNewFile
    ? await uploadPdfFile(file, payload.data.fiscal_year)
    : null;

  if (upload && !upload.ok) return { ok: false, message: upload.message };

  const updatePayload = {
    ...payload.data,
    ...(upload?.ok
      ? {
          file_url: upload.url,
          file_path: upload.path,
          file_name: upload.fileName,
          file_size: upload.fileSize,
        }
      : {}),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("fundraising_reports")
    .update(updatePayload)
    .eq("id", id);

  if (error) {
    if (upload?.ok) await supabase.storage.from(BUCKET).remove([upload.path]);
    return { ok: false, message: error.message };
  }

  if (upload?.ok && existing.file_path) {
    await supabase.storage.from(BUCKET).remove([existing.file_path]);
  }

  revalidateFundraisingReports();
  return { ok: true };
}

export async function deleteFundraisingReport(
  id: string,
  filePath: string,
): Promise<ActionResult> {
  const user = await getAuthorizedAdmin();
  if (!user) return { ok: false, message: "未授權" };

  const supabase = await createAdminClient();
  const { error } = await supabase.from("fundraising_reports").delete().eq("id", id);

  if (error) return { ok: false, message: error.message };

  if (filePath) {
    await supabase.storage.from(BUCKET).remove([filePath]);
  }

  revalidateFundraisingReports();
  return { ok: true };
}
