import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { foodbankConfig } from "@/config/foodbank";

export function FoodbankFaq() {
  const { faq } = foodbankConfig;

  return (
    <section className="bg-cream py-20">
      <Container>
        <SectionHeading
          align="center"
          eyebrow={faq.eyebrow}
          title={faq.title}
          className="mb-12"
        />

        <Reveal>
          <Accordion
            type="single"
            collapsible
            className="mx-auto max-w-3xl gap-3"
          >
            {faq.items.map((item, i) => (
              <AccordionItem
                key={item.question}
                value={`q${i + 1}`}
                className="rounded-2xl border border-navy-100 bg-white px-5 shadow-card not-last:border-b"
              >
                <AccordionTrigger className="gap-4 py-5 font-serif text-base font-bold text-navy-900 hover:no-underline sm:text-lg">
                  <span className="flex items-start gap-3">
                    <span className="mt-0.5 font-serif text-sm font-bold text-amber-600">
                      Q{i + 1}
                    </span>
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <p className="pl-8 text-sm leading-relaxed text-ink-soft">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </section>
  );
}
