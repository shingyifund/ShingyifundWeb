"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/provider";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={locale === "en" ? "Back to top" : "回到頂部"}
      className={cn(
        "fixed bottom-6 right-6 z-110 inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-amber-500 text-navy-900 shadow-lg ring-1 ring-amber-400/50 transition-all duration-300 hover:bg-amber-400 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700",
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none",
      )}
    >
      <ChevronUp className="size-5" />
    </button>
  );
}
