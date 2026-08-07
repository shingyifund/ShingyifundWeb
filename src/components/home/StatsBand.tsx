"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import {
  HandHeart,
  Handshake,
  Heart,
  Leaf,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ImpactStat } from "@/lib/types";
import { useLocale } from "@/i18n/provider";
import { translate } from "@/i18n/translations";

const ICONS: Record<ImpactStat["icon"], LucideIcon> = {
  family: Users,
  leaf: Leaf,
  store: Store,
  partners: Handshake,
  hands: HandHeart,
};

export function StatsBand({ stats }: { stats: ImpactStat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStart(true);
          ob.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  return (
    <section>
      <div className="container-x">
        <div
          ref={ref}
          className="relative overflow-hidden rounded-3xl bg-navy-800 px-6 py-9 shadow-soft sm:px-10 sm:py-10"
        >
          {/* 裝飾光暈 */}
          <div className="pointer-events-none absolute -left-20 -top-24 size-64 rounded-full bg-navy-600/40 blur-2xl will-change-transform" style={{ transform: "translateZ(0)" }} />
          <div className="pointer-events-none absolute -bottom-24 -right-16 size-64 rounded-full bg-amber-500/20 blur-2xl will-change-transform" style={{ transform: "translateZ(0)" }} />

          {/* 標題 + 愛心脈搏裝飾 */}
          <div className="relative mb-8 flex items-center justify-center gap-3 text-amber-400 sm:mb-9">
            <span className="hidden items-center gap-2 sm:flex">
              <span className="h-px w-12 bg-current/50" />
              <Heart className="size-4 fill-current text-rose-500" />
            </span>
            <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
              {translate(locale, "我們的服務成效")}
            </h2>
            <span className="hidden items-center gap-2 sm:flex">
              <Heart className="size-4 fill-current text-rose-500" />
              <span className="h-px w-12 bg-current/50" />
            </span>
          </div>

          {/* 數據 */}
          <dl className="relative grid grid-cols-2 gap-y-7 sm:grid-cols-3 sm:gap-y-8 lg:grid-cols-5 lg:gap-y-0">
            {stats.map((s) => {
              const Icon = ICONS[s.icon];
              return (
                <div
                  key={s.id}
                  className="grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)] grid-rows-[1.5rem_2.5rem_2.75rem] items-center gap-x-3 px-3 lg:border-l lg:border-white/15 lg:first:border-l-0"
                >
                  <Icon
                    className="row-span-3 size-9 shrink-0 self-center text-white/85 sm:size-10"
                    strokeWidth={1.5}
                  />
                  <dt className="col-start-2 row-start-1 self-end text-xs leading-5 text-navy-100/70">
                    {s.topLabel}
                  </dt>
                  <dd className="col-start-2 row-start-2 self-center whitespace-nowrap font-serif text-[2rem] font-black leading-none tabular-nums text-amber-400 sm:text-4xl">
                    {start ? (
                      <CountUp end={s.value} duration={2} separator="," />
                    ) : (
                      0
                    )}
                    {s.suffix}
                  </dd>
                  <p className="col-start-2 row-start-3 self-start pt-1 text-xs leading-5 text-navy-100/70">
                    {s.bottomLabel}
                  </p>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
