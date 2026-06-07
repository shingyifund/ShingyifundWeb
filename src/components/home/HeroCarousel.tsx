"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import type { HeroSlide } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 6000, stopOnInteraction: false })],
  );
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="relative">
      {/* 單一語意 h1（視覺標題在各 slide 內以 p 呈現） */}
      <h1 className="sr-only">
        財團法人興毅社會福利慈善事業基金會 — 讓愛延續，讓需要被看見
      </h1>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, i) => (
            <div key={slide.id} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative h-[80dvh] max-h-[720px] min-h-[480px]">
                {/* 背景大圖 */}
                <ImagePlaceholder
                  src={slide.image}
                  alt={slide.title}
                  tone={slide.tone === "amber" ? "navy" : "mist"}
                  label="主視覺圖片"
                  priority={i === 0}
                  sizes="100vw"
                  className="absolute inset-0 size-full"
                />
                {/* 左側可讀性遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/85 to-cream/10 md:to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-cream to-transparent" />

                {/* 文字內容 */}
                <div className="container-x relative flex h-full items-center">
                  <div
                    className={cn(
                      "max-w-xl transition-all duration-700",
                      selected === i
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0",
                    )}
                  >
                    <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-700">
                      <Heart className="size-3.5 fill-current" />
                      財團法人興毅社會福利慈善事業基金會
                    </span>

                    <p className="mt-5 font-serif text-4xl font-black leading-[1.15] text-navy-900 sm:text-5xl lg:text-6xl">
                      <HeroTitle text={slide.title} />
                    </p>

                    {slide.subtitle && (
                      <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg">
                        {slide.subtitle}
                      </p>
                    )}

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <Button href="/donate" size="lg">
                        <Heart className="size-4 fill-current" />
                        立即捐款
                      </Button>
                      <Button
                        href={slide.cta?.href ?? "/services"}
                        size="lg"
                        variant="white"
                      >
                        {slide.cta?.label ?? "了解服務"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 控制列（拉高到特色卡重疊區之上，避免卡在接縫） */}
      <div className="container-x pointer-events-none absolute inset-x-0 bottom-16 z-20">
        <div className="flex items-center justify-between">
          <div className="pointer-events-auto flex items-center">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`切換到第 ${i + 1} 張`}
                aria-current={selected === i ? "true" : undefined}
                className="group flex h-11 items-center justify-center px-1.5"
              >
                <span
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    selected === i
                      ? "w-8 bg-amber-500"
                      : "w-2 bg-navy-300 group-hover:bg-navy-400",
                  )}
                />
              </button>
            ))}
          </div>
          <div className="pointer-events-auto hidden gap-2 sm:flex">
            <ArrowBtn dir="prev" onClick={() => emblaApi?.scrollPrev()} />
            <ArrowBtn dir="next" onClick={() => emblaApi?.scrollNext()} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** 標語中「被看見 / 溫暖 / 告白」等關鍵詞以暖色強調（依逗號後半段） */
function HeroTitle({ text }: { text: string }) {
  const parts = text.split("，");
  if (parts.length < 2) return <>{text}</>;
  return (
    <>
      {parts[0]}，
      <br className="hidden sm:block" />
      <span className="text-gradient-amber">{parts.slice(1).join("，")}</span>
    </>
  );
}

function ArrowBtn({
  dir,
  onClick,
}: {
  dir: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === "prev" ? "上一張" : "下一張"}
      className="inline-flex size-11 items-center justify-center rounded-full border border-navy-200 bg-white/80 text-navy-700 backdrop-blur transition-all hover:bg-white hover:shadow-md"
    >
      {dir === "prev" ? (
        <ChevronLeft className="size-5" />
      ) : (
        <ChevronRight className="size-5" />
      )}
    </button>
  );
}
