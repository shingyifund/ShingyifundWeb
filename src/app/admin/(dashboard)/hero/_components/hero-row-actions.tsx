"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Edit3, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
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
  const router = useRouter();
  const [localActive, setLocalActive] = useState(isActive);
  const [isPending, startTransition] = useTransition();

  function toggle(nextValue: boolean) {
    setLocalActive(nextValue);
    startTransition(async () => {
      const result = await toggleSlideActive(id, nextValue);
      if (!result.ok) {
        setLocalActive(isActive);
        return;
      }
      router.refresh();
    });
  }

  function move(direction: "up" | "down") {
    startTransition(async () => {
      const result = await moveSlide(id, direction);
      if (!result.ok) {
        console.error(result.message ?? "Move slide failed");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      {/* 第一行：顯示 switch + spinner */}
      <div className="flex items-center gap-1.5 select-none">
        {isPending && <Loader2 className="size-3.5 animate-spin text-muted-foreground" />}
        <Switch id={`switch-${id}`} checked={localActive} onCheckedChange={toggle} />
        <Label htmlFor={`switch-${id}`} className="cursor-pointer text-xs text-muted-foreground">
          {localActive ? "顯示" : "停用"}
        </Label>
      </div>
      {/* 第二行：排序 / 編輯 / 刪除 */}
      <div className="flex items-center gap-0.5">
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
    </div>
  );
}
