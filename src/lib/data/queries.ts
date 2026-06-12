/**
 * 資料存取層 — 元件只透過這裡取資料。
 *
 * Phase 1：回傳 mock.ts 的靜態假資料。
 * Phase 2（當前）：hero_slides 由 Supabase 提供，其餘仍用 mock。
 */
import { createClient } from "@/lib/supabase/server";
import type {
  FinancialReport,
  FundraisingReport,
  HeroSlide,
  ImpactStat,
  MonthlyDonationImage,
  MonthlyDonationReport,
  YouTubeVideo,
} from "@/lib/types";
import {
  impactStats,
  serviceFeatures,
  transparencyDocs,
} from "./mock";

export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("hero_slides")
      .select(
        "id, content_type, has_title, title, has_subtitle, subtitle, image_url, poster_image_url, youtube_url, youtube_video_id, has_cta, cta_label, cta_href, link_url, tone",
      )
      .eq("is_active", true)
      .order("sort_order")
      .order("created_at");

    if (error || !data) throw error;

    return data.map((row) => ({
      id: row.id,
      content_type: row.content_type as "image" | "image_text" | "youtube",
      has_title: row.has_title,
      title: row.title,
      has_subtitle: row.has_subtitle,
      subtitle: row.subtitle,
      image_url: row.image_url,
      poster_image_url: row.poster_image_url,
      youtube_url: row.youtube_url,
      youtube_video_id: row.youtube_video_id,
      has_cta: row.has_cta,
      cta_label: row.cta_label,
      cta_href: row.cta_href,
      link_url: row.link_url,
      tone: row.tone as "navy" | "amber",
    }));
  } catch {
    return [];
  }
}

export async function getServiceFeatures() {
  return serviceFeatures;
}

export async function getImpactStats(): Promise<ImpactStat[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("impact_stats")
      .select("id, icon, top_label, value, suffix, bottom_label")
      .order("sort_order");

    if (error || !data) throw error;

    return data.map((row) => ({
      id: row.id,
      icon: row.icon as ImpactStat["icon"],
      topLabel: row.top_label,
      value: row.value,
      suffix: row.suffix,
      bottomLabel: row.bottom_label,
    }));
  } catch {
    return impactStats;
  }
}

export async function getTransparencyDocs() {
  return transparencyDocs;
}

const YOUTUBE_CHANNEL_ID = "UCQgUmF4zZ8t8hWmgCXAFv2w"; // @shingyifund

function decodeXmlEntities(text: string) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

/** 從 YouTube 頻道 RSS 取最新影片（免 API key，無配額）。每小時快取一次。 */
export async function getYouTubeVideos(limit = 4): Promise<YouTubeVideo[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];

    const xml = await res.text();
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];

    return entries
      .map((match) => {
        const block = match[1];
        const id = block.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1];
        const title = block.match(/<title>([\s\S]*?)<\/title>/)?.[1];
        const publishedAt = block.match(/<published>(.*?)<\/published>/)?.[1];
        if (!id || !title || !publishedAt) return null;
        return {
          id,
          title: decodeXmlEntities(title.trim()),
          publishedAt,
        };
      })
      .filter((video): video is YouTubeVideo => video !== null)
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function getFundraisingReports(): Promise<FundraisingReport[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("fundraising_reports")
      .select(
        "id, title, fiscal_year, file_url, file_path, file_name, file_size, created_at, updated_at",
      )
      .order("fiscal_year", { ascending: false });

    if (error || !data) throw error;

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      fiscalYear: row.fiscal_year,
      fileUrl: row.file_url,
      filePath: row.file_path,
      fileName: row.file_name,
      fileSize: row.file_size,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch {
    return [];
  }
}

export async function getFinancialReports(): Promise<FinancialReport[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("financial_reports")
      .select(
        "id, title, fiscal_year, comparison_year, file_url, file_path, file_name, file_size, created_at, updated_at",
      )
      .order("fiscal_year", { ascending: false });

    if (error || !data) throw error;

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      fiscalYear: row.fiscal_year,
      comparisonYear: row.comparison_year,
      fileUrl: row.file_url,
      filePath: row.file_path,
      fileName: row.file_name,
      fileSize: row.file_size,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch {
    return [];
  }
}

const MONTHLY_DONATION_REPORT_COLS =
  "id, title, western_year, month, region, donor_type, donor_name, is_anonymous, sort_order, is_published, created_at, updated_at";

const MONTHLY_DONATION_IMAGE_COLS =
  "id, report_id, public_id, image_url, caption, file_name, file_size, width, height, sort_order, created_at";

type MonthlyDonationReportRow = {
  id: string;
  title: string;
  western_year: number;
  month: number;
  region: MonthlyDonationReport["region"];
  donor_type: MonthlyDonationReport["donorType"];
  donor_name: string | null;
  is_anonymous: boolean;
  sort_order: number;
  is_published: boolean;
  created_at: string | null;
  updated_at: string | null;
};

type MonthlyDonationImageRow = {
  id: string;
  report_id: string;
  public_id: string;
  image_url: string;
  caption: string | null;
  file_name: string | null;
  file_size: number | null;
  width: number | null;
  height: number | null;
  sort_order: number;
  created_at: string | null;
};

function mapMonthlyDonationImage(row: MonthlyDonationImageRow): MonthlyDonationImage {
  return {
    id: row.id,
    reportId: row.report_id,
    publicId: row.public_id,
    imageUrl: row.image_url,
    caption: row.caption,
    fileName: row.file_name,
    fileSize: row.file_size,
    width: row.width,
    height: row.height,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

function mapMonthlyDonationReport(
  row: MonthlyDonationReportRow,
  images: MonthlyDonationImage[],
): MonthlyDonationReport {
  return {
    id: row.id,
    title: row.title,
    westernYear: row.western_year,
    month: row.month,
    region: row.region,
    donorType: row.donor_type,
    donorName: row.donor_name,
    isAnonymous: row.is_anonymous,
    sortOrder: row.sort_order,
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    images,
  };
}

async function getMonthlyDonationImagesByReportIds(reportIds: string[]) {
  if (reportIds.length === 0) return new Map<string, MonthlyDonationImage[]>();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("monthly_donation_images")
    .select(MONTHLY_DONATION_IMAGE_COLS)
    .in("report_id", reportIds)
    .order("sort_order", { ascending: true });

  if (error || !data) throw error;

  const map = new Map<string, MonthlyDonationImage[]>();
  for (const row of data as MonthlyDonationImageRow[]) {
    const image = mapMonthlyDonationImage(row);
    const images = map.get(image.reportId) ?? [];
    images.push(image);
    map.set(image.reportId, images);
  }

  return map;
}

/** 首頁跑馬燈用：最新捐贈者資訊，不帶圖片以省查詢 */
export async function getRecentMonthlyDonors(
  limit = 20,
): Promise<MonthlyDonationReport[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("monthly_donation_reports")
      .select(MONTHLY_DONATION_REPORT_COLS)
      .eq("is_published", true)
      .order("western_year", { ascending: false })
      .order("month", { ascending: false })
      .order("sort_order", { ascending: true })
      .limit(limit);

    if (error || !data) throw error;

    return (data as MonthlyDonationReportRow[]).map((row) =>
      mapMonthlyDonationReport(row, []),
    );
  } catch {
    return [];
  }
}

export async function getMonthlyDonationReports(): Promise<
  MonthlyDonationReport[]
> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("monthly_donation_reports")
      .select(MONTHLY_DONATION_REPORT_COLS)
      .eq("is_published", true)
      .order("western_year", { ascending: false })
      .order("month", { ascending: false })
      .order("region", { ascending: true })
      .order("donor_type", { ascending: true })
      .order("sort_order", { ascending: true });

    if (error || !data) throw error;

    const rows = data as MonthlyDonationReportRow[];
    const imagesByReportId = await getMonthlyDonationImagesByReportIds(
      rows.map((row) => row.id),
    );

    return rows.map((row) =>
      mapMonthlyDonationReport(row, imagesByReportId.get(row.id) ?? []),
    );
  } catch {
    return [];
  }
}

export async function getMonthlyDonationReportById(
  id: string,
): Promise<MonthlyDonationReport | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("monthly_donation_reports")
      .select(MONTHLY_DONATION_REPORT_COLS)
      .eq("is_published", true)
      .eq("id", id)
      .maybeSingle();

    if (error || !data) throw error;

    const row = data as MonthlyDonationReportRow;
    const imagesByReportId = await getMonthlyDonationImagesByReportIds([row.id]);

    return mapMonthlyDonationReport(row, imagesByReportId.get(row.id) ?? []);
  } catch {
    return null;
  }
}
