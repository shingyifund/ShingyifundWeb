import { Info } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getFoodbankConfig } from "@/config/foodbank";

export async function FoodbankReminders() {
  const { reminders } = await getFoodbankConfig();

  return (
    <section className="bg-white py-20">
      <Container>
        <SectionHeading
          align="center"
          eyebrow={reminders.eyebrow}
          title={reminders.title}
          className="mb-12"
        />

        <ul className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          {reminders.items.map((item, i) => (
            <Reveal key={i} delay={(i % 2) * 0.08}>
              <li className="flex h-full gap-3 rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-600">
                  <Info className="size-3.5" strokeWidth={2} />
                </span>
                <p className="text-sm leading-relaxed text-ink-soft">{item}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
