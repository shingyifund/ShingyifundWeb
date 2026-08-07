import type {
  MonthlyDonationDonorType,
  MonthlyDonationRegion,
} from "@/lib/types";
import type { Locale } from "@/i18n/config";

export const MONTHLY_DONATION_REGIONS: Array<{
  value: MonthlyDonationRegion;
  label: string;
}> = [
  { value: "taipei", label: "台北" },
  { value: "new_taipei", label: "新北" },
  { value: "taoyuan", label: "桃園" },
  { value: "tainan", label: "台南" },
];

export const MONTHLY_DONATION_DONOR_TYPES: Array<{
  value: MonthlyDonationDonorType;
  label: string;
}> = [
  { value: "individual", label: "個人" },
  { value: "organization", label: "團體" },
];

export function getMonthlyDonationRegionLabel(region: MonthlyDonationRegion, locale: Locale = "tw") {
  if (locale === "en") {
    return { taipei: "Taipei", new_taipei: "New Taipei", taoyuan: "Taoyuan", tainan: "Tainan" }[region];
  }
  return (
    MONTHLY_DONATION_REGIONS.find((item) => item.value === region)?.label ?? region
  );
}

export function getMonthlyDonationDonorTypeLabel(
  donorType: MonthlyDonationDonorType,
  locale: Locale = "tw",
) {
  if (locale === "en") return donorType === "individual" ? "Individual" : "Organization";
  return (
    MONTHLY_DONATION_DONOR_TYPES.find((item) => item.value === donorType)
      ?.label ?? donorType
  );
}

export function formatMonthlyDonationPeriod(westernYear: number, month: number, locale: Locale = "tw") {
  return locale === "en"
    ? new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(westernYear, month - 1, 1)))
    : `${westernYear}年${String(month).padStart(2, "0")}月`;
}

/** 匿名時前台顯示「善心人士」，否則顯示捐贈者名稱 */
export function getMonthlyDonationDonorDisplayName({
  donorName,
  isAnonymous,
  locale = "tw",
}: {
  donorName: string | null;
  isAnonymous: boolean;
  locale?: Locale;
}) {
  if (isAnonymous || !donorName) return locale === "en" ? "Anonymous donor" : "善心人士";
  return donorName;
}

/** 標題自動產生：感謝 {善心人士／捐贈者名稱} 捐贈物資 */
export function buildMonthlyDonationTitle({
  donorName,
  isAnonymous,
}: {
  donorName: string | null;
  isAnonymous: boolean;
}) {
  return `感謝 ${getMonthlyDonationDonorDisplayName({ donorName, isAnonymous })} 捐贈物資`;
}
