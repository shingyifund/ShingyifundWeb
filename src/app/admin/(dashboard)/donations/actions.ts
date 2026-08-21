"use server";

import { revalidatePath } from "next/cache";
import { isAuthorizedAdminEmail } from "@/lib/admin-auth";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import type {
  DonationImportPayload,
  DonationImportResult,
  DonationType,
} from "@/lib/donation-registry";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_RECORDS = 25_000;
const VALID_DONATION_TYPES = new Set<DonationType>(["general", "fundraising"]);

export type DonationImportActionResult =
  | { ok: true; data: DonationImportResult; message: string }
  | { ok: false; message: string };

async function getAuthorizedAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return isAuthorizedAdminEmail(user?.email) ? user : null;
}
function isValidIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day &&
    year >= 1912 &&
    year <= new Date().getUTCFullYear() + 1
  );
}

function validatePayload(payload: DonationImportPayload) {
  if (!payload || typeof payload !== "object") return "匯入資料格式不正確。";
  if (!/\.(xls|xlsx)$/i.test(payload.file_name) || payload.file_name.length > 255) {
    return "檔案名稱或格式不正確。";
  }
  if (!Number.isInteger(payload.file_size) || payload.file_size <= 0 || payload.file_size > MAX_FILE_BYTES) {
    return "Excel 檔案必須小於 10 MB。";
  }
  if (!/^[0-9a-f]{64}$/.test(payload.file_hash)) return "檔案驗證碼不正確。";
  if (!Array.isArray(payload.records) || payload.records.length === 0 || payload.records.length > MAX_RECORDS) {
    return `資料筆數必須介於 1 至 ${MAX_RECORDS.toLocaleString("zh-TW")} 筆。`;
  }

  const sourceRows = new Set<string>();
  for (const row of payload.records) {
    if (
      !isValidIsoDate(row.donation_date) ||
      typeof row.donor_name !== "string" ||
      row.donor_name.trim().length === 0 ||
      row.donor_name.trim().length > 200 ||
      !Number.isSafeInteger(row.amount) ||
      row.amount <= 0 ||
      !VALID_DONATION_TYPES.has(row.donation_type) ||
      typeof row.is_anonymous !== "boolean" ||
      typeof row.source_sheet !== "string" ||
      row.source_sheet.trim().length === 0 ||
      row.source_sheet.length > 100 ||
      !Number.isInteger(row.source_row) ||
      row.source_row <= 0
    ) {
      return `工作表「${row.source_sheet || "未知"}」第 ${row.source_row || "?"} 列資料不正確。`;
    }

    const sourceKey = `${row.source_sheet}\u0000${row.source_row}`;
    if (sourceRows.has(sourceKey)) return `工作表「${row.source_sheet}」第 ${row.source_row} 列重複。`;
    sourceRows.add(sourceKey);
  }

  return null;
}

function errorMessage(message: string) {
  if (message.includes("DUPLICATE_FILE")) return "這份 Excel 已經匯入過，資料未重複新增。";
  if (message.includes("INVALID_RECORD_COUNT")) return "Excel 資料筆數超過限制。";
  if (message.includes("INVALID_RECORD_DATA")) return "Excel 內含格式不正確的資料，請重新檢查。";
  if (message.includes("Could not find the function") || message.includes("schema cache")) {
    return "找不到捐款匯入資料表或函式，請先執行提供的 Supabase SQL。";
  }
  return `匯入失敗：${message}`;
}

export async function importDonationWorkbook(
  payload: DonationImportPayload,
): Promise<DonationImportActionResult> {
  const user = await getAuthorizedAdmin();
  if (!user) return { ok: false, message: "登入已逾時，請重新登入後再匯入。" };

  const validationError = validatePayload(payload);
  if (validationError) return { ok: false, message: validationError };

  const supabase = await createAdminClient();
  const { data, error } = await supabase.rpc("import_donation_workbook", {
    p_file_name: payload.file_name.trim(),
    p_file_size: payload.file_size,
    p_file_hash: payload.file_hash,
    p_imported_by: user.id,
    p_records: payload.records,
  });

  if (error || !data || typeof data !== "object" || Array.isArray(data)) {
    return { ok: false, message: errorMessage(error?.message ?? "資料庫沒有回傳匯入結果。") };
  }

  const raw = data as Record<string, unknown>;
  const result: DonationImportResult = {
    importId: String(raw.importId ?? ""),
    recordCount: Number(raw.recordCount) || 0,
    periodCount: Number(raw.periodCount) || 0,
    totalAmount: Number(raw.totalAmount) || 0,
    replacedRecordCount: Number(raw.replacedRecordCount) || 0,
    replacedPeriodCount: Number(raw.replacedPeriodCount) || 0,
  };

  revalidatePath("/transparency/donors");
  revalidatePath("/admin/donations");

  return {
    ok: true,
    data: result,
    message: `已匯入 ${result.recordCount.toLocaleString("zh-TW")} 筆資料，取代 ${result.replacedPeriodCount} 個既有月份／類別。`,
  };
}

export async function deleteDonationImport(batchId: string) {
  const user = await getAuthorizedAdmin();
  if (!user || !/^[0-9a-f-]{36}$/i.test(batchId)) return;

  const supabase = await createAdminClient();
  const { error } = await supabase.from("donation_import_batches").delete().eq("id", batchId);
  if (error) throw new Error(error.message);

  revalidatePath("/transparency/donors");
  revalidatePath("/admin/donations");
}
