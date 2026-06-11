import { Badge } from "@/components/ui/badge";
import {
  AdminDataList,
  AdminDataListRow,
} from "@/components/admin/admin-data-list";
import type { HeroSlideRecord } from "../actions";
import { HeroRowActions } from "./hero-row-actions";

const GRID_CLASS = "lg:grid-cols-[100px_minmax(0,1fr)_90px_100px_220px]";

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
    <AdminDataList
      columns={[
        { label: "預覽" },
        { label: "內容" },
        { label: "型態" },
        { label: "狀態" },
        { label: "操作", className: "text-right" },
      ]}
      gridClassName={GRID_CLASS}
      headerVisibleClassName="lg:grid"
    >
      {slides.map((slide, index) => {
        const thumbSrc =
          slide.image_url ??
          (slide.youtube_video_id
            ? `https://img.youtube.com/vi/${slide.youtube_video_id}/hqdefault.jpg`
            : null);

        return (
          <AdminDataListRow
            key={slide.id}
            gridClassName={GRID_CLASS}
            itemAlignClassName="lg:items-center"
          >
            <div className="relative aspect-video w-20 overflow-hidden rounded-md bg-muted">
              {thumbSrc && (
                <img
                  src={thumbSrc}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                />
              )}
            </div>
            <div className="min-w-0">
              <div className="max-w-xl">
                {slide.has_title && slide.title ? (
                  <p className="font-medium text-foreground">{slide.title}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">（無標題）</p>
                )}
                {slide.has_subtitle && slide.subtitle && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {slide.subtitle}
                  </p>
                )}
                {slide.has_cta && slide.cta_label && slide.cta_href && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {slide.cta_label} {"→"} {slide.cta_href}
                  </p>
                )}
                {slide.content_type === "youtube" && slide.youtube_video_id && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    ID: {slide.youtube_video_id}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Badge variant="outline">
                {TYPE_LABELS[slide.content_type] ?? slide.content_type}
              </Badge>
            </div>
            <div>
              <Badge variant={slide.is_active ? "default" : "secondary"}>
                {slide.is_active ? "顯示中" : "已停用"}
              </Badge>
            </div>
            <div>
              <HeroRowActions
                id={slide.id}
                imageUrl={slide.image_url}
                title={slide.title ?? slide.content_type}
                isActive={slide.is_active}
                isFirst={index === 0}
                isLast={index === slides.length - 1}
              />
            </div>
          </AdminDataListRow>
        );
      })}
    </AdminDataList>
  );
}
