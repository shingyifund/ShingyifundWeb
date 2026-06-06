import { getHeroSlides } from "@/lib/data/queries";
import { HeroCarousel } from "./HeroCarousel";

export async function HeroSection() {
  const slides = await getHeroSlides();
  return <HeroCarousel slides={slides} />;
}
