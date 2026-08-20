"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Handshake, Heart, type LucideIcon } from "lucide-react";
import { useLocale } from "@/i18n/provider";
import { translate } from "@/i18n/translations";
import { localizeHref } from "@/i18n/config";
import { cn } from "@/lib/utils";

const DonationModal = dynamic(() =>
  import("./DonationModal").then((m) => m.DonationModal),
);

/** 全站右側固定「愛心捐款」按鈕，點擊彈出捐款資訊 Modal */
export function DonateFab() {
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState("");
  const locale = useLocale();
  const pathname = usePathname();
  const normalizedPath = pathname.replace(/^\/(tw|en)(?=\/|$)/, "") || "/";

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [pathname]);

  const quickActions = [
    {
      label: translate(locale, "服務申請"),
      shortLabel: locale === "en" ? "Services" : translate(locale, "服務申請"),
      href: `${localizeHref("/", locale)}#services`,
      icon: ClipboardList,
      current: normalizedPath === "/" && hash === "#services",
      onNavigate: () => setHash("#services"),
    },
    {
      label: translate(locale, "企業合作"),
      shortLabel: locale === "en" ? "Partner" : translate(locale, "企業合作"),
      href: localizeHref("/sustainability/action", locale),
      icon: Handshake,
      current: normalizedPath === "/sustainability/action",
      onNavigate: undefined,
    },
  ];

  return (
    <>
      <div className="fixed right-0 top-1/2 z-[120] hidden -translate-y-1/2 flex-col items-stretch overflow-hidden rounded-l-2xl bg-navy-800 shadow-lg ring-1 ring-white/10 md:flex">
        <nav aria-label={translate(locale, "網站快捷選單")} className="flex flex-col">
          {quickActions.map((action) => (
            <DesktopQuickAction key={action.label} {...action} locale={locale} />
          ))}
        </nav>
        <DonationButton locale={locale} onClick={() => setOpen(true)} embedded />
      </div>

      <DonationButton
        locale={locale}
        onClick={() => setOpen(true)}
        className="fixed right-0 top-1/2 z-[120] -translate-y-1/2 md:hidden"
      />

      <nav
        aria-label={translate(locale, "網站快捷選單")}
        className="fixed bottom-3 left-3 right-20 z-[115] grid grid-cols-2 gap-2 rounded-2xl border border-navy-100/80 bg-cream/95 p-1.5 shadow-[0_12px_32px_-14px_rgb(15_38_71/0.45)] backdrop-blur-md md:hidden"
      >
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              aria-disabled={action.current ? "true" : undefined}
              aria-current={action.current ? "location" : undefined}
              tabIndex={action.current ? -1 : undefined}
              onClick={
                action.current
                  ? (event) => event.preventDefault()
                  : action.onNavigate
              }
              className={cn(
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2 text-center text-xs font-bold text-navy-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
                action.current
                  ? "pointer-events-none cursor-default opacity-40"
                  : "hover:bg-navy-50",
              )}
            >
              <Icon className="size-4 shrink-0 text-amber-500" strokeWidth={1.75} />
              {action.label}
            </Link>
          );
        })}
      </nav>

      <DonationModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function DesktopQuickAction({
  label,
  shortLabel,
  href,
  icon: Icon,
  locale,
  current,
  onNavigate,
}: {
  label: string;
  shortLabel: string;
  href: string;
  icon: LucideIcon;
  locale: "tw" | "en";
  current: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      aria-disabled={current ? "true" : undefined}
      aria-current={current ? "location" : undefined}
      tabIndex={current ? -1 : undefined}
      onClick={current ? (event) => event.preventDefault() : onNavigate}
      className={cn(
        "group flex flex-col items-center justify-center gap-2 border-b border-white/15 bg-navy-800 px-2 py-3 text-white transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400",
        locale === "en" ? "min-h-20 w-16" : "min-h-[6.5rem] w-14",
        current
          ? "pointer-events-none cursor-default opacity-40"
          : "hover:bg-navy-700",
      )}
    >
      <Icon className="size-5 shrink-0 text-amber-400 transition-transform group-hover:scale-110" strokeWidth={1.75} />
      <span
        className={cn(
          "font-bold leading-none tracking-[0.12em]",
          locale === "en"
            ? "text-center text-[11px] tracking-[0.04em]"
            : "text-sm [writing-mode:vertical-lr]",
        )}
      >
        {shortLabel}
      </span>
    </Link>
  );
}

function DonationButton({
  locale,
  onClick,
  className,
  embedded = false,
}: {
  locale: "tw" | "en";
  onClick: () => void;
  className?: string;
  embedded?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={translate(locale, "愛心捐款")}
      className={cn(
        "group flex cursor-pointer flex-col items-center gap-2.5 bg-navy-800 px-3 py-4 text-white transition-all hover:bg-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
        locale === "en" ? "w-16" : "w-14",
        embedded
          ? "rounded-none shadow-none ring-0 focus-visible:ring-inset"
          : "rounded-l-2xl shadow-lg ring-1 ring-white/10",
        className,
      )}
    >
      <span className="relative flex size-5 shrink-0 items-center justify-center">
        <span className="absolute inline-flex size-5 rounded-full bg-rose-500/50 animate-ping-ring" />
        <Heart className="relative size-5 fill-rose-500 text-rose-500 animate-heartbeat" />
      </span>
      <span
        className={
          locale === "en"
            ? "text-[11px] font-bold uppercase tracking-[0.06em]"
            : "text-sm font-semibold [writing-mode:vertical-lr]"
        }
      >
        {translate(locale, "愛心捐款")}
      </span>
    </button>
  );
}
