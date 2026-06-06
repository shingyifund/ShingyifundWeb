import Link from "next/link";
import {
  ArrowRight,
  FileBarChart,
  HeartHandshake,
  ScrollText,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { getTransparencyDocs } from "@/lib/data/queries";
import type { TransparencyDoc } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const ICONS: Record<TransparencyDoc["icon"], LucideIcon> = {
  report: ScrollText,
  financial: Wallet,
  fundraising: FileBarChart,
  donors: HeartHandshake,
  recipients: Users,
};

export async function TransparencySection() {
  const docs = await getTransparencyDocs();

  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="公開透明"
          title="每一分善款，都看得見"
          description="財務、勸募、受贈名單全面公開，讓您的愛心走得安心、走得長遠。"
          className="mb-12"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {docs.map((doc, i) => {
            const Icon = ICONS[doc.icon];
            return (
              <Reveal key={doc.id} delay={i * 0.08}>
                <Link
                  href={doc.href}
                  className="group flex h-full flex-col items-start rounded-2xl border border-navy-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-soft"
                >
                  <span className="inline-flex size-12 items-center justify-center rounded-xl bg-navy-50 text-navy-700 transition-colors group-hover:bg-amber-500 group-hover:text-white">
                    <Icon className="size-6" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-4 font-serif text-lg font-bold text-navy-900">
                    {doc.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                    {doc.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-amber-600">
                    查看明細
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
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
