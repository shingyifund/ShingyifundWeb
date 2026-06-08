import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PageHero({
  image,
  imageAlt = "",
  imagePosition = "center",
  eyebrow,
  title,
  align = "center",
  overlay = "center",
  children,
}: {
  image: string;
  imageAlt?: string;
  imagePosition?: "center" | "right";
  eyebrow?: string;
  title: string;
  align?: "left" | "center";
  /** center = 全覆蓋半透明；gradient = 左濃右透漸層 */
  overlay?: "center" | "gradient";
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-20 text-white sm:py-28">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className={cn(
          "pointer-events-none object-cover opacity-95",
          imagePosition === "right" ? "object-right" : "object-center",
        )}
      />

      {overlay === "gradient" ? (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/55 to-transparent" />
      ) : (
        <div className="pointer-events-none absolute inset-0 bg-navy-900/60" />
      )}

      {/* 裝飾光暈 */}
      <div
        className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-navy-600/40 blur-2xl"
        style={{ transform: "translateZ(0)" }}
      />
      {/* 細格紋 */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.06)_1px,transparent_0)] bg-size-[28px_28px]" />

      <Container className={cn("relative", align === "center" && "text-center")}>
        {eyebrow && (
          <p className="font-serif text-sm font-medium uppercase tracking-[0.3em] text-amber-300">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-4 font-serif text-4xl font-black tracking-wide sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {children}
      </Container>
    </section>
  );
}
