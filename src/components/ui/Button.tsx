import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "white";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  // 暖琥珀主按鈕
  primary:
    "bg-amber-500 text-navy-900 shadow-[0_10px_28px_-10px_rgb(245_166_35_/_0.7)] hover:bg-amber-400 hover:shadow-[0_14px_34px_-10px_rgb(245_166_35_/_0.8)] hover:-translate-y-0.5",
  // 深藍實心
  secondary:
    "bg-navy-700 text-white shadow-[0_10px_28px_-12px_rgb(15_38_71_/_0.6)] hover:bg-navy-600 hover:-translate-y-0.5",
  // 白底描邊
  white:
    "bg-white/90 text-navy-700 ring-1 ring-navy-200 backdrop-blur hover:bg-white hover:ring-navy-300 hover:-translate-y-0.5",
  // 透明
  ghost: "text-navy-700 hover:bg-navy-50",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[15px]",
  lg: "h-13 px-8 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & { href: string } & React.ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </Link>
  );
}
