import type { Locale } from "@/i18n/config";

export type RecipientImportRowInput = {
  aid_date: string;
  recipient_name: string;
  amount: number;
  source_sheet: string;
  source_row: number;
};

export type RecipientImportPeriod = {
  western_year: number;
  month: number;
};

export type RecipientImportPayload = {
  file_name: string;
  file_size: number;
  file_hash: string;
  periods: RecipientImportPeriod[];
  records: RecipientImportRowInput[];
};

export type RecipientImportResult = {
  importId: string;
  recordCount: number;
  periodCount: number;
  totalAmount: number;
  replacedRecordCount: number;
  replacedPeriodCount: number;
};

export type RecipientRecord = {
  id: number;
  aid_date: string;
  western_year: number;
  month: number;
  recipient_name: string;
  amount: number;
};

export type RecipientSearchResult = {
  rows: RecipientRecord[];
  totalCount: number;
  totalAmount: number;
  periodCount: number;
  availableYears: number[];
  databaseReady: boolean;
};

export type RecipientSearchParams = {
  query?: string;
  year?: number;
  month?: number;
  page?: number;
  pageSize?: number;
};

export function formatRecipientAmount(amount: number, locale: Locale = "tw") {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRecipientDate(value: string, locale: Locale = "tw") {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "zh-TW", {
    year: "numeric",
    month: locale === "en" ? "short" : "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
