"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Heart } from "lucide-react";
import { useLocale } from "@/i18n/provider";
import { translate } from "@/i18n/translations";

const DonationModal = dynamic(() =>
  import("./DonationModal").then((m) => m.DonationModal),
);

/** 全站右側固定「愛心捐款」按鈕，點擊彈出捐款資訊 Modal */
export function DonateFab() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={translate(locale, "愛心捐款")}
        className="group fixed right-0 top-1/2 z-[120] flex -translate-y-1/2 cursor-pointer flex-col items-center gap-2.5 rounded-l-2xl bg-navy-800 px-3 py-4 text-white shadow-lg ring-1 ring-white/10 transition-all hover:bg-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      >
        {/* 愛心 + 衝擊波 */}
        <span className="relative flex size-5 shrink-0 items-center justify-center">
          <span className="absolute inline-flex size-5 rounded-full bg-rose-500/50 animate-ping-ring" />
          <Heart className="relative size-5 fill-rose-500 text-rose-500 animate-heartbeat" />
        </span>
        <span
          className={
            locale === "en"
              ? "text-xs font-bold uppercase tracking-[0.08em] [writing-mode:vertical-rl] [text-orientation:upright]"
              : "text-sm font-semibold [writing-mode:vertical-lr]"
          }
        >
          {translate(locale, "愛心捐款")}
        </span>
      </button>

      <DonationModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
