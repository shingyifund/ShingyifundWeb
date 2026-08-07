"use client";

import * as React from "react";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLocale } from "@/i18n/provider";

const MONTH_LABELS = [
  "1 月",
  "2 月",
  "3 月",
  "4 月",
  "5 月",
  "6 月",
  "7 月",
  "8 月",
  "9 月",
  "10 月",
  "11 月",
  "12 月",
];

/** 解析 YYYY-MM → { year, month(1-12) }，無效回 null */
function parsePeriod(value: string): { year: number; month: number } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;
  return { year, month };
}

export function MonthPicker({
  id,
  value,
  onChange,
  fromYear = 1912,
  toYear = 2100,
  placeholder = "選擇年月",
  disabled,
  className,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  fromYear?: number;
  toYear?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  const locale = useLocale();
  const [open, setOpen] = React.useState(false);
  const selected = parsePeriod(value);

  // 面板目前顯示的年份（受控）
  const [viewYear, setViewYear] = React.useState(
    selected?.year ?? new Date().getFullYear(),
  );

  // 開啟時對齊已選年份
  React.useEffect(() => {
    if (open && selected) setViewYear(selected.year);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const label = selected
    ? locale === "en" ? `${selected.year}-${String(selected.month).padStart(2, "0")}` : `${selected.year} 年 ${String(selected.month).padStart(2, "0")} 月`
    : placeholder;

  function pick(month: number) {
    onChange(`${viewYear}-${String(month).padStart(2, "0")}`);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-8 w-full justify-start gap-2 px-2.5 font-normal",
            !selected && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon
            className="size-4 text-muted-foreground"
            strokeWidth={1.8}
          />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        {/* 年份切換列 */}
        <div className="mb-2 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={viewYear <= fromYear}
            onClick={() => setViewYear((y) => y - 1)}
            aria-label={locale === "en" ? "Previous year" : "上一年"}
          >
            <ChevronLeft />
          </Button>
          <span className="text-sm font-semibold tabular-nums">
            {viewYear}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={viewYear >= toYear}
            onClick={() => setViewYear((y) => y + 1)}
            aria-label={locale === "en" ? "Next year" : "下一年"}
          >
            <ChevronRight />
          </Button>
        </div>

        {/* 12 個月份格 */}
        <div className="grid grid-cols-4 gap-1.5">
          {MONTH_LABELS.map((monthLabel, index) => {
            const month = index + 1;
            const isSelected =
              selected?.year === viewYear && selected?.month === month;
            return (
              <Button
                key={month}
                type="button"
                variant={isSelected ? "default" : "ghost"}
                size="sm"
                className="h-9 rounded-md px-0 text-sm font-normal"
                onClick={() => pick(month)}
              >
                {locale === "en" ? new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2024, month - 1, 1))) : monthLabel}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
