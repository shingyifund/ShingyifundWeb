import type {
  RecipientImportPayload,
  RecipientImportPeriod,
  RecipientImportRowInput,
} from "@/lib/recipient-registry";

export const MAX_RECIPIENT_WORKBOOK_BYTES = 10 * 1024 * 1024;
export const MAX_RECIPIENT_WORKBOOK_ROWS = 25_000;
const MAX_WORKSHEETS = 40;
const MAX_REPORTED_ERRORS = 100;

type CellValue = string | number | boolean | Date | null | undefined;

export type RecipientWorkbookIssue = {
  sheet: string;
  row: number;
  message: string;
};

export type RecipientSheetSummary = {
  sheet: string;
  westernYear: number;
  month: number;
  recordCount: number;
  totalAmount: number;
};

export type ParsedRecipientWorkbook = RecipientImportPayload & {
  issues: RecipientWorkbookIssue[];
  sheets: RecipientSheetSummary[];
  periodCount: number;
  totalAmount: number;
  duplicateCount: number;
  previewRows: RecipientImportRowInput[];
};

function textValue(value: CellValue) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\u0000/g, "").trim();
}

function compactText(value: CellValue) {
  return textValue(value).replace(/[\s　]+/g, "");
}

function parseSheetPeriod(sheetName: string) {
  const match = /(\d{2,4})\s*(?:年|[./-])\s*(\d{1,2})\s*月/.exec(sheetName);
  if (!match) return null;
  const sourceYear = Number(match[1]);
  const westernYear = sourceYear < 1912 ? sourceYear + 1911 : sourceYear;
  const month = Number(match[2]);
  if (westernYear < 1912 || westernYear > 2999 || month < 1 || month > 12) return null;
  return { westernYear, month };
}

function toIsoDate(parts: { year: number; month: number; day: number }) {
  const { year, month, day } = parts;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseTextDate(value: string) {
  const match = /^(\d{2,4})[\/.\-](\d{1,2})[\/.\-](\d{1,2})/.exec(value.trim());
  if (!match) return null;
  const rawYear = Number(match[1]);
  return toIsoDate({
    year: rawYear < 1912 ? rawYear + 1911 : rawYear,
    month: Number(match[2]),
    day: Number(match[3]),
  });
}

function parseAmount(value: CellValue) {
  if (typeof value === "number") {
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  }
  const normalized = textValue(value).replace(/[,，$＄NTD元\s]/gi, "");
  if (!/^\d+$/.test(normalized)) return null;
  const amount = Number(normalized);
  return Number.isSafeInteger(amount) && amount > 0 ? amount : null;
}

function normalizeName(value: string) {
  return value.toLocaleLowerCase("zh-TW").replace(/[\s　]+/g, "");
}

async function sha256Hex(buffer: ArrayBuffer) {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function parseRecipientWorkbook(file: File): Promise<ParsedRecipientWorkbook> {
  if (!/\.(xls|xlsx)$/i.test(file.name)) throw new Error("僅支援 .xls 或 .xlsx 檔案。");
  if (file.size <= 0 || file.size > MAX_RECIPIENT_WORKBOOK_BYTES) {
    throw new Error("Excel 檔案必須小於 10 MB。");
  }

  const buffer = await file.arrayBuffer();
  const [XLSX, fileHash] = await Promise.all([import("xlsx"), sha256Hex(buffer)]);
  const workbook = XLSX.read(buffer, {
    type: "array",
    cellDates: true,
    cellFormula: false,
    cellHTML: false,
    cellStyles: false,
    dense: true,
  });

  if (workbook.SheetNames.length === 0) throw new Error("Excel 內沒有工作表。");
  if (workbook.SheetNames.length > MAX_WORKSHEETS) {
    throw new Error(`工作表不可超過 ${MAX_WORKSHEETS} 個。`);
  }

  const records: RecipientImportRowInput[] = [];
  const recordKeys = new Set<string>();
  const periodMap = new Map<string, RecipientImportPeriod>();
  const issues: RecipientWorkbookIssue[] = [];
  const sheets: RecipientSheetSummary[] = [];
  let duplicateCount = 0;

  const reportIssue = (issue: RecipientWorkbookIssue) => {
    if (issues.length < MAX_REPORTED_ERRORS) issues.push(issue);
  };

  for (const sheetName of workbook.SheetNames) {
    const period = parseSheetPeriod(sheetName);
    if (!period) {
      reportIssue({ sheet: sheetName, row: 0, message: "工作表名稱無法辨識年月，格式應如「115.6月」。" });
      continue;
    }
    periodMap.set(`${period.westernYear}-${period.month}`, {
      western_year: period.westernYear,
      month: period.month,
    });

    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<CellValue[]>(worksheet, {
      header: 1,
      raw: true,
      defval: null,
      blankrows: false,
    });
    const headerIndex = rows.slice(0, 15).findIndex((row) => {
      const cells = row.map(compactText);
      return (
        cells.some((cell) => cell === "日期") &&
        cells.some((cell) => /受贈(對象)?(姓名|名稱)/.test(cell)) &&
        cells.some((cell) => /受贈金額|金額/.test(cell))
      );
    });

    if (headerIndex < 0) {
      reportIssue({ sheet: sheetName, row: 0, message: "找不到「日期／受贈對象名稱／受贈金額」欄位。" });
      continue;
    }

    const headers = rows[headerIndex].map(compactText);
    const dateColumn = headers.findIndex((cell) => cell === "日期");
    const nameColumn = headers.findIndex((cell) => /受贈(對象)?(姓名|名稱)/.test(cell));
    const amountColumn = headers.findIndex((cell) => /受贈金額|金額/.test(cell));
    let sheetRecordCount = 0;
    let sheetTotalAmount = 0;

    for (let index = headerIndex + 1; index < rows.length; index += 1) {
      const row = rows[index];
      const excelRow = index + 1;
      const recipientName = textValue(row[nameColumn]);
      const rawDate = row[dateColumn];
      const rawAmount = row[amountColumn];

      if ((!recipientName || compactText(recipientName) === "無") && !compactText(rawDate)) continue;

      let aidDate: string | null = null;
      if (rawDate instanceof Date && !Number.isNaN(rawDate.getTime())) {
        aidDate = toIsoDate({
          year: rawDate.getFullYear(),
          month: rawDate.getMonth() + 1,
          day: rawDate.getDate(),
        });
      } else if (typeof rawDate === "number") {
        const parsed = XLSX.SSF.parse_date_code(rawDate);
        if (parsed) aidDate = toIsoDate({ year: parsed.y, month: parsed.m, day: parsed.d });
      } else {
        aidDate = parseTextDate(textValue(rawDate));
      }
      const amount = parseAmount(rawAmount);

      if (!recipientName || !aidDate || amount === null) {
        const missing = [
          !aidDate ? "日期" : null,
          !recipientName ? "受贈對象名稱" : null,
          amount === null ? "受贈金額" : null,
        ].filter(Boolean).join("、");
        reportIssue({ sheet: sheetName, row: excelRow, message: `${missing}格式不正確。` });
        continue;
      }

      const [recordYear, recordMonth] = aidDate.split("-").map(Number);
      periodMap.set(`${recordYear}-${recordMonth}`, {
        western_year: recordYear,
        month: recordMonth,
      });
      const recordKey = `${aidDate}\u0000${normalizeName(recipientName)}\u0000${amount}`;
      if (recordKeys.has(recordKey)) {
        duplicateCount += 1;
        continue;
      }
      recordKeys.add(recordKey);
      records.push({
        aid_date: aidDate,
        recipient_name: recipientName,
        amount,
        source_sheet: sheetName,
        source_row: excelRow,
      });
      sheetRecordCount += 1;
      sheetTotalAmount += amount;

      if (records.length > MAX_RECIPIENT_WORKBOOK_ROWS) {
        throw new Error(`資料筆數不可超過 ${MAX_RECIPIENT_WORKBOOK_ROWS.toLocaleString("zh-TW")} 筆。`);
      }
    }

    sheets.push({
      sheet: sheetName,
      westernYear: period.westernYear,
      month: period.month,
      recordCount: sheetRecordCount,
      totalAmount: sheetTotalAmount,
    });
  }

  if (issues.length >= MAX_REPORTED_ERRORS) {
    issues.push({ sheet: "整份檔案", row: 0, message: "錯誤過多，僅顯示前 100 筆。" });
  }
  if (periodMap.size === 0) throw new Error("Excel 內沒有可辨識的月份。");

  const periods = Array.from(periodMap.values()).sort(
    (a, b) => a.western_year - b.western_year || a.month - b.month,
  );

  return {
    file_name: file.name,
    file_size: file.size,
    file_hash: fileHash,
    periods,
    records,
    issues,
    sheets,
    periodCount: periods.length,
    totalAmount: records.reduce((sum, row) => sum + row.amount, 0),
    duplicateCount,
    previewRows: records.slice(0, 8),
  };
}
