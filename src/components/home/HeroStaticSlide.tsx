import type { HeroSlide } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Play } from "lucide-react";
import { getRequestLocale } from "@/i18n/request";
import { translate } from "@/i18n/translations";
import type { Locale } from "@/i18n/config";

export async function HeroStaticSlide({ slide }: { slide: HeroSlide }) {
  const locale = await getRequestLocale();
  return (
    <section className="pt-4 pb-14 sm:pb-16">
      <h1 className="sr-only">
        {locale === "en" ? "Shing Yi Social Welfare and Charity Foundation" : "財團法人興毅社會福利慈善事業基金會 — 讓愛延續，讓需要被看見"}
      </h1>
      <div className="container-x">
        <div className="overflow-hidden rounded-2xl">
          <div className="relative aspect-video w-full lg:aspect-[16/7]">
            {slide.content_type === "image" && <StaticImageSlide slide={slide} locale={locale} />}
            {slide.content_type === "image_text" && <StaticImageTextSlide slide={slide} locale={locale} />}
            {slide.content_type === "youtube" && <StaticYoutubeSlide slide={slide} locale={locale} />}
          </div>
        </div>
      </div>
    </section>
  );
}

function StaticImageSlide({ slide, locale }: { slide: HeroSlide; locale: Locale }) {
  const inner = (
    <>
      <ImagePlaceholder
        src={slide.image_url}
        alt=""
        tone="mist"
        label={translate(locale, "主視覺圖片")}
        priority
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

function StaticImageTextSlide({ slide, locale }: { slide: HeroSlide; locale: Locale }) {
  return (
    <>
      <ImagePlaceholder
        src={slide.image_url}
        alt={slide.title ?? ""}
        tone={slide.tone === "amber" ? "navy" : "mist"}
        label={translate(locale, "主視覺圖片")}
        priority
        sizes="100vw"
        className="absolute inset-0 size-full"
      />
      <div className="absolute inset-0 bg-linear-to-r from-cream via-cream/85 to-cream/10 md:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-cream to-transparent" />

      <div className="container-x relative flex h-full items-center pb-8">
        <div className="max-w-xl">
          {slide.has_title && slide.title && (
            <p className="mt-4 line-clamp-2 max-w-[min(34rem,calc(100vw-3rem))] font-serif text-2xl font-black leading-[1.15] text-navy-900 sm:mt-5 sm:text-3xl lg:text-5xl">
              <HeroTitle text={slide.title} />
            </p>
          )}
          {slide.has_subtitle && slide.subtitle && (
            <p className="mt-3 max-w-md text-base leading-relaxed text-ink-soft sm:mt-5 sm:text-lg">
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

function StaticYoutubeSlide({ slide, locale }: { slide: HeroSlide; locale: Locale }) {
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
          priority
          sizes="100vw"
          className="absolute inset-0 size-full"
        />
      )}
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-black/85 via-black/45 to-transparent" />

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
        <div className="container-x absolute inset-x-0 bottom-5 z-10 sm:bottom-8">
          <div className="max-w-[min(30rem,calc(100vw-3rem))]">
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
