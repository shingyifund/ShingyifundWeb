import { Badge } from "@/components/ui/badge";
import type { HeroSlideRecord } from "../actions";
import { HeroRowActions } from "./hero-row-actions";

const TYPE_LABELS: Record<string, string> = {
  image: "圖片",
  image_text: "圖文",
  youtube: "YouTube",
};

export function HeroTable({ slides }: { slides: HeroSlideRecord[] }) {
  if (slides.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-white px-6 py-16 text-center">
        <p className="text-sm font-medium text-foreground">目前沒有 Hero slide</p>
        <p className="mt-1 text-sm text-muted-foreground">
          建立第一張 slide 後，首頁輪播就會從這裡維護。
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="divide-y">
        {slides.map((slide, index) => {
          const thumbSrc =
            slide.image_url ??
            (slide.youtube_video_id
              ? `https://img.youtube.com/vi/${slide.youtube_video_id}/hqdefault.jpg`
              : null);

          return (
            <div
              key={slide.id}
              className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-4"
            >
              {/* 縮圖 + 內容：維持橫排 */}
              <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
              {/* 縮圖：固定寬度，16:9 */}
              <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-md bg-muted sm:w-36">
                {thumbSrc && (
                  <img
                    src={thumbSrc}
                    alt=""
                    className="absolute inset-0 size-full object-cover"
                  />
                )}
              </div>

              {/* 內容：彈性填滿 */}
              <div className="min-w-0 flex-1">
                {slide.has_title && slide.title ? (
                  <p className="truncate font-medium text-foreground">{slide.title}</p>
                ) : (
                  <p className="text-sm italic text-muted-foreground">（無標題）</p>
                )}
                {slide.has_subtitle && slide.subtitle && (
                  <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                    {slide.subtitle}
                  </p>
                )}
                {slide.content_type === "youtube" && slide.youtube_video_id && (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    ID: {slide.youtube_video_id}
                  </p>
                )}
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <Badge variant="outline">
                    {TYPE_LABELS[slide.content_type] ?? slide.content_type}
                  </Badge>
                  <Badge variant={slide.is_active ? "default" : "secondary"}>
                    {slide.is_active ? "顯示中" : "已停用"}
                  </Badge>
                </div>
              </div>
              </div>

              {/* 操作列：手機掉到第二列靠右，桌機也靠右 */}
              <div className="flex shrink-0 justify-end sm:ml-auto">
                <HeroRowActions
                  id={slide.id}
                  imageUrl={slide.image_url}
                  title={slide.title ?? slide.content_type}
                  isActive={slide.is_active}
                  isFirst={index === 0}
                  isLast={index === slides.length - 1}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
