# 每月捐物清單管理

## 重要前提：權限照現有功能做

本功能沿用財務報告 / 勸募成果報告的後台資料權限模式：

- 前台：`anon` 只可讀公開資料。
- 後台：`authenticated` 透過 `Admin full access` policy 新增、更新、刪除。
- 禁止新增 `no_direct_*`、`using=false`、`with_check=false` 之類的防禦性 policy，會擋住後台寫入。
- 圖片存 Cloudinary，不存 Supabase Storage，所以不需要 `storage.objects` policy。

## 需求範圍

- 前台入口：`徵信明細 > 每月捐物清單`
- 前台列表頁：`/transparency/monthly-donations`
- 前台詳細頁：`/transparency/monthly-donations/{西元年}-{月份}-{區域}`
- 後台：`/admin/monthly-donations`
- 一筆資料代表：一個區域 + 一個分類（個人 / 團體）+ 一個月份。
- 後台可新增、編輯、刪除資料。
- 後台可貼上 txt 捐贈明細。
- 後台可多圖上傳，圖片上傳到 Cloudinary。
- 刪除資料時同步刪除 Cloudinary 圖片。
- 前台只顯示 `is_published = true` 的資料。

## Cloudinary 環境變數

`.env.local` 需要：

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

`API_SECRET` 只可放 server environment，不能放前端或 commit。

## Supabase 資料表

### `monthly_donation_reports`

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | uuid | 主鍵 |
| title | text | 顯示標題 |
| western_year | smallint | 西元年度，例如 2026 |
| month | smallint | 月份 1-12 |
| region | text | `taipei` / `new_taipei` / `taoyuan` / `tainan` |
| donor_type | text | `individual` / `organization` |
| content_text | text | txt 捐贈明細內容 |
| is_published | boolean | 是否前台公開 |
| created_at | timestamptz | 建立時間 |
| updated_at | timestamptz | 更新時間 |

### `monthly_donation_images`

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | uuid | 主鍵 |
| report_id | uuid | 對應 `monthly_donation_reports.id` |
| public_id | text | Cloudinary public id，刪除時使用 |
| image_url | text | Cloudinary 圖片 URL |
| file_name | text | 原始檔名 |
| file_size | integer | 檔案大小 bytes |
| width | integer | 圖片寬度 |
| height | integer | 圖片高度 |
| sort_order | smallint | 顯示排序 |
| created_at | timestamptz | 建立時間 |

## SQL（完整、最小、可直接執行）

```sql
create table monthly_donation_reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  western_year smallint not null check (western_year between 1912 and 2999),
  month smallint not null check (month between 1 and 12),
  region text not null check (region in ('taipei', 'new_taipei', 'taoyuan', 'tainan')),
  donor_type text not null check (donor_type in ('individual', 'organization')),
  content_text text not null,
  is_published boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (western_year, month, region, donor_type)
);

create table monthly_donation_images (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references monthly_donation_reports(id) on delete cascade,
  public_id text not null,
  image_url text not null,
  file_name text,
  file_size integer,
  width integer,
  height integer,
  sort_order smallint not null default 1,
  created_at timestamptz default now()
);

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
| 前台詳細頁 | `src/app/(site)/transparency/monthly-donations/[slug]/page.tsx` |
| Cloudinary helper | `src/lib/cloudinary.ts` |
| 型別 | `src/lib/types.ts` |
| 資料存取 | `src/lib/data/queries.ts` |
