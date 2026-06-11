# 勸募成果報告管理

## 重要前提：複製現有功能時，照抄現有設定

本功能前後端完全比照「財務報告」，差別只有：沒有 `comparison_year` 欄位、table 與 bucket 名稱不同。

開發此功能時曾因「自作聰明」浪費大量時間，以下是踩雷紀錄，務必遵守：

### 禁止事項

- 禁止新增任何 `no_direct_*` 之類的「防禦性」policy（with_check=false / using=false）。
  - 後台寫入透過 `createAdminClient`，但它是 `@supabase/ssr` 帶 cookie 的 client，登入後 session JWT 會把角色蓋成 `authenticated`，並未真正以 service_role 繞過 RLS。
  - 因此 `with_check=false` 的 policy 會直接擋住後台的 insert/upload，噴 `new row violates row-level security policy`。
- 禁止憑空重寫一套 RLS。直接複製 `financial-reports` 的 table policy 與 storage policy。

### 兩種錯誤的區別（debug 對照表）

| 錯誤訊息 | 層級 | 解法 |
|----------|------|------|
| `new row violates row-level security policy` | RLS policy | 確認有 `Admin full access`（table）與 admin upload/update/delete（storage）policy，且沒有 `no_direct_*` 擋路 |
| `permission denied for table xxx` | GRANT 授權 | `grant all on public.xxx to authenticated;` |

注意上傳流程是「先傳 PDF 到 Storage、再寫 table」，所以 RLS 錯誤可能來自 **storage.objects**，不是 table。

## 需求範圍

- 前台 `/transparency/fundraising` 顯示年度勸募成果報告 PDF。
- 報告連結直接開啟 PDF，不另做詳情頁。
- 後台 `/admin/fundraising-reports` 可新增、編輯、刪除報告。
- 後台標題依年度自動產生，且允許手動修改。
- 報告以年度排序（由新到舊）。
- 報告新增後一律公開，不做草稿狀態。
- 刪除報告時同步刪除 Supabase Storage 裡的 PDF。

## Supabase 資料表

### `fundraising_reports`

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | uuid | 主鍵 |
| title | text | 顯示標題 |
| fiscal_year | smallint | 民國年度，例如 113 |
| file_url | text | PDF 公開網址 |
| file_path | text | Storage 檔案路徑，刪除時使用 |
| file_name | text | 原始檔名 |
| file_size | bigint | 檔案大小 bytes |
| created_at | timestamptz | 建立時間 |
| updated_at | timestamptz | 更新時間 |

## Storage

- Bucket：`fundraising-reports`（public）
- 檔案格式：PDF
- 後台上傳路徑格式：`113-{uuid}.pdf`
- 前台直接使用 public URL 開啟 PDF。

## SQL（完整、最小、可直接執行）

### 1. 建立 bucket

Supabase Dashboard → Storage → New bucket，名稱 `fundraising-reports`，勾選 Public。

不要設 file size limit 與 allowed mime types（留 unset，對齊 financial-reports；type 檢查已在 `uploadPdfFile` 程式內做）。bucket 大小沿用專案全域上限（預設 50MB）。

### 上傳大小限制

1. Supabase bucket / 專案全域上限：預設 50MB，bucket 個別 `file_size_limit` 留 null。
2. Next.js Server Action `bodySizeLimit`（`next.config.mjs`）：需 >= 預期最大檔案，目前設 50mb。超過會噴 `Unexpected end of form`。改 config 後要重啟 dev server。
   - 本專案同時設定頂層 `serverActions` 與 `experimental.serverActions`，兩邊值一致，避免 Next 版本差異導致設定被忽略。
3. Next.js dev/proxy request body 上限：`experimental.proxyClientMaxBodySize` 也需 >= 預期最大檔案，否則 multipart form 可能在 Server Action 解析前被截斷。
   ```js
   const nextConfig = {
     serverActions: { bodySizeLimit: "50mb" },
     experimental: {
       proxyClientMaxBodySize: "50mb",
       serverActions: { bodySizeLimit: "50mb" },
     },
   };
   ```

### 2. 建立 table、grant、RLS policy

```sql
create table fundraising_reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  fiscal_year smallint not null check (fiscal_year between 1 and 999),
  file_url text not null,
  file_path text not null,
  file_name text,
  file_size bigint,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table fundraising_reports enable row level security;

-- GRANT（缺這個會 permission denied for table）
grant usage on schema public to anon, authenticated;
grant select on table fundraising_reports to anon;
grant all privileges on table fundraising_reports to authenticated, service_role;

-- Table RLS
create policy "Public read fundraising reports" on fundraising_reports
  for select to anon using (true);

create policy "Admin full access" on fundraising_reports
  for all to authenticated using (true) with check (true);
```

### 3. 建立 Storage RLS policy（財務報告 doc 漏寫的關鍵段落）

```sql
-- 公開讀取
create policy "Public read fundraising report files" on storage.objects
  for select to public
  using (bucket_id = 'fundraising-reports');

-- 後台上傳 / 更新 / 刪除
create policy "admin upload fundraising report files" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'fundraising-reports');

create policy "admin update fundraising report files" on storage.objects
  for update to authenticated
  using (bucket_id = 'fundraising-reports');

create policy "admin delete fundraising report files" on storage.objects
  for delete to authenticated
  using (bucket_id = 'fundraising-reports');
```

完成這三步即可正常運作，不需要任何額外 policy。

## 程式碼對應檔案

| 層 | 路徑 |
|----|------|
| Server Action | `src/app/admin/(dashboard)/fundraising-reports/actions.ts` |
| 後台列表頁 | `src/app/admin/(dashboard)/fundraising-reports/page.tsx` |
| 後台新增頁 | `src/app/admin/(dashboard)/fundraising-reports/new/page.tsx` |
| 後台編輯頁 | `src/app/admin/(dashboard)/fundraising-reports/[id]/page.tsx` |
| 表單 / 列表 / 刪除元件 | `src/app/admin/(dashboard)/fundraising-reports/_components/` |
| 前台頁面 | `src/app/(site)/transparency/fundraising/page.tsx` |
| 型別 | `src/lib/types.ts`（`FundraisingReport`） |
| 資料存取 | `src/lib/data/queries.ts`（`getFundraisingReports`） |
| 後台入口卡片 | `src/app/admin/(dashboard)/page.tsx` |
