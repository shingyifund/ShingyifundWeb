"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateStat } from "../actions";
import type { ImpactStatRecord } from "../actions";

export function StatForm({ stat }: { stat: ImpactStatRecord }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateStat(stat.id, formData);
      if (result.ok) {
        router.push("/admin/stats");
        router.refresh();
      } else {
        alert(result.message ?? "儲存失敗");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label className="text-muted-foreground text-xs">指標</Label>
        <p className="text-sm font-medium">{stat.bottom_label}</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="value">數值</Label>
        <Input
          id="value"
          name="value"
          type="number"
          min={0}
          defaultValue={stat.value}
          required
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "儲存中..." : "儲存"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          取消
        </Button>
      </div>
    </form>
  );
}
