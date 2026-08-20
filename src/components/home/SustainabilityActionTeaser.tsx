import Image from "next/image";
import { ArrowRight, Leaf, Recycle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { getSustainabilityActionContent } from "@/config/sustainability-action";
import { localizeHref } from "@/i18n/config";
import { getRequestLocale } from "@/i18n/request";

export async function SustainabilityActionTeaser() {
  const locale = await getRequestLocale();
  const content = getSustainabilityActionContent(locale);

  return (
    <section className="py-8 sm:py-12">
      <Container>
        <Reveal>
          <div className="grid overflow-hidden rounded-[2rem] bg-navy-800 shadow-soft lg:grid-cols-[1.25fr_0.75fr]">
            <div className="relative min-h-64 lg:min-h-[27rem]">
              <Image
                src="/images/sustainability-action.jpg"
                alt={content.title}
                fill
                sizes="(max-width: 1024px) 100vw, 62vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/25 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-navy-900/30" />
            </div>

            <div className="relative flex flex-col justify-center overflow-hidden px-7 py-10 text-white sm:px-10 lg:px-12">
              <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-amber-400/15 blur-3xl" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-amber-300">
                  <Leaf className="size-4" />
                  {content.tagline}
                </span>
                <h2 className="mt-4 font-serif text-3xl font-black leading-tight sm:text-4xl">
                  {content.title}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-navy-100/80">
                  {content.teaser}
                </p>
                <div className="mt-7 flex items-center gap-4">
                  <Button href={localizeHref("/sustainability/action", locale)} size="md">
                    {content.learnMore}
                    <ArrowRight className="size-4" />
                  </Button>
                  <Recycle className="hidden size-10 text-white/15 sm:block" strokeWidth={1.25} />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
