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
            <TableHead className="w-[88px]">預覽</TableHead>
            <TableHead>內容</TableHead>
            <TableHead className="w-[120px]">色調</TableHead>
            <TableHead className="w-[120px]">狀態</TableHead>
            <TableHead className="w-[220px] text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {slides.map((slide, index) => (
            <TableRow key={slide.id}>
              <TableCell>
                <div className="relative aspect-video w-20 overflow-hidden rounded-md bg-muted">
                  {slide.image ? (
                    <img
                      src={slide.image}
                      alt=""
                      className="absolute inset-0 size-full object-cover"
                    />
                  ) : null}
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-xl">
                  <p className="font-medium text-foreground">{slide.title}</p>
                  {slide.subtitle && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.cta_label && slide.cta_href && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {slide.cta_label} {"->"} {slide.cta_href}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {slide.tone === "amber" ? "琥珀" : "深藍"}
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
                  imageUrl={slide.image}
                  title={slide.title}
                  isActive={slide.is_active}
                  isFirst={index === 0}
                  isLast={index === slides.length - 1}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
