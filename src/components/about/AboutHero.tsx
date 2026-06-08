import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { aboutConfig } from "@/config/about";

export function AboutHero() {
  const { en, title, couplet } = aboutConfig.hero;

  return (
    <section className="relative overflow-hidden bg-navy-900 py-20 text-white sm:py-28">
      {/* 麥穗背景圖（右側透出，明顯呈現） */}
      <Image
        src="/images/about-hero-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover object-right opacity-95"
      />
      {/* 左濃右透遮罩：左側保護文字、右側幾乎不蓋讓麥穗清楚呈現 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/55 to-transparent" />

      {/* 裝飾光暈 */}
      <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-navy-600/40 blur-2xl" style={{ transform: "translateZ(0)" }} />
      {/* 細格紋 */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255_/_0.06)_1px,transparent_0)] [background-size:28px_28px]" />

      <Container className="relative text-left">
        <p className="font-serif text-sm font-medium uppercase tracking-[0.3em] text-amber-300">
          {en}
        </p>
        <h1 className="mt-4 font-serif text-4xl font-black tracking-wide sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        <div className="mt-8 flex max-w-md flex-col items-start gap-3 text-lg font-medium text-navy-100/90 sm:flex-row sm:items-center sm:gap-4 sm:text-xl">
          <span>{couplet[0]}</span>
          <span className="hidden h-8 w-px bg-amber-400/50 sm:block" />
          <span>{couplet[1]}</span>
        </div>
      </Container>
    </section>
  );
}
