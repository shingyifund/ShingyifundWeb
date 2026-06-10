# 財務報告管理

## 需求範圍

- 前台 `/transparency/financial` 顯示年度財務報告 PDF。
- 報告連結直接開啟 PDF，不另做詳情頁。
- 後台 `/admin/financial-reports` 可新增、編輯、刪除報告。
- 後台標題依主要年度自動產生，且允許手動修改。
- 報告以主要年度排序；比較年度為選填，用於說明 PDF 內含比較財務資訊。
- 報告新增後一律公開，不做草稿狀態。
- 刪除報告時同步刪除 Supabase Storage 裡的 PDF。

## Supabase 資料表

### `financial_reports`

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | uuid | 主鍵 |
| title | text | 顯示標題 |
| fiscal_year | smallint | 主要民國年度，例如 113 |
| comparison_year | smallint | 比較民國年度，例如 112，可為 null |
| file_url | text | PDF 公開網址 |
| file_path | text | Storage 檔案路徑，刪除時使用 |
| file_name | text | 原始檔名 |
| file_size | integer | 檔案大小 bytes |
| created_at | timestamptz | 建立時間 |
| updated_at | timestamptz | 更新時間 |

## Storage

- Bucket：`financial-reports`
- 檔案格式：PDF
- 後台上傳路徑格式：`113-{uuid}.pdf`
- 前台直接使用 public URL 開啟 PDF。

## SQL

請先在 Supabase Dashboard 建立 `financial-reports` public bucket，或用 Dashboard UI 建立後設為 public。

接著執行：

```sql
create table financial_reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  fiscal_year smallint not null check (fiscal_year between 1 and 999),
  comparison_year smallint check (comparison_year is null or comparison_year between 1 and 999),
  file_url text not null,
  file_path text not null,
  file_name text,
  file_size integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table financial_reports enable row level security;

grant usage on schema public to anon, authenticated;
grant select on table financial_reports to anon;
grant all privileges on table financial_reports to authenticated;

create policy "Public read financial reports" on financial_reports
  for select
  to anon
  using (true);

create policy "Admin full access" on financial_reports
  for all
  to authenticated
  using (true)
  with check (true);
```

權限沿用 Hero 模式：

- 前台：`anon` 只可 `select`
- 後台：`authenticated` 透過 `Admin full access` policy 新增、更新、刪除

## 如果已建立舊版雙年度欄位

若已經建立過 `fiscal_year_start` / `fiscal_year_end`，可用以下 SQL 遷移：

```sql
alter table financial_reports
  add column if not exists fiscal_year smallint,
  add column if not exists comparison_year smallint;

update financial_reports
set
  fiscal_year = fiscal_year_start,
  comparison_year = fiscal_year_end
where fiscal_year is null;

alter table financial_reports
  alter column fiscal_year set not null;

alter table financial_reports
  drop column if exists fiscal_year_start,
  drop column if exists fiscal_year_end;
```
