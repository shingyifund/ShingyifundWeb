# 興毅基金會官網改版 — 規劃文件

> 本檔用於記錄首頁改版規劃，供後續恢復記憶。
> 設計依據：`ChatGPT Image 2026年6月5日 下午05_06_39.png`（首頁設計圖）
> 內容來源：`readMe.md`（既有網站資訊）
> 最後更新：2026-06-06

---

## 1. 技術決策（已確認）

| 項目 | 決策 |
|------|------|
| 前端框架 | Next.js 14+ App Router (SSG/ISR) |
| 樣式 | Tailwind CSS |
| UI 元件 | shadcn/ui |
| 動畫 | Framer Motion（輕量點綴） |
| 後端/資料庫 | Supabase（DB + Auth + Storage） |
| 部署 | Vercel |
| 設計風格 | 照設計圖（藍 + 橘黃），細節可優化 |

### 依賴套件（已確認）
| 需求 | 套件 |
|------|------|
| UI 元件骨架 | `shadcn/ui`（基於 Radix UI，複製進專案、可完全客製） |
| 樣式 | `tailwindcss` |
| 動畫 | `framer-motion` |
| 圖示 | `lucide-react` |
| 數字遞增（服務成效） | `react-countup`（或自寫 hook） |
| 輪播 | `embla-carousel-react`（shadcn Carousel 內建） |
| 表單驗證（捐款／聯絡） | `react-hook-form` + `zod` |

### Supabase 最終職責（分階段導入）
- 新聞 / 動態 CMS（首頁最新消息、Facebook 動態 → Supabase 資料表）
- 捐款意願表單、聯絡我們表單 → 寫入資料庫
- 後台管理 + 管理員登入（Supabase Auth + RLS）

### 重要原則：資料存取層解耦
> 第一階段首頁先用**靜態假資料**把版面做出來，但所有資料都透過
> `lib/data/queries.ts` 的函式取得（如 `getLatestNews()`）。
> 第二階段只需把函式內部從 mock 換成 Supabase 查詢，**元件完全不用改**。

---

## 2. 首頁區塊拆解（依設計圖，由上到下）

| # | 區塊 | 元件 | 內容重點 |
|---|------|------|---------|
| 1 | 頁首導覽 | `SiteHeader` | Logo＋基金會名、主選單（含下拉子選單）、sticky、手機漢堡選單 |
| 2 | 主視覺 Hero | `HeroSection` | **整塊滿版大圖做成輪播 `HeroCarousel`（embla）**，文字與按鈕以 overlay 疊在圖上、左側白色漸層遮罩確保可讀性；標語「讓愛延續，讓需要被看見」、副標「透過社會救助與食物銀行服務，陪伴弱勢家庭度過難關」、兩顆 CTA（立即捐款／了解服務）、裝飾愛心；先保留輪播結構、目前放單張，後續可放多張 |
| 3 | 雙特色卡 | `FeatureCards` | 兩張卡：社會救助、食物銀行（icon＋標題＋說明＋小圖示＋了解更多） |
| 4 | 服務成效 | `ImpactStats` | 藍底；「我們的服務成效」＋ 5 組數據（700+ / 50+ / 128+ / 160+ / 1000+）每組含 icon 與標籤 |
| 5 | 影音行動現場 | `VideoShowcase` | 左：影片縮圖＋播放鈕；右（藍底）：「看見興毅的行動現場」＋說明＋觀看更多影片 |
| 6 | 臉書最新動態 | `FacebookFeed` | 「粉專最新動態」＋ FB 連結；4 張貼文卡（圖＋標題＋摘要） |
| 7 | 公開透明 | `TransparencySection` | 「公開透明・永續成果公開」＋ 4–5 張圖示卡（永續報告書、財務報告、勸募成果…） |
| 8 | 捐款行動條 | `DonationCTA` | 橘黃底；「您的支持・持續不間斷」＋捐款帳號資訊＋立即捐款鈕＋右側雙手捧物圖 |
| 9 | 頁尾 | `SiteFooter` | Logo＋組織資訊、聯絡方式、快速連結、捐款資訊、UN SDGs 17 色彩圖示、版權 |

---

## 3. 專案目錄結構（規劃）

```
src/
  app/
    layout.tsx              # 根佈局：字型、metadata、Header/Footer
    page.tsx                # 首頁：組合 9 大區塊
    globals.css             # Tailwind + 設計 token
  components/
    layout/
      SiteHeader.tsx
      NavMenu.tsx           # 桌機下拉選單
      MobileNav.tsx         # 手機漢堡選單
      SiteFooter.tsx
    home/
      HeroSection.tsx
      HeroCarousel.tsx      # 整塊滿版大圖輪播（embla），文字 overlay 疊於其上，目前單張、可擴充多張
      FeatureCards.tsx      # 內含 FeatureCard
      ImpactStats.tsx       # 內含 StatItem（含數字滾動動畫）
      VideoShowcase.tsx
      FacebookFeed.tsx      # 內含 FacebookPostCard
      TransparencySection.tsx
      DonationCTA.tsx
    ui/                     # shadcn/ui 元件（button, card…）
  lib/
    supabase/
      client.ts             # 瀏覽器端 client（階段二）
      server.ts             # 伺服器端 client（階段二）
    data/
      mock.ts               # 階段一靜態假資料
      queries.ts            # 資料存取層（mock → Supabase 的接口）
    types.ts                # 共用型別
  config/
    site.ts                 # 組織資訊、聯絡、捐款帳號（常數）
    nav.ts                  # 導覽列結構（單一來源）
public/
  images/                   # Hero、卡片、Logo 等素材
```

---

## 4. 設計 Token（初版，可調）

| 用途 | 色碼（暫定） |
|------|------|
| 主色 深藍 | `#16448C` / 深一階 `#0F2E5E` |
| 強調 橘黃 | `#F5A623` / `#FDB913` |
| 淺背景 | `#F5F8FC`（藍灰）、`#FFF9F0`（米） |
| 文字主色 | `#1A2B45` |
| 卡片 | 白底、圓角 `rounded-2xl`、柔和陰影 |

字型：思源黑體 / Noto Sans TC（中文），標題可加重量。

---

## 5. Supabase 資料表規劃（階段二再建）

| 資料表 | 主要欄位 | 用途 |
|--------|---------|------|
| `news` | id, title, slug, excerpt, content, cover_image, category, published_at, is_published | 興毅新聞/報導 |
| `fb_posts` | id, image_url, content, link, posted_at | 首頁臉書動態 |
| `impact_stats` | id, label, value, icon, sort | 服務成效數據 |
| `transparency_docs` | id, title, type, file_url, year | 財報/勸募/永續報告 |
| `donations` | id, name, amount, email, message, created_at | 捐款意願表單 |
| `contacts` | id, name, email, phone, message, created_at | 聯絡我們表單 |

Auth：Supabase Auth + **Google OAuth 登入**（Google 帳號），搭配 RLS；後台路由置於 `app/admin/`（階段四）。
- 於 Supabase Dashboard 啟用 Google Provider，設定 Google Cloud OAuth Client ID / Secret
- 以白名單（allowed emails 表或 RLS）限制只有授權的 Google 帳號可進後台

---

## 6. 開發階段（里程碑）

- **Phase 1 — 首頁靜態版（✅ 已完成首頁開發，待部署）**
  - [x] 建立專案：**Next.js 16 + React 19 + Tailwind v4（CSS-first @theme）+ TypeScript 6**
  - [x] 設計 token、字型（Noto Serif TC 標題 + Noto Sans TC 內文）、globals.css
  - [x] 完成 9 大區塊元件 + RWD + 假資料（透過 `lib/data/queries.ts`）
  - [x] `npm run build` 通過、dev server 正常渲染
  - [ ] 部署 Vercel
  - 備註：動畫用 `motion`（framer-motion v12）；輪播用 `embla-carousel-react` + autoplay；
    lucide-react v1 已移除 Facebook/Youtube 商標圖示，改用 `components/brand/SocialIcons.tsx` 內嵌 SVG。
    圖片暫用品牌色塊 placeholder（`ImagePlaceholder`，傳入 src 即顯示真圖）。
- **Phase 2 — 接 Supabase 資料**
  - 建 DB schema、queries.ts 改接 Supabase
  - 新聞列表 / 內頁
- **Phase 3 — 表單**
  - 捐款意願、聯絡我們 → 寫入 Supabase
- **Phase 4 — 後台**
  - Supabase Auth + Google OAuth 登入 + 內容管理介面（CRUD）

---

## 7. 待補素材 / 待確認

- [x] 正式 Logo 檔（SVG）— 已從原站抓取，存於 `public/brand/`
  - `logo.svg`（橫式，含中英文字樣，245×43）
  - `favicon-32x32.png`、`favicon-192x192.png`、`apple-touch-icon.png`（180）、`icon-512.png`（原始徽章）
- [ ] Hero 與各區塊正式圖片（暫用 placeholder）
- [ ] 服務成效數據的「正確數字與標籤」（圖上為示意）
- [ ] 影音區 YouTube 影片連結
- [ ] 網域與 Vercel / Supabase 專案是否已建立
```
