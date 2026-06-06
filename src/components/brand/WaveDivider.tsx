import { cn } from "@/lib/utils";

/** 曲線波浪分隔 — 呼應 logo 麥穗的柔和弧線，銜接上下區塊 */
export function WaveDivider({
  className,
  fill = "var(--color-cream)",
  flip = false,
}: {
  className?: string;
  fill?: string;
  flip?: boolean;
}) {
  return (
    <div
      className={cn("pointer-events-none w-full leading-[0]", className)}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={cn("h-[60px] w-full sm:h-[90px]", flip && "rotate-180")}
      >
        <path
          d="M0,64 C240,112 480,16 720,40 C960,64 1200,128 1440,72 L1440,120 L0,120 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
