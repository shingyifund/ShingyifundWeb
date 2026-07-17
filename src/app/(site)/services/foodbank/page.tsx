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
import { foodbankConfig } from "@/config/foodbank";

export const metadata: Metadata = {
  title: "忠信食物銀行",
  description: foodbankConfig.hero.intro,
};

export default function FoodbankPage() {
  const { hero } = foodbankConfig;

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
