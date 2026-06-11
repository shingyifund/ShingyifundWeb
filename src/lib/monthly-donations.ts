import type {
  MonthlyDonationDonorType,
  MonthlyDonationRegion,
} from "@/lib/types";

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

export function getMonthlyDonationRegionLabel(region: MonthlyDonationRegion) {
  return (
    MONTHLY_DONATION_REGIONS.find((item) => item.value === region)?.label ?? region
  );
}

export function getMonthlyDonationDonorTypeLabel(
  donorType: MonthlyDonationDonorType,
) {
  return (
    MONTHLY_DONATION_DONOR_TYPES.find((item) => item.value === donorType)
      ?.label ?? donorType
  );
}

export function formatMonthlyDonationPeriod(westernYear: number, month: number) {
  return `${westernYear}年${String(month).padStart(2, "0")}月`;
}

export function monthlyDonationSlug({
  westernYear,
  month,
  region,
}: {
  westernYear: number;
  month: number;
  region: MonthlyDonationRegion;
}) {
  return `${westernYear}-${String(month).padStart(2, "0")}-${region}`;
}

export function parseMonthlyDonationSlug(slug: string) {
  const match = slug.match(/^(\d{4})-(\d{1,2})-(taipei|new_taipei|taoyuan|tainan)$/);
  if (!match) return null;

  const westernYear = Number(match[1]);
  const month = Number(match[2]);

  if (
    !Number.isInteger(westernYear) ||
    westernYear < 1912 ||
    westernYear > 2999
  ) {
    return null;
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) return null;

  return {
    westernYear,
    month,
    region: match[3] as MonthlyDonationRegion,
  };
}
