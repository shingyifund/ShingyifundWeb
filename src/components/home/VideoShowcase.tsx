import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { FaYoutube } from "react-icons/fa6";
import { getYouTubeVideos } from "@/lib/data/queries";
import { getSiteConfig } from "@/config/site.server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import type { YouTubeVideo } from "@/lib/types";
import { getRequestLocale } from "@/i18n/request";
import { localeToIntl } from "@/i18n/config";
import { translate } from "@/i18n/translations";

function thumbUrl(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

function watchUrl(id: string) {
  return `https://www.youtube.com/watch?v=${id}`;
}

function formatDate(iso: string, locale: "tw" | "en") {
  return new Date(iso).toLocaleDateString(localeToIntl(locale), {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export async function VideoShowcase() {
  const locale = await getRequestLocale();
  const siteConfig = await getSiteConfig();
  const videos = await getYouTubeVideos(4);
  if (videos.length === 0) return null;

  const [featured, ...rest] = videos;

  return (
    <section className="py-4 sm:py-6">
      <Container>
        <Reveal>
          <div className="grid overflow-hidden rounded-3xl shadow-soft lg:grid-cols-[1.15fr_1fr]">
            {/* 精選最新影片 */}
            <Link
              href={watchUrl(featured.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-video lg:aspect-auto"
            >
              <Image
                src={thumbUrl(featured.id)}
                alt={featured.title}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-navy-950/20 transition-colors group-hover:bg-navy-950/10" />
              <span className="absolute left-1/2 top-1/2 flex size-18 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-700 shadow-lg transition-transform group-hover:scale-110">
                <Play className="ml-1 size-8 fill-current" />
              </span>
            </Link>

            {/* 文案 + 最新影片列表 */}
            <div className="relative flex flex-col justify-center bg-navy-700 p-8 text-white sm:p-10">
              <div
                className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-amber-500/15 blur-2xl"
                style={{ transform: "translateZ(0)" }}
              />
              <div className="relative">
                <span className="text-sm font-medium tracking-wide text-amber-300">
                  {translate(locale, "影音專區")}
                </span>
                <h2 className="mt-3 line-clamp-2 font-serif text-2xl font-bold leading-snug sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-2 text-sm text-navy-100/70">
                  {formatDate(featured.publishedAt, locale)}
                </p>

                {rest.length > 0 && (
                  <ul className="mt-6 space-y-3 border-t border-white/10 pt-6">
                    {rest.map((video) => (
                      <VideoRow key={video.id} video={video} locale={locale} />
                    ))}
                  </ul>
                )}

                <Link
                  href={siteConfig.social.youtube ?? watchUrl(featured.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-[15px] font-medium text-navy-900 transition-all hover:-translate-y-0.5 hover:bg-amber-400 active:translate-y-0"
                >
                  <FaYoutube className="size-5 text-[#FF0000]" />
                  {translate(locale, "前往 YouTube 頻道")}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function VideoRow({ video, locale }: { video: YouTubeVideo; locale: "tw" | "en" }) {
  return (
    <li>
      <Link
        href={watchUrl(video.id)}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 rounded-xl p-1.5 transition-colors hover:bg-white/5"
      >
        <span className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-lg bg-navy-900">
          <Image
            src={thumbUrl(video.id)}
            alt=""
            fill
            sizes="96px"
            className="object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-navy-950/25 opacity-0 transition-opacity group-hover:opacity-100">
            <Play className="size-4 fill-white text-white" />
          </span>
        </span>
        <div className="min-w-0">
          <p className="line-clamp-2 text-sm font-medium leading-snug text-white group-hover:text-amber-200">
            {video.title}
          </p>
          <p className="mt-0.5 text-xs text-navy-100/60">
            {formatDate(video.publishedAt, locale)}
          </p>
        </div>
      </Link>
    </li>
  );
}
