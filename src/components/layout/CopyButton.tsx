"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * 複製按鈕 — 複製指定文字到剪貼簿，顯示短暫成功回饋。
 * tone: "light"（預設，深底用淺色 icon）| "dark"（淺底用深色 icon）
 */
export function CopyButton({
  value,
  label,
  tone = "light",
}: {
  value: string;
  label: string;
  tone?: "light" | "dark";
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // 忽略（少數瀏覽器不支援；非關鍵功能）
    }
  }

  const styles =
    tone === "dark"
      ? "text-navy-400 hover:bg-navy-50 hover:text-amber-600"
      : "text-navy-100/50 hover:bg-white/10 hover:text-amber-300";

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`複製${label}`}
      className={`inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${styles}`}
    >
      {copied ? (
        <Check className={tone === "dark" ? "size-4 text-amber-600" : "size-4 text-amber-300"} />
      ) : (
        <Copy className="size-3.5" />
      )}
    </button>
  );
}
