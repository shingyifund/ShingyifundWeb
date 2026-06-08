import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FacebookIcon } from "@/components/brand/SocialIcons";
import { getFacebookPosts } from "@/lib/data/queries";
import type { FacebookPost } from "@/lib/types";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { cn } from "@/lib/utils";

const CATEGORY_STYLE: Record<FacebookPost["category"], string> = {
  新聞: "bg-navy-100 text-navy-700",
  報導: "bg-amber-100 text-amber-700",
  故事: "bg-amber-200 text-amber-800",
  活動: "bg-navy-200 text-navy-800",
};

export async function FacebookFeed() {
  const posts = await getFacebookPosts();

  return (
    <section className="bg-mist/60 py-16">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="最新動態"
            title="粉專最新消息"
            description="追蹤興毅 Facebook，第一時間看見每一份愛心的流動。"
          />
          <Link
            href={siteConfig.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#1877F2] px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <FacebookIcon className="size-4" />
            前往粉絲專頁
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.08}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function PostCard({ post }: { post: FacebookPost }) {
  const date = new Date(post.postedAt).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <Link
      href={post.href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft active:scale-[0.99]"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <ImagePlaceholder
          src={post.image}
          alt={post.title}
          tone={post.category === "報導" || post.category === "活動" ? "amber" : "navy"}
          label="貼文圖片"
          sizes="(max-width: 640px) 100vw, 25vw"
          className="absolute inset-0 size-full"
          imgClassName="transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold",
            CATEGORY_STYLE[post.category],
          )}
        >
          {post.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <time className="text-xs text-ink-muted">{date}</time>
        <h3 className="mt-2 line-clamp-2 font-semibold text-navy-900 transition-colors group-hover:text-navy-700">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-soft">
          {post.excerpt}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-amber-600">
          閱讀更多
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
