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


export type YouTubeVideo = {
  id: string;
  title: string;
  publishedAt: string; // ISO date
};

export type TransparencyDoc = {
  id: string;
  icon:
    | "sustainability"
    | "donors"
    | "recipients"
    | "monthlyDonations"
    | "financial"
    | "fundraising";
  title: string;
  description: string;
  href: string;
};

export type FinancialReport = {
  id: string;
  title: string;
  fiscalYear: number;
  comparisonYear: number | null;
  fileUrl: string;
  filePath: string;
  fileName: string | null;
  fileSize: number | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type FundraisingReport = {
  id: string;
  title: string;
  fiscalYear: number;
  fileUrl: string;
  filePath: string;
  fileName: string | null;
  fileSize: number | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type MonthlyDonationRegion =
  | "taipei"
  | "new_taipei"
  | "taoyuan"
  | "tainan";

export type FacebookPost = {
  id: string;
  message: string;
  createdTime: string;
  fullPicture: string | null;
  permalink: string;
};

export type MonthlyDonationDonorType = "individual" | "organization";

export type MonthlyDonationImage = {
  id: string;
  reportId: string;
  publicId: string;
  imageUrl: string;
  caption: string | null;
  fileName: string | null;
  fileSize: number | null;
  width: number | null;
  height: number | null;
  sortOrder: number;
  createdAt: string | null;
};

export type MonthlyDonationReport = {
  id: string;
  title: string;
  westernYear: number;
  month: number;
  region: MonthlyDonationRegion;
  donorType: MonthlyDonationDonorType;
  donorName: string | null;
  donationContent: string;
  isAnonymous: boolean;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  images: MonthlyDonationImage[];
};

export type SustainabilityPartner = {
  id: string;
  name: string;
  nameEn: string | null;
  logoUrl: string;
  websiteUrl: string | null;
};
