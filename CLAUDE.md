# ShingyifundWeb — 開發注意事項

## 效能規範

### 裝飾性光暈元素
- 最大使用 `blur-2xl`，禁用 `blur-3xl`
- 必須加 `style={{ transform: "translateZ(0)" }}` 強制 GPU 合成層
- 範例：
  ```tsx
  <div className="pointer-events-none absolute ... blur-2xl" style={{ transform: "translateZ(0)" }} />
  ```

### 禁止事項
- 禁用 `text-rendering: optimizeLegibility` — 繁體中文每字觸發 hinting，捲動時極慢
- 禁用 `backdrop-blur` 於 sticky/fixed 元素與捲動區域內的元件，改用高不透明度實色背景
  - SiteHeader：`bg-cream/95`（捲動後）、`bg-cream/80`（初始）
  - 按鈕：`bg-white` 取代 `bg-white/90 backdrop-blur`
  - Modal 遮罩例外，因非捲動路徑

### 持續動畫
- `heartbeat`、`ping-ring` 等無限迴圈動畫須在 CSS 宣告 `will-change: transform`
- opacity 動畫元素加 `willChange: "opacity"`

## 技術棧
- Next.js 15 App Router
- Tailwind CSS v4（CSS-first 設定，token 定義在 globals.css `@theme`）
- Framer Motion（`motion/react`）— Reveal 元件使用 `whileInView` + `once: true`
- Embla Carousel — Hero 輪播
