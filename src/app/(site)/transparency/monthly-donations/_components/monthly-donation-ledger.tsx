"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  ImageIcon,
  UserRound,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  formatMonthlyDonationPeriod,
  getMonthlyDonationDonorDisplayName,
  getMonthlyDonationDonorTypeLabel,
  getMonthlyDonationRegionLabel,
} from "@/lib/monthly-donations";
import type { MonthlyDonationDonorType, MonthlyDonationReport } from "@/lib/types";

type DonorFilter = "all" | MonthlyDonationDonorType;

function periodKey(report: MonthlyDonationReport) {
  return `${report.westernYear}-${String(report.month).padStart(2, "0")}`;
}

export function MonthlyDonationLedger({
  reports,
}: {
  reports: MonthlyDonationReport[];
}) {
  const months = useMemo(() => {
    const seen = new Map<string, { key: string; label: string }>();
    for (const report of reports) {
      const key = periodKey(report);
      if (!seen.has(key)) {
        seen.set(key, {
          key,
          label: formatMonthlyDonationPeriod(report.westernYear, report.month),
        });
      }
    }
    return Array.from(seen.values());
  }, [reports]);

  const [month, setMonth] = useState("all");
  const [donorType, setDonorType] = useState<DonorFilter>("all");

  const filtered = useMemo(
    () =>
      reports.filter((report) => {
        if (month !== "all" && periodKey(report) !== month) return false;
        if (donorType !== "all" && report.donorType !== donorType) return false;
        return true;
      }),
    [donorType, month, reports],
  );

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 border-b border-navy-100 pb-3">
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

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <ToggleGroup
            type="single"
            value={month}
            onValueChange={(value) => setMonth(value || "all")}
            spacing={0}
            variant="outline"
            className="flex-wrap"
          >
            <ToggleGroupItem value="all" className="text-sm">
              全部月份
            </ToggleGroupItem>
            {months.map((item) => (
              <ToggleGroupItem key={item.key} value={item.key} className="text-sm">
                {item.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <ToggleGroup
            type="single"
            value={donorType}
            onValueChange={(value) =>
              setDonorType((value || "all") as DonorFilter)
            }
            spacing={0}
            variant="outline"
          >
            <ToggleGroupItem value="all" className="text-sm">
              全部
            </ToggleGroupItem>
            <ToggleGroupItem value="individual" className="text-sm">
              個人
            </ToggleGroupItem>
            <ToggleGroupItem value="organization" className="text-sm">
              團體
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_16px_44px_-28px_rgb(15_38_71_/_0.45)] ring-1 ring-navy-100">
        <div className="hidden grid-cols-[8rem_1fr_8rem_7rem_6rem] gap-4 border-b border-navy-100 bg-navy-50/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted md:grid">
          <span>月份</span>
          <span>捐贈者</span>
          <span>地區</span>
          <span>照片</span>
          <span className="text-right">明細</span>
        </div>

        {filtered.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="font-serif text-xl font-bold text-navy-900">
              沒有符合條件的紀錄
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              可以切回全部月份或全部類型查看。
            </p>
          </div>
        ) : (
          <div className="divide-y divide-navy-100">
            {filtered.map((report) => (
              <DonationLedgerRow key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function DonationLedgerRow({ report }: { report: MonthlyDonationReport }) {
  const donorName = getMonthlyDonationDonorDisplayName({
    donorName: report.donorName,
    isAnonymous: report.isAnonymous,
  });
  const DonorIcon = report.donorType === "organization" ? Building2 : UserRound;
  const period = formatMonthlyDonationPeriod(report.westernYear, report.month);

  return (
    <article className="group bg-white transition-colors hover:bg-amber-50/45">
      <div className="grid gap-3 px-4 py-3 md:grid-cols-[8rem_1fr_8rem_7rem_6rem] md:items-center md:gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-navy-800">
          <CalendarDays className="size-4 text-amber-600" strokeWidth={1.8} />
          {period}
        </div>

        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
            <DonorIcon className="size-5" strokeWidth={1.7} />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-serif text-lg font-bold leading-snug text-navy-900">
              {donorName}
            </h3>
            <p className="text-xs font-semibold text-amber-700 md:hidden">
              {getMonthlyDonationRegionLabel(report.region)} ·{" "}
              {getMonthlyDonationDonorTypeLabel(report.donorType)}
            </p>
          </div>
        </div>

        <p className="hidden text-sm font-semibold text-amber-700 md:block">
          {getMonthlyDonationRegionLabel(report.region)} ·{" "}
          {getMonthlyDonationDonorTypeLabel(report.donorType)}
        </p>

        <p className="flex items-center gap-2 text-sm text-ink-muted">
          <ImageIcon className="size-4 text-navy-400" strokeWidth={1.8} />
          {report.images.length > 0
            ? `${report.images.length} 張照片`
            : "尚無照片"}
        </p>

        <Link
          href={`/transparency/monthly-donations/${report.id}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-navy-100 bg-white px-3 py-2 text-sm font-semibold text-navy-900 transition-colors hover:border-amber-300 hover:bg-white md:justify-self-end"
        >
          查看
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
