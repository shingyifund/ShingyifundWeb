import { DonationMarqueeTrack } from "./DonationMarqueeTrack";
import Link from "next/link";
import { Heart } from "lucide-react";
import { getRecentMonthlyDonors } from "@/lib/data/queries";
import { getRequestLocale } from "@/i18n/request";
import { localizeHref } from "@/i18n/config";

export async function DonationMarquee() {
  const locale = await getRequestLocale();
  const donors = await getRecentMonthlyDonors();
  if (donors.length === 0) return null;

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

          <DonationMarqueeTrack donors={donors.map((donor) => ({
            id: donor.id,
            title: donor.title,
            westernYear: donor.westernYear,
            month: donor.month,
            region: donor.region,
            donorName: donor.isAnonymous ? null : donor.donorName,
            isAnonymous: donor.isAnonymous,
          }))} locale={locale} />
        </div>
      </div>
    </section>
  );
}
