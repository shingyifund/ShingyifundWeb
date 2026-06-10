/**
 * 資料存取層 — 元件只透過這裡取資料。
 *
 * Phase 1：回傳 mock.ts 的靜態假資料。
 * Phase 2（當前）：hero_slides 由 Supabase 提供，其餘仍用 mock。
 */
import { createClient } from "@/lib/supabase/server";
import type { HeroSlide, ImpactStat } from "@/lib/types";
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
      .select(
        "id, content_type, has_title, title, has_subtitle, subtitle, image_url, poster_image_url, youtube_url, youtube_video_id, has_cta, cta_label, cta_href, link_url, tone",
      )
      .eq("is_active", true)
      .order("sort_order");

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

export async function getFacebookPosts() {
  return facebookPosts;
}

export async function getTransparencyDocs() {
  return transparencyDocs;
}

export async function getFeaturedVideo() {
  return featuredVideo;
}
