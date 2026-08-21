import type { Metadata } from "next";
import {
  Filter,
  HandHeart,
  Search,
  X,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getRequestLocale } from "@/i18n/request";
import { localizeHref, type Locale } from "@/i18n/config";
import {
  formatRecipientAmount,
  formatRecipientDate,
  type RecipientRecord,
} from "@/lib/recipient-registry";
import { searchPublicRecipients } from "@/lib/recipient-registry-server";
import {
  DonationFilterForm,
  DonationSearchButton,
} from "../donors/_components/donation-filter-form";
import { DonationFilterSelect } from "../donors/_components/donation-filter-select";

const PAGE_SIZE = 50;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return locale === "en"
    ? {
        title: "Beneficiary List",
        description: "Search the Shing Yi Charity Foundation's public beneficiary list by name and period.",
      }
    : {
        title: "受贈者名單",
        description: "依受贈對象名稱、年份與月份查詢興毅基金會公開受贈者名單。",
      };
}

function integerParam(value: string | undefined, min: number, max: number) {
  if (!value || !/^\d+$/.test(value)) return undefined;
  const number = Number(value);
  return Number.isInteger(number) && number >= min && number <= max ? number : undefined;
}

function pageHref(
  locale: Locale,
  values: { query?: string; year?: number; month?: number },
  page: number,
) {
  const params = new URLSearchParams();
  if (values.query) params.set("q", values.query);
  if (values.year) params.set("year", String(values.year));
  if (values.month) params.set("month", String(values.month));
  if (page > 1) params.set("page", String(page));
  const queryString = params.toString();
  return `${localizeHref("/transparency/recipients", locale)}${queryString ? `?${queryString}` : ""}`;
}

export default async function RecipientsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const [locale, params] = await Promise.all([getRequestLocale(), searchParams]);
  const query = params.q?.trim().slice(0, 80) || undefined;
  const year = integerParam(params.year, 1912, 2999);
  const month = integerParam(params.month, 1, 12);
  const page = integerParam(params.page, 1, 100_000) ?? 1;
  const result = await searchPublicRecipients({ query, year, month, page, pageSize: PAGE_SIZE });
  const totalPages = Math.max(1, Math.ceil(result.totalCount / PAGE_SIZE));
  const hasFilters = Boolean(query || year || month);
  const filters = { query, year, month };

  return (
    <>
      <section className="relative overflow-hidden bg-navy-900 py-14 text-white sm:py-18">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.07)_1px,transparent_0)] bg-size-[25px_25px]" />
        <div className="pointer-events-none absolute -right-32 -top-36 size-96 rounded-full bg-amber-400/15 blur-2xl" style={{ transform: "translateZ(0)" }} />
        <Container className="relative">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
              <HandHeart className="size-4" />
              {locale === "en" ? "Public transparency" : "公開徵信"}
            </p>
            <h1 className="mt-4 font-serif text-4xl font-black leading-tight sm:text-5xl">
              {locale === "en" ? "Beneficiary List" : "受贈者名單"}
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-navy-100 sm:text-base">
              {locale === "en"
                ? "Review the Foundation's publicly disclosed recipients and assistance amounts. Search by recipient name or period."
                : "公開本會受贈對象與受贈金額。您可以依受贈對象名稱、年份與月份篩選公開紀錄。"}
            </p>
          </div>
        </Container>
      </section>

      <main className="bg-grain bg-[#f8f6ef] py-9 sm:py-12">
        <Container>
          <RecipientFilters
            locale={locale}
            query={query}
            year={year}
            month={month}
            availableYears={result.availableYears}
            hasFilters={hasFilters}
          />

          <section className="mt-6 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-[0_18px_50px_-34px_rgb(15_38_71/0.5)]">
            <div className="flex flex-col gap-1 border-b border-navy-100 bg-navy-50/65 px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">{locale === "en" ? "Public record" : "公開紀錄"}</p>
                <h2 className="mt-1 font-serif text-2xl font-bold text-navy-900">
                  {hasFilters ? (locale === "en" ? "Search results" : "篩選結果") : (locale === "en" ? "All beneficiaries" : "全部受贈紀錄")}
                </h2>
                {hasFilters ? <RecipientFilterSummary locale={locale} query={query} year={year} month={month} /> : null}
              </div>
              <p className="text-xs text-ink-muted">{locale === "en" ? "Newest records first" : "依受贈日期由新到舊排列"}</p>
            </div>

            {result.rows.length > 0 ? (
              <>
                <RecipientTable rows={result.rows} locale={locale} />
                <RecipientCards rows={result.rows} locale={locale} />
              </>
            ) : (
              <div className="px-6 py-14 text-center">
                <Search className="mx-auto size-10 text-navy-300" />
                <h2 className="mt-4 font-serif text-xl font-bold text-navy-900">{locale === "en" ? "No matching records" : "目前沒有符合條件的受贈紀錄"}</h2>
                <p className="mt-2 text-sm text-ink-muted">{locale === "en" ? "Try changing or clearing the filters." : "請調整受贈對象名稱或年月後再查詢。"}</p>
              </div>
            )}

            {result.totalCount > 0 ? (
              <Pagination locale={locale} page={Math.min(page, totalPages)} totalPages={totalPages} totalCount={result.totalCount} filters={filters} />
            ) : null}
          </section>
        </Container>
      </main>
    </>
  );
}

function RecipientFilters({
  locale,
  query,
  year,
  month,
  availableYears,
  hasFilters,
}: {
  locale: Locale;
  query?: string;
  year?: number;
  month?: number;
  availableYears: number[];
  hasFilters: boolean;
}) {
  const now = new Date().getFullYear();
  const years = availableYears.length > 0 ? availableYears : Array.from({ length: 6 }, (_, index) => now - index);
  const yearOptions = [
    { value: "all", label: locale === "en" ? "All years" : "全部年份" },
    ...years.map((value) => ({ value: String(value), label: locale === "en" ? String(value) : `${value} 年` })),
  ];
  const monthOptions = [
    { value: "all", label: locale === "en" ? "All months" : "全部月份" },
    ...Array.from({ length: 12 }, (_, index) => index + 1).map((value) => ({
      value: String(value),
      label: locale === "en"
        ? new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2026, value - 1, 1)))
        : `${value} 月`,
    })),
  ];

  return (
    <DonationFilterForm action={localizeHref("/transparency/recipients", locale)} className="rounded-2xl border border-navy-100 bg-white p-4 shadow-card sm:p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy-900"><Filter className="size-4 text-amber-600" />{locale === "en" ? "Filter public records" : "篩選公開紀錄"}</div>
      <div className="grid gap-3 md:grid-cols-[minmax(15rem,1.5fr)_0.7fr_0.7fr_auto] md:items-end">
        <label className="grid gap-1.5 text-sm font-semibold text-navy-900">
          {locale === "en" ? "Recipient name" : "受贈對象名稱"}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-navy-300" />
            <input name="q" type="search" defaultValue={query} maxLength={80} placeholder={locale === "en" ? "Enter all or part of a name" : "輸入完整或部分名稱"} className="h-11 w-full rounded-xl border border-navy-200 bg-white pl-9 pr-3 text-sm text-navy-900 outline-none transition focus:border-amber-500 focus:ring-3 focus:ring-amber-100" />
          </div>
        </label>
        <DonationFilterSelect name="year" label={locale === "en" ? "Year" : "年份"} defaultValue={year ? String(year) : "all"} options={yearOptions} />
        <DonationFilterSelect name="month" label={locale === "en" ? "Month" : "月份"} defaultValue={month ? String(month) : "all"} options={monthOptions} />
        <div className="flex gap-2">
          <DonationSearchButton locale={locale} className="flex-1 md:flex-none" />
          {hasFilters ? <Button href={localizeHref("/transparency/recipients", locale)} variant="outline" size="md" aria-label={locale === "en" ? "Clear filters" : "清除篩選"}><X className="size-4" /></Button> : null}
        </div>
      </div>
    </DonationFilterForm>
  );
}

function RecipientFilterSummary({ locale, query, year, month }: { locale: Locale; query?: string; year?: number; month?: number }) {
  const items = [
    query ? `${locale === "en" ? "Recipient" : "受贈對象"}：${query}` : null,
    year ? `${locale === "en" ? "Year" : "年份"}：${year}` : null,
    month ? `${locale === "en" ? "Month" : "月份"}：${locale === "en" ? month : `${month} 月`}` : null,
  ].filter((item): item is string => Boolean(item));

  return (
    <div className="mt-2 flex flex-wrap gap-1.5" aria-label={locale === "en" ? "Applied filters" : "目前篩選條件"}>
      {items.map((item) => <span key={item} className="rounded-full border border-navy-100 bg-white px-2.5 py-1 text-xs font-medium text-navy-700">{item}</span>)}
    </div>
  );
}

function RecipientTable({ rows, locale }: { rows: RecipientRecord[]; locale: Locale }) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full border-collapse text-left text-sm">
        <thead><tr className="border-b border-navy-100 bg-[#fffdf8] text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted"><th className="px-6 py-3">{locale === "en" ? "Date" : "受贈日期"}</th><th className="px-6 py-3">{locale === "en" ? "Recipient" : "受贈對象名稱"}</th><th className="px-6 py-3 text-right">{locale === "en" ? "Amount" : "受贈金額"}</th></tr></thead>
        <tbody className="divide-y divide-navy-100">{rows.map((row) => <tr key={row.id} className="transition-colors hover:bg-amber-50/45"><td className="px-6 py-4 tabular-nums text-ink-soft">{formatRecipientDate(row.aid_date, locale)}</td><td className="px-6 py-4 font-semibold text-navy-900">{row.recipient_name}</td><td className="px-6 py-4 text-right font-semibold tabular-nums text-navy-900">{formatRecipientAmount(row.amount, locale)}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

function RecipientCards({ rows, locale }: { rows: RecipientRecord[]; locale: Locale }) {
  return <div className="divide-y divide-navy-100 md:hidden">{rows.map((row) => <article key={row.id} className="px-5 py-4"><div className="flex items-start justify-between gap-4"><div className="min-w-0"><p className="font-semibold text-navy-900">{row.recipient_name}</p><p className="mt-1 text-xs tabular-nums text-ink-muted">{formatRecipientDate(row.aid_date, locale)}</p></div><p className="shrink-0 font-serif text-lg font-bold tabular-nums text-navy-900">{formatRecipientAmount(row.amount, locale)}</p></div></article>)}</div>;
}

function Pagination({ locale, page, totalPages, totalCount, filters }: { locale: Locale; page: number; totalPages: number; totalCount: number; filters: { query?: string; year?: number; month?: number } }) {
  const start = (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, totalCount);
  return (
    <div className="flex flex-col gap-3 border-t border-navy-100 bg-[#fffdf8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-sm text-ink-muted">{locale === "en" ? `${start}–${end} of ${totalCount}` : `第 ${start}–${end} 筆，共 ${totalCount.toLocaleString("zh-TW")} 筆`}</p>
      <div className="flex items-center gap-2">
        {page > 1 ? <Button href={pageHref(locale, filters, page - 1)} variant="white" size="sm">{locale === "en" ? "Previous" : "上一頁"}</Button> : <span className="rounded-full border border-navy-100 px-4 py-2 text-sm text-navy-300">{locale === "en" ? "Previous" : "上一頁"}</span>}
        <span className="min-w-16 text-center text-sm text-ink-muted">{page} / {totalPages}</span>
        {page < totalPages ? <Button href={pageHref(locale, filters, page + 1)} variant="white" size="sm">{locale === "en" ? "Next" : "下一頁"}</Button> : <span className="rounded-full border border-navy-100 px-4 py-2 text-sm text-navy-300">{locale === "en" ? "Next" : "下一頁"}</span>}
      </div>
    </div>
  );
}
