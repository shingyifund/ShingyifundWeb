# Admin Rebuild Plan

## Goal

將現有 `/admin` 後台視為一次完整重做，不沿用目前 UI 與頁面結構。

這次重做的原則：

1. 先移除現有後台頁面與互動元件。
2. 保留 Supabase 資料契約，不破壞既有 table / storage / auth 流程。
3. 新後台以官方 `shadcn` CLI 初始化後再重新建立。

---

## Scope

本計畫只針對後台：

- `/src/app/admin/**`
- 與後台直接綁定的 client/server actions

本計畫不主動重做前台：

- `/src/components/home/**`
- `/src/components/layout/**`
- `/src/components/donate/**`

---

## Phase 0: Preserve Contracts First

在刪除後台 code 前，先把「不能忘的資料契約」固定下來。

### 1. Supabase table: `hero_slides`

目前程式碼已確認使用到的欄位如下：

| column | type (inferred) | required | notes |
| --- | --- | --- | --- |
| `id` | `uuid` or `text` | yes | 主鍵，前台/後台都用來識別 slide |
| `title` | `text` | yes | 輪播主標題 |
| `subtitle` | `text \| null` | no | 輪播副標題 |
| `image` | `text \| null` | no | 圖片網址，通常為 Supabase public URL |
| `tone` | `text` | yes | 目前實際值只有 `navy` / `amber` |
| `cta_label` | `text \| null` | no | CTA 按鈕文字 |
| `cta_href` | `text \| null` | no | CTA 連結 |
| `sort` | `integer` | yes | 排序用，前台依此欄位排序 |
| `is_active` | `boolean` | yes | 前台只顯示 `true` |
| `updated_at` | `timestamp \| null` | no | 更新時會寫入 |

### 2. Query contract

前台目前依賴以下查詢行為：

- 資料表：`hero_slides`
- 查詢欄位：
  - `id`
  - `title`
  - `subtitle`
  - `image`
  - `tone`
  - `cta_label`
  - `cta_href`
- 過濾條件：`.eq("is_active", true)`
- 排序條件：`.order("sort")`

如果重做後台，這個前台查詢契約不能被破壞。

### 3. Storage contract

目前圖片上傳流程依賴：

- bucket 名稱：`hero-images`
- public URL 用途：直接存在 `hero_slides.image`
- 刪除策略：若 `imageUrl` 包含 `/storage/v1/object/public/hero-images/`，後台刪除 slide 時會同步刪 bucket 內檔案

### 4. Auth / authorization contract

目前 admin 權限機制如下：

- 使用 Supabase Auth 取得登入者
- `ADMIN_EMAILS` env 作為白名單
- `/src/middleware.ts` 會保護 `/admin/:path*`
- 未授權者會被導向 `/admin/login`
- 已授權者進 `/admin/login` 會被導回 `/admin`

### 5. Required env

重做後台時，以下 env 契約預設仍需保留：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAILS`

---

## Phase 1: Delete Existing Admin UI

以下檔案可視為「可刪除後重建」範圍：

### Routes and pages

- `src/app/admin/layout.tsx`
- `src/app/admin/login/page.tsx`
- `src/app/admin/(dashboard)/layout.tsx`
- `src/app/admin/(dashboard)/page.tsx`
- `src/app/admin/(dashboard)/hero/page.tsx`
- `src/app/admin/(dashboard)/hero/new/page.tsx`
- `src/app/admin/(dashboard)/hero/[id]/page.tsx`

### Admin-only components

- `src/app/admin/login/LoginButton.tsx`
- `src/app/admin/(dashboard)/LogoutButton.tsx`
- `src/app/admin/(dashboard)/hero/ConfirmDialog.tsx`
- `src/app/admin/(dashboard)/hero/SlideForm.tsx`
- `src/app/admin/(dashboard)/hero/SlideRow.tsx`

### Admin actions to rewrite

- `src/app/admin/(dashboard)/hero/actions.ts`

這些檔案不需要保留原設計或原結構，可以直接砍掉後重寫。

---

## Phase 2: Keep Infra, Do Not Accidentally Delete

以下檔案不是後台畫面，但目前屬於資料與權限基礎設施，重做時應保留或等價重寫：

- `src/lib/supabase/server.ts`
- `src/lib/supabase/client.ts`
- `src/lib/admin-auth.ts`
- `src/middleware.ts`
- `src/lib/data/queries.ts`
- `src/lib/types.ts`

### Notes

- `src/lib/data/queries.ts` 的 `getHeroSlides()` 仍被前台使用。
- 即使後台全部重做，前台首頁輪播仍要能讀 `hero_slides`。
- 若之後要改 table schema，必須先同步改前台查詢層，不可只改後台。

---

## Phase 3: Reinitialize Admin with Official shadcn CLI

新後台重建順序：

1. 清空現有 admin 頁面與元件。
2. 用官方 `shadcn` CLI 初始化專案。
3. 加入後台需要的官方元件。
4. 重建最小可用後台。

### Planned shadcn components

至少加入以下元件：

- `button`
- `input`
- `label`
- `card`
- `table`
- `dialog`
- `select`
- `checkbox`
- `badge`
- `form`
- `textarea`
- `dropdown-menu`
- `sheet`
- `skeleton`
- `alert`

### Admin information architecture

第一版後台先只做最小範圍：

1. `/admin/login`
   - Google login
   - unauthorized state message

2. `/admin`
   - 乾淨首頁
   - 今日日期
   - 左側 navigation

3. `/admin/hero`
   - slide list table
   - status badge
   - create / edit / delete actions

4. `/admin/hero/new`
   - create form

5. `/admin/hero/[id]`
   - edit form

---

## Phase 4: Rewrite Data Layer Cleanly

後台重做時，不沿用目前 action 檔案的寫法，但保留功能契約。

### Required operations

- `listSlides`
- `getSlideById`
- `createSlide`
- `updateSlide`
- `deleteSlide`
- `toggleSlideActive`
- `uploadHeroImage`

### Required behavior

- 每個 mutation 前都要檢查 admin 權限
- 變更後要 `revalidatePath("/admin/hero")`
- 前台首頁相關變更要 `revalidatePath("/")`
- `deleteSlide` 要處理 bucket 檔案清理

---

## Phase 5: Recommended Structure After Rebuild

建議的新 admin 結構：

```text
src/app/admin/
  layout.tsx
  login/
    page.tsx
  (dashboard)/
    layout.tsx
    page.tsx
    hero/
      page.tsx
      new/page.tsx
      [id]/page.tsx
      actions.ts
      _components/
        hero-table.tsx
        hero-form.tsx
        delete-slide-dialog.tsx
        admin-sidebar.tsx
```

---

## Phase 6: Acceptance Criteria

重做完成時，至少要滿足：

1. `/admin` 未授權不可進入。
2. `/admin/login` 可登入且授權成功後能進 dashboard。
3. `/admin/hero` 可列出 `hero_slides`。
4. 可新增、編輯、刪除、啟用/停用 slide。
5. 可上傳圖片到 `hero-images` bucket。
6. 前台首頁仍能正常讀取 `hero_slides`。
7. 不更動 `hero_slides` schema 的情況下完成重建。

---

## Current Contract Summary

如果今天要先「砍掉後台重來」，最重要的是記住下面這組契約：

- table 名稱：`hero_slides`
- bucket 名稱：`hero-images`
- 前台只讀 `is_active = true`
- 前台依 `sort` 排序
- `tone` 目前只用 `navy` / `amber`
- CTA 由 `cta_label` + `cta_href` 組成
- admin 權限由 `ADMIN_EMAILS` 控制
- 後台 mutation 需要 `SUPABASE_SERVICE_ROLE_KEY`

這些不變，後台 UI 可以全部重寫。
