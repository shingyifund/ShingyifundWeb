import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { getAboutConfig } from "@/config/about";
import { getRequestLocale } from "@/i18n/request";

export async function OriginStory() {
  const locale = await getRequestLocale();
  const { origin } = await getAboutConfig();

  return (
    <section className="py-20">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[2fr_3fr]">
          {/* 圖 */}
          <Reveal>
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              <ImagePlaceholder
                src="/images/photo-a.jpg"
                alt={locale === "en" ? `${origin.founder} and Shing Yi Foundation` : `${origin.founder} 與興毅基金會`}
                tone="navy"
                label={locale === "en" ? "Founder" : "創辦人示意圖"}
                sizes="(max-width: 1024px) 60vw, 40vw"
                className="aspect-[4/3] w-full rounded-[1.75rem] shadow-soft"
              />
              {/* 創辦人名牌 */}
              <div className="absolute -bottom-6 left-6 rounded-2xl bg-white px-6 py-4 shadow-card ring-1 ring-navy-100">
                <p className="font-serif text-lg font-bold text-navy-900">
                  {origin.founder}
                </p>
                <p className="mt-0.5 text-sm text-ink-muted">{origin.founderTitle}</p>
              </div>
            </div>
          </Reveal>

          {/* 文 */}
          <Reveal delay={0.1}>
            <SectionHeading
              eyebrow={origin.eyebrow}
              title={origin.title}
              className="max-w-none"
            />
            <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-ink-soft sm:text-base">
              {origin.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
