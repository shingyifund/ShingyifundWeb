import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getReliefConfig } from "@/config/relief";

export async function ReliefDownloads() {
  const { downloads } = await getReliefConfig();

  return (
    <section id="relief-downloads" className="scroll-mt-24 bg-mist/60 py-20">
      <Container>
        <SectionHeading
          align="center"
          eyebrow={downloads.eyebrow}
          title={downloads.title}
          className="mb-12"
        />

        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          {downloads.items.map((doc, i) => (
            <Reveal key={doc.title} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
                  <FileText className="size-5" strokeWidth={1.5} />
                </span>

                <h3 className="mt-4 font-serif text-lg font-bold text-navy-900">
                  {doc.title}
                </h3>
                <p className="mt-2 grow text-sm leading-relaxed text-ink-soft">
                  {doc.description}
                </p>

                <div className="mt-5">
                  {doc.href ? (
                    <Button
                      href={doc.href}
                      size="sm"
                      variant="secondary"
                      download={doc.fileName}
                    >
                      <Download className="size-4" />
                      {downloads.downloadLabel}
                    </Button>
                  ) : (
                    <Button size="sm" variant="white" disabled>
                      <Download className="size-4" />
                      {downloads.pendingLabel}
                    </Button>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
