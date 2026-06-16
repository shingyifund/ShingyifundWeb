"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ImageIcon,
  UserRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MonthPicker } from "@/components/ui/month-picker";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LinkPendingIcon } from "@/components/ui/link-pending";
import {
  formatMonthlyDonationPeriod,
  getMonthlyDonationDonorDisplayName,
  getMonthlyDonationDonorTypeLabel,
  getMonthlyDonationRegionLabel,
} from "@/lib/monthly-donations";
import type { MonthlyDonationDonorType } from "@/lib/types";
import type { MonthlyDonationListItem } from "@/lib/data/queries";

type Props = {
  reports: MonthlyDonationListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  currentYear?: number;
  currentMonth?: number;
  currentDonorType?: MonthlyDonationDonorType;
};

export function MonthlyDonationLedger({
  reports,
  total,
  page,
  pageSize,
  totalPages,
  currentYear,
  currentMonth,
  currentDonorType,
}: Props) {
  const router = useRouter();

  function buildUrl(overrides: {
    year?: string;
    month?: string;
    donorType?: string;
    page?: string;
  }) {
    const base = {
      year: currentYear ? String(currentYear) : undefined,
      month: currentMonth ? String(currentMonth) : undefined,
      donorType: currentDonorType,
      page: page > 1 ? String(page) : undefined,
    };
    const merged = { ...base, ...overrides };
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) {
      if (v !== undefined && v !== "") params.set(k, v);
    }
    const str = params.toString();
    return str ? `?${str}` : "?";
  }

  function handlePeriodChange(val: string) {
    const match = /^(\d{4})-(\d{2})$/.exec(val);
    if (match) {
      router.push(
        buildUrl({ year: match[1], month: String(Number(match[2])), page: undefined }),
      );
    }
  }

  function handlePeriodClear() {
    router.push(buildUrl({ year: undefined, month: undefined, page: undefined }));
  }

  function handleDonorTypeChange(value: string) {
    router.push(
      buildUrl({ donorType: value === "all" || !value ? undefined : value, page: undefined }),
    );
  }

  const periodValue =
    currentYear && currentMonth
      ? `${currentYear}-${String(currentMonth).padStart(2, "0")}`
      : "";

  const hasFilter = periodValue || currentDonorType;
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 border-b border-navy-100 pb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
              Public ledger
            </p>
            <h2 className="mt-1 font-serif text-2xl font-black leading-tight text-navy-900">
              捐贈公開紀錄
            </h2>
          </div>
          <p className="text-sm text-ink-muted">
            依月份由新到舊排列，點選可查看照片與明細。
          </p>
        </div>

        <div className="rounded-lg border border-navy-100 bg-white px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <MonthPicker
                value={periodValue}
                onChange={handlePeriodChange}
                placeholder="選擇年月"
                className="w-40"
              />
              {periodValue && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={handlePeriodClear}
                  aria-label="清除年月篩選"
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>

            <ToggleGroup
              type="single"
              value={currentDonorType ?? "all"}
              onValueChange={handleDonorTypeChange}
              spacing={0}
              variant="outline"
            >
              <ToggleGroupItem value="all" className="text-sm">全部</ToggleGroupItem>
              <ToggleGroupItem value="individual" className="text-sm">個人</ToggleGroupItem>
              <ToggleGroupItem value="organization" className="text-sm">團體</ToggleGroupItem>
            </ToggleGroup>

            {hasFilter && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => router.push("?")}
                className="text-ink-muted"
              >
                清除篩選
              </Button>
            )}
          </div>
        </div>
      </div>

      {total === 0 && !hasFilter ? (
        <div className="rounded-2xl border border-dashed border-navy-200 bg-white p-8 text-center">
          <h2 className="font-serif text-2xl font-bold text-navy-900">
            目前尚無每月捐物清單
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            後台新增資料後，清單會顯示在此頁。
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_16px_44px_-28px_rgb(15_38_71/0.45)] ring-1 ring-navy-100">
            <div className="hidden grid-cols-[112px_150px_250px_minmax(0,1fr)_6rem] gap-4 border-b border-navy-100 bg-navy-50/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted md:grid">
              <span>圖片</span>
              <span>月份 / 區域</span>
              <span>捐贈者</span>
              <span>項目</span>
              <span className="text-center">明細</span>
            </div>

            {reports.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="font-serif text-xl font-bold text-navy-900">
                  沒有符合條件的紀錄
                </p>
                <p className="mt-2 text-sm text-ink-muted">
                  可以切換篩選條件查看其他月份。
                </p>
              </div>
            ) : (
              <div className="divide-y divide-navy-100">
                {reports.map((report) => (
                  <DonationLedgerRow key={report.id} report={report} />
                ))}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-ink-muted">
                第 {rangeStart}–{rangeEnd} 筆，共 {total} 筆
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => router.push(buildUrl({ page: String(page - 1) }))}
                >
                  上一頁
                </Button>
                <span className="min-w-16 text-center text-sm text-ink-muted">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => router.push(buildUrl({ page: String(page + 1) }))}
                >
                  下一頁
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function Thumbnail({
  url,
  className = "h-16 w-28",
}: {
  url: string | null;
  className?: string;
}) {
  return (
    <div className={`${className} shrink-0 overflow-hidden rounded-xl bg-navy-50`}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="size-full object-cover" />
      ) : (
        <div className="flex size-full items-center justify-center">
          <ImageIcon className="size-5 text-navy-300" strokeWidth={1.5} />
        </div>
      )}
    </div>
  );
}

function DonationLedgerRow({ report }: { report: MonthlyDonationListItem }) {
  const donorName = getMonthlyDonationDonorDisplayName({
    donorName: report.donorName,
    isAnonymous: report.isAnonymous,
  });
  const DonorIcon = report.donorType === "organization" ? Building2 : UserRound;
  const period = formatMonthlyDonationPeriod(report.westernYear, report.month);
  const regionLabel = getMonthlyDonationRegionLabel(report.region);
  const typeLabel = getMonthlyDonationDonorTypeLabel(report.donorType);

  return (
    <article className="group bg-white transition-colors hover:bg-amber-50/45">
      <div className="px-4 py-3">
        {/* Mobile */}
        <div className="flex gap-3 md:hidden">
          <Thumbnail url={report.firstImageUrl} className="h-20 w-32" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-ink-muted">
              {period} · {regionLabel} · {typeLabel}
            </p>
            <h3 className="mt-0.5 line-clamp-2 font-serif text-base font-bold leading-snug text-navy-900">
              {report.title}
            </h3>
            <p className="mt-0.5 text-xs font-semibold text-amber-700">{donorName}</p>
            <Link
              href={`/transparency/monthly-donations/${report.id}`}
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-navy-700 underline-offset-2 hover:underline"
            >
              查看明細
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:grid md:grid-cols-[112px_150px_250px_minmax(0,1fr)_6rem] md:items-center md:gap-4">
          <Thumbnail url={report.firstImageUrl} />

          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-navy-800">{period}</p>
            <p className="text-xs text-ink-muted">
              {regionLabel} · {typeLabel}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
              <DonorIcon className="size-4" strokeWidth={1.7} />
            </span>
            <span className="font-semibold text-amber-700">{donorName}</span>
          </div>

          <h3 className="line-clamp-2 font-serif text-base font-bold leading-snug text-navy-900">
            {report.title}
          </h3>

          <Link
            href={`/transparency/monthly-donations/${report.id}`}
            className="inline-flex items-center justify-center gap-1.5 justify-self-center rounded-full border border-navy-100 bg-white px-3 py-2 text-sm font-semibold text-navy-900 transition-colors hover:border-amber-300 hover:bg-white"
          >
            查看
            <LinkPendingIcon>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </LinkPendingIcon>
          </Link>
        </div>
      </div>
    </article>
  );
}
