import { Store, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getFoodbankConfig } from "@/config/foodbank";

export async function FoodbankPickup() {
  const { pickup } = await getFoodbankConfig();

  return (
    <section className="bg-mist/60 py-20">
      <Container>
        <SectionHeading
          align="center"
          eyebrow={pickup.eyebrow}
          title={pickup.title}
          className="mb-12"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* 親自領取 */}
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
                  <Store className="size-5" strokeWidth={1.5} />
                </span>
                <h3 className="font-serif text-xl font-bold text-navy-900">
                  {pickup.main.title}
                </h3>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-ink-soft">
                {pickup.main.description}
              </p>
            </div>
          </Reveal>

          {/* 代領 */}
          <Reveal delay={0.08}>
            <div className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Users className="size-5" strokeWidth={1.5} />
                </span>
                <h3 className="font-serif text-xl font-bold text-navy-900">
                  {pickup.proxy.title}
                </h3>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-ink-soft">
                {pickup.proxy.description}
              </p>
              <ol className="mt-4 space-y-3">
                {pickup.proxy.items.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-50 font-serif text-xs font-bold text-amber-700">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-ink-soft">
                      {item}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-ink-muted">
            {pickup.footnote}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
