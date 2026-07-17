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

## UI 元件規範

本專案為 shadcn/ui 結構（根目錄 `components.json`，style `radix-nova`，元件位於 `src/components/ui/`）。

優先順序：

1. **優先使用 shadcn 官方元件** — 需要新元件時先用 CLI 加：`npx shadcn@latest add <name>`，並先確認 `src/components/ui/` 是否已有現成的。
2. **registry 沒有的，以 shadcn 為基底自製** — 用 shadcn 的 Popover / Button / ToggleGroup 等既有元件組裝，沿用站上 token 與樣式，**不另起爐灶、不引入功能重疊的第三方 UI 套件**。
   - 範例：年月（month-only）選擇器 registry 無現成品，`src/components/ui/month-picker.tsx` 以 Popover + Button 自組。
3. **避免裸寫原生控件** — 表單一律走 shadcn 元件。原生 HTML 控件僅限技術必要的場景（如 `<input type="file">` 檔案選擇器、瀏覽器原生 checkbox），且須封裝。

注意事項：
- 本環境不能跑互動式 CLI prompt（會 hang）。若 CLI 問是否覆蓋既有檔需謹慎，避免覆蓋專案客製的 `Button.tsx`（首字母大寫，import 路徑為 `@/components/ui/Button`）。
- 排版／展示用元件（Container、PageHero、SectionHeading、Reveal…）非互動控件，shadcn registry 無對應品項，屬正常自製。

## 版號與發布

- **版號單一來源為 `package.json` 的 `version`**。footer 顯示的版號由 `src/config/site.ts` 讀取 `package.json`（`version: \`v${pkg.version}\``），不可再寫死字串。
- 發布流程：改完 → `npx next build` 驗證 → 升 `package.json` 版號 → commit 標題結尾帶 `(v0.1.x)` → push。
- Commit 標題慣例：`feat: 說明 (v0.1.x)`、`fix: 說明`（修 bug 不一定升版）。
- **不要自動 push**，使用者說 push 才推。

### 不進版控
- `docs/*.doc`、`docs/*.docx` — 內容來源文件（.gitignore 已設）
- `.agents/`、`.claude/` — agent skills
- 需要對外下載的檔案放 `public/downloads/`（用英文檔名，下載時以 `download` 屬性帶回中文原名）

## 技術棧
- Next.js 15 App Router
- Tailwind CSS v4（CSS-first 設定，token 定義在 globals.css `@theme`）
- Framer Motion（`motion/react`）— Reveal 元件使用 `whileInView` + `once: true`
- Embla Carousel — Hero 輪播
