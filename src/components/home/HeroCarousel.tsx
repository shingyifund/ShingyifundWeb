"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import type { HeroSlide } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/provider";
import { translate } from "@/i18n/translations";
import { Button } from "@/components/ui/Button";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const locale = useLocale();
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
    <section className="pt-2 pb-4 sm:pb-5">
      <h1 className="sr-only">
        財團法人興毅社會福利慈善事業基金會 — 讓愛延續，讓需要被看見
      </h1>

      {/* 手機保留 16:9，桌機以 16:7 稍微壓低高度，同一輪播內高度固定避免跳動。 */}
      <div className="container-x">
        <div className="relative">
          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex">
              {slides.map((slide, i) => (
                <div key={slide.id} className="relative min-w-0 flex-[0_0_100%]">
                  <div className="relative aspect-video w-full lg:aspect-[16/7]">
                    {slide.content_type === "image" && (
                      <ImageSlide slide={slide} priority={i === 0} />
                    )}
                    {slide.content_type === "image_text" && (
                      <ImageTextSlide
                        slide={slide}
                        priority={i === 0}
                        selected={selected === i}
                      />
                    )}
                    {slide.content_type === "youtube" && (
                      <YoutubeSlide slide={slide} selected={selected === i} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 控制列疊在 hero 下緣；小寬度只留置中 dots，箭頭隱藏避免與 CTA 重疊。 */}
          <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex items-center justify-end sm:inset-x-5 sm:bottom-5 sm:justify-between">
            <div className="pointer-events-auto flex items-center rounded-full bg-white/80 px-1.5 py-1 shadow-card backdrop-blur-md">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={locale === "en" ? `Go to slide ${i + 1}` : `切換到第 ${i + 1} 張`}
                  aria-current={selected === i ? "true" : undefined}
                  className="group flex h-6 cursor-pointer items-center justify-center px-1 sm:h-7 sm:px-1.5"
                >
                  <span
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300 sm:h-2",
                      selected === i
                        ? "w-7 bg-amber-500 sm:w-8"
                        : "w-1.5 bg-navy-300 group-hover:bg-navy-400 sm:w-2",
                    )}
                  />
                </button>
              ))}
            </div>
            <div className="pointer-events-auto mr-14 hidden gap-1.5 sm:mr-20 sm:flex sm:gap-2 2xl:mr-0">
              <ArrowBtn dir="prev" onClick={() => emblaApi?.scrollPrev()} />
              <ArrowBtn dir="next" onClick={() => emblaApi?.scrollNext()} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImageSlide({ slide, priority }: { slide: HeroSlide; priority: boolean }) {
  const locale = useLocale();
  const inner = (
    <>
      <ImagePlaceholder
        src={slide.image_url}
        alt=""
        tone="mist"
        label={translate(locale, "主視覺圖片")}
        priority={priority}
        sizes="100vw"
        className="absolute inset-0 size-full"
        imgClassName="object-contain"
      />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/20 to-transparent" />
    </>
  );

  if (slide.link_url) {
    return (
      <a
        href={slide.link_url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0"
        aria-label={translate(locale, "查看詳情")}
      >
        {inner}
      </a>
    );
  }

  return <>{inner}</>;
}

function ImageTextSlide({
  slide,
  priority,
  selected,
}: {
  slide: HeroSlide;
  priority: boolean;
  selected: boolean;
}) {
  const locale = useLocale();
  const isNavy = slide.tone === "navy";

  return (
    <>
      <ImagePlaceholder
        src={slide.image_url}
        alt={slide.title ?? ""}
        tone={isNavy ? "navy" : "mist"}
        label={translate(locale, "主視覺圖片")}
        priority={priority}
        sizes="100vw"
        className="absolute inset-0 size-full"
      />
      {isNavy ? (
        <>
          <div className="absolute inset-0 bg-linear-to-r from-navy-950 via-navy-950/85 to-navy-950/10 md:to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-navy-950 to-transparent" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-linear-to-r from-cream via-cream/85 to-cream/10 md:to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-cream to-transparent" />
        </>
      )}

      <div className="container-x relative flex h-full items-center pb-8">
        <div
          className={cn(
            "max-w-xl transition-all duration-700",
            selected ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
          style={{ willChange: "transform, opacity" }}
        >
          {slide.has_title && slide.title && (
            <p
              className={cn(
                "mt-4 line-clamp-2 max-w-[min(34rem,calc(100vw-3rem))] font-serif text-2xl font-black leading-[1.15] sm:mt-5 sm:text-3xl lg:text-5xl",
                isNavy ? "text-white" : "text-navy-900",
              )}
            >
              <HeroTitle text={slide.title} />
            </p>
          )}

          {slide.has_subtitle && slide.subtitle && (
            <p
              className={cn(
                "mt-3 max-w-md text-base leading-relaxed sm:mt-5 sm:text-lg",
                isNavy ? "text-cream/90" : "text-ink-soft",
              )}
            >
              {slide.subtitle}
            </p>
          )}

          {slide.has_cta && slide.cta_href && (
            <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-8">
              <Button
                href={slide.cta_href}
                size="md"
                variant="white"
                className="h-11 px-6 text-base sm:h-12 sm:px-8"
              >
                {slide.cta_label ?? translate(locale, "了解服務")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function YoutubeSlide({ slide, selected }: { slide: HeroSlide; selected: boolean }) {
  const locale = useLocale();
  const posterSrc =
    slide.poster_image_url ??
    (slide.youtube_video_id
      ? `https://img.youtube.com/vi/${slide.youtube_video_id}/hqdefault.jpg`
      : null);

  return (
    <>
      {posterSrc && (
        <ImagePlaceholder
          src={posterSrc}
          alt={slide.title ?? ""}
          tone="mist"
          label={translate(locale, "影片封面")}
          priority={false}
          sizes="100vw"
          className="absolute inset-0 size-full"
        />
      )}
      <div className="absolute inset-0 bg-black/15" />
      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/65 via-black/25 to-transparent" />

      {slide.youtube_url && (
        <a
          href={slide.youtube_url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center"
          aria-label={translate(locale, "在 YouTube 觀看影片")}
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-white/90 text-red-600 shadow-lg transition hover:scale-105 hover:bg-white sm:size-16">
            <Play className="size-6 translate-x-0.5 fill-current sm:size-7" />
          </span>
        </a>
      )}

      {(slide.has_title || slide.has_subtitle) && (
        <div className="container-x pointer-events-none absolute inset-x-0 top-5 z-10 sm:top-8">
          <div
            className={cn(
              "max-w-[min(30rem,calc(100vw-3rem))] transition-all duration-700",
              selected ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}
            style={{ willChange: "transform, opacity" }}
          >
            {slide.has_title && slide.title && (
              <p className="line-clamp-2 font-serif text-xl font-black leading-tight text-white drop-shadow-lg sm:text-2xl lg:text-3xl">
                {slide.title}
              </p>
            )}
            {slide.has_subtitle && slide.subtitle && (
              <p className="mt-2 line-clamp-1 max-w-md text-sm leading-relaxed text-white/90 drop-shadow sm:text-base">
                {slide.subtitle}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

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

function ArrowBtn({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  const locale = useLocale();
  return (
    <button
      onClick={onClick}
      aria-label={dir === "prev" ? translate(locale, "上一張") : translate(locale, "下一張")}
      className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-navy-200 bg-white text-navy-700 transition-all hover:bg-navy-50 hover:shadow-md"
    >
      {dir === "prev" ? (
        <ChevronLeft className="size-4" />
      ) : (
        <ChevronRight className="size-4" />
      )}
    </button>
  );
}
