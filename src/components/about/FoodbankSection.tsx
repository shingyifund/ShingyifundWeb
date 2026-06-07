import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { aboutConfig } from "@/config/about";

export function FoodbankSection() {
  const { foodbank } = aboutConfig;

  return (
    <section className="py-20">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* 文 */}
          <Reveal>
            <SectionHeading
              eyebrow={foodbank.eyebrow}
              title={foodbank.title}
              className="max-w-none"
            />
            <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-ink-soft sm:text-base">
              {foodbank.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {foodbank.highlights.map((h) => (
                <li key={h} className="flex items-center gap-3">
                  <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <Check className="size-4" strokeWidth={2.5} />
                  </span>
                  <span className="text-sm font-medium text-navy-800">{h}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* 圖 */}
          <Reveal delay={0.1}>
            <ImagePlaceholder
              src="/images/photo-b.jpg"
              alt="忠信食物銀行物資發放"
              tone="amber"
              label="食物銀行示意圖"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="aspect-video w-full rounded-[1.75rem] shadow-soft lg:order-last lg:aspect-[4/3]"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
