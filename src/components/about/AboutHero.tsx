import { PageHero } from "@/components/ui/PageHero";
import { getAboutConfig } from "@/config/about";

export async function AboutHero() {
  const { en, title, couplet } = (await getAboutConfig()).hero;

  return (
    <PageHero
      image="/images/about-hero-bg.jpg"
      imagePosition="right"
      eyebrow={en}
      title={title}
      align="left"
      overlay="gradient"
    >
      <div className="mt-8 flex max-w-md flex-col items-start gap-3 text-lg font-medium text-navy-100/90 sm:flex-row sm:items-center sm:gap-4 sm:text-xl">
        <span>{couplet[0]}</span>
        <span className="hidden h-8 w-px bg-amber-400/50 sm:block" />
        <span>{couplet[1]}</span>
      </div>
    </PageHero>
  );
}
