import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { reliefConfig } from "@/config/relief";

/**
 * 審查與補助原則 — 用深色區塊做視覺分隔，
 * 讓「申請不等於獲補助」這類期待管理的內容有足夠份量。
 */
export function ReliefPrinciples() {
  const { principles } = reliefConfig;

  return (
    <section className="relative overflow-hidden bg-navy-900 py-20">
      {/* 裝飾光暈 */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-navy-600/40 blur-2xl"
        style={{ transform: "translateZ(0)" }}
      />
      {/* 細格紋 */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.06)_1px,transparent_0)] bg-size-[28px_28px]" />

      <Container className="relative">
        <SectionHeading
          align="center"
          invert
          eyebrow={principles.eyebrow}
          title={principles.title}
          className="mb-12"
        />

        <ul className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          {principles.items.map((item, i) => (
            <Reveal key={i} delay={(i % 2) * 0.08}>
              <li className="flex h-full gap-3 rounded-2xl border border-white/10 bg-white/5 p-5">
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                <p className="text-sm leading-relaxed text-navy-100/85">
                  {item}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
