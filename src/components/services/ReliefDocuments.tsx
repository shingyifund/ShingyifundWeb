import { FileCheck2, FileText } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { reliefConfig } from "@/config/relief";

export function ReliefDocuments() {
  const { documents } = reliefConfig;

  const groups = [
    { ...documents.basic, icon: FileText, tone: "navy" as const },
    { ...documents.conditional, icon: FileCheck2, tone: "amber" as const },
  ];

  return (
    <section className="bg-mist/60 py-20">
      <Container>
        <SectionHeading
          align="center"
          eyebrow={documents.eyebrow}
          title={documents.title}
          className="mb-12"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {groups.map((group, gi) => {
            const Icon = group.icon;
            const isNavy = group.tone === "navy";
            return (
              <Reveal key={group.title} delay={gi * 0.08}>
                <div className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        isNavy
                          ? "inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-600"
                          : "inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600"
                      }
                    >
                      <Icon className="size-5" strokeWidth={1.5} />
                    </span>
                    <h3 className="font-serif text-xl font-bold text-navy-900">
                      {group.title}
                    </h3>
                  </div>

                  <ol className="mt-5 space-y-3">
                    {group.items.map((item, i) => (
                      <li key={i} className="flex gap-3">
                        <span
                          className={
                            isNavy
                              ? "inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-navy-50 font-serif text-xs font-bold text-navy-700"
                              : "inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-50 font-serif text-xs font-bold text-amber-700"
                          }
                        >
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
            );
          })}
        </div>

        <Reveal delay={0.12}>
          <p className="mt-6 text-center text-sm leading-relaxed text-ink-muted">
            {documents.footnote}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
