import {
  ClipboardList,
  FileCheck2,
  HandHeart,
  PhoneCall,
  ShoppingBasket,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getFoodbankConfig, type FoodbankFlowStep } from "@/config/foodbank";

const ICONS: Record<FoodbankFlowStep["icon"], LucideIcon> = {
  contact: PhoneCall,
  apply: ClipboardList,
  visit: FileCheck2,
  review: HandHeart,
  pickup: ShoppingBasket,
};

export async function FoodbankFlow() {
  const { flow } = await getFoodbankConfig();

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

        {/* 物資來源補充說明 */}
        <Reveal>
          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:flex-row sm:items-center sm:p-7">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
              <HandHeart className="size-5" strokeWidth={1.5} />
            </span>
            <p className="text-sm leading-relaxed text-ink-soft sm:text-base">
              {flow.highlight}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
