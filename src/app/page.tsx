import { HeroSection } from "@/components/home/HeroSection";
import { FeatureCards } from "@/components/home/FeatureCards";
import { ImpactStats } from "@/components/home/ImpactStats";
import { VideoShowcase } from "@/components/home/VideoShowcase";
import { FacebookFeed } from "@/components/home/FacebookFeed";
import { TransparencySection } from "@/components/home/TransparencySection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureCards />
      <ImpactStats />
      <VideoShowcase />
      <FacebookFeed />
      <TransparencySection />
    </>
  );
}
