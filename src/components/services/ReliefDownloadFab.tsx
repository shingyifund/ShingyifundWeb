"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/provider";
import { translate } from "@/i18n/translations";

const TARGET_ID = "relief-downloads";

/**
 * 申請文件下載捷徑。
 * 文件下載區在頁面最下方，捲動一段後於右上浮現，讓使用者不必滑到底。
 * 位置避開右側垂直置中的捐款 FAB（top-1/2）與右下的 BackToTop。
 */
export function ReliefDownloadFab() {
  const [visible, setVisible] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 400;
      // 已看到下載區就不再提示
      const target = document.getElementById(TARGET_ID);
      const reached = target
        ? target.getBoundingClientRect().top < window.innerHeight * 0.8
        : false;
      setVisible(scrolled && !reached);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed right-4 top-24 z-110 transition-all duration-300 sm:right-6",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-3 opacity-0",
      )}
    >
      {/* 光暈 */}
      <div
        className="pointer-events-none absolute -inset-3 rounded-full bg-amber-400/50 blur-2xl"
        style={{ transform: "translateZ(0)" }}
        aria-hidden
      />

      <button
        type="button"
        onClick={() =>
          document
            .getElementById(TARGET_ID)
            ?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        className="relative inline-flex cursor-pointer items-center gap-2 rounded-full bg-amber-500 px-4 py-2.5 text-sm font-semibold text-navy-900 shadow-[0_10px_28px_-8px_rgb(245_166_35/0.9)] ring-1 ring-amber-300/60 transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700"
      >
        <Download className="size-4" strokeWidth={2} />
        {translate(locale, "申請文件")}
      </button>
    </div>
  );
}
