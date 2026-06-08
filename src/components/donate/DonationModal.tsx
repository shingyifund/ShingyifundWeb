"use client";

import { useEffect } from "react";
import { CreditCard, Heart, Landmark, Receipt, X, type LucideIcon } from "lucide-react";
import { siteConfig } from "@/config/site";
import { CopyButton } from "@/components/layout/CopyButton";
import { Button } from "@/components/ui/Button";

type Method = {
  icon: LucideIcon;
  label: string;
  primary: string;
  account: string;
};

export function DonationModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { donation } = siteConfig;

  const methods: Method[] = [
    { icon: Landmark, label: "銀行匯款", primary: donation.bank, account: donation.bankAccount },
    { icon: CreditCard, label: "郵政劃撥", primary: "劃撥帳號", account: donation.postal },
    { icon: Receipt, label: "發票愛心碼", primary: "捐贈發票", account: donation.loveCode },
  ];

  // Esc 關閉 + 鎖背景捲動
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label="愛心捐款資訊"
    >
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-navy-900/55 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 橘色框（參考首頁 DonationCTA 風格） */}
      <div className="relative my-auto w-full max-w-lg overflow-hidden rounded-3xl bg-linear-to-br from-amber-400 via-amber-500 to-amber-600 p-6 shadow-glow sm:p-8 [@media(max-height:680px)]:zoom-[0.85] [@media(max-height:560px)]:zoom-[0.72] [@media(max-height:460px)]:zoom-[0.6]">
        {/* 裝飾 */}
        <div className="pointer-events-none absolute -right-12 -top-12 size-44 rounded-full bg-white/20 blur-2xl" style={{ transform: "translateZ(0)" }} />
        <Heart className="pointer-events-none absolute right-6 top-5 size-20 rotate-12 fill-rose-500/15 text-rose-500/15" />

        {/* 關閉 */}
        <button
          type="button"
          onClick={onClose}
          aria-label="關閉"
          className="absolute right-4 top-4 z-10 inline-flex size-9 cursor-pointer items-center justify-center rounded-full bg-navy-900/10 text-navy-900 transition-colors hover:bg-navy-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700"
        >
          <X className="size-5" />
        </button>

        <div className="relative text-navy-900">
          <span className="inline-flex items-center gap-2 rounded-full bg-navy-900/10 px-4 py-1.5 text-sm font-semibold">
            <Heart className="size-4 fill-current text-rose-500" />
            愛心捐款
          </span>
          <h2 className="mt-4 font-serif text-2xl font-black leading-tight sm:text-3xl">
            每一份捐款，<br className="sm:hidden" />都是弱勢家庭的一道光
          </h2>
          <p className="mt-3 text-balance text-sm leading-relaxed text-navy-900/70">
            無論金額多寡，您的心意都將化為實際的物資與服務，送到最需要的人手中。
          </p>

          {/* 捐款方式 */}
          <div className="mt-6 space-y-3">
            {methods.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl bg-white p-4 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-navy-700 text-white">
                    <m.icon className="size-5" strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-ink-muted">
                      {m.label}
                    </p>
                    <p className="truncate text-sm font-semibold text-navy-900">
                      {m.primary}
                    </p>
                    {/* 帳號獨佔一行，避免窄框把名稱擠成直排 */}
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="font-mono text-[15px] font-bold tabular-nums tracking-tight text-amber-600">
                        {m.account}
                      </span>
                      <CopyButton value={m.account} label={m.label} tone="dark" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center">
            <Button href="/donate" variant="secondary" size="md" onClick={onClose}>
              <Heart className="size-4 fill-current text-rose-500" />
              前往捐款頁
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
