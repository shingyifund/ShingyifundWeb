"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/ui/form-alert";
import { updateStat } from "../actions";
import type { ImpactStatRecord } from "../actions";

export function StatForm({ stat }: { stat: ImpactStatRecord }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateStat(stat.id, formData);
      if (result.ok) {
        router.push("/admin/stats");
      } else {
        setMessage(result.message ?? "儲存失敗");
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

      <FormAlert message={message} />

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
