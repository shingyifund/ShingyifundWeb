import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { getAboutConfig } from "@/config/about";

export async function FounderQuote() {
  const { quote } = await getAboutConfig();

  return (
    <section className="py-12">
      <Container>
        <Reveal>
          <figure className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-800 to-navy-900 px-8 py-14 text-center shadow-soft sm:px-16">
            {/* 裝飾大引號 */}
            <Quote
              className="pointer-events-none absolute left-8 top-8 size-20 rotate-180 fill-amber-500/10 text-amber-500/10"
              strokeWidth={1}
            />
            <Quote
              className="pointer-events-none absolute bottom-8 right-8 size-20 fill-amber-500/10 text-amber-500/10"
              strokeWidth={1}
            />

            <blockquote className="relative mx-auto max-w-2xl font-serif text-xl font-medium leading-relaxed text-white sm:text-2xl sm:leading-relaxed">
              「{quote.text}」
            </blockquote>
            <figcaption className="relative mt-7">
              <span className="font-serif text-base font-semibold text-amber-300">
                — {quote.source}
              </span>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-navy-100/70">
                {quote.note}
              </p>
            </figcaption>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
