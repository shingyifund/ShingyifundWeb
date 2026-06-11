"use server";

import { isAuthorizedAdminEmail } from "@/lib/admin-auth";
import { deleteCloudinaryImage, uploadCloudinaryImage } from "@/lib/cloudinary";
import {
  MONTHLY_DONATION_DONOR_TYPES,
  MONTHLY_DONATION_REGIONS,
  getMonthlyDonationDonorTypeLabel,
  getMonthlyDonationRegionLabel,
} from "@/lib/monthly-donations";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import type {
  MonthlyDonationDonorType,
  MonthlyDonationRegion,
} from "@/lib/types";
import { revalidatePath } from "next/cache";

const REPORT_COLS =
  "id, title, western_year, month, region, donor_type, content_text, is_published, created_at, updated_at";
const IMAGE_COLS =
  "id, report_id, public_id, image_url, file_name, file_size, width, height, sort_order, created_at";
const MAX_IMAGE_BYTES = 500 * 1024;
const MAX_IMAGE_COUNT = 40;

export type MonthlyDonationImageRecord = {
  id: string;
  report_id: string;
  public_id: string;
  image_url: string;
  file_name: string | null;
  file_size: number | null;
  width: number | null;
  height: number | null;
  sort_order: number;
  created_at: string | null;
};

export type MonthlyDonationReportRecord = {
  id: string;
  title: string;
  western_year: number;
  month: number;
  region: MonthlyDonationRegion;
  donor_type: MonthlyDonationDonorType;
  content_text: string;
  is_published: boolean;
  created_at: string | null;
  updated_at: string | null;
  images: MonthlyDonationImageRecord[];
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

function parsePeriod(formData: FormData) {
  const period = textValue(formData, "period");
  const match = period?.match(/^(\d{4})-(\d{2})$/);
  if (!match) return null;

  const westernYear = Number(match[1]);
  const month = Number(match[2]);
  if (!Number.isInteger(westernYear) || westernYear < 1912 || westernYear > 2999) {
    return null;
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) return null;

  return { westernYear, month };
}

function defaultTitle({
  westernYear,
  month,
  region,
  donorType,
}: {
  westernYear: number;
  month: number;
  region: MonthlyDonationRegion;
  donorType: MonthlyDonationDonorType;
}) {
  return `${westernYear}年${String(month).padStart(2, "0")}月${getMonthlyDonationRegionLabel(region)}${getMonthlyDonationDonorTypeLabel(donorType)}捐贈明細`;
}

function reportPayload(formData: FormData) {
  const period = parsePeriod(formData);
  const region = textValue(formData, "region") as MonthlyDonationRegion | null;
  const donorType = textValue(formData, "donor_type") as
    | MonthlyDonationDonorType
    | null;
  const contentText = textValue(formData, "content_text");

  if (!period) return { error: "請選擇有效年月" as const };
  if (!region || !MONTHLY_DONATION_REGIONS.some((item) => item.value === region)) {
    return { error: "請選擇區域" as const };
  }
  if (
    !donorType ||
    !MONTHLY_DONATION_DONOR_TYPES.some((item) => item.value === donorType)
  ) {
    return { error: "請選擇個人或團體" as const };
  }
  if (!contentText) return { error: "請輸入捐贈明細" as const };

  const title =
    textValue(formData, "title") ??
    defaultTitle({
      westernYear: period.westernYear,
      month: period.month,
      region,
      donorType,
    });

  return {
    data: {
      title,
      western_year: period.westernYear,
      month: period.month,
      region,
      donor_type: donorType,
      content_text: contentText,
      is_published: formData.get("is_published") === "true",
      updated_at: new Date().toISOString(),
    },
  };
}

function imageFiles(formData: FormData) {
  return formData
    .getAll("images")
    .filter((file): file is File => file instanceof File && file.size > 0);
}

function validateImages(files: File[]) {
  if (files.length > MAX_IMAGE_COUNT) {
    return `每筆最多上傳 ${MAX_IMAGE_COUNT} 張圖片`;
  }

  for (const file of files) {
    if (!file.type.startsWith("image/")) return "檔案格式需為圖片";
    if (file.size > MAX_IMAGE_BYTES) {
      return "圖片壓縮後仍超過 500KB，請換較小圖片。";
    }
  }

  return null;
}

function cloudinaryFolder(payload: {
  western_year: number;
  month: number;
  region: MonthlyDonationRegion;
  donor_type: MonthlyDonationDonorType;
}) {
  return [
    "monthly-donations",
    String(payload.western_year),
    String(payload.month).padStart(2, "0"),
    payload.region,
    payload.donor_type,
  ].join("/");
}

function optimizedCloudinaryUrl(url: string) {
  return url.replace("/upload/", "/upload/f_auto,q_auto/");
}

function revalidateMonthlyDonations() {
  revalidatePath("/transparency/monthly-donations");
  revalidatePath("/");
}

async function listImages(reportIds: string[]) {
  if (reportIds.length === 0) return new Map<string, MonthlyDonationImageRecord[]>();

  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("monthly_donation_images")
    .select(IMAGE_COLS)
    .in("report_id", reportIds)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);

  const map = new Map<string, MonthlyDonationImageRecord[]>();
  for (const image of (data ?? []) as MonthlyDonationImageRecord[]) {
    const images = map.get(image.report_id) ?? [];
    images.push(image);
    map.set(image.report_id, images);
  }

  return map;
}

export async function listMonthlyDonationReports(): Promise<
  MonthlyDonationReportRecord[]
> {
  await assertAdmin();

  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("monthly_donation_reports")
    .select(REPORT_COLS)
    .order("western_year", { ascending: false })
    .order("month", { ascending: false })
    .order("region", { ascending: true })
    .order("donor_type", { ascending: true });

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as Omit<MonthlyDonationReportRecord, "images">[];
  const imagesByReportId = await listImages(rows.map((row) => row.id));

  return rows.map((row) => ({
    ...row,
    images: imagesByReportId.get(row.id) ?? [],
  }));
}

export async function getMonthlyDonationReportById(
  id: string,
): Promise<MonthlyDonationReportRecord | null> {
  await assertAdmin();

  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("monthly_donation_reports")
    .select(REPORT_COLS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const imagesByReportId = await listImages([data.id]);

  return {
    ...(data as Omit<MonthlyDonationReportRecord, "images">),
    images: imagesByReportId.get(data.id) ?? [],
  };
}

async function uploadImages({
  files,
  reportId,
  payload,
  startSortOrder,
}: {
  files: File[];
  reportId: string;
  payload: {
    western_year: number;
    month: number;
    region: MonthlyDonationRegion;
    donor_type: MonthlyDonationDonorType;
  };
  startSortOrder: number;
}) {
  const uploaded: Array<{
    public_id: string;
    image_url: string;
    file_name: string;
    file_size: number | null;
    width: number | null;
    height: number | null;
    sort_order: number;
  }> = [];
  const folder = cloudinaryFolder(payload);

  for (const [index, file] of files.entries()) {
    const upload = await uploadCloudinaryImage({
      file,
      folder,
      publicId: crypto.randomUUID(),
    });

    uploaded.push({
      public_id: upload.publicId,
      image_url: optimizedCloudinaryUrl(upload.imageUrl),
      file_name: file.name,
      file_size: upload.fileSize,
      width: upload.width,
      height: upload.height,
      sort_order: startSortOrder + index,
    });
  }

  const supabase = await createAdminClient();
  const rows = uploaded.map((image) => ({
    report_id: reportId,
    ...image,
  }));
  const { error } = await supabase.from("monthly_donation_images").insert(rows);

  if (error) {
    await Promise.allSettled(
      uploaded.map((image) => deleteCloudinaryImage(image.public_id)),
    );
    throw new Error(error.message);
  }
}

export async function createMonthlyDonationReport(
  formData: FormData,
): Promise<ActionResult> {
  const user = await getAuthorizedAdmin();
  if (!user) return { ok: false, message: "未授權" };

  const payload = reportPayload(formData);
  if ("error" in payload) return { ok: false, message: payload.error };

  const files = imageFiles(formData);
  const imageError = validateImages(files);
  if (imageError) return { ok: false, message: imageError };

  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("monthly_donation_reports")
    .insert(payload.data)
    .select("id")
    .single();

  if (error) return { ok: false, message: error.message };

  try {
    await uploadImages({
      files,
      reportId: data.id,
      payload: payload.data,
      startSortOrder: 1,
    });
  } catch (error) {
    await supabase.from("monthly_donation_reports").delete().eq("id", data.id);
    return {
      ok: false,
      message: error instanceof Error ? error.message : "圖片上傳失敗",
    };
  }

  revalidateMonthlyDonations();
  return { ok: true };
}

export async function updateMonthlyDonationReport(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const user = await getAuthorizedAdmin();
  if (!user) return { ok: false, message: "未授權" };

  const payload = reportPayload(formData);
  if ("error" in payload) return { ok: false, message: payload.error };

  const files = imageFiles(formData);
  const imageError = validateImages(files);
  if (imageError) return { ok: false, message: imageError };

  const supabase = await createAdminClient();
  const { data: existing, error: fetchError } = await supabase
    .from("monthly_donation_reports")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) return { ok: false, message: fetchError.message };
  if (!existing) return { ok: false, message: "找不到每月捐物清單" };

  const deleteIds = formData
    .getAll("delete_image_ids")
    .filter((value): value is string => typeof value === "string");

  if (deleteIds.length > 0) {
    const { data: images, error } = await supabase
      .from("monthly_donation_images")
      .select("id, public_id")
      .eq("report_id", id)
      .in("id", deleteIds);

    if (error) return { ok: false, message: error.message };

    const { error: deleteError } = await supabase
      .from("monthly_donation_images")
      .delete()
      .eq("report_id", id)
      .in("id", deleteIds);

    if (deleteError) return { ok: false, message: deleteError.message };

    await Promise.allSettled(
      (images ?? []).map((image) => deleteCloudinaryImage(image.public_id)),
    );
  }

  const { error: updateError } = await supabase
    .from("monthly_donation_reports")
    .update(payload.data)
    .eq("id", id);

  if (updateError) return { ok: false, message: updateError.message };

  if (files.length > 0) {
    const { data: lastImage, error } = await supabase
      .from("monthly_donation_images")
      .select("sort_order")
      .eq("report_id", id)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) return { ok: false, message: error.message };

    try {
      await uploadImages({
        files,
        reportId: id,
        payload: payload.data,
        startSortOrder: (lastImage?.sort_order ?? 0) + 1,
      });
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "圖片上傳失敗",
      };
    }
  }

  revalidateMonthlyDonations();
  return { ok: true };
}

export async function deleteMonthlyDonationReport(
  id: string,
): Promise<ActionResult> {
  const user = await getAuthorizedAdmin();
  if (!user) return { ok: false, message: "未授權" };

  const supabase = await createAdminClient();
  const { data: images, error: imageError } = await supabase
    .from("monthly_donation_images")
    .select("public_id")
    .eq("report_id", id);

  if (imageError) return { ok: false, message: imageError.message };

  const { error } = await supabase
    .from("monthly_donation_reports")
    .delete()
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  await Promise.allSettled(
    (images ?? []).map((image) => deleteCloudinaryImage(image.public_id)),
  );

  revalidateMonthlyDonations();
  return { ok: true };
}

export async function toggleMonthlyDonationPublished(
  id: string,
  isPublished: boolean,
): Promise<ActionResult> {
  const user = await getAuthorizedAdmin();
  if (!user) return { ok: false, message: "未授權" };

  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("monthly_donation_reports")
    .update({
      is_published: isPublished,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  revalidateMonthlyDonations();
  return { ok: true };
}
