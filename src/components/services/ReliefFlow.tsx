import {
  Building2,
  ClipboardList,
  FileSearch,
  House,
  MailCheck,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { reliefConfig, type FlowStep } from "@/config/relief";

const ICONS: Record<FlowStep["icon"], LucideIcon> = {
  seek: MessagesSquare,
  referral: Building2,
  submit: ClipboardList,
  review: FileSearch,
  visit: House,
  notify: MailCheck,
};

export function ReliefFlow() {
  const { flow } = reliefConfig;

  return (
    <section className="bg-white py-20">
      <Container>
        <SectionHeading
          align="center"
          eyebrow={flow.eyebrow}
          title={flow.title}
          description={flow.description}
          className="mb-14"
        />

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {flow.steps.map((step, i) => {
            const Icon = ICONS[step.icon];
            return (
              <Reveal key={step.title} delay={(i % 3) * 0.08}>
                <li className="group relative flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 pt-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-navy-200 hover:shadow-soft">
                  {/* 步驟編號 */}
                  <span className="absolute -top-4 left-6 inline-flex size-9 items-center justify-center rounded-full bg-amber-500 font-serif text-base font-bold text-white shadow-card">
                    {i + 1}
                  </span>

                  <Icon
                    className="size-9 text-navy-600 transition-transform duration-300 group-hover:scale-110"
                    strokeWidth={1.5}
                    aria-hidden
                  />

                  <h3 className="mt-4 font-serif text-xl font-bold text-navy-900">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
                    {step.description}
                  </p>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
