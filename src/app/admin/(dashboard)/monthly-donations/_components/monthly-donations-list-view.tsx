"use client";

import { useMemo, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { MonthlyDonationReportRecord } from "../actions";
import { MonthlyDonationsTable } from "./monthly-donations-table";

type DonorFilter = "all" | "individual" | "organization";

export function MonthlyDonationsListView({
  reports,
}: {
  reports: MonthlyDonationReportRecord[];
}) {
  // 年份清單（資料已由 server 依年月排序）
  const years = useMemo(() => {
    const seen = new Set<number>();
    for (const report of reports) seen.add(report.western_year);
    return Array.from(seen).sort((a, b) => b - a);
  }, [reports]);

  const [year, setYear] = useState<string>("all");
  const [month, setMonth] = useState<number | "all">("all");
  const [donor, setDonor] = useState<DonorFilter>("all");

  // 選定年份後，列出該年有資料的月份
  const months = useMemo(() => {
    if (year === "all") return [];
    const seen = new Set<number>();
    for (const report of reports) {
      if (report.western_year === Number(year)) seen.add(report.month);
    }
    return Array.from(seen).sort((a, b) => b - a);
  }, [reports, year]);

  function handleYearChange(value: string) {
    setYear(value || "all");
    setMonth("all"); // 換年份時重置月份
  }

  const filtered = useMemo(
    () =>
      reports.filter((report) => {
        if (year !== "all" && report.western_year !== Number(year)) return false;
        if (month !== "all" && report.month !== month) return false;
        if (donor !== "all" && report.donor_type !== donor) return false;
        return true;
      }),
    [reports, year, month, donor],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          {/* 年份 */}
          {years.length > 0 && (
            <ToggleGroup
              type="single"
              value={year}
              onValueChange={handleYearChange}
              spacing={0}
              variant="outline"
              className="flex-wrap"
            >
              <ToggleGroupItem value="all" className="text-sm">
                全部年份
              </ToggleGroupItem>
              {years.map((y) => (
                <ToggleGroupItem key={y} value={String(y)} className="text-sm">
                  {y}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}

          {/* 月份（選定年份後才出現） */}
          {months.length > 0 && (
            <ToggleGroup
              type="single"
              value={month === "all" ? "all" : String(month)}
              onValueChange={(v) => setMonth(v === "all" || !v ? "all" : Number(v))}
              spacing={0}
              variant="outline"
              className="flex-wrap"
            >
              <ToggleGroupItem value="all" className="text-sm">
                全年
              </ToggleGroupItem>
              {months.map((m) => (
                <ToggleGroupItem key={m} value={String(m)} className="text-sm">
                  {String(m).padStart(2, "0")} 月
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}
        </div>

        {/* 分類 */}
        <ToggleGroup
          type="single"
          value={donor}
          onValueChange={(v) => setDonor((v || "all") as DonorFilter)}
          spacing={0}
          variant="outline"
          className="shrink-0"
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

      <MonthlyDonationsTable reports={filtered} />
    </div>
  );
}
