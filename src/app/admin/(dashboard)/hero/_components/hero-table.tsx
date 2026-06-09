import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-22">預覽</TableHead>
            <TableHead>內容</TableHead>
            <TableHead className="w-25">型態</TableHead>
            <TableHead className="w-25">狀態</TableHead>
            <TableHead className="w-55 text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {slides.map((slide, index) => {
            const thumbSrc =
              slide.image_url ??
              (slide.youtube_video_id
                ? `https://img.youtube.com/vi/${slide.youtube_video_id}/hqdefault.jpg`
                : null);

            return (
              <TableRow key={slide.id}>
                <TableCell>
                  <div className="relative aspect-video w-20 overflow-hidden rounded-md bg-muted">
                    {thumbSrc && (
                      <img
                        src={thumbSrc}
                        alt=""
                        className="absolute inset-0 size-full object-cover"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {TYPE_LABELS[slide.content_type] ?? slide.content_type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={slide.is_active ? "default" : "secondary"}>
                    {slide.is_active ? "顯示中" : "已停用"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <HeroRowActions
                    id={slide.id}
                    imageUrl={slide.image_url}
                    title={slide.title ?? slide.content_type}
                    isActive={slide.is_active}
                    isFirst={index === 0}
                    isLast={index === slides.length - 1}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
