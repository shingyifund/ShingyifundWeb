"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Heart, Menu, X } from "lucide-react";
import { getMainNav, ONLINE_DONATION_URL, type NavItem } from "@/config/nav";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/i18n/provider";
import { localizeHref, switchLocaleHref, type Locale } from "@/i18n/config";
import { translate } from "@/i18n/translations";

/** 當前路徑是否落在該選單項目底下 */
function useIsActive() {
  const pathname = usePathname();
  const normalize = (value: string) => value.replace(/^\/(tw|en)(?=\/|$)/, "") || "/";
  const currentPath = normalize(pathname);
  return (href: string) => {
    const targetPath = normalize(href);
    return targetPath === "/"
      ? currentPath === "/"
      : currentPath === targetPath || currentPath.startsWith(targetPath + "/");
  };
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isActive = useIsActive();
  const pathname = usePathname();
  const locale = useLocale();
  const mainNav = getMainNav(locale);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 開選單時鎖背景捲動
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-navy-100 bg-cream/95 shadow-[0_4px_20px_-12px_rgb(15_38_71_/_0.25)]"
          : "border-b border-transparent bg-cream/80",
      )}
    >
      <div className="container-x flex h-18 items-center justify-between gap-4">
        {/* Logo */}
        <Link href={localizeHref("/", locale)} className="flex shrink-0 items-center" aria-label={translate(locale, "興毅基金會首頁")}>
          <Image
            src="/brand/logo.svg"
            alt={translate(locale, "興毅基金會")}
            width={245}
            height={43}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        {/* 桌機主選單 */}
        <nav className="hidden shrink-0 items-center gap-0.5 xl:flex">
          {mainNav.map((item) => (
            <DesktopNavItem key={item.href} item={item} active={isActive(item.href)} />
          ))}
        </nav>

        {/* 右側漢堡（捐款改由右側固定鈕 DonateFab） */}
        <div className="flex items-center gap-2">
          <div className="hidden items-center rounded-full border border-navy-100 bg-white/70 p-1 sm:flex" aria-label="Language">
            {(["tw", "en"] as const).map((item) => (
              <a
                key={item}
                href={switchLocaleHref(pathname, item)}
                hrefLang={item === "en" ? "en" : "zh-Hant-TW"}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-bold tracking-wide transition-colors",
                  locale === item ? "bg-navy-700 text-white" : "text-navy-600 hover:bg-navy-50",
                )}
                aria-current={locale === item ? "true" : undefined}
              >
                {item === "tw" ? "繁中" : "English"}
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-navy-700 transition-colors hover:bg-navy-50 xl:hidden"
            aria-label={translate(locale, "開啟選單")}
          >
            <Menu className="size-6" />
          </button>
        </div>
      </div>
    </header>

    {/* 行動版抽屜（放在 header 外，避免 backdrop-blur 造成 fixed 定位錯誤） */}
    <MobileDrawer open={open} onClose={() => setOpen(false)} locale={locale} mainNav={mainNav} pathname={pathname} />
    </>
  );
}

/**
 * 桌機單一選單項目。
 * 一律點擊開合（各裝置行為一致），並支援點外面 / Esc 關閉。
 */
function DesktopNavItem({ item, active }: { item: NavItem; active: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!item.children) {
    return (
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-[15px] font-medium transition-colors",
          active ? "bg-amber-50 text-navy-800" : "text-ink-soft hover:text-navy-700",
        )}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-[15px] font-medium transition-colors",
          active || open
            ? "bg-amber-50 text-navy-800"
            : "text-ink-soft hover:text-navy-700",
        )}
      >
        {item.label}
        <ChevronDown
          className={cn(
            "size-3.5 opacity-60 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-2 transition-all duration-200",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible translate-y-1 opacity-0",
        )}
      >
        <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white p-2 shadow-[0_18px_44px_-18px_rgb(15_38_71/0.35)]">
          {item.children.map((child) => {
            const childClass =
              "block rounded-xl px-4 py-2.5 text-sm text-ink-soft transition-colors hover:bg-amber-50 hover:text-navy-700";
            return child.external ? (
              <a
                key={child.href}
                href={child.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className={childClass}
              >
                {child.label}
              </a>
            ) : (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => setOpen(false)}
                className={childClass}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MobileDrawer({
  open,
  onClose,
  locale,
  mainNav,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  mainNav: NavItem[];
  pathname: string;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 xl:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      {/* 遮罩 */}
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-navy-950/40 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      {/* 面板 */}
      <div
        className={cn(
          "absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-cream shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-18 items-center justify-between border-b border-navy-100 px-5">
          <Image src="/brand/logo.svg" alt={translate(locale, "興毅基金會")} width={200} height={35} className="h-8 w-auto" />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-navy-700 hover:bg-navy-50"
            aria-label={translate(locale, "關閉選單")}
          >
            <X className="size-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4">
          {mainNav.map((item) => {
            const isOpen = expanded === item.href;
            return (
              <div key={item.href} className="border-b border-navy-100/60 last:border-0">
                {item.children ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : item.href)}
                      className="flex w-full cursor-pointer items-center justify-between py-3.5 text-left text-[15px] font-medium text-navy-800"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn("size-4 text-ink-muted transition-transform", isOpen && "rotate-180")}
                      />
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-300",
                        isOpen ? "grid-rows-[1fr] pb-2" : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="overflow-hidden">
                        {item.children.map((child) => {
                          const childClass =
                            "block rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-amber-50 hover:text-navy-700";
                          return child.external ? (
                            <a
                              key={child.href}
                              href={child.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={onClose}
                              className={childClass}
                            >
                              {child.label}
                            </a>
                          ) : (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={onClose}
                              className={childClass}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block py-3.5 text-[15px] font-medium text-navy-800"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        <div className="border-t border-navy-100 p-4">
          <div className="mb-3 grid grid-cols-2 rounded-full border border-navy-100 bg-white p-1">
            {(["tw", "en"] as const).map((item) => (
              <a
                key={item}
                href={switchLocaleHref(pathname, item)}
                hrefLang={item === "en" ? "en" : "zh-Hant-TW"}
                onClick={onClose}
                className={cn(
                  "rounded-full px-3 py-2 text-center text-xs font-bold tracking-wide",
                  locale === item ? "bg-navy-700 text-white" : "text-navy-600",
                )}
              >
                {item === "tw" ? "繁中" : "English"}
              </a>
            ))}
          </div>
          <Button
            href={ONLINE_DONATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
            onClick={onClose}
          >
            <Heart className="size-4 fill-current text-rose-500" />
            {translate(locale, "線上捐款")}
          </Button>
        </div>
      </div>
    </div>
  );
}
