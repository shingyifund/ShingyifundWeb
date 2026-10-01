export const MAX_REPORT_PDF_SIZE = 50 * 1024 * 1024;

export type ReportSubmitPhase = "idle" | "preparing" | "uploading" | "saving";

export function validateReportPdf(file: File) {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return "檔案格式需為 PDF，請重新選擇檔案。";
  }
  if (file.size <= 0) return "PDF 檔案不可為空白，請重新選擇檔案。";
  if (file.size > MAX_REPORT_PDF_SIZE) {
    return `PDF 檔案大小為 ${(file.size / 1024 / 1024).toFixed(1)}MB，超過 50MB 上限，請縮小檔案後再上傳。`;
  }
  return null;
}

export function validateReportFields(year: string, title: string, comparisonYear?: string) {
  const isYear = (value: string) =>
    value.trim() !== "" && Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 999;
  if (!isYear(year)) return "請輸入有效年度（1–999）。";
  if (!title.trim()) return "請輸入報告標題。";
  if (comparisonYear?.trim() && !isYear(comparisonYear)) return "比較年度需為 1–999，或留空。";
  return null;
}

export function getReportErrorMessage(error: unknown, phase: ReportSubmitPhase) {
  const details = error && typeof error === "object"
    ? error as { message?: unknown; status?: unknown; statusCode?: unknown; digest?: unknown }
    : null;
  const message = typeof error === "string" ? error.trim()
    : typeof details?.message === "string" ? details.message.trim() : "";
  const status = Number(details?.statusCode ?? details?.status);
  const prefix = phase === "preparing" ? "準備上傳失敗"
    : phase === "uploading" ? "PDF 上傳失敗" : "儲存報告失敗";

  // A server action may already have returned a translated, contextual error.
  if (/^(準備上傳失敗|PDF 上傳失敗|儲存報告失敗)：/.test(message)) return message;

  let reason: string;
  if (/row.level security|permission denied|access denied|forbidden|not authorized|權限/i.test(message) || status === 403) {
    reason = "目前帳號沒有上傳或儲存權限，請聯絡管理員確認權限設定。";
  } else if (/jwt.*expired|token.*expired|expired.*token|invalid.*token|invalid.*jwt|unauthorized|未授權|not authenticated|auth session missing|session.*expired/i.test(message) || status === 401) {
    reason = "登入或上傳授權已失效，請重新登入後再試。";
  } else if (/payload.*too large|content too large|exceed.*size|maximum.*size|entity too large|413|超過.*MB/i.test(message) || status === 413) {
    reason = "檔案超過上傳服務允許的大小，請縮小 PDF 後再試（本表單上限 50MB）。";
  } else if (/bucket.*not found|bucket.*does not exist/i.test(message)) {
    reason = "找不到報告檔案儲存空間，請聯絡管理員確認儲存設定。";
  } else if (/mime|content.type|unsupported.*type/i.test(message) || status === 415) {
    reason = "上傳服務不接受此檔案格式，請確認檔案為 PDF。";
  } else if (/failed to fetch|fetch failed|network|load failed|timeout|timed out|連線/i.test(message)) {
    reason = "無法連線至上傳或儲存服務，請檢查網路後重試。";
  } else if (/supabase(url|key).*required|invalid api key/i.test(message)) {
    reason = "儲存服務設定不完整，請聯絡管理員。";
  } else if (details?.digest || /server components render|unexpected response.*server|internal server error/i.test(message) || status >= 500) {
    reason = "伺服器處理失敗，請稍後重試；若持續發生，請聯絡管理員。";
  } else {
    reason = message || "未收到服務的錯誤原因，請稍後重試；若持續發生，請聯絡管理員。";
  }
  return `${prefix}：${reason}`;
}
