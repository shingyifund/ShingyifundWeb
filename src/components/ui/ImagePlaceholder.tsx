import Image from "next/image";
import { cn } from "@/lib/utils";
import { Wheat } from "lucide-react";

/**
 * 圖片佔位元件。
 * - 傳入 src 時顯示真實圖片（next/image）。
 * - src 為 null 時顯示品牌色塊，標示「圖片待補」，視覺上仍成立。
 */
export function ImagePlaceholder({
  src,
  alt,
  tone = "navy",
  label,
  className,
  imgClassName,
  priority,
  sizes,
}: {
  src?: string | null;
  alt: string;
  tone?: "navy" | "amber" | "mist";
  label?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes ?? "100vw"}
          className={cn("object-cover", imgClassName)}
        />
      </div>
    );
  }

  const tones = {
    navy: "from-navy-700 via-navy-800 to-navy-900 text-navy-100/50",
    amber: "from-amber-400 via-amber-500 to-amber-600 text-amber-50/70",
    mist: "from-mist via-navy-50 to-cream text-navy-300/60",
  } as const;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        tones[tone],
        className,
      )}
      role="img"
      aria-label={alt}
    >
      {/* 麥穗紋理 */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
        <div className="absolute -right-6 -top-6 size-40 rounded-full border-[14px] border-current" />
        <div className="absolute -bottom-10 -left-8 size-52 rounded-full border-[14px] border-current" />
      </div>
      <div className="relative flex flex-col items-center gap-2">
        <Wheat className="size-10" strokeWidth={1.5} />
        {label && <span className="text-xs font-medium tracking-wide">{label}</span>}
      </div>
    </div>
  );
}
