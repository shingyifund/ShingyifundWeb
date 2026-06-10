/** 共用資料型別 — 對應 PLAN.md 第 5 節 Supabase schema */

export type HeroSlide = {
  id: string;
  content_type: "image" | "image_text" | "youtube";
  has_title: boolean;
  title: string | null;
  has_subtitle: boolean;
  subtitle: string | null;
  image_url: string | null;
  poster_image_url: string | null;
  youtube_url: string | null;
  youtube_video_id: string | null;
  has_cta: boolean;
  cta_label: string | null;
  cta_href: string | null;
  link_url: string | null;
  tone: "navy" | "amber";
};

export type ServiceBulletIcon =
  | "handHeart"
  | "lifeKit"
  | "visit"
  | "collect"
  | "sort"
  | "distribute";

export type ServiceBullet = { label: string; icon: ServiceBulletIcon };

export type ServiceFeature = {
  id: string;
  icon: "relief" | "foodbank";
  accent: "amber" | "navy";
  title: string;
  description: string;
  image: string | null;
  bullets: ServiceBullet[];
  href: string;
};

export type ImpactStat = {
  id: string;
  icon: "family" | "leaf" | "store" | "partners" | "hands";
  topLabel: string;
  value: number;
  suffix: string;
  bottomLabel: string;
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
  icon: "sustainability" | "donors" | "recipients" | "financial" | "fundraising";
  title: string;
  description: string;
  href: string;
};
