import {
  HeartHandshake,
  Sprout,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { aboutConfig, type AboutValue } from "@/config/about";

const ICONS: Record<AboutValue["icon"], LucideIcon> = {
  heartHandshake: HeartHandshake,
  sprout: Sprout,
  users: Users,
};

export function CoreValues() {
  const { values } = aboutConfig;

  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="核心精神"
          title="我們所堅持的事"
          description="以人性至善為念，讓每一份善心都化為實際的陪伴與行動。"
          className="mb-12"
        />

        <div className="grid gap-6 md:grid-cols-3">
          {values.map((v, i) => {
            const Icon = ICONS[v.icon];
            return (
              <Reveal key={v.title} delay={i * 0.1}>
                <div className="group flex h-full flex-col items-center rounded-2xl border border-navy-100 bg-white px-7 py-9 text-center shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-navy-200 hover:shadow-soft">
                  <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-navy-50 text-navy-600 transition-colors duration-300 group-hover:bg-navy-700 group-hover:text-white">
                    <Icon className="size-8" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-5 font-serif text-xl font-bold text-navy-900">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                    {v.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
