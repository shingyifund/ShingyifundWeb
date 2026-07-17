import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { foodbankConfig } from "@/config/foodbank";

export function FoodbankAbout() {
  const { about } = foodbankConfig;

  return (
    <section className="bg-white py-20">
      <Container>
        <SectionHeading
          align="center"
          eyebrow={about.eyebrow}
          title={about.title}
          className="mb-10"
        />

        <div className="mx-auto max-w-3xl space-y-5">
          {about.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="text-base leading-loose text-ink-soft sm:text-lg">
                {p}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
