import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ReliefNotice } from "@/components/services/ReliefNotice";
import { ReliefAbout } from "@/components/services/ReliefAbout";
import { ReliefReferral } from "@/components/services/ReliefReferral";
import { ReliefFlow } from "@/components/services/ReliefFlow";
import { ReliefDocuments } from "@/components/services/ReliefDocuments";
import { ReliefPrinciples } from "@/components/services/ReliefPrinciples";
import { ReliefTerms } from "@/components/services/ReliefTerms";
import { ReliefDownloads } from "@/components/services/ReliefDownloads";
import { ReliefDownloadFab } from "@/components/services/ReliefDownloadFab";
import { ReliefFaq } from "@/components/services/ReliefFaq";
import { reliefConfig } from "@/config/relief";

export const metadata: Metadata = {
  title: "社會救助",
  description: reliefConfig.hero.intro,
};

export default function ReliefPage() {
  const { hero } = reliefConfig;

  return (
    <>
      <PageHero
        image="/images/relief.jpg"
        imageAlt=""
        eyebrow={hero.eyebrow}
        title={hero.title}
      >
        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-navy-100/85 sm:text-lg">
          {hero.intro}
        </p>
      </PageHero>

      <ReliefNotice />
      <ReliefAbout />
      <ReliefReferral />
      <ReliefFlow />
      <ReliefDocuments />
      <ReliefPrinciples />
      <ReliefTerms />
      <ReliefDownloads />
      <ReliefFaq />

      <ReliefDownloadFab />
    </>
  );
}
