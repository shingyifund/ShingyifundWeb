/**
 * 資料存取層 — 元件只透過這裡取資料。
 *
 * Phase 1：回傳 mock.ts 的靜態假資料。
 * Phase 2（當前）：hero_slides 由 Supabase 提供，其餘仍用 mock。
 */
import { createClient } from "@/lib/supabase/server";
import type { HeroSlide } from "@/lib/types";
import {
  facebookPosts,
  featuredVideo,
  impactStats,
  serviceFeatures,
  transparencyDocs,
} from "./mock";

export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("hero_slides")
      .select("id, title, subtitle, image, tone, cta_label, cta_href")
      .eq("is_active", true)
      .order("sort");

    if (error || !data) throw error;

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      subtitle: row.subtitle ?? undefined,
      image: row.image,
      tone: row.tone as "navy" | "amber",
      cta:
        row.cta_label && row.cta_href
          ? { label: row.cta_label, href: row.cta_href }
          : undefined,
    }));
  } catch {
    // fallback to mock if DB unavailable
    const { heroSlides } = await import("./mock");
    return heroSlides;
  }
}

export async function getServiceFeatures() {
  return serviceFeatures;
}

export async function getImpactStats() {
  return impactStats;
}

export async function getFacebookPosts() {
  return facebookPosts;
}

export async function getTransparencyDocs() {
  return transparencyDocs;
}

export async function getFeaturedVideo() {
  return featuredVideo;
}
