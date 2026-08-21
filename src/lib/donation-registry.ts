import type { Locale } from "@/i18n/config";

export type DonationType = "general" | "fundraising";

export type DonationImportRowInput = {
  donation_date: string;
  donor_name: string;
  amount: number;
  donation_type: DonationType;
  is_anonymous: boolean;
  source_sheet: string;
  source_row: number;
};

export type DonationImportPayload = {
  file_name: string;
  file_size: number;
  file_hash: string;
  records: DonationImportRowInput[];
};

export type DonationImportResult = {
  importId: string;
  recordCount: number;
  periodCount: number;
  totalAmount: number;
  replacedRecordCount: number;
  replacedPeriodCount: number;
};

export type DonationRecord = {
  id: number;
  donation_date: string;
  western_year: number;
  month: number;
  donor_name: string;
  amount: number;
  donation_type: DonationType;
  is_anonymous: boolean;
};

export type DonationSearchResult = {
  rows: DonationRecord[];
  totalCount: number;
  totalAmount: number;
  periodCount: number;
  availableYears: number[];
  databaseReady: boolean;
};

export type DonationSearchParams = {
  query?: string;
  year?: number;
  month?: number;
  donationType?: DonationType;
  page?: number;
  pageSize?: number;
};

export function getDonationTypeLabel(type: DonationType, locale: Locale = "tw") {
  if (locale === "en") {
    return type === "fundraising" ? "Fundraising campaign" : "General donation";
  }
  return type === "fundraising" ? "勸募捐款" : "一般捐款";
}

export function formatDonationAmount(amount: number, locale: Locale = "tw") {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDonationDate(value: string, locale: Locale = "tw") {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "zh-TW", {
    year: "numeric",
    month: locale === "en" ? "short" : "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
