"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toggleMonthlyDonationPublished } from "../actions";

export function MonthlyDonationPublishSwitch({
  id,
  title,
  isPublished,
}: {
  id: string;
  title: string;
  isPublished: boolean;
}) {
  const router = useRouter();
  const [localPublished, setLocalPublished] = useState(isPublished);
  const [isPending, startTransition] = useTransition();

  function toggle(nextValue: boolean) {
    setLocalPublished(nextValue);
    startTransition(async () => {
      const result = await toggleMonthlyDonationPublished(id, nextValue);
      if (!result.ok) {
        setLocalPublished(isPublished);
        console.error(result.message ?? "Toggle monthly donation publish failed");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      {isPending && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
      <div className="flex items-center gap-1.5 select-none">
        <Switch
          id={`publish-${id}`}
          checked={localPublished}
          disabled={isPending}
          onCheckedChange={toggle}
          aria-label={`${localPublished ? "取消公開" : "公開"} ${title}`}
        />
        <Label
          htmlFor={`publish-${id}`}
          className="cursor-pointer text-xs text-muted-foreground"
        >
          {localPublished ? "公開" : "草稿"}
        </Label>
      </div>
    </div>
  );
}
