"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { updateAllStats } from "../actions";
import type { ImpactStatRecord } from "../actions";

export function StatsEditor({ stats }: { stats: ImpactStatRecord[] }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(stats.map((s) => [s.id, String(s.value)])),
  );
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    const updates: { id: string; value: number }[] = [];
    for (const stat of stats) {
      const value = Number.parseInt(values[stat.id] ?? "", 10);
      if (!Number.isInteger(value) || value < 0) {
        alert("請確認所有指標數值皆為有效數字");
        return;
      }
      updates.push({ id: stat.id, value });
    }

    startTransition(async () => {
      const result = await updateAllStats(updates);
      if (result.ok) {
        router.refresh();
      } else {
        alert(result.message ?? "儲存失敗");
      }
    });
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="mt-1 text-3xl font-semibold text-foreground sm:text-4xl">
            服務成效
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            修改數值後點擊「儲存」，首頁立即更新。
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="w-full sm:mt-1 sm:w-auto sm:shrink-0"
        >
          {isPending ? "儲存中..." : "儲存"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="flex items-center justify-between gap-4 bg-white px-4 py-4 text-left sm:flex-col sm:items-center sm:justify-start sm:px-4 sm:py-8 sm:text-center"
          >
            <div className="min-w-0 sm:hidden">
              <span className="block text-xs text-muted-foreground">
                {stat.top_label}
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                {stat.bottom_label}
              </span>
            </div>
            <span className="hidden text-xs text-muted-foreground sm:block">
              {stat.top_label}
            </span>
            <div className="flex shrink-0 items-baseline gap-1 sm:shrink">
              <Input
                type="number"
                min={0}
                value={values[stat.id]}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [stat.id]: e.target.value }))
                }
                className="w-24 text-center text-xl font-bold tabular-nums"
              />
              <span className="text-sm font-medium text-muted-foreground">
                {stat.suffix}
              </span>
            </div>
            <span className="hidden text-xs text-muted-foreground sm:block">
              {stat.bottom_label}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
