import type { HeroSlide } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Play } from "lucide-react";

export function HeroStaticSlide({ slide }: { slide: HeroSlide }) {
  return (
    <section className="pt-4 pb-14 sm:pb-16">
      <h1 className="sr-only">
        財團法人興毅社會福利慈善事業基金會 — 讓愛延續，讓需要被看見
      </h1>
      <div className="container-x">
        <div className="overflow-hidden rounded-2xl">
          <div className="relative w-full aspect-video">
            {slide.content_type === "image" && <StaticImageSlide slide={slide} />}
            {slide.content_type === "image_text" && <StaticImageTextSlide slide={slide} />}
            {slide.content_type === "youtube" && <StaticYoutubeSlide slide={slide} />}
          </div>
        </div>
      </div>
    </section>
  );
}

function StaticImageSlide({ slide }: { slide: HeroSlide }) {
  return (
    <>
      <ImagePlaceholder
        src={slide.image_url}
        alt=""
        tone="mist"
        label="主視覺圖片"
        priority
        sizes="100vw"
        className="absolute inset-0 size-full"
      />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/20 to-transparent" />
    </>
  );
}

function StaticImageTextSlide({ slide }: { slide: HeroSlide }) {
  return (
    <>
      <ImagePlaceholder
        src={slide.image_url}
        alt={slide.title ?? ""}
        tone={slide.tone === "amber" ? "navy" : "mist"}
        label="主視覺圖片"
        priority
        sizes="100vw"
        className="absolute inset-0 size-full"
      />
      <div className="absolute inset-0 bg-linear-to-r from-cream via-cream/85 to-cream/10 md:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-cream to-transparent" />

      <div className="container-x relative flex h-full items-center pb-8">
        <div className="max-w-xl">
          {slide.has_title && slide.title && (
            <p className="mt-5 font-serif text-4xl font-black leading-[1.15] text-navy-900 sm:text-5xl lg:text-6xl">
              <HeroTitle text={slide.title} />
            </p>
          )}
          {slide.has_subtitle && slide.subtitle && (
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg">
              {slide.subtitle}
            </p>
          )}
          {slide.has_cta && slide.cta_href && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href={slide.cta_href} size="lg" variant="white">
                {slide.cta_label ?? "了解服務"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function StaticYoutubeSlide({ slide }: { slide: HeroSlide }) {
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
          label="影片封面"
          priority
          sizes="100vw"
          className="absolute inset-0 size-full"
        />
      )}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/60 to-transparent" />

      {slide.youtube_url && (
        <a
          href={slide.youtube_url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center"
          aria-label="在 YouTube 觀看影片"
        >
          <span className="flex size-20 items-center justify-center rounded-full bg-white/90 text-red-600 shadow-lg transition hover:scale-105 hover:bg-white">
            <Play className="size-8 translate-x-0.5 fill-current" />
          </span>
        </a>
      )}

      {(slide.has_title || slide.has_subtitle) && (
        <div className="container-x absolute inset-x-0 bottom-12 z-10">
          <div className="max-w-xl">
            {slide.has_title && slide.title && (
              <p className="font-serif text-3xl font-black leading-tight text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
                {slide.title}
              </p>
            )}
            {slide.has_subtitle && slide.subtitle && (
              <p className="mt-3 max-w-md text-base leading-relaxed text-white/90 drop-shadow sm:text-lg">
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
