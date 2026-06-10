# Vercel React Best Practices Review

## Purpose

這份文件提供給後續 AI / 開發者參考。  
依據 `vercel-react-best-practices` skill 針對目前程式碼做 review，**先記錄建議，不直接修改實作**。

參考 skill：

- `/Users/roy/.agents/skills/vercel-react-best-practices/SKILL.md`

---

## Scope Reviewed

本次主要看以下區塊：

- `src/app/(site)/page.tsx`
- `src/lib/data/queries.ts`
- `src/components/home/*`
- `src/components/donate/*`
- `src/components/layout/SiteHeader.tsx`
- `src/app/admin/(dashboard)/*`
- `src/app/admin/login/page.tsx`
- `src/middleware.ts`

---

## Summary

目前最值得優先改善的點有 4 個：

1. `moveSlide()` 有明顯 async waterfall
2. `DonationModal` 適合改成 dynamic import
3. 首屏 `HeroCarousel` client boundary 偏大
4. admin 驗權與 user lookup 缺少 per-request dedupe

同時，目前 server actions 內有再次驗權，這點是正確的。

---

## Findings

### 1. `moveSlide()` uses sequential updates

- Priority: `P1`
- Rule: `async-parallel`
- Impact: 排序更新數量一多，延遲會線性增加

#### Files

- `src/app/admin/(dashboard)/hero/actions.ts`

#### Evidence

- 讀取列表：`list for reorder`
  - `src/app/admin/(dashboard)/hero/actions.ts:300`
- 逐筆更新：
  - `src/app/admin/(dashboard)/hero/actions.ts:319`
  - `src/app/admin/(dashboard)/hero/actions.ts:320`
  - `src/app/admin/(dashboard)/hero/actions.ts:323`

#### Why it matters

目前 `moveSlide()` 先抓全部 slide，再用 `for` 迴圈逐筆 `await update(...)`。  
這是標準的 sequential waterfall。當 slide 變多時，排序一次就會打出多次串行 round trips。

#### Recommendation

- 優先考慮單次 transaction / RPC 完成 reorder
- 如果暫時不做 RPC，至少避免逐筆串行 await

---

### 2. `DonationModal` should be lazily loaded

- Priority: `P1`
- Rule: `bundle-dynamic-imports`
- Impact: 降低首頁初始 JS，改善 TTI / hydration 成本

#### Files

- `src/app/(site)/layout.tsx`
- `src/components/donate/DonateFab.tsx`
- `src/components/donate/DonationModal.tsx`

#### Evidence

- 全站 layout 直接掛載 Donate FAB：
  - `src/app/(site)/layout.tsx:19`
- Donate FAB 直接 import modal：
  - `src/components/donate/DonateFab.tsx:5`
- Donate FAB render 時同步包含 modal：
  - `src/components/donate/DonateFab.tsx:29`

#### Why it matters

`DonationModal` 屬於「點了才會使用」的互動內容。  
目前它跟著全站 layout 一起進來，代表多數根本不會打開 modal 的使用者，也先承擔這段 JS 的解析與 hydration 成本。

#### Recommendation

- 用 `next/dynamic` 延後載入 `DonationModal`
- 只在使用者打開 donate 流程時才載入 modal 相關程式碼

---

### 3. Hero carousel client boundary is too large for above-the-fold content

- Priority: `P2`
- Rules:
  - `bundle-dynamic-imports`
  - `server-serialization`
- Impact: 首屏互動 JS 偏重，hydration 成本較高

#### Files

- `src/components/home/HeroSection.tsx`
- `src/components/home/HeroCarousel.tsx`
- `src/lib/data/queries.ts`

#### Evidence

- server component 先抓資料：
  - `src/components/home/HeroSection.tsx:5`
- 然後把整包 slides 丟給 client carousel：
  - `src/components/home/HeroSection.tsx:6`
- `HeroCarousel` 是 client component：
  - `src/components/home/HeroCarousel.tsx:1`
- `HeroCarousel` 同時負責：
  - Embla
  - Autoplay
  - slide controls
  - image / image_text / youtube 三種顯示邏輯

#### Why it matters

目前首屏 Hero 不只是互動控制在 client，連主要內容顯示邏輯也都包在 client component 裡。  
對首頁 LCP 區塊來說，這通常會放大首屏 JS 和 hydration 成本。

#### Recommendation

- 把純展示內容盡量留在 server component
- 把 carousel 控制層縮成更小的 client boundary
- 若只有 1 張 slide，可直接不載 carousel 行為

---

### 4. Admin auth lookups are repeated without request-level dedupe

- Priority: `P2`
- Rule: `server-cache-react`
- Impact: admin 頁面與 action 數量增加後，重複 auth / user lookup 會放大

#### Files

- `src/middleware.ts`
- `src/app/admin/(dashboard)/layout.tsx`
- `src/app/admin/login/page.tsx`
- `src/app/admin/(dashboard)/hero/actions.ts`

#### Evidence

- middleware 取 user：
  - `src/middleware.ts:27`
- admin layout 取 user：
  - `src/app/admin/(dashboard)/layout.tsx:13`
- login page 取 user：
  - `src/app/admin/login/page.tsx:11`
- server actions 內再次取 user：
  - `src/app/admin/(dashboard)/hero/actions.ts:32`
  - `src/app/admin/(dashboard)/hero/actions.ts:33`

#### Why it matters

權限檢查本身需要保留，但目前缺少集中且可重用的 auth helper。  
隨著 admin 功能增加，這些 non-fetch async work 會反覆發生。

#### Recommendation

- 抽出 `getCurrentAdmin()` / `verifyAdmin()` helper
- 用 `React.cache()` 做 per-request dedupe
- 保持「每個 server action 內仍要驗權」這條安全原則不變

---

## Things Already Good

### Server actions authenticate inside the action

- Rule: `server-auth-actions`
- Status: `Good`

#### Evidence

- `src/app/admin/(dashboard)/hero/actions.ts:124`
- `src/app/admin/(dashboard)/hero/actions.ts:138`
- `src/app/admin/(dashboard)/hero/actions.ts:154`
- `src/app/admin/(dashboard)/hero/actions.ts:186`
- `src/app/admin/(dashboard)/hero/actions.ts:208`
- `src/app/admin/(dashboard)/hero/actions.ts:254`
- `src/app/admin/(dashboard)/hero/actions.ts:274`
- `src/app/admin/(dashboard)/hero/actions.ts:292`

#### Notes

目前不是只靠 middleware 或 layout guard，server actions 內也有 `assertAdmin()`。  
這點符合 Vercel / Next.js 對 Server Actions 的安全要求，應該保留。

---

## Lower-Confidence / Secondary Observations

以下是次要觀察，值得之後再確認，但目前不列為最高優先：

### A. `Suspense` boundaries can likely be used more intentionally

- Rule: `async-suspense-boundaries`

首頁現在由多個 async server component 組成，但 `src/app/(site)/page.tsx` 本身沒有明確 `Suspense` 切分。  
如果某些資料來源未來從 mock 改成遠端查詢，wrapper UI 可能會一起被阻塞。

### B. Motion-heavy client surfaces should be watched for bundle growth

- Related rules:
  - `bundle-dynamic-imports`
  - `rerender-memo`

像 `HeroCarousel`、`SiteHeader`、`DonationModal`、`Reveal` 這些互動區塊目前看起來還可控，  
但之後若再疊更多動畫/編輯器/第三方 SDK，應優先檢查 client bundle，不要等整體變重才處理。

---

## Recommended Priority Order

若後續要逐步改善，建議順序：

1. 修 `moveSlide()` 的 waterfall
2. 將 `DonationModal` 改成 dynamic import
3. 縮小 Hero 首屏 client boundary
4. 抽離並 cache admin auth helper

---

## Important Constraint for Future AI Changes

之後如果 AI 要根據這份文件動手改，請注意：

1. 不可移除 server action 內的授權檢查
2. 不可只靠 middleware 取代 server action auth
3. 若改 Hero data flow，需確認首屏 SEO / LCP 不退步
4. 若改 admin auth cache，不能引入跨 request 共用的 mutable state

---

## Review Mode

這份文件是 code review / performance review 結果。  
**內容是建議，不代表已實作。**
