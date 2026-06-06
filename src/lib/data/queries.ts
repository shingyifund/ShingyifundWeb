/**
 * 資料存取層 — 元件只透過這裡取資料。
 *
 * Phase 1：回傳 mock.ts 的靜態假資料。
 * Phase 2：把每個函式內部改為 Supabase 查詢即可，元件完全不需更動。
 *   例：
 *     export async function getHeroSlides() {
 *       const supabase = createServerClient();
 *       const { data } = await supabase.from("hero_slides").select("*").order("sort");
 *       return data ?? [];
 *     }
 */
import {
  facebookPosts,
  featuredVideo,
  heroSlides,
  impactStats,
  serviceFeatures,
  transparencyDocs,
} from "./mock";

export async function getHeroSlides() {
  return heroSlides;
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
