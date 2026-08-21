-- 受贈者名單：Excel 匯入批次與公開查詢資料
-- 可重複在 Supabase SQL Editor 執行。

create extension if not exists pgcrypto;

create table if not exists public.recipient_import_batches (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_size integer not null check (file_size > 0 and file_size <= 10485760),
  file_hash text not null check (file_hash ~ '^[0-9a-f]{64}$'),
  record_count integer not null default 0 check (record_count >= 0),
  period_count integer not null default 0 check (period_count > 0),
  total_amount bigint not null default 0 check (total_amount >= 0),
  imported_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.recipient_records (
  id bigint generated always as identity primary key,
  import_batch_id uuid not null references public.recipient_import_batches(id) on delete cascade,
  aid_date date not null,
  western_year smallint generated always as (extract(year from aid_date)::smallint) stored,
  month smallint generated always as (extract(month from aid_date)::smallint) stored,
  recipient_name text not null check (char_length(btrim(recipient_name)) between 1 and 200),
  normalized_name text generated always as (
    lower(regexp_replace(btrim(recipient_name), '[[:space:]　]+', '', 'g'))
  ) stored,
  amount bigint not null check (amount > 0),
  source_sheet text not null check (char_length(source_sheet) between 1 and 100),
  source_row integer not null check (source_row > 0),
  created_at timestamptz not null default now(),
  unique (import_batch_id, source_sheet, source_row)
);

create index if not exists recipient_records_period_idx
  on public.recipient_records (western_year desc, month desc, aid_date desc, id desc);

create index if not exists recipient_records_normalized_name_idx
  on public.recipient_records (normalized_name text_pattern_ops);

create index if not exists recipient_records_batch_idx
  on public.recipient_records (import_batch_id);

alter table public.recipient_import_batches enable row level security;
alter table public.recipient_records enable row level security;

revoke all on table public.recipient_import_batches from anon, authenticated;
grant select on table public.recipient_records to anon, authenticated;
grant all privileges on table public.recipient_import_batches to service_role;
grant all privileges on table public.recipient_records to service_role;
grant usage, select on sequence public.recipient_records_id_seq to service_role;

drop policy if exists "Public can read recipient records" on public.recipient_records;
create policy "Public can read recipient records"
on public.recipient_records
for select
to anon, authenticated
using (true);

-- 以 Excel 涵蓋的年月完整取代既有資料；包含零筆資料的月份也會正確清空。
create or replace function public.import_recipient_workbook(
  p_file_name text,
  p_file_size integer,
  p_file_hash text,
  p_imported_by uuid,
  p_periods jsonb,
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
  if jsonb_typeof(p_periods) <> 'array' or jsonb_typeof(p_records) <> 'array' then
    raise exception 'INVALID_PAYLOAD';
  end if;

  v_record_count := jsonb_array_length(p_records);
  v_period_count := jsonb_array_length(p_periods);
  if v_record_count > 25000 then raise exception 'INVALID_RECORD_COUNT'; end if;
  if v_period_count = 0 or v_period_count > 480 then raise exception 'INVALID_PERIOD_COUNT'; end if;
  if p_file_size <= 0 or p_file_size > 10485760 then raise exception 'INVALID_FILE_SIZE'; end if;
  if p_file_hash !~ '^[0-9a-f]{64}$' then raise exception 'INVALID_FILE_HASH'; end if;

  if exists (select 1 from public.recipient_import_batches where file_hash = p_file_hash) then
    raise exception 'DUPLICATE_FILE';
  end if;

  create temporary table recipient_period_staging (
    western_year smallint not null,
    month smallint not null,
    primary key (western_year, month)
  ) on commit drop;

  insert into recipient_period_staging (western_year, month)
  select x.western_year, x.month
  from jsonb_to_recordset(p_periods) as x(western_year smallint, month smallint);

  if exists (
    select 1 from recipient_period_staging
    where western_year < 1912 or western_year > extract(year from current_date)::integer + 1
       or month < 1 or month > 12
  ) then
    raise exception 'INVALID_PERIOD_DATA';
  end if;

  create temporary table recipient_import_staging (
    aid_date date not null,
    recipient_name text not null,
    amount bigint not null,
    source_sheet text not null,
    source_row integer not null
  ) on commit drop;

  insert into recipient_import_staging (
    aid_date,
    recipient_name,
    amount,
    source_sheet,
    source_row
  )
  select
    x.aid_date,
    btrim(x.recipient_name),
    x.amount,
    btrim(x.source_sheet),
    x.source_row
  from jsonb_to_recordset(p_records) as x(
    aid_date date,
    recipient_name text,
    amount bigint,
    source_sheet text,
    source_row integer
  );

  if exists (
    select 1
    from recipient_import_staging
    where aid_date < date '1912-01-01'
       or aid_date > (current_date + interval '1 year')::date
       or char_length(recipient_name) not between 1 and 200
       or amount <= 0
       or char_length(source_sheet) not between 1 and 100
       or source_row <= 0
  ) then
    raise exception 'INVALID_RECORD_DATA';
  end if;

  if exists (
    select 1
    from recipient_import_staging
    group by source_sheet, source_row
    having count(*) > 1
  ) then
    raise exception 'DUPLICATE_SOURCE_ROW';
  end if;

  if exists (
    select 1
    from recipient_import_staging r
    where not exists (
      select 1 from recipient_period_staging p
      where p.western_year = extract(year from r.aid_date)::smallint
        and p.month = extract(month from r.aid_date)::smallint
    )
  ) then
    raise exception 'RECORD_PERIOD_NOT_INCLUDED';
  end if;

  select count(*)::integer, coalesce(sum(amount), 0)::bigint
  into v_record_count, v_total_amount
  from recipient_import_staging;

  select count(*)::integer into v_period_count from recipient_period_staging;

  select count(*)::integer
  into v_replaced_period_count
  from recipient_period_staging p
  where exists (
    select 1 from public.recipient_records r
    where r.western_year = p.western_year and r.month = p.month
  );

  insert into public.recipient_import_batches (
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

  delete from public.recipient_records r
  using recipient_period_staging p
  where r.western_year = p.western_year and r.month = p.month;

  get diagnostics v_replaced_record_count = row_count;

  delete from public.recipient_import_batches b
  where b.id <> v_batch_id
    and not exists (
      select 1 from public.recipient_records r where r.import_batch_id = b.id
    );

  insert into public.recipient_records (
    import_batch_id,
    aid_date,
    recipient_name,
    amount,
    source_sheet,
    source_row
  )
  select
    v_batch_id,
    aid_date,
    recipient_name,
    amount,
    source_sheet,
    source_row
  from recipient_import_staging;

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

revoke all on function public.import_recipient_workbook(text, integer, text, uuid, jsonb, jsonb)
from public, anon, authenticated;
grant execute on function public.import_recipient_workbook(text, integer, text, uuid, jsonb, jsonb)
to service_role;

create or replace function public.search_public_recipients(
  p_query text default null,
  p_year integer default null,
  p_month integer default null,
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
      r.id,
      r.aid_date,
      r.western_year,
      r.month,
      r.recipient_name,
      r.amount
    from public.recipient_records r
    cross join params p
    where (p_year is null or r.western_year = p_year)
      and (p_month is null or r.month = p_month)
      and (p.query = '' or r.normalized_name like '%' || p.query || '%')
  ),
  paged as (
    select *
    from filtered
    order by aid_date desc, id desc
    limit (select page_size from params)
    offset ((select page - 1 from params) * (select page_size from params))
  ),
  years as (
    select coalesce(jsonb_agg(y order by y desc), '[]'::jsonb) as values
    from (select distinct western_year as y from public.recipient_records) distinct_years
  )
  select jsonb_build_object(
    'rows', coalesce((select jsonb_agg(to_jsonb(paged) order by aid_date desc, id desc) from paged), '[]'::jsonb),
    'totalCount', (select count(*) from filtered),
    'totalAmount', coalesce((select sum(amount) from filtered), 0),
    'periodCount', (select count(*) from (select distinct western_year, month from filtered) fp),
    'availableYears', (select values from years)
  );
$$;

grant execute on function public.search_public_recipients(text, integer, integer, integer, integer)
to anon, authenticated;
