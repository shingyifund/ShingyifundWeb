import type {
  DonationImportPayload,
  DonationImportRowInput,
  DonationType,
} from "@/lib/donation-registry";

export const MAX_DONATION_WORKBOOK_BYTES = 10 * 1024 * 1024;
export const MAX_DONATION_WORKBOOK_ROWS = 25_000;
const MAX_WORKSHEETS = 40;
const MAX_REPORTED_ERRORS = 100;

type CellValue = string | number | boolean | Date | null | undefined;

export type DonationWorkbookIssue = {
  sheet: string;
  row: number;
  message: string;
};

export type DonationSheetSummary = {
  sheet: string;
  westernYear: number;
  month: number;
  donationType: DonationType;
  recordCount: number;
  totalAmount: number;
};

export type ParsedDonationWorkbook = DonationImportPayload & {
  issues: DonationWorkbookIssue[];
  sheets: DonationSheetSummary[];
  periodCount: number;
  totalAmount: number;
  previewRows: DonationImportRowInput[];
};

function textValue(value: CellValue) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\u0000/g, "").trim();
}
function compactText(value: CellValue) {
  return textValue(value).replace(/[\s　]+/g, "");
}

function parseSheetPeriod(sheetName: string) {
  const match = /(\d{2,4})\s*年\s*(\d{1,2})\s*月/.exec(sheetName);
  if (!match) return null;
  const sourceYear = Number(match[1]);
  const westernYear = sourceYear < 1912 ? sourceYear + 1911 : sourceYear;
  const month = Number(match[2]);
  if (westernYear < 1912 || westernYear > 2999 || month < 1 || month > 12) {
    return null;
  }
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
  const match = /^(\d{2,4})[\/.-](\d{1,2})[\/.-](\d{1,2})/.exec(value.trim());
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

function isAnonymousName(name: string) {
  return /善心人士|愛心人士|匿名|無名氏|捐款箱/.test(name);
}

async function sha256Hex(buffer: ArrayBuffer) {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function parseDonationWorkbook(file: File): Promise<ParsedDonationWorkbook> {
  if (!/\.(xls|xlsx)$/i.test(file.name)) {
    throw new Error("僅支援 .xls 或 .xlsx 檔案。");
  }
  if (file.size <= 0 || file.size > MAX_DONATION_WORKBOOK_BYTES) {
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

  const records: DonationImportRowInput[] = [];
  const issues: DonationWorkbookIssue[] = [];
  const sheets: DonationSheetSummary[] = [];

  const reportIssue = (issue: DonationWorkbookIssue) => {
    if (issues.length < MAX_REPORTED_ERRORS) issues.push(issue);
  };

  for (const sheetName of workbook.SheetNames) {
    const period = parseSheetPeriod(sheetName);
    if (!period) {
      reportIssue({ sheet: sheetName, row: 0, message: "工作表名稱無法辨識年月，格式應如「115年6月」。" });
      continue;
    }

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
        cells.some((cell) => cell === "日期" || cell === "捐款日期") &&
        cells.some((cell) => /捐(贈|款)者?(姓名|名稱)|芳名/.test(cell)) &&
        cells.some((cell) => /金額/.test(cell))
      );
    });

    if (headerIndex < 0) {
      reportIssue({ sheet: sheetName, row: 0, message: "找不到「日期／捐贈者姓名／金額」欄位。" });
      continue;
    }

    const headers = rows[headerIndex].map(compactText);
    const dateColumn = headers.findIndex((cell) => cell === "日期" || cell === "捐款日期");
    const nameColumn = headers.findIndex((cell) => /捐(贈|款)者?(姓名|名稱)|芳名/.test(cell));
    const amountColumn = headers.findIndex((cell) => /金額/.test(cell));
    const donationType: DonationType = sheetName.includes("勸募") ? "fundraising" : "general";
    const sheetRecords: DonationImportRowInput[] = [];

    for (let index = headerIndex + 1; index < rows.length; index += 1) {
      const row = rows[index];
      const excelRow = index + 1;
      if (!row.some((cell) => compactText(cell))) continue;
      if (row.some((cell) => /總額|合計/.test(compactText(cell)))) continue;

      const donorName = textValue(row[nameColumn]);
      const amount = parseAmount(row[amountColumn]);
      const rawDate = row[dateColumn];
      let donationDate: string | null = null;

      if (rawDate instanceof Date && !Number.isNaN(rawDate.getTime())) {
        donationDate = toIsoDate({
          year: rawDate.getUTCFullYear(),
          month: rawDate.getUTCMonth() + 1,
          day: rawDate.getUTCDate(),
        });
      } else if (typeof rawDate === "number") {
        const parsed = XLSX.SSF.parse_date_code(rawDate);
        if (parsed) donationDate = toIsoDate({ year: parsed.y, month: parsed.m, day: parsed.d });
      } else {
        donationDate = parseTextDate(textValue(rawDate));
      }

      if (!donorName || !donationDate || amount === null) {
        const missing = [
          !donationDate ? "日期" : null,
          !donorName ? "捐贈者姓名" : null,
          amount === null ? "金額" : null,
        ].filter(Boolean).join("、");
        reportIssue({ sheet: sheetName, row: excelRow, message: `${missing}格式不正確。` });
        continue;
      }

      const [recordYear, recordMonth] = donationDate.split("-").map(Number);
      if (recordYear !== period.westernYear || recordMonth !== period.month) {
        reportIssue({
          sheet: sheetName,
          row: excelRow,
          message: `日期 ${donationDate} 與工作表年月不一致。`,
        });
        continue;
      }

      sheetRecords.push({
        donation_date: donationDate,
        donor_name: donorName,
        amount,
        donation_type: donationType,
        is_anonymous: isAnonymousName(donorName),
        source_sheet: sheetName,
        source_row: excelRow,
      });
    }

    if (sheetRecords.length === 0) {
      reportIssue({ sheet: sheetName, row: 0, message: "工作表沒有可匯入的捐款明細。" });
      continue;
    }

    records.push(...sheetRecords);
    sheets.push({
      sheet: sheetName,
      westernYear: period.westernYear,
      month: period.month,
      donationType,
      recordCount: sheetRecords.length,
      totalAmount: sheetRecords.reduce((sum, row) => sum + row.amount, 0),
    });

    if (records.length > MAX_DONATION_WORKBOOK_ROWS) {
      throw new Error(`資料筆數不可超過 ${MAX_DONATION_WORKBOOK_ROWS.toLocaleString("zh-TW")} 筆。`);
    }
  }

  if (issues.length >= MAX_REPORTED_ERRORS) {
    issues.push({ sheet: "整份檔案", row: 0, message: "錯誤過多，僅顯示前 100 筆。" });
  }
  if (records.length === 0 && issues.length === 0) throw new Error("Excel 內沒有可匯入的資料。");

  return {
    file_name: file.name,
    file_size: file.size,
    file_hash: fileHash,
    records,
    issues,
    sheets,
    periodCount: sheets.length,
    totalAmount: records.reduce((sum, row) => sum + row.amount, 0),
    previewRows: records.slice(0, 8),
  };
}
