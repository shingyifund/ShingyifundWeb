import type {
  FacebookPost,
  HeroSlide,
  ImpactStat,
  ServiceFeature,
  TransparencyDoc,
} from "@/lib/types";

/** Phase 1 靜態假資料。Phase 2 由 Supabase 取代（見 queries.ts） */

// 示意圖（取自原站，兩張重複使用，待替換為正式素材）
const IMG_A = "/images/photo-a.jpg"; // 雙手捧米
const IMG_B = "/images/photo-b.jpg"; // 志工發放物資

export const heroSlides: HeroSlide[] = [
  {
    id: "hero-1",
    title: "讓愛延續，讓需要被看見",
    subtitle: "透過社會救助與食物銀行服務，陪伴弱勢家庭度過難關。",
    image: IMG_B,
    tone: "amber",
    cta: { label: "立即捐款", href: "/donate" },
  },
  {
    id: "hero-2",
    title: "一份物資，一份溫暖",
    subtitle: "忠信食物銀行，把愛心送到每個需要的家庭。",
    image: IMG_A,
    tone: "navy",
    cta: { label: "了解食物銀行", href: "/foodbank" },
  },
  {
    id: "hero-3",
    title: "陪伴，是最長情的告白",
    subtitle: "從兒少到長者，興毅的服務不曾間斷。",
    image: IMG_B,
    tone: "amber",
    cta: { label: "認識興毅服務", href: "/services" },
  },
];

export const serviceFeatures: ServiceFeature[] = [
  {
    id: "relief",
    icon: "relief",
    title: "社會救助",
    description: "提供緊急紓困、生活扶助與關懷訪視，為弱勢家庭撐起一把傘。",
    bullets: ["急難救助", "生活扶助", "關懷訪視"],
    href: "/services/relief",
  },
  {
    id: "foodbank",
    icon: "foodbank",
    title: "忠信食物銀行",
    description: "募集即期與愛心物資，依需求分送至弱勢家庭，讓資源不浪費。",
    bullets: ["食物募集", "物資分送", "定點領取"],
    href: "/foodbank",
  },
];

export const impactStats: ImpactStat[] = [
  { id: "s1", icon: "users", value: 700, suffix: "+", label: "服務人次" },
  { id: "s2", icon: "calendar", value: 50, suffix: "+", label: "合作據點" },
  { id: "s3", icon: "box", value: 128, suffix: "+", label: "物資發放（噸）" },
  { id: "s4", icon: "heart", value: 160, suffix: "+", label: "公益活動場次" },
  { id: "s5", icon: "hands", value: 1000, suffix: "+", label: "志工投入人次" },
];

export const facebookPosts: FacebookPost[] = [
  {
    id: "fb-1",
    category: "新聞",
    title: "113年勸募成果報告出爐",
    excerpt: "感謝每一位善心人士的支持，讓愛心化為實際行動，陪伴更多家庭。",
    image: IMG_B,
    href: "/transparency/fundraising",
    postedAt: "2026-05-28",
  },
  {
    id: "fb-2",
    category: "活動",
    title: "捐物不費力，讓愛更永續",
    excerpt: "線上捐物平台上線，動動手指就能把物資送到需要的人手中。",
    image: IMG_A,
    href: "/foodbank/needs",
    postedAt: "2026-05-20",
  },
  {
    id: "fb-3",
    category: "報導",
    title: "志工隊捐血活動花絮",
    excerpt: "捲起袖子、伸出手臂，興毅志工以熱血傳遞生命的溫度。",
    image: IMG_B,
    href: "/news/reports",
    postedAt: "2026-05-12",
  },
  {
    id: "fb-4",
    category: "故事",
    title: "世界糧食日：珍惜每一份食物",
    excerpt: "從惜食到分享，我們一起讓剩食變成滿滿的愛。",
    image: IMG_A,
    href: "/news/stories",
    postedAt: "2026-05-04",
  },
];

export const transparencyDocs: TransparencyDoc[] = [
  {
    id: "t1",
    icon: "fundraising",
    title: "勸募成果報告",
    description: "公開每期勸募金額與運用明細。",
    href: "/transparency/fundraising",
  },
  {
    id: "t2",
    icon: "financial",
    title: "財務報告",
    description: "年度財務報表與會計師查核。",
    href: "/transparency/financial",
  },
  {
    id: "t3",
    icon: "donors",
    title: "捐款芳名錄",
    description: "感謝每一份善心的支持。",
    href: "/transparency/donors",
  },
  {
    id: "t4",
    icon: "recipients",
    title: "受贈者名單",
    description: "公開受助對象與服務成果。",
    href: "/transparency/recipients",
  },
];

/** 影音專區 — 先放佔位 YouTube 連結 */
export const featuredVideo = {
  title: "看見興毅的行動現場",
  description:
    "從社會救助到食物銀行，每一次出發都是為了讓需要的人被看見。一起走進興毅的服務現場。",
  youtubeId: "",
  poster: IMG_B,
  href: "/news/reports",
};
