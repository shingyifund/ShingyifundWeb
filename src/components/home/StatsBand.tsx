"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import {
  CalendarDays,
  HandHeart,
  HeartHandshake,
  PackageOpen,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ImpactStat } from "@/lib/types";

const ICONS: Record<ImpactStat["icon"], LucideIcon> = {
  users: Users,
  calendar: CalendarDays,
  box: PackageOpen,
  heart: HeartHandshake,
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

          <div className="relative mb-10 text-center">
            <span className="text-sm font-medium tracking-wide text-amber-300">
              IMPACT
            </span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">
              我們的服務成效
            </h2>
          </div>

          <dl className="relative grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-5">
            {stats.map((s) => {
              const Icon = ICONS[s.icon];
              return (
                <div key={s.id} className="flex flex-col items-center text-center">
                  <span className="mb-3 inline-flex size-12 items-center justify-center rounded-2xl bg-white/10 text-amber-300">
                    <Icon className="size-6" strokeWidth={1.75} />
                  </span>
                  <dd className="font-serif text-4xl font-black text-white sm:text-5xl">
                    {start ? (
                      <CountUp end={s.value} duration={2} separator="," />
                    ) : (
                      0
                    )}
                    <span className="text-amber-400">{s.suffix}</span>
                  </dd>
                  <dt className="mt-2 text-sm text-navy-100/70">{s.label}</dt>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
