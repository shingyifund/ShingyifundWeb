import { Camera, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getReliefConfig } from "@/config/relief";

/**
 * 訪視影像紀錄與個資保密 — 兩段皆為權益告知性質，
 * 併為同一區塊，避免頁面被過多同構的條列區塊拉長。
 */
export async function ReliefTerms() {
  const { visit, privacy } = await getReliefConfig();

  return (
    <section className="bg-white py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          {/* 訪視與居住環境影像紀錄 */}
          <Reveal>
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
                  <Camera className="size-5" strokeWidth={1.5} />
                </span>
                <SectionHeading eyebrow={visit.eyebrow} title={visit.title} />
              </div>

              <ul className="mt-6 space-y-3.5">
                {visit.items.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500"
                      aria-hidden
                    />
                    <p className="text-sm leading-relaxed text-ink-soft">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>

              <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium leading-relaxed text-amber-900">
                {visit.highlight}
              </p>
            </div>
          </Reveal>

          {/* 個人資料與保密說明 */}
          <Reveal delay={0.08}>
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
                  <ShieldCheck className="size-5" strokeWidth={1.5} />
                </span>
                <SectionHeading
                  eyebrow={privacy.eyebrow}
                  title={privacy.title}
                />
              </div>

              <ul className="mt-6 space-y-3.5">
                {privacy.items.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-navy-400"
                      aria-hidden
                    />
                    <p className="text-sm leading-relaxed text-ink-soft">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
