import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { aboutConfig } from "@/config/about";

export function Milestones() {
  const { milestones } = aboutConfig;

  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="一路走來"
          title="興毅大事紀"
          description="從一念慈悲到遍地開花，每一步都是為了讓需要的人被看見。"
          className="mb-14"
        />

        <ol className="relative mx-auto max-w-2xl pl-12">
          {/* 時間軸主線（中心在容器左側 12px 處） */}
          <span
            className="absolute left-3 top-4 h-[calc(100%-2rem)] w-0.5 -translate-x-1/2 bg-gradient-to-b from-amber-400 via-navy-200 to-transparent"
            aria-hidden
          />

          {milestones.map((m, i) => (
            <Reveal key={m.year} delay={i * 0.1} className="mb-8 block last:mb-0">
              <li className="relative">
                {/* 節點圓點（圓心對齊主線：容器 12px、li 左邊界在 48px，故 -36px） */}
                <span
                  className="absolute top-4 left-[-36px] size-4 -translate-x-1/2 rounded-full border-4 border-cream bg-amber-500 shadow-sm"
                  aria-hidden
                />
                <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
                  <span className="inline-block rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700">
                    {m.year}
                  </span>
                  <h3 className="mt-3 font-serif text-lg font-bold text-navy-900">
                    {m.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {m.description}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
