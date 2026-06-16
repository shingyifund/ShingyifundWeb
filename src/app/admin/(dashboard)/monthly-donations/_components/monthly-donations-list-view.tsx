"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { MonthPicker } from "@/components/ui/month-picker";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { MonthlyDonationDonorType } from "@/lib/types";
import type { MonthlyDonationListRecord } from "../actions";
import { MonthlyDonationsTable } from "./monthly-donations-table";

type Props = {
  reports: MonthlyDonationListRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  currentYear?: number;
  currentMonth?: number;
  currentDonorType?: MonthlyDonationDonorType;
  currentDonorName: string;
};

export function MonthlyDonationsListView({
  reports,
  total,
  page,
  pageSize,
  totalPages,
  currentYear,
  currentMonth,
  currentDonorType,
  currentDonorName,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [localPeriod, setLocalPeriod] = useState(
    currentYear && currentMonth
      ? `${currentYear}-${String(currentMonth).padStart(2, "0")}`
      : "",
  );
  const [localDonorType, setLocalDonorType] = useState<string>(
    currentDonorType ?? "all",
  );
  const [localDonorName, setLocalDonorName] = useState(currentDonorName);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();

    const match = /^(\d{4})-(\d{2})$/.exec(localPeriod);
    if (match) {
      params.set("year", match[1]);
      params.set("month", String(Number(match[2])));
    }
    if (localDonorType && localDonorType !== "all") {
      params.set("donorType", localDonorType);
    }
    const name = localDonorName.trim();
    if (name) params.set("donorName", name);

    router.push(`?${params.toString()}`);
  }

  function handleReset() {
    setLocalPeriod("");
    setLocalDonorType("all");
    setLocalDonorName("");
    router.push("?");
  }

  const pushPage = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(newPage));
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const hasActiveFilters =
    currentYear ?? currentMonth ?? currentDonorType ?? currentDonorName;

  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white p-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-center gap-2"
      >
        {/* 年月 */}
        <div className="flex items-center gap-1">
          <MonthPicker
            value={localPeriod}
            onChange={setLocalPeriod}
            placeholder="選擇年月"
            className="w-40"
          />
          {localPeriod && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setLocalPeriod("")}
              aria-label="清除年月"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>

        {/* 捐贈者名稱 */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={localDonorName}
            onChange={(e) => setLocalDonorName(e.target.value)}
            placeholder="搜尋捐贈者"
            className="w-40 pl-8"
          />
        </div>

        {/* 個人 / 團體 */}
        <ToggleGroup
          type="single"
          value={localDonorType}
          onValueChange={(v) => setLocalDonorType(v || "all")}
          spacing={0}
          variant="outline"
        >
          <ToggleGroupItem value="all" className="text-sm">全部</ToggleGroupItem>
          <ToggleGroupItem value="individual" className="text-sm">個人</ToggleGroupItem>
          <ToggleGroupItem value="organization" className="text-sm">團體</ToggleGroupItem>
        </ToggleGroup>

        <Button type="submit" size="sm">
          <Search className="size-4" />
          搜尋
        </Button>

        {hasActiveFilters && (
          <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
            清除篩選
          </Button>
        )}
      </form>
      </div>

      <MonthlyDonationsTable reports={reports} />

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-sm text-muted-foreground">
            第 {rangeStart}–{rangeEnd} 筆，共 {total} 筆
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => pushPage(page - 1)}
            >
              上一頁
            </Button>
            <span className="min-w-16 text-center text-sm text-muted-foreground">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => pushPage(page + 1)}
            >
              下一頁
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
