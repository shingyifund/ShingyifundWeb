import {
  CalendarDays,
  Coins,
  Store,
  Target,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { aboutConfig, type AboutStat } from "@/config/about";

const ICONS: Record<AboutStat["icon"], LucideIcon> = {
  calendar: CalendarDays,
  coins: Coins,
  store: Store,
  target: Target,
};

export function AboutStats() {
  const { stats } = aboutConfig;

  return (
    <section className="py-8">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-navy-800 px-6 py-12 shadow-soft sm:px-10">
            <div className="pointer-events-none absolute -left-20 -top-24 size-64 rounded-full bg-navy-600/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 size-64 rounded-full bg-amber-500/20 blur-3xl" />

            <dl className="relative grid grid-cols-2 gap-y-10 lg:grid-cols-4 lg:gap-y-0">
              {stats.map((s) => {
                const Icon = ICONS[s.icon];
                return (
                  <div
                    key={s.label}
                    className="flex flex-col items-center gap-2 px-3 text-center lg:border-l lg:border-white/15 lg:first:border-l-0"
                  >
                    <Icon
                      className="size-9 text-white/85"
                      strokeWidth={1.5}
                    />
                    <dd className="font-serif text-3xl font-black leading-none tabular-nums text-amber-400 sm:text-4xl">
                      {s.value}
                    </dd>
                    <dt className="text-sm text-navy-100/75">{s.label}</dt>
                  </div>
                );
              })}
            </dl>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
