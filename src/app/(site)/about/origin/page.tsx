import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { OriginStory } from "@/components/about/OriginStory";
import { FounderQuote } from "@/components/about/FounderQuote";
import { ServiceScopeSection } from "@/components/about/ServiceScopeSection";
import { FoodbankSection } from "@/components/about/FoodbankSection";
import { Milestones } from "@/components/about/Milestones";
import { AboutStats } from "@/components/about/AboutStats";
import { CoreValues } from "@/components/about/CoreValues";

export const metadata: Metadata = {
  title: "興毅緣起",
  description:
    "創辦人吳靜宇老先生於民國 82 年創辦興毅基金會，秉持「興辦社福博施濟眾，毅弘聖道繼往開來」的精神，長期幫助弱勢族群。",
};

export default function OriginPage() {
  return (
    <>
      <AboutHero />
      <OriginStory />
      <FounderQuote />
      <ServiceScopeSection />
      <FoodbankSection />
      <Milestones />
      <AboutStats />
      <CoreValues />
    </>
  );
}
