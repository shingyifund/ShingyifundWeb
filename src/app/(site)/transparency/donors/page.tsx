import type { Metadata } from "next";
import Link from "next/link";
import {
  Filter,
  HeartHandshake,
  Search,
  X,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getRequestLocale } from "@/i18n/request";
import { localizeHref, type Locale } from "@/i18n/config";
import {
  formatDonationAmount,
  formatDonationDate,
  getDonationTypeLabel,
  type DonationRecord,
  type DonationType,
} from "@/lib/donation-registry";
import { searchPublicDonations } from "@/lib/donation-registry-server";
import {
  DonationFilterForm,
  DonationSearchButton,
} from "./_components/donation-filter-form";
import { DonationFilterSelect } from "./_components/donation-filter-select";

const PAGE_SIZE = 50;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return locale === "en"
    ? {
        title: "Donation Registry",
        description: "Search the Shing Yi Charity Foundation's public donation registry by donor name and date.",
      }
    : {
        title: "捐款芳名錄",
        description: "依捐款者姓名、年份與月份查詢興毅基金會公開捐款芳名錄。",
      };
}

function integerParam(value: string | undefined, min: number, max: number) {
  if (!value || !/^\d+$/.test(value)) return undefined;
  const number = Number(value);
  return Number.isInteger(number) && number >= min && number <= max ? number : undefined;
}

function donationTypeParam(value: string | undefined): DonationType | undefined {
  return value === "general" || value === "fundraising" ? value : undefined;
}

function pageHref(
  locale: Locale,
  values: { query?: string; year?: number; month?: number; donationType?: DonationType },
  page: number,
) {
  const params = new URLSearchParams();
  if (values.query) params.set("q", values.query);
  if (values.year) params.set("year", String(values.year));
  if (values.month) params.set("month", String(values.month));
  if (values.donationType) params.set("type", values.donationType);
  if (page > 1) params.set("page", String(page));
  const queryString = params.toString();
  return `${localizeHref("/transparency/donors", locale)}${queryString ? `?${queryString}` : ""}`;
}

export default async function DonorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const locale = await getRequestLocale();
  const params = await searchParams;
  const query = params.q?.trim().slice(0, 80) || undefined;
  const year = integerParam(params.year, 1912, 2999);
  const month = integerParam(params.month, 1, 12);
  const donationType = donationTypeParam(params.type);
  const page = integerParam(params.page, 1, 100_000) ?? 1;

  const result = await searchPublicDonations({
    query,
    year,
    month,
    donationType,
    page,
    pageSize: PAGE_SIZE,
  });
  const totalPages = Math.max(1, Math.ceil(result.totalCount / PAGE_SIZE));
  const hasFilters = Boolean(query || year || month || donationType);
  const filters = { query, year, month, donationType };

  return (
    <>
      <section className="relative overflow-hidden bg-navy-900 py-14 text-white sm:py-18">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.07)_1px,transparent_0)] bg-size-[25px_25px]" />
        <div className="pointer-events-none absolute -right-32 -top-36 size-96 rounded-full bg-amber-400/15 blur-3xl" />
        <Container className="relative">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
              <HeartHandshake className="size-4" />
              {locale === "en" ? "Public transparency" : "公開徵信"}
            </p>
            <h1 className="mt-4 font-serif text-4xl font-black leading-tight sm:text-5xl">
              {locale === "en" ? "Donation Registry" : "捐款芳名錄"}
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-navy-100 sm:text-base">
              {locale === "en"
                ? "Every contribution is published with gratitude. Search by name or period to review donation records and totals."
                : "感謝每一份善心支持。您可以依姓名、年份與月份篩選公開紀錄，查看符合資料的捐款筆數與金額合計。"}
            </p>
          </div>
        </Container>
      </section>

      <main className="bg-grain bg-[#f8f6ef] py-9 sm:py-12">
        <Container>
          <DonationFilters
            locale={locale}
            query={query}
            year={year}
            month={month}
            donationType={donationType}
            availableYears={result.availableYears}
            hasFilters={hasFilters}
          />

          <section className="mt-6 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-[0_18px_50px_-34px_rgb(15_38_71/0.5)]">
            <div className="flex flex-col gap-1 border-b border-navy-100 bg-navy-50/65 px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
                  {locale === "en" ? "Public ledger" : "公開紀錄"}
                </p>
                <h2 className="mt-1 font-serif text-2xl font-bold text-navy-900">
                  {hasFilters
                    ? locale === "en" ? "Search results" : "篩選結果"
                    : locale === "en" ? "All donations" : "全部捐款"}
                </h2>
                {hasFilters ? (
                  <FilterSummary
                    locale={locale}
                    query={query}
                    year={year}
                    month={month}
                    donationType={donationType}
                  />
                ) : null}
              </div>
              <p className="text-xs text-ink-muted">
                {locale === "en" ? "Newest records first" : "依捐款日期由新到舊排列"}
              </p>
            </div>

            {result.rows.length > 0 ? (
              <>
                <DonationTable rows={result.rows} locale={locale} />
                <DonationCards rows={result.rows} locale={locale} />
              </>
            ) : (
              <div className="px-6 py-14 text-center">
                <Search className="mx-auto size-10 text-navy-300" />
                <h2 className="mt-4 font-serif text-xl font-bold text-navy-900">
                  {locale === "en" ? "No matching donation records" : "目前沒有符合條件的捐款紀錄"}
                </h2>
                <p className="mt-2 text-sm text-ink-muted">
                  {locale === "en" ? "Try changing or clearing the filters." : "請調整姓名、年月或捐款類別後再查詢。"}
                </p>
              </div>
            )}

            {result.totalCount > 0 ? (
              <Pagination
                locale={locale}
                page={Math.min(page, totalPages)}
                totalPages={totalPages}
                totalCount={result.totalCount}
                filters={filters}
              />
            ) : null}
          </section>

          <p className="mt-5 rounded-xl border border-navy-100 bg-white/75 px-4 py-3 text-xs leading-5 text-ink-muted">
            {locale === "en"
              ? "Search totals are calculated from the public names shown in this registry. People with the same name may be combined; anonymous labels do not represent a verified individual."
              : "查詢合計依芳名錄上的公開姓名篩選；同名捐款人可能合併計算。「善心人士」等匿名名稱僅為公開標示，不代表可辨識的同一人。"}
          </p>
        </Container>
      </main>
    </>
  );
}

function DonationFilters({
  locale,
  query,
  year,
  month,
  donationType,
  availableYears,
  hasFilters,
}: {
  locale: Locale;
  query?: string;
  year?: number;
  month?: number;
  donationType?: DonationType;
  availableYears: number[];
  hasFilters: boolean;
}) {
  const now = new Date().getFullYear();
  const fallbackYears = Array.from({ length: 6 }, (_, index) => now - index);
  const years = availableYears.length > 0 ? availableYears : fallbackYears;
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
  const typeOptions = [
    { value: "all", label: locale === "en" ? "All categories" : "全部類別" },
    { value: "general", label: getDonationTypeLabel("general", locale) },
    { value: "fundraising", label: getDonationTypeLabel("fundraising", locale) },
  ];

  return (
    <DonationFilterForm
      action={localizeHref("/transparency/donors", locale)}
      className="rounded-2xl border border-navy-100 bg-white p-4 shadow-card sm:p-5"
    >
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy-900">
        <Filter className="size-4 text-amber-600" />
        {locale === "en" ? "Filter public records" : "篩選公開紀錄"}
      </div>
      <div className="grid gap-3 md:grid-cols-[minmax(13rem,1.5fr)_0.7fr_0.65fr_0.9fr_auto] md:items-end">
        <label className="grid gap-1.5 text-sm font-semibold text-navy-900">
          {locale === "en" ? "Donor name" : "捐款者姓名"}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-navy-300" />
            <input
              name="q"
              type="search"
              defaultValue={query}
              maxLength={80}
              placeholder={locale === "en" ? "Enter all or part of a name" : "輸入完整或部分姓名"}
              className="h-11 w-full rounded-xl border border-navy-200 bg-white pl-9 pr-3 text-sm text-navy-900 outline-none transition focus:border-amber-500 focus:ring-3 focus:ring-amber-100"
            />
          </div>
        </label>
        <DonationFilterSelect
          name="year"
          label={locale === "en" ? "Year" : "年份"}
          defaultValue={year ? String(year) : "all"}
          options={yearOptions}
        />
        <DonationFilterSelect
          name="month"
          label={locale === "en" ? "Month" : "月份"}
          defaultValue={month ? String(month) : "all"}
          options={monthOptions}
        />
        <DonationFilterSelect
          name="type"
          label={locale === "en" ? "Category" : "類別"}
          defaultValue={donationType ?? "all"}
          options={typeOptions}
        />
        <div className="flex gap-2">
          <DonationSearchButton locale={locale} className="flex-1 md:flex-none" />
          {hasFilters ? (
            <Button href={localizeHref("/transparency/donors", locale)} variant="outline" size="md" aria-label={locale === "en" ? "Clear filters" : "清除篩選"}>
              <X className="size-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </DonationFilterForm>
  );
}

function FilterSummary({
  locale,
  query,
  year,
  month,
  donationType,
}: {
  locale: Locale;
  query?: string;
  year?: number;
  month?: number;
  donationType?: DonationType;
}) {
  const items = [
    query ? `${locale === "en" ? "Name" : "姓名"}：${query}` : null,
    year ? `${locale === "en" ? "Year" : "年份"}：${year}` : null,
    month ? `${locale === "en" ? "Month" : "月份"}：${locale === "en" ? month : `${month} 月`}` : null,
    donationType ? `${locale === "en" ? "Category" : "類別"}：${getDonationTypeLabel(donationType, locale)}` : null,
  ].filter((item): item is string => Boolean(item));

  return (
    <div className="mt-2 flex flex-wrap gap-1.5" aria-label={locale === "en" ? "Applied filters" : "目前篩選條件"}>
      {items.map((item) => (
        <span key={item} className="rounded-full border border-navy-100 bg-white px-2.5 py-1 text-xs font-medium text-navy-700">
          {item}
        </span>
      ))}
    </div>
  );
}

function DonationTable({ rows, locale }: { rows: DonationRecord[]; locale: Locale }) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-navy-100 bg-[#fffdf8] text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
            <th className="px-6 py-3">{locale === "en" ? "Date" : "捐款日期"}</th>
            <th className="px-6 py-3">{locale === "en" ? "Public name" : "公開姓名"}</th>
            <th className="px-6 py-3">{locale === "en" ? "Category" : "類別"}</th>
            <th className="px-6 py-3 text-right">{locale === "en" ? "Amount" : "捐款金額"}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-100">
          {rows.map((row) => (
            <tr key={row.id} className="transition-colors hover:bg-amber-50/45">
              <td className="px-6 py-4 tabular-nums text-ink-soft">{formatDonationDate(row.donation_date, locale)}</td>
              <td className="px-6 py-4 font-semibold text-navy-900">{row.donor_name}</td>
              <td className="px-6 py-4"><DonationTypePill type={row.donation_type} locale={locale} /></td>
              <td className="px-6 py-4 text-right font-semibold tabular-nums text-navy-900">{formatDonationAmount(row.amount, locale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DonationCards({ rows, locale }: { rows: DonationRecord[]; locale: Locale }) {
  return (
    <div className="divide-y divide-navy-100 md:hidden">
      {rows.map((row) => (
        <article key={row.id} className="px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate font-semibold text-navy-900">{row.donor_name}</p>
              <p className="mt-1 text-xs tabular-nums text-ink-muted">{formatDonationDate(row.donation_date, locale)}</p>
            </div>
            <p className="shrink-0 font-serif text-lg font-bold tabular-nums text-navy-900">{formatDonationAmount(row.amount, locale)}</p>
          </div>
          <div className="mt-3"><DonationTypePill type={row.donation_type} locale={locale} /></div>
        </article>
      ))}
    </div>
  );
}

function DonationTypePill({ type, locale }: { type: DonationType; locale: Locale }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${type === "fundraising" ? "bg-amber-100 text-amber-800" : "bg-navy-50 text-navy-700"}`}>
      {getDonationTypeLabel(type, locale)}
    </span>
  );
}

function Pagination({
  locale,
  page,
  totalPages,
  totalCount,
  filters,
}: {
  locale: Locale;
  page: number;
  totalPages: number;
  totalCount: number;
  filters: { query?: string; year?: number; month?: number; donationType?: DonationType };
}) {
  const start = (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, totalCount);
  return (
    <div className="flex flex-col gap-3 border-t border-navy-100 bg-[#fffdf8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-sm text-ink-muted">
        {locale === "en" ? `${start}–${end} of ${totalCount}` : `第 ${start}–${end} 筆，共 ${totalCount.toLocaleString("zh-TW")} 筆`}
      </p>
      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link href={pageHref(locale, filters, page - 1)} className="rounded-full border border-navy-200 bg-white px-4 py-2 text-sm font-semibold text-navy-700 transition hover:border-amber-400 hover:text-amber-700">
            {locale === "en" ? "Previous" : "上一頁"}
          </Link>
        ) : <span className="rounded-full border border-navy-100 px-4 py-2 text-sm text-navy-300">{locale === "en" ? "Previous" : "上一頁"}</span>}
        <span className="min-w-16 text-center text-sm text-ink-muted">{page} / {totalPages}</span>
        {page < totalPages ? (
          <Link href={pageHref(locale, filters, page + 1)} className="rounded-full border border-navy-200 bg-white px-4 py-2 text-sm font-semibold text-navy-700 transition hover:border-amber-400 hover:text-amber-700">
            {locale === "en" ? "Next" : "下一頁"}
          </Link>
        ) : <span className="rounded-full border border-navy-100 px-4 py-2 text-sm text-navy-300">{locale === "en" ? "Next" : "下一頁"}</span>}
      </div>
    </div>
  );
}
