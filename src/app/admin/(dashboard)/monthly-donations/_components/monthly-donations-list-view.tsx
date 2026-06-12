"use client";

import { useMemo, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { formatMonthlyDonationPeriod } from "@/lib/monthly-donations";
import type { MonthlyDonationReportRecord } from "../actions";
import { MonthlyDonationsTable } from "./monthly-donations-table";

type DonorFilter = "all" | "individual" | "organization";

function periodKey(report: MonthlyDonationReportRecord) {
  return `${report.western_year}-${String(report.month).padStart(2, "0")}`;
}

export function MonthlyDonationsListView({
  reports,
}: {
  reports: MonthlyDonationReportRecord[];
}) {
  // 依資料排序（已由 server 排好）抽出不重複月份
  const months = useMemo(() => {
    const seen = new Map<string, { key: string; label: string }>();
    for (const report of reports) {
      const key = periodKey(report);
      if (!seen.has(key)) {
        seen.set(key, {
          key,
          label: formatMonthlyDonationPeriod(report.western_year, report.month),
        });
      }
    }
    return Array.from(seen.values());
  }, [reports]);

  const [month, setMonth] = useState<string>("all");
  const [donor, setDonor] = useState<DonorFilter>("all");

  const filtered = useMemo(
    () =>
      reports.filter((report) => {
        if (month !== "all" && periodKey(report) !== month) return false;
        if (donor !== "all" && report.donor_type !== donor) return false;
        return true;
      }),
    [reports, month, donor],
  );

  return (
    <div className="space-y-4">
      {months.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <ToggleGroup
            type="single"
            value={month}
            onValueChange={(v) => setMonth(v || "all")}
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
            value={donor}
            onValueChange={(v) => setDonor((v || "all") as DonorFilter)}
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
      )}

      <MonthlyDonationsTable reports={filtered} />
    </div>
  );
}
