# 每月捐物清單管理

## 重要前提：權限照現有功能做

本功能沿用財務報告 / 勸募成果報告的後台資料權限模式：

- 前台：`anon` 只可讀公開資料。
- 後台：`authenticated` 透過 `Admin full access` policy 新增、更新、刪除。
- 禁止新增 `no_direct_*`、`using=false`、`with_check=false` 之類的防禦性 policy，會擋住後台寫入。
- 圖片存 Cloudinary，不存 Supabase Storage，所以不需要 `storage.objects` policy。

## 需求範圍（v2：一筆 = 一位捐贈者）

- 前台入口：`徵信明細 > 每月捐物清單`
- 前台列表頁：`/transparency/monthly-donations`
- 前台詳細頁：`/transparency/monthly-donations/{report_id}`（每位捐贈者一頁）
- 後台：`/admin/monthly-donations`
- **一筆資料代表：一位捐贈者（個人或團體）在某月某區的一次捐贈。**
  - 同一個「年 + 月 + 區域 + 分類」底下可有多筆（多位捐贈者），無 unique 約束。
- 捐贈者可匿名：`is_anonymous = true` 時前台顯示「善心人士」，後台仍保留真實姓名。
- 表單使用獨立的「捐贈內容」欄位，標題自動產生「感謝 {捐贈者名稱／善心人士} 捐贈 {捐贈內容} 一批」，並可手動修改。
- 每張圖片的 `caption` 仍可補充該張照片的物資說明。
- 後台可新增、編輯、刪除資料。
- 後台可多圖上傳，每張圖可填說明（caption），圖片上傳到 Cloudinary。
- 刪除資料時同步刪除 Cloudinary 圖片。
- 前台只顯示 `is_published = true` 的資料。

## 前台列表結構

三層收合，手機友善：

1. **月份**（2026年01月 / 2025年12月…）
2. **個人 / 團體**（ToggleGroup 切換，與後台一致）
3. **捐贈者卡片列表**（依區域分組），每張卡片連到該捐贈者詳細頁

## 匿名顯示規則

| `is_anonymous` | 前台顯示 | 後台顯示 |
|----------------|----------|----------|
| `false` | `donor_name`（必填） | `donor_name` |
| `true` | 「善心人士」 | `donor_name`（若有填，內部可見） |

## Cloudinary 環境變數

`.env.local` 需要：

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

`API_SECRET` 只可放 server environment，不能放前端或 commit。

Cloudinary 資料夾路徑加上 `report_id` 一層，避免同月同區的圖混在一起：
`monthly-donations/{年}/{月}/{區域}/{分類}/{report_id}/`

## Supabase 資料表

### `monthly_donation_reports`

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | uuid | 主鍵（前台詳細頁 slug） |
| title | text | 顯示標題（自動產生可改） |
| western_year | smallint | 西元年度，例如 2026 |
| month | smallint | 月份 1-12 |
| region | text | `taipei` / `new_taipei` / `taoyuan` / `tainan` |
| donor_type | text | `individual` / `organization` |
| donor_name | text | 捐贈者名稱（匿名時可空） |
| donation_content | text | 捐贈內容，1-500 字 |
| is_anonymous | boolean | 前台是否遮成「善心人士」 |
| sort_order | smallint | 同月同區捐贈者顯示排序 |
| is_published | boolean | 是否前台公開 |
| created_at | timestamptz | 建立時間 |
| updated_at | timestamptz | 更新時間 |

> 移除 v1 的 `content_text` 欄位與 `unique(年,月,區域,分類)` 約束。

### `monthly_donation_images`

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | uuid | 主鍵 |
| report_id | uuid | 對應 `monthly_donation_reports.id` |
| public_id | text | Cloudinary public id，刪除時使用 |
| image_url | text | Cloudinary 圖片 URL |
| caption | text | 圖片物資說明 |
| file_name | text | 原始檔名 |
| file_size | integer | 檔案大小 bytes |
| width | integer | 圖片寬度 |
| height | integer | 圖片高度 |
| sort_order | smallint | 顯示排序 |
| created_at | timestamptz | 建立時間 |

## SQL（drop 重建，完整、可直接執行）

```sql
-- 1. 砍掉舊表（images 先砍，有 FK）
drop table if exists monthly_donation_images;
drop table if exists monthly_donation_reports;

-- 2. 重建 reports（一筆 = 一位捐贈者，無 unique 約束）
create table monthly_donation_reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  western_year smallint not null check (western_year between 1912 and 2999),
  month smallint not null check (month between 1 and 12),
  region text not null check (region in ('taipei', 'new_taipei', 'taoyuan', 'tainan')),
  donor_type text not null check (donor_type in ('individual', 'organization')),
  donor_name text,
  donation_content text not null check (char_length(btrim(donation_content)) between 1 and 500),
  is_anonymous boolean not null default false,
  sort_order smallint not null default 1,
  is_published boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. 重建 images（加 caption）
create table monthly_donation_images (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references monthly_donation_reports(id) on delete cascade,
  public_id text not null,
  image_url text not null,
  caption text,
  file_name text,
  file_size integer,
  width integer,
  height integer,
  sort_order smallint not null default 1,
  created_at timestamptz default now()
);

-- 4. index：列表查詢用
create index idx_mdr_archive
  on monthly_donation_reports (western_year desc, month desc, region, donor_type, sort_order);

-- 5. RLS
alter table monthly_donation_reports enable row level security;
alter table monthly_donation_images enable row level security;

grant usage on schema public to anon, authenticated;
grant select on table monthly_donation_reports to anon;
grant select on table monthly_donation_images to anon;
grant all privileges on table monthly_donation_reports to authenticated;
grant all privileges on table monthly_donation_images to authenticated;

create policy "Public read monthly donation reports"
on monthly_donation_reports
for select
to anon
using (is_published = true);

create policy "Public read monthly donation images"
on monthly_donation_images
for select
to anon
using (
  exists (
    select 1
    from monthly_donation_reports
    where monthly_donation_reports.id = monthly_donation_images.report_id
      and monthly_donation_reports.is_published = true
  )
);

create policy "Admin full access"
on monthly_donation_reports
for all
to authenticated
using (true)
with check (true);

create policy "Admin full access"
on monthly_donation_images
for all
to authenticated
using (true)
with check (true);
```

## 程式碼對應檔案

| 層 | 路徑 |
|----|------|
| Server Action | `src/app/admin/(dashboard)/monthly-donations/actions.ts` |
| 後台列表頁 | `src/app/admin/(dashboard)/monthly-donations/page.tsx` |
| 後台新增頁 | `src/app/admin/(dashboard)/monthly-donations/new/page.tsx` |
| 後台編輯頁 | `src/app/admin/(dashboard)/monthly-donations/[id]/page.tsx` |
| 表單 / 列表 / 刪除元件 | `src/app/admin/(dashboard)/monthly-donations/_components/` |
| 前台列表頁 | `src/app/(site)/transparency/monthly-donations/page.tsx` |
| 前台詳細頁 | `src/app/(site)/transparency/monthly-donations/[id]/page.tsx` |
| Cloudinary helper | `src/lib/cloudinary.ts` |
| 型別 | `src/lib/types.ts` |
| 資料存取 | `src/lib/data/queries.ts` |

## 程式碼需配合修改的重點（v1 → v2）

1. **型別 / 欄位**：新增 `donor_name`、`donation_content`、`is_anonymous`、`sort_order`（reports）與 `caption`（images）。
2. **後台表單**：新增捐贈者名稱、捐贈內容、匿名 switch，以及每張圖的說明輸入。
3. **slug**：`monthlyDonationSlug` / `parseMonthlyDonationSlug` 改為直接用 `report_id`，前台詳細頁路由改 `[id]`。
4. **前台列表 `buildArchives`**：改為列出每位捐贈者（不再把同月同區合併成一張卡）。
5. **Cloudinary folder**：路徑加 `report_id` 一層。
6. **標題自動產生**：`感謝 {is_anonymous ? "善心人士" : donor_name} 捐贈 {donation_content} 一批`。
