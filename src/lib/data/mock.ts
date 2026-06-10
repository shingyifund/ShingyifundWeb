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
    content_type: "image_text",
    has_title: true,
    title: "讓愛延續，讓需要被看見",
    has_subtitle: true,
    subtitle: "透過社會救助與食物銀行服務，陪伴弱勢家庭度過難關。",
    image_url: IMG_B,
    poster_image_url: null,
    youtube_url: null,
    youtube_video_id: null,
    has_cta: true,
    cta_label: "了解服務",
    cta_href: "/services",
    link_url: null,
    tone: "amber",
  },
  {
    id: "hero-2",
    content_type: "image_text",
    has_title: true,
    title: "一份物資，一份溫暖",
    has_subtitle: true,
    subtitle: "忠信食物銀行，把愛心送到每個需要的家庭。",
    image_url: IMG_A,
    poster_image_url: null,
    youtube_url: null,
    youtube_video_id: null,
    has_cta: true,
    cta_label: "了解食物銀行",
    cta_href: "/services/foodbank",
    link_url: null,
    tone: "navy",
  },
  {
    id: "hero-3",
    content_type: "image_text",
    has_title: true,
    title: "陪伴，是最長情的告白",
    has_subtitle: true,
    subtitle: "從兒少到長者，興毅的服務不曾間斷。",
    image_url: IMG_B,
    poster_image_url: null,
    youtube_url: null,
    youtube_video_id: null,
    has_cta: true,
    cta_label: "認識興毅服務",
    cta_href: "/services",
    link_url: null,
    tone: "amber",
  },
];

export const serviceFeatures: ServiceFeature[] = [
  {
    id: "relief",
    icon: "relief",
    accent: "amber",
    title: "社會救助",
    description: "提供急難救助、生活扶助與關懷訪視，陪伴弱勢家庭度過困境，重建生活希望。",
    image: IMG_B,
    bullets: [
      { label: "急難救助", icon: "handHeart" },
      { label: "生活扶助", icon: "lifeKit" },
      { label: "關懷訪視", icon: "visit" },
    ],
    href: "/services/relief",
  },
  {
    id: "foodbank",
    icon: "foodbank",
    accent: "navy",
    title: "食物銀行",
    description: "透過募集、整理與發放物資，減少食物浪費，將愛心送到有需要的家庭與團體。",
    image: IMG_A,
    bullets: [
      { label: "食物募集", icon: "collect" },
      { label: "物資整理", icon: "sort" },
      { label: "物資發放", icon: "distribute" },
    ],
    href: "/services/foodbank",
  },
];

export const impactStats: ImpactStat[] = [
  { id: "s1", icon: "family", topLabel: "每月服務", value: 700, suffix: "+", bottomLabel: "戶弱勢家庭" },
  { id: "s2", icon: "leaf", topLabel: "每月減少", value: 50, suffix: "+", bottomLabel: "公噸食物浪費" },
  { id: "s3", icon: "store", topLabel: "串聯", value: 128, suffix: "+", bottomLabel: "家合作店家" },
  { id: "s4", icon: "partners", topLabel: "分享", value: 160, suffix: "+", bottomLabel: "個社福團體與里長" },
  { id: "s5", icon: "hands", topLabel: "每月服務", value: 1000, suffix: "+", bottomLabel: "人次" },
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
    href: "/transparency/needs",
    postedAt: "2026-05-20",
  },
  {
    id: "fb-3",
    category: "報導",
    title: "志工隊捐血活動花絮",
    excerpt: "捲起袖子、伸出手臂，興毅志工以熱血傳遞生命的溫度。",
    image: IMG_B,
    href: "/",
    postedAt: "2026-05-12",
  },
  {
    id: "fb-4",
    category: "故事",
    title: "世界糧食日：珍惜每一份食物",
    excerpt: "從惜食到分享，我們一起讓剩食變成滿滿的愛。",
    image: IMG_A,
    href: "/",
    postedAt: "2026-05-04",
  },
];

export const transparencyDocs: TransparencyDoc[] = [
  {
    id: "t1",
    icon: "sustainability",
    title: "永續報告書",
    description: "揭露永續發展目標的實踐與成果。",
    href: "/sustainability",
  },
  {
    id: "t2",
    icon: "donors",
    title: "捐款芳名錄",
    description: "感謝每一份善心的支持。",
    href: "/transparency/donors",
  },
  {
    id: "t3",
    icon: "recipients",
    title: "受贈者名單",
    description: "公開受助對象與服務成果。",
    href: "/transparency/recipients",
  },
  {
    id: "t4",
    icon: "financial",
    title: "財務報告",
    description: "年度財務報表與會計師查核。",
    href: "/transparency/financial",
  },
  {
    id: "t5",
    icon: "fundraising",
    title: "勸募成果報告",
    description: "公開每期勸募金額與運用明細。",
    href: "/transparency/fundraising",
  },
];

/** 影音專區 — 先放佔位 YouTube 連結 */
export const featuredVideo = {
  title: "看見興毅的行動現場",
  description:
    "從社會救助到食物銀行，每一次出發都是為了讓需要的人被看見。一起走進興毅的服務現場。",
  youtubeId: "",
  poster: IMG_B,
  href: "/",
};
