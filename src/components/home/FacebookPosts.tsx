import Link from "next/link";
import { FaFacebookF } from "react-icons/fa6";
import { siteConfig } from "@/config/site";
import type { FacebookPost } from "@/lib/types";

const dateFormatter = new Intl.DateTimeFormat("zh-TW", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

/**
 * 粉專最新貼文（伺服器端取資料，全平台可顯示）。
 * 以圖片導向的卡片網格呈現；無貼文（缺 token / 抓取失敗）時退回 CTA 卡片。
 */
export function FacebookPosts({ posts }: { posts: FacebookPost[] }) {
  if (posts.length === 0) return <FacebookFallbackCard />;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function PostCard({ post }: { post: FacebookPost }) {
  return (
    <Link
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgb(15_38_71/0.45)]"
    >
      {post.fullPicture && (
        <div className="aspect-[3/2] overflow-hidden bg-mist">
          {/* eslint-disable-next-line @next/next/no-img-element -- FB CDN 簽名網址，用原生 img 避免 next/image 代理與簽章過期問題 */}
          <img
            src={post.fullPicture}
            alt={`興毅基金會貼文：${post.message.slice(0, 30)}`}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <p className="line-clamp-4 whitespace-pre-line text-base leading-7 text-ink-soft">
          {post.message}
        </p>
        <div className="mt-auto flex items-center gap-1.5 pt-5 text-xs font-medium tracking-wide text-navy-400">
          <FaFacebookF className="size-3 text-[#1877F2]" />
          {dateFormatter.format(new Date(post.createdTime))}
        </div>
      </div>
    </Link>
  );
}

/**
 * 退回卡片：抓不到貼文時顯示，永遠可用，引導前往粉絲專頁。
 */
function FacebookFallbackCard() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-5 rounded-2xl bg-white px-8 py-12 text-center shadow-card">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-[#1877F2] text-white">
        <FaFacebookF className="size-8" />
      </span>
      <div>
        <p className="font-serif text-xl font-bold text-navy-900">
          {siteConfig.shortName} 粉絲專頁
        </p>
        <p className="mt-2 text-sm leading-relaxed text-navy-500">
          點擊下方按鈕，即可看見最新的愛心流動。
        </p>
      </div>
      <Link
        href={siteConfig.social.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-[#1877F2] px-6 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
      >
        <FaFacebookF className="size-4" />
        前往 Facebook 粉絲專頁
      </Link>
    </div>
  );
}
