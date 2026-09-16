"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

import {
  formatMonthlyDonationPeriod,
  getMonthlyDonationDonorDisplayName,
  getMonthlyDonationRegionLabel,
} from "@/lib/monthly-donations";
import type { MonthlyDonationReport } from "@/lib/types";

import { localizeHref } from "@/i18n/config";


const STORAGE_KEY = "donation-marquee-v1";
type MarqueeDonor = Pick<MonthlyDonationReport,
  "id" | "title" | "westernYear" | "month" | "region" | "donorName" | "isAnonymous"
>;
type Progress = { ids: string[]; cursor: number; elapsed: number };

export function DonationMarqueeTrack({ donors, locale }: { donors: MarqueeDonor[]; locale: "tw" | "en" }) {
  const track = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    const ids = donors.map((donor) => donor.id);
    let restored: Progress | null = null;
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null");
      if (saved && Array.isArray(saved.ids) && saved.ids.length === ids.length &&
          new Set(saved.ids).size === ids.length && saved.ids.every((id: unknown) => typeof id === "string" && ids.includes(id)) &&
          Number.isInteger(saved.cursor) && saved.cursor >= 0 && saved.cursor < ids.length &&
          Number.isFinite(saved.elapsed) && saved.elapsed >= 0) restored = saved;
    } catch { /* Storage is optional. */ }
    if (!restored) {
      const start = Math.floor(Math.random() * ids.length);
      restored = { ids: [...ids.slice(start), ...ids.slice(0, start)], cursor: 0, elapsed: 0 };
    }
    // Restore browser-only state after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(restored);
  }, [donors]);

  const byId = new Map(donors.map((donor) => [donor.id, donor]));
  const batch = progress
    ? progress.ids.slice(progress.cursor, progress.cursor + 24).flatMap((id) => {
        const donor = byId.get(id);
        return donor ? [donor] : [];
      })
    : donors.slice(0, 24);
  const repeatCount = batch.length < 8 ? 4 : 2;
  const loop = Array.from({ length: repeatCount }, () => batch).flat();
  const duration = Math.max(32, loop.length / 2 * 7) * 1000;

  useEffect(() => {
    const element = track.current;
    if (!element || !progress) return;
    const animation = element.getAnimations()[0];
    if (animation) animation.currentTime = progress.elapsed % duration;
    let advancing = false;
    const save = () => {
      if (advancing) return;
      const elapsed = Number(animation?.currentTime ?? 0) % duration;
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...progress, elapsed })); } catch { /* Storage is optional. */ }
    };
    const advance = () => {
      advancing = true;
      const cursor = progress.cursor + 24 >= progress.ids.length ? 0 : progress.cursor + 24;
      const next = { ...progress, cursor, elapsed: 0 };
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* Storage is optional. */ }
      setProgress(next);
    };
    save();
    element.addEventListener("animationiteration", advance);
    window.addEventListener("pagehide", save);
    document.addEventListener("visibilitychange", save);
    const timer = window.setInterval(save, 1000);
    return () => {
      save();
      clearInterval(timer);
      element.removeEventListener("animationiteration", advance);
      window.removeEventListener("pagehide", save);
      document.removeEventListener("visibilitychange", save);
    };
  }, [progress, duration]);

  return (
    <ul ref={track} className="donation-marquee-track flex w-max gap-3 will-change-transform"
      style={{ animationDuration: `${duration}ms`, visibility: progress ? "visible" : "hidden" }}>
      {loop.map((donor, i) => <DonorChip key={`${donor.id}-${i}`} donor={donor} locale={locale} />)}
    </ul>
  );
}
function DonorChip({ donor, locale }: { donor: MarqueeDonor; locale: "tw" | "en" }) {
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
