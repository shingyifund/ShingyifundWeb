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
    <section className="py-8">
      <div className="container-x">
        <div
          ref={ref}
          className="relative overflow-hidden rounded-3xl bg-navy-800 px-6 py-12 shadow-soft sm:px-10"
        >
          {/* 裝飾光暈 */}
          <div className="pointer-events-none absolute -left-20 -top-24 size-64 rounded-full bg-navy-600/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 size-64 rounded-full bg-amber-500/20 blur-3xl" />

          {/* 標題 + 愛心脈搏裝飾 */}
          <div className="relative mb-12 flex items-center justify-center gap-3 text-amber-400">
            <span className="hidden items-center gap-2 sm:flex">
              <span className="h-px w-12 bg-current/50" />
              <Heart className="size-4 fill-current" />
            </span>
            <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
              我們的服務成效
            </h2>
            <span className="hidden items-center gap-2 sm:flex">
              <Heart className="size-4 fill-current" />
              <span className="h-px w-12 bg-current/50" />
            </span>
          </div>

          {/* 數據 */}
          <dl className="relative grid grid-cols-2 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-y-0">
            {stats.map((s) => {
              const Icon = ICONS[s.icon];
              return (
                <div
                  key={s.id}
                  className="flex items-center justify-center gap-3 px-3 lg:border-l lg:border-white/15 lg:first:border-l-0"
                >
                  <Icon
                    className="size-10 shrink-0 text-white/85"
                    strokeWidth={1.4}
                  />
                  <div className="text-left">
                    <dt className="text-xs text-navy-100/70">{s.topLabel}</dt>
                    <dd className="font-serif text-3xl font-black leading-none text-amber-400 sm:text-4xl">
                      {start ? (
                        <CountUp end={s.value} duration={2} separator="," />
                      ) : (
                        0
                      )}
                      {s.suffix}
                    </dd>
                    <p className="mt-1 text-xs text-navy-100/70">{s.bottomLabel}</p>
                  </div>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
