/** 共用資料型別 — 對應 PLAN.md 第 5 節 Supabase schema */

export type HeroSlide = {
  id: string;
  title: string;
  subtitle?: string;
  /** 圖片網址；null 時顯示品牌色塊 placeholder */
  image: string | null;
  /** 主題色，影響 placeholder 與遮罩 */
  tone?: "navy" | "amber";
  cta?: { label: string; href: string };
};

export type ServiceFeature = {
  id: string;
  icon: "relief" | "foodbank";
  title: string;
  description: string;
  bullets: string[];
  href: string;
};

export type ImpactStat = {
  id: string;
  icon: "users" | "calendar" | "box" | "heart" | "hands";
  value: number;
  suffix: string;
  label: string;
};

export type NewsCategory = "新聞" | "報導" | "故事" | "活動";

export type FacebookPost = {
  id: string;
  category: NewsCategory;
  title: string;
  excerpt: string;
  image: string | null;
  href: string;
  postedAt: string; // ISO date
};

export type TransparencyDoc = {
  id: string;
  icon: "report" | "financial" | "fundraising" | "donors" | "recipients";
  title: string;
  description: string;
  href: string;
};
