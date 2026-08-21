import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  DonationRecord,
  DonationSearchParams,
  DonationSearchResult,
} from "@/lib/donation-registry";

const EMPTY_SEARCH_RESULT: DonationSearchResult = {
  rows: [],
  totalCount: 0,
  totalAmount: 0,
  periodCount: 0,
  availableYears: [],
  databaseReady: false,
};

export async function searchPublicDonations({
  query,
  year,
  month,
  donationType,
  page = 1,
  pageSize = 50,
}: DonationSearchParams): Promise<DonationSearchResult> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("search_public_donations", {
      p_query: query?.trim() || null,
      p_year: year ?? null,
      p_month: month ?? null,
      p_donation_type: donationType ?? null,
      p_page: Math.max(1, page),
      p_page_size: Math.min(100, Math.max(1, pageSize)),
    });

    if (error || !data || typeof data !== "object" || Array.isArray(data)) {
      throw error ?? new Error("Invalid donation search response");
    }

    const result = data as Record<string, unknown>;
    return {
      rows: Array.isArray(result.rows) ? (result.rows as DonationRecord[]) : [],
      totalCount: Number(result.totalCount) || 0,
      totalAmount: Number(result.totalAmount) || 0,
      periodCount: Number(result.periodCount) || 0,
      availableYears: Array.isArray(result.availableYears)
        ? result.availableYears.map(Number).filter(Number.isInteger)
        : [],
      databaseReady: true,
    };
  } catch {
    return EMPTY_SEARCH_RESULT;
  }
}
