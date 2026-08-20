create extension if not exists pgcrypto;

create table if not exists public.sustainability_partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_en text,
  logo_url text not null,
  logo_path text not null,
  website_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sustainability_partners enable row level security;

grant select on public.sustainability_partners to anon, authenticated;
grant all on public.sustainability_partners to service_role;

drop policy if exists "Public can read active sustainability partners"
  on public.sustainability_partners;
create policy "Public can read active sustainability partners"
  on public.sustainability_partners
  for select
  to anon, authenticated
  using (is_active = true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'sustainability-partner-logos',
  'sustainability-partner-logos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.set_sustainability_partner_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_sustainability_partner_updated_at
  on public.sustainability_partners;
create trigger set_sustainability_partner_updated_at
before update on public.sustainability_partners
for each row execute function public.set_sustainability_partner_updated_at();
