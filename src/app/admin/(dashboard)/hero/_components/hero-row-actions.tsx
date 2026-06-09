"use client";

import Link from "next/link";
import { useTransition } from "react";
import { ArrowDown, ArrowUp, Edit3, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/switch";
import { moveSlide, toggleSlideActive } from "../actions";
import { DeleteSlideDialog } from "./delete-slide-dialog";

export function HeroRowActions({
  id,
  imageUrl,
  title,
  isActive,
  isFirst,
  isLast,
}: {
  id: string;
  imageUrl: string | null;
  title: string;
  isActive: boolean;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function toggle(nextValue: boolean) {
    startTransition(async () => {
      await toggleSlideActive(id, nextValue);
    });
  }

  function move(direction: "up" | "down") {
    startTransition(async () => {
      await moveSlide(id, direction);
    });
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {isPending && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
      <Switch checked={isActive} onCheckedChange={toggle} aria-label="切換顯示狀態" />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={isPending || isFirst}
        onClick={() => move("up")}
        aria-label="往上排序"
      >
        <ArrowUp />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={isPending || isLast}
        onClick={() => move("down")}
        aria-label="往下排序"
      >
        <ArrowDown />
      </Button>
      <Button asChild variant="ghost" size="icon-sm" aria-label={`編輯 ${title}`}>
        <Link href={`/admin/hero/${id}`}>
          <Edit3 />
        </Link>
      </Button>
      <DeleteSlideDialog id={id} imageUrl={imageUrl} title={title} />
    </div>
  );
}
