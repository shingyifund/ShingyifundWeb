import Link from "next/link";
import { Heart } from "lucide-react";
import { getRecentMonthlyDonors } from "@/lib/data/queries";
import {
  formatMonthlyDonationPeriod,
  getMonthlyDonationDonorDisplayName,
  getMonthlyDonationRegionLabel,
} from "@/lib/monthly-donations";
import type { MonthlyDonationReport } from "@/lib/types";
import { getRequestLocale } from "@/i18n/request";
import { localizeHref } from "@/i18n/config";

export async function DonationMarquee() {
  const locale = await getRequestLocale();
  const donors = await getRecentMonthlyDonors(24);
  if (donors.length === 0) return null;

  // 資料少時加長軌道，避免內容寬度接近視窗時看起來像沒有移動。
  const repeatCount = donors.length < 8 ? 4 : 2;
  const loop = Array.from({ length: repeatCount }, () => donors).flat();

  return (
    <section className="bg-cream pt-2">
      <div className="container-x">
        <div className="mb-3 flex items-center gap-2 px-1">
          <Heart className="size-4 fill-current text-rose-500" strokeWidth={2} />
          <h2 className="text-sm font-semibold tracking-wide text-navy-800">
            {locale === "en" ? "Recent Donations" : "近期捐贈芳名"}
          </h2>
          <Link
            href={localizeHref("/transparency/monthly-donations", locale)}
            className="ml-auto text-xs font-medium text-amber-700 transition-colors hover:text-amber-800"
          >
            {locale === "en" ? "View all" : "查看全部"}
          </Link>
        </div>

        <div className="group relative overflow-hidden">
          {/* 兩側淡出遮罩，用實色 cream，不用 backdrop-blur */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-cream to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-cream to-transparent" />

          <ul
            className="donation-marquee-track flex w-max gap-3 will-change-transform"
            style={{
              animationName: "marquee",
              animationDuration: "60s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
            }}
          >
            {loop.map((donor, i) => (
              <DonorChip key={`${donor.id}-${i}`} donor={donor} locale={locale} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function DonorChip({ donor, locale }: { donor: MonthlyDonationReport; locale: "tw" | "en" }) {
  const name = getMonthlyDonationDonorDisplayName({
    donorName: donor.donorName,
    isAnonymous: donor.isAnonymous,
    locale,
  });
  const title = donor.title || (locale === "en" ? `Thank you, ${name}, for your donation` : `感謝 ${name} 捐贈物資`);

  return (
    <li className="shrink-0">
      <Link
        href={localizeHref(`/transparency/monthly-donations/${donor.id}`, locale)}
        className="flex items-center gap-1.5 rounded-full border border-navy-100 bg-white py-1.5 pr-3 pl-1.5 shadow-card transition-colors hover:border-amber-300 hover:bg-amber-50"
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-rose-500">
          <Heart className="size-3.5 fill-current" strokeWidth={2} />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="whitespace-nowrap text-[13px] font-semibold text-navy-900">
            {title}
          </span>
          <span className="mt-0.5 whitespace-nowrap text-[11px] text-ink-soft">
            {formatMonthlyDonationPeriod(donor.westernYear, donor.month, locale)} ·{" "}
            {getMonthlyDonationRegionLabel(donor.region, locale)}
          </span>
        </span>
      </Link>
    </li>
  );
}
