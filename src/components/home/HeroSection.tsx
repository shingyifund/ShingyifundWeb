import { getHeroSlides } from "@/lib/data/queries";
import { HeroCarousel } from "./HeroCarousel";
import { HeroStaticSlide } from "./HeroStaticSlide";

export async function HeroSection() {
  const slides = await getHeroSlides();
  if (slides.length === 0) return null;
  if (slides.length === 1) return <HeroStaticSlide slide={slides[0]} />;
  return <HeroCarousel slides={slides} />;
}
