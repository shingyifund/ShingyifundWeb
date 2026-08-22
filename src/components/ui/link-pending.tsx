"use client";

import type * as React from "react";
import { useLinkStatus } from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/provider";

/**
 * 顯示所屬 <Link> 的導航 pending 狀態（Next 16 useLinkStatus）。
 * 必須渲染在 <Link> 子樹內。點擊連結到新頁 ready 之間顯示 spinner。
 */
export function LinkPending({ className }: { className?: string }) {
  const { pending } = useLinkStatus();
  const locale = useLocale();
  if (!pending) return null;
  return (
    <Loader2
      className={cn("size-4 animate-spin motion-reduce:animate-none", className)}
      aria-label={locale === "en" ? "Loading" : "載入中"}
    />
  );
}

/**
 * pending 時以 spinner 取代 children（適合只有單一 icon 的按鈕，
 * 如 icon-sm 編輯鈕）。必須渲染在 <Link> 子樹內。
 */
export function LinkPendingIcon({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useLinkStatus();
  const locale = useLocale();
  return pending ? (
    <Loader2
      className={cn("size-4 animate-spin motion-reduce:animate-none", className)}
      aria-label={locale === "en" ? "Loading" : "載入中"}
    />
  ) : (
    <>{children}</>
  );
}
