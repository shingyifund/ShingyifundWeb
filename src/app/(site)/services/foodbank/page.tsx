import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { FoodbankNotice } from "@/components/services/FoodbankNotice";
import { FoodbankAbout } from "@/components/services/FoodbankAbout";
import { FoodbankTargets } from "@/components/services/FoodbankTargets";
import { FoodbankFlow } from "@/components/services/FoodbankFlow";
import { FoodbankPoints } from "@/components/services/FoodbankPoints";
import { FoodbankPickup } from "@/components/services/FoodbankPickup";
import { FoodbankReminders } from "@/components/services/FoodbankReminders";
import { FoodbankFaq } from "@/components/services/FoodbankFaq";
import { getFoodbankConfig } from "@/config/foodbank";
import { getRequestLocale } from "@/i18n/request";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getFoodbankConfig();
  return { title: config.hero.title, description: config.hero.intro };
}

export default async function FoodbankPage() {
  await getRequestLocale();
  const { hero } = await getFoodbankConfig();

  return (
    <>
      <PageHero
        image="/images/foodbank.jpg"
        imageAlt=""
        imagePosition="top"
        eyebrow={hero.eyebrow}
        title={hero.title}
      >
        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-navy-100/85 sm:text-lg">
          {hero.intro}
        </p>
      </PageHero>

      <FoodbankNotice />
      <FoodbankAbout />
      <FoodbankTargets />
      <FoodbankFlow />
      <FoodbankPoints />
      <FoodbankPickup />
      <FoodbankReminders />
      <FoodbankFaq />
    </>
  );
}
