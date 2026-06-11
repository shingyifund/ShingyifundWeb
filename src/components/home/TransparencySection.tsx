import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  ClipboardCheck,
  FileBarChart,
  HeartHandshake,
  PackageOpen,
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
  monthlyDonations: PackageOpen,
  financial: FileBarChart,
  fundraising: ClipboardCheck,
};

/** 每類文件的色系（建立卡片間的層次與識別，避免一致到單調） */
const ACCENTS: Record<
  TransparencyDoc["icon"],
  { iconBg: string; iconText: string; hoverIcon: string; glow: string }
> = {
  sustainability: {
    iconBg: "bg-amber-50",
    iconText: "text-amber-700",
    hoverIcon: "group-hover:bg-amber-600",
    glow: "bg-amber-500/10",
  },
  donors: {
    iconBg: "bg-amber-100",
    iconText: "text-amber-800",
    hoverIcon: "group-hover:bg-amber-700",
    glow: "bg-amber-600/10",
  },
  recipients: {
    iconBg: "bg-navy-50",
    iconText: "text-navy-600",
    hoverIcon: "group-hover:bg-navy-700",
    glow: "bg-navy-600/10",
  },
  monthlyDonations: {
    iconBg: "bg-amber-50",
    iconText: "text-amber-700",
    hoverIcon: "group-hover:bg-amber-600",
    glow: "bg-amber-500/10",
  },
  financial: {
    iconBg: "bg-navy-100",
    iconText: "text-navy-700",
    hoverIcon: "group-hover:bg-navy-800",
    glow: "bg-navy-700/10",
  },
  fundraising: {
    iconBg: "bg-amber-50",
    iconText: "text-amber-600",
    hoverIcon: "group-hover:bg-amber-500",
    glow: "bg-amber-400/10",
  },
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

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {docs.map((doc, i) => (
            <Reveal key={doc.id} delay={i * 0.07}>
              <DocCard doc={doc} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function DocCard({ doc }: { doc: TransparencyDoc }) {
  const Icon = ICONS[doc.icon];
  const a = ACCENTS[doc.icon];

  return (
    <Link
      href={doc.href}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white px-5 pb-6 pt-7 text-center shadow-card transition-all duration-300",
        "hover:-translate-y-1.5 hover:border-navy-200 hover:shadow-soft active:scale-[0.99]",
      )}
    >
      {/* hover 光暈 */}
      <span
        className={cn(
          "pointer-events-none absolute -top-10 left-1/2 size-32 -translate-x-1/2 rounded-full opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100",
          a.glow,
        )}
        style={{ willChange: "opacity" }}
      />

      {/* icon */}
      <span
        className={cn(
          "relative mx-auto inline-flex size-16 items-center justify-center rounded-2xl transition-colors duration-300 group-hover:text-white",
          a.iconBg,
          a.iconText,
          a.hoverIcon,
        )}
      >
        <Icon className="size-8" strokeWidth={1.5} />
      </span>

      <h3 className="relative mt-4 font-serif text-base font-bold text-navy-900">
        {doc.title}
      </h3>
      <p className="relative mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
        {doc.description}
      </p>

      {/* 查看詳情（hover 時箭頭浮現） */}
      <span className="relative mt-5 inline-flex items-center justify-center gap-1 text-xs font-semibold text-navy-500 transition-colors group-hover:text-navy-800">
        查看詳情
        <ArrowUpRight className="size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
      </span>
    </Link>
  );
}
