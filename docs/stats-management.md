# 服務成效管理

## 需求背景

首頁「我們的服務成效」區塊原本將五項指標（數字、標籤）硬編碼在 `src/lib/data/mock.ts`，需要修改程式碼才能更新數字。此功能將資料移至 Supabase，讓管理員可透過後台直接修改。

## 功能範圍

- 後台提供五筆固定指標的數字編輯功能（不支援新增、刪除、排序）
- 每筆指標只可編輯：數值
- 上方標籤、後綴、下方標籤與圖示固定，不可透過後台更換
- 儲存後首頁即時反映（revalidatePath）

## 資料結構

### Supabase 資料表：`impact_stats`

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | text (PK) | 固定識別碼 s1~s5 |
| icon | text | 圖示名稱，對應前台 Lucide icon |
| top_label | text | 數字上方的小標 |
| value | integer | 顯示的數字 |
| suffix | text | 數字後綴，預設 + |
| bottom_label | text | 數字下方的說明 |
| sort_order | smallint | 顯示排序 |
| updated_at | timestamptz | 最後更新時間 |

### icon 允許值

| 值 | 對應圖示 |
|----|---------|
| family | 家庭 |
| leaf | 葉子（惜食） |
| store | 商店 |
| partners | 夥伴（握手） |
| hands | 愛心雙手 |

## 初始資料（Seed）

| id | icon | top_label | value | suffix | bottom_label |
|----|------|-----------|-------|--------|--------------|
| s1 | family | 每月服務 | 700 | + | 戶弱勢家庭 |
| s2 | leaf | 每月減少 | 50 | + | 公噸食物浪費 |
| s3 | store | 串聯 | 128 | + | 家合作店家 |
| s4 | partners | 分享 | 160 | + | 個社福團體與里長 |
| s5 | hands | 每月服務 | 1000 | + | 人次 |

## 程式架構

### 後台

- `src/app/admin/(dashboard)/stats/page.tsx` — 列表頁，顯示五筆指標
- `src/app/admin/(dashboard)/stats/[id]/page.tsx` — 單筆數值編輯頁
- `src/app/admin/(dashboard)/stats/actions.ts` — Server Actions（listStats、getStatById、updateStat、updateAllStats）
- `src/app/admin/(dashboard)/stats/_components/stat-form.tsx` — 單筆數值編輯表單
- `src/app/admin/(dashboard)/stats/_components/stats-editor.tsx` — 五筆指標的批次數值編輯畫面

### 前台

- `src/lib/data/queries.ts` — `getImpactStats()` 改從 Supabase 讀取，Supabase 失敗時 fallback 至 mock 資料
- `src/components/home/ImpactStats.tsx` — 無需修改
- `src/components/home/StatsBand.tsx` — 無需修改

## RLS 政策建議

- 所有人可 SELECT（公開資料）
- INSERT / UPDATE / DELETE 需 service_role（後台用 Admin client）

## SQL

請至 Supabase Dashboard > SQL Editor 執行以下 SQL：

```sql
create table impact_stats (
  id text primary key,
  icon text not null check (icon in ('family', 'leaf', 'store', 'partners', 'hands')),
  top_label text not null,
  value integer not null,
  suffix text not null default '+',
  bottom_label text not null,
  sort_order smallint not null,
  updated_at timestamptz default now()
);

alter table impact_stats enable row level security;

create policy "public read" on impact_stats
  for select using (true);

insert into impact_stats (id, icon, top_label, value, suffix, bottom_label, sort_order) values
  ('s1', 'family', '每月服務', 700, '+', '戶弱勢家庭', 1),
  ('s2', 'leaf',   '每月減少', 50,  '+', '公噸食物浪費', 2),
  ('s3', 'store',  '串聯',    128, '+', '家合作店家', 3),
  ('s4', 'partners','分享',   160, '+', '個社福團體與里長', 4),
  ('s5', 'hands',  '每月服務', 1000, '+', '人次', 5);
```
