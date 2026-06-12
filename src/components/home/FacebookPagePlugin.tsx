import { siteConfig } from "@/config/site";

/**
 * Facebook 官方 Page Plugin（iframe 版，不需載入 FB SDK）。
 * 樣式受 FB 限制，僅能調整寬高與顯示選項。
 */
export function FacebookPagePlugin({
  width = 500,
  height = 600,
  tabs = "timeline",
  showCover = true,
}: {
  width?: number;
  height?: number;
  tabs?: "timeline" | "events" | "messages";
  showCover?: boolean;
}) {
  const pageUrl = encodeURIComponent(siteConfig.social.facebook);
  const src =
    `https://www.facebook.com/plugins/page.php?href=${pageUrl}` +
    `&tabs=${tabs}` +
    `&width=${width}` +
    `&height=${height}` +
    `&small_header=false` +
    `&adapt_container_width=true` +
    `&hide_cover=${showCover ? "false" : "true"}` +
    `&show_facepile=true`;

  return (
    <div className="mx-auto w-full max-w-[500px] overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
      <iframe
        title="興毅慈善基金會 Facebook 粉絲專頁"
        src={src}
        width={width}
        height={height}
        style={{ border: "none", overflow: "hidden", width: "100%" }}
        scrolling="no"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        loading="lazy"
      />
    </div>
  );
}
