import {
  Baby,
  CircleAlert,
  HeartHandshake,
  Home,
  Scale,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { foodbankConfig, type FoodbankTarget } from "@/config/foodbank";

const ICONS: Record<FoodbankTarget["icon"], LucideIcon> = {
  lowIncome: Scale,
  marginal: Users,
  children: Baby,
  poor: Home,
  emergency: CircleAlert,
  other: HeartHandshake,
};

export function FoodbankTargets() {
  const { targets } = foodbankConfig;

  return (
    <section className="bg-mist/60 py-20">
      <Container>
        <SectionHeading
          align="center"
          eyebrow={targets.eyebrow}
          title={targets.title}
          description={targets.description}
          className="mb-12"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {targets.items.map((item, i) => {
            const Icon = ICONS[item.icon];
            return (
              <Reveal key={item.title} delay={(i % 3) * 0.08}>
                <div className="group flex h-full items-center gap-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-navy-200 hover:shadow-soft">
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-600 transition-colors duration-300 group-hover:bg-navy-700 group-hover:text-white">
                    <Icon
                      className="size-6 transition-transform duration-300 group-hover:scale-110"
                      strokeWidth={1.5}
                    />
                  </span>
                  <h3 className="font-serif text-base font-bold leading-snug text-navy-900">
                    {item.title}
                  </h3>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-ink-muted">
            {targets.footnote}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
