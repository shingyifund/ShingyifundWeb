import Link from "next/link";
import {
  BookOpen,
  ClipboardCheck,
  FileBarChart,
  HeartHandshake,
  Users,
  type LucideIcon,
} from "lucide-react";
import { getTransparencyDocs } from "@/lib/data/queries";
import type { TransparencyDoc } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const ICONS: Record<TransparencyDoc["icon"], LucideIcon> = {
  sustainability: BookOpen,
  donors: HeartHandshake,
  recipients: Users,
  financial: FileBarChart,
  fundraising: ClipboardCheck,
};

export async function TransparencySection() {
  const docs = await getTransparencyDocs();

  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="公開透明"
          title="永續與成果公開"
          description="財務、勸募、受贈名單全面公開，讓您的愛心走得安心、走得長遠。"
          className="mb-12"
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {docs.map((doc, i) => {
            const Icon = ICONS[doc.icon];
            return (
              <Reveal key={doc.id} delay={i * 0.07}>
                <Link
                  href={doc.href}
                  className={cn(
                    "group flex h-full flex-col items-center rounded-2xl border border-navy-100 bg-white px-5 py-7 text-center shadow-card transition-all duration-300",
                    "hover:-translate-y-1 hover:border-navy-300 hover:shadow-soft active:scale-[0.99]",
                  )}
                >
                  <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-navy-50 text-navy-600 transition-colors group-hover:bg-navy-700 group-hover:text-white">
                    <Icon className="size-8" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-4 font-serif text-base font-bold text-navy-900">
                    {doc.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                    {doc.description}
                  </p>
                  <span className="mt-5 inline-flex items-center rounded-md border border-navy-200 px-4 py-1.5 text-xs font-medium text-navy-600 transition-colors group-hover:border-navy-600 group-hover:bg-navy-700 group-hover:text-white">
                    查看詳情
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
