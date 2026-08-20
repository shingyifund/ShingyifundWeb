import { HeroSection } from "@/components/home/HeroSection";
import { FeatureCards } from "@/components/home/FeatureCards";
import { ImpactStats } from "@/components/home/ImpactStats";
import { DonationMarquee } from "@/components/home/DonationMarquee";
import { VideoShowcase } from "@/components/home/VideoShowcase";
import { FacebookFeed } from "@/components/home/FacebookFeed";
import { TransparencySection } from "@/components/home/TransparencySection";
import { SustainabilityActionTeaser } from "@/components/home/SustainabilityActionTeaser";

export default function HomePage() {
  return (
    <>
      <DonationMarquee />
      <HeroSection />
      <ImpactStats />
      <FacebookFeed />
      <FeatureCards />
      <SustainabilityActionTeaser />
      <VideoShowcase />
      <TransparencySection />
    </>
  );
}
