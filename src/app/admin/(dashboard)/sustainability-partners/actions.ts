"use server";

import { revalidatePath } from "next/cache";
import { isAuthorizedAdminEmail } from "@/lib/admin-auth";
import { createAdminClient, createClient } from "@/lib/supabase/server";

const BUCKET = "sustainability-partner-logos";
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export type SustainabilityPartnerRecord = {
  id: string;
  name: string;
  name_en: string | null;
  logo_url: string;
  logo_path: string;
  website_url: string | null;
  sort_order: number;
  is_active: boolean;
  updated_at: string | null;
};

export type PartnerActionResult = { ok: boolean; message?: string };

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAuthorizedAdminEmail(user?.email)) throw new Error("Unauthorized");
}

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function revalidatePartners() {
  revalidatePath("/admin/sustainability-partners");
  revalidatePath("/sustainability/action");
  revalidatePath("/tw/sustainability/action");
  revalidatePath("/en/sustainability/action");
}

export async function listSustainabilityPartners(): Promise<SustainabilityPartnerRecord[]> {
  await assertAdmin();
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("sustainability_partners")
    .select("id, name, name_en, logo_url, logo_path, website_url, sort_order, is_active, updated_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return [];
  return (data ?? []) as SustainabilityPartnerRecord[];
}

async function uploadLogo(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false as const, message: "請選擇 Logo 圖片" };
  }
  if (!ACCEPTED_TYPES.has(file.type)) {
    return { ok: false as const, message: "Logo 僅支援 JPG、PNG 或 WebP" };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { ok: false as const, message: "Logo 檔案不可超過 5MB" };
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `${crypto.randomUUID()}.${extension}`;
  const supabase = await createAdminClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, await file.arrayBuffer(), {
      contentType: file.type,
      upsert: false,
    });

  if (error) return { ok: false as const, message: error.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(data.path);

  return { ok: true as const, path: data.path, url: publicUrl };
}

export async function createSustainabilityPartner(
  formData: FormData,
): Promise<PartnerActionResult> {
  await assertAdmin();
  const name = textValue(formData, "name");
  if (!name) return { ok: false, message: "請輸入合作夥伴名稱" };

  const upload = await uploadLogo(formData.get("logo_file"));
  if (!upload.ok) return upload;

  const supabase = await createAdminClient();
  const { count } = await supabase
    .from("sustainability_partners")
    .select("*", { count: "exact", head: true });

  const { error } = await supabase.from("sustainability_partners").insert({
    name,
    name_en: textValue(formData, "name_en"),
    logo_url: upload.url,
    logo_path: upload.path,
    website_url: textValue(formData, "website_url"),
    sort_order: count ?? 0,
    is_active: true,
  });

  if (error) {
    await supabase.storage.from(BUCKET).remove([upload.path]);
    return { ok: false, message: error.message };
  }

  revalidatePartners();
  return { ok: true };
}

export async function toggleSustainabilityPartner(
  id: string,
  isActive: boolean,
): Promise<PartnerActionResult> {
  await assertAdmin();
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("sustainability_partners")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };
  revalidatePartners();
  return { ok: true };
}

export async function moveSustainabilityPartner(
  id: string,
  direction: "up" | "down",
): Promise<PartnerActionResult> {
  await assertAdmin();
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("sustainability_partners")
    .select("id, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return { ok: false, message: error.message };
  const rows = data ?? [];
  const index = rows.findIndex((row) => row.id === id);
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || targetIndex < 0 || targetIndex >= rows.length) return { ok: true };

  const reordered = [...rows];
  const [item] = reordered.splice(index, 1);
  reordered.splice(targetIndex, 0, item);

  for (let sortOrder = 0; sortOrder < reordered.length; sortOrder += 1) {
    if (reordered[sortOrder].sort_order === sortOrder) continue;
    const { error: updateError } = await supabase
      .from("sustainability_partners")
      .update({ sort_order: sortOrder })
      .eq("id", reordered[sortOrder].id);
    if (updateError) return { ok: false, message: updateError.message };
  }

  revalidatePartners();
  return { ok: true };
}

export async function deleteSustainabilityPartner(
  id: string,
): Promise<PartnerActionResult> {
  await assertAdmin();
  const supabase = await createAdminClient();
  const { data: existing, error: readError } = await supabase
    .from("sustainability_partners")
    .select("logo_path")
    .eq("id", id)
    .maybeSingle();

  if (readError) return { ok: false, message: readError.message };
  const { error } = await supabase.from("sustainability_partners").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  if (existing?.logo_path) {
    await supabase.storage.from(BUCKET).remove([existing.logo_path]);
  }

  revalidatePartners();
  return { ok: true };
}
