-- 每月捐物清單：新增可編輯的捐贈內容，供標題自動組合使用。

alter table public.monthly_donation_reports
  add column if not exists donation_content text;

-- 舊資料原本只有泛稱「物資」，先以相同語意補齊，保留既有自訂標題。
update public.monthly_donation_reports
set donation_content = '物資'
where donation_content is null or btrim(donation_content) = '';

-- 只升級舊版自動產生的標題；手動修改過的標題維持原樣。
update public.monthly_donation_reports
set title = '感謝 '
  || case
    when is_anonymous or donor_name is null or btrim(donor_name) = '' then '善心人士'
    else btrim(donor_name)
  end
  || ' 捐贈 '
  || btrim(donation_content)
  || ' 一批'
where title = '感謝 '
  || case
    when is_anonymous or donor_name is null or btrim(donor_name) = '' then '善心人士'
    else btrim(donor_name)
  end
  || ' 捐贈物資';

alter table public.monthly_donation_reports
  alter column donation_content set not null;

alter table public.monthly_donation_reports
  drop constraint if exists monthly_donation_reports_donation_content_check;

alter table public.monthly_donation_reports
  add constraint monthly_donation_reports_donation_content_check
  check (char_length(btrim(donation_content)) between 1 and 500);
