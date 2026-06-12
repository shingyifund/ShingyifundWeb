import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { getFeaturedVideo } from "@/lib/data/queries";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

export async function VideoShowcase() {
  const video = await getFeaturedVideo();
  const thumb = video.youtubeId
    ? `https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg`
    : (video.poster ?? null);
  const watchHref = video.youtubeId
    ? `https://www.youtube.com/watch?v=${video.youtubeId}`
    : video.href;

  return (
    <section className="py-8 sm:py-10">
      <Container>
        <Reveal>
          <div className="grid overflow-hidden rounded-3xl shadow-soft lg:grid-cols-[1.15fr_1fr]">
            {/* 影片 */}
            <Link
              href={watchHref}
              target={video.youtubeId ? "_blank" : undefined}
              rel={video.youtubeId ? "noopener noreferrer" : undefined}
              className="group relative block aspect-video lg:aspect-auto"
            >
              <ImagePlaceholder
                src={thumb}
                alt={video.title}
                tone="navy"
                label="影片縮圖"
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="absolute inset-0 size-full"
              />
              <div className="absolute inset-0 bg-navy-950/20 transition-colors group-hover:bg-navy-950/10" />
              <span className="absolute left-1/2 top-1/2 flex size-18 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-700 shadow-lg transition-transform group-hover:scale-110">
                <Play className="ml-1 size-8 fill-current" />
              </span>
            </Link>

            {/* 文案 */}
            <div className="relative flex flex-col justify-center bg-navy-700 p-8 text-white sm:p-10">
              <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-amber-500/15 blur-xl" style={{ transform: "translateZ(0)" }} />
              <span className="text-sm font-medium tracking-wide text-amber-300">
                影音專區
              </span>
              <h2 className="mt-3 font-serif text-3xl font-bold leading-snug sm:text-4xl">
                {video.title}
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-navy-100/80">
                {video.description}
              </p>
              <Link
                href={video.href}
                className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-[15px] font-medium text-navy-900 transition-all hover:-translate-y-0.5 hover:bg-amber-400"
              >
                觀看更多影片
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
