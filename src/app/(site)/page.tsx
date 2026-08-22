import { Suspense } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { FeatureCards } from "@/components/home/FeatureCards";
import { ImpactStats } from "@/components/home/ImpactStats";
import { DonationMarquee } from "@/components/home/DonationMarquee";
import { VideoShowcase } from "@/components/home/VideoShowcase";
import { FacebookFeed } from "@/components/home/FacebookFeed";
import { TransparencySection } from "@/components/home/TransparencySection";
import { SustainabilityActionTeaser } from "@/components/home/SustainabilityActionTeaser";
import {
  DonationMarqueeSkeleton,
  FeatureCardsSkeleton,
  HeroSkeleton,
  HomePanelSkeleton,
  StatsSkeleton,
  TransparencySkeleton,
} from "@/components/loading/SiteLoadingSkeletons";

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<DonationMarqueeSkeleton />}>
        <DonationMarquee />
      </Suspense>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<StatsSkeleton />}>
        <ImpactStats />
      </Suspense>
      <Suspense fallback={<HomePanelSkeleton tone="navy" />}>
        <FacebookFeed />
      </Suspense>
      <Suspense fallback={<FeatureCardsSkeleton />}>
        <FeatureCards />
      </Suspense>
      <Suspense fallback={<HomePanelSkeleton tone="navy" className="lg:min-h-[27rem]" />}>
        <SustainabilityActionTeaser />
      </Suspense>
      <Suspense fallback={<HomePanelSkeleton tone="navy" />}>
        <VideoShowcase />
      </Suspense>
      <Suspense fallback={<TransparencySkeleton />}>
        <TransparencySection />
      </Suspense>
    </>
  );
}
