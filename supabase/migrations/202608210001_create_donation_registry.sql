-- 捐款芳名錄：Excel 匯入批次與公開查詢資料
-- 可重複在 Supabase SQL Editor 執行。

create extension if not exists pgcrypto;

create table if not exists public.donation_import_batches (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_size integer not null check (file_size > 0 and file_size <= 10485760),
  file_hash text not null check (file_hash ~ '^[0-9a-f]{64}$'),
  record_count integer not null default 0 check (record_count >= 0),
  period_count integer not null default 0 check (period_count >= 0),
  total_amount bigint not null default 0 check (total_amount >= 0),
  imported_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.donation_records (
  id bigint generated always as identity primary key,
  import_batch_id uuid not null references public.donation_import_batches(id) on delete cascade,
  donation_date date not null,
  western_year smallint generated always as (extract(year from donation_date)::smallint) stored,
  month smallint generated always as (extract(month from donation_date)::smallint) stored,
  donor_name text not null check (char_length(btrim(donor_name)) between 1 and 200),
  normalized_name text generated always as (
    lower(regexp_replace(btrim(donor_name), '[[:space:]　]+', '', 'g'))
  ) stored,
  amount bigint not null check (amount > 0),
  donation_type text not null check (donation_type in ('general', 'fundraising')),
  is_anonymous boolean not null default false,
  source_sheet text not null check (char_length(source_sheet) between 1 and 100),
  source_row integer not null check (source_row > 0),
  created_at timestamptz not null default now(),
  unique (import_batch_id, source_sheet, source_row)
);

create index if not exists donation_records_period_idx
  on public.donation_records (western_year desc, month desc, donation_type, donation_date desc, id desc);

create index if not exists donation_records_normalized_name_idx
  on public.donation_records (normalized_name text_pattern_ops);

create index if not exists donation_records_batch_idx
  on public.donation_records (import_batch_id);

alter table public.donation_import_batches enable row level security;
alter table public.donation_records enable row level security;

revoke all on table public.donation_import_batches from anon, authenticated;
grant select on table public.donation_records to anon, authenticated;
grant all privileges on table public.donation_import_batches to service_role;
grant all privileges on table public.donation_records to service_role;
grant usage, select on sequence public.donation_records_id_seq to service_role;

drop policy if exists "Public can read donation records" on public.donation_records;
create policy "Public can read donation records"
on public.donation_records
for select
to anon, authenticated
using (true);

-- 一次交易完成驗證、月份覆蓋與新增；失敗時舊資料會完整保留。
create or replace function public.import_donation_workbook(
  p_file_name text,
  p_file_size integer,
  p_file_hash text,
  p_imported_by uuid,
  p_records jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_batch_id uuid;
  v_record_count integer;
  v_period_count integer;
  v_total_amount bigint;
  v_replaced_record_count integer := 0;
  v_replaced_period_count integer := 0;
begin
  if jsonb_typeof(p_records) <> 'array' then
    raise exception 'INVALID_RECORDS';
  end if;

  v_record_count := jsonb_array_length(p_records);
  if v_record_count = 0 or v_record_count > 25000 then
    raise exception 'INVALID_RECORD_COUNT';
  end if;

  if p_file_size <= 0 or p_file_size > 10485760 then
    raise exception 'INVALID_FILE_SIZE';
  end if;

  if p_file_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'INVALID_FILE_HASH';
  end if;

  if exists (
    select 1 from public.donation_import_batches where file_hash = p_file_hash
  ) then
    raise exception 'DUPLICATE_FILE';
  end if;

  create temporary table donation_import_staging (
    donation_date date not null,
    donor_name text not null,
    amount bigint not null,
    donation_type text not null,
    is_anonymous boolean not null,
    source_sheet text not null,
    source_row integer not null
  ) on commit drop;

  insert into donation_import_staging (
    donation_date,
    donor_name,
    amount,
    donation_type,
    is_anonymous,
    source_sheet,
    source_row
  )
  select
    x.donation_date,
    btrim(x.donor_name),
    x.amount,
    x.donation_type,
    x.is_anonymous,
    btrim(x.source_sheet),
    x.source_row
  from jsonb_to_recordset(p_records) as x(
    donation_date date,
    donor_name text,
    amount bigint,
    donation_type text,
    is_anonymous boolean,
    source_sheet text,
    source_row integer
  );

  if exists (
    select 1
    from donation_import_staging
    where donation_date < date '1912-01-01'
       or donation_date > (current_date + interval '1 year')::date
       or char_length(donor_name) not between 1 and 200
       or amount <= 0
       or donation_type not in ('general', 'fundraising')
       or char_length(source_sheet) not between 1 and 100
       or source_row <= 0
  ) then
    raise exception 'INVALID_RECORD_DATA';
  end if;

  if exists (
    select 1
    from donation_import_staging
    group by source_sheet, source_row
    having count(*) > 1
  ) then
    raise exception 'DUPLICATE_SOURCE_ROW';
  end if;

  select count(*)::integer, coalesce(sum(amount), 0)::bigint
  into v_record_count, v_total_amount
  from donation_import_staging;

  select count(*)::integer
  into v_period_count
  from (
    select distinct
      extract(year from donation_date)::smallint as western_year,
      extract(month from donation_date)::smallint as month,
      donation_type
    from donation_import_staging
  ) periods;

  select count(*)::integer
  into v_replaced_period_count
  from (
    select distinct d.western_year, d.month, d.donation_type
    from public.donation_records d
    join (
      select distinct
        extract(year from donation_date)::smallint as western_year,
        extract(month from donation_date)::smallint as month,
        donation_type
      from donation_import_staging
    ) incoming
      on incoming.western_year = d.western_year
     and incoming.month = d.month
     and incoming.donation_type = d.donation_type
  ) existing_periods;

  insert into public.donation_import_batches (
    file_name,
    file_size,
    file_hash,
    record_count,
    period_count,
    total_amount,
    imported_by
  ) values (
    left(btrim(p_file_name), 255),
    p_file_size,
    p_file_hash,
    v_record_count,
    v_period_count,
    v_total_amount,
    p_imported_by
  ) returning id into v_batch_id;

  delete from public.donation_records d
  using (
    select distinct
      extract(year from donation_date)::smallint as western_year,
      extract(month from donation_date)::smallint as month,
      donation_type
    from donation_import_staging
  ) incoming
  where d.western_year = incoming.western_year
    and d.month = incoming.month
    and d.donation_type = incoming.donation_type;

  get diagnostics v_replaced_record_count = row_count;

  -- 覆蓋後已無資料的舊批次一併清掉，避免批次紀錄無限累積。
  delete from public.donation_import_batches b
  where b.id <> v_batch_id
    and not exists (
      select 1 from public.donation_records d where d.import_batch_id = b.id
    );

  insert into public.donation_records (
    import_batch_id,
    donation_date,
    donor_name,
    amount,
    donation_type,
    is_anonymous,
    source_sheet,
    source_row
  )
  select
    v_batch_id,
    donation_date,
    donor_name,
    amount,
    donation_type,
    is_anonymous,
    source_sheet,
    source_row
  from donation_import_staging;

  return jsonb_build_object(
    'importId', v_batch_id,
    'recordCount', v_record_count,
    'periodCount', v_period_count,
    'totalAmount', v_total_amount,
    'replacedRecordCount', v_replaced_record_count,
    'replacedPeriodCount', v_replaced_period_count
  );
end;
$$;

revoke all on function public.import_donation_workbook(text, integer, text, uuid, jsonb)
from public, anon, authenticated;
grant execute on function public.import_donation_workbook(text, integer, text, uuid, jsonb)
to service_role;

-- 公開查詢：支援姓名部分比對、年月與一般／勸募篩選，並回傳完整篩選合計。
create or replace function public.search_public_donations(
  p_query text default null,
  p_year integer default null,
  p_month integer default null,
  p_donation_type text default null,
  p_page integer default 1,
  p_page_size integer default 50
)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  with params as (
    select
      lower(regexp_replace(btrim(coalesce(p_query, '')), '[[:space:]　]+', '', 'g')) as query,
      greatest(coalesce(p_page, 1), 1) as page,
      least(greatest(coalesce(p_page_size, 50), 1), 100) as page_size
  ),
  filtered as materialized (
    select
      d.id,
      d.donation_date,
      d.western_year,
      d.month,
      d.donor_name,
      d.amount,
      d.donation_type,
      d.is_anonymous
    from public.donation_records d
    cross join params p
    where (p_year is null or d.western_year = p_year)
      and (p_month is null or d.month = p_month)
      and (p_donation_type is null or d.donation_type = p_donation_type)
      and (p.query = '' or d.normalized_name like '%' || p.query || '%')
  ),
  paged as (
    select *
    from filtered
    order by donation_date desc, id desc
    limit (select page_size from params)
    offset ((select page - 1 from params) * (select page_size from params))
  ),
  years as (
    select coalesce(jsonb_agg(y order by y desc), '[]'::jsonb) as values
    from (select distinct western_year as y from public.donation_records) distinct_years
  )
  select jsonb_build_object(
    'rows', coalesce((select jsonb_agg(to_jsonb(paged) order by donation_date desc, id desc) from paged), '[]'::jsonb),
    'totalCount', (select count(*) from filtered),
    'totalAmount', coalesce((select sum(amount) from filtered), 0),
    'periodCount', (select count(*) from (select distinct western_year, month from filtered) fp),
    'availableYears', (select values from years)
  );
$$;

grant execute on function public.search_public_donations(text, integer, integer, text, integer, integer)
to anon, authenticated;
