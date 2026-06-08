import {
  BookOpen,
  CloudRain,
  GraduationCap,
  HandHeart,
  Handshake,
  LifeBuoy,
  Sparkles,
  Stethoscope,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { aboutConfig, type ServiceScope } from "@/config/about";
import { cn } from "@/lib/utils";

const ICONS: Record<ServiceScope["icon"], LucideIcon> = {
  stethoscope: Stethoscope,
  lifeBuoy: LifeBuoy,
  cloudRain: CloudRain,
  graduation: GraduationCap,
  elderly: HandHeart,
  handshake: Handshake,
  userCheck: UserCheck,
  bookOpen: BookOpen,
  sparkles: Sparkles,
};

/** 依服務性質分三色系，建立視覺層次（救助=藍、關懷=橘、培育=綠） */
type Accent = { iconBg: string; iconText: string; hoverIcon: string };
const ACCENTS: Record<ServiceScope["icon"], Accent> = {
  // 關懷類 — amber
  stethoscope: { iconBg: "bg-amber-50", iconText: "text-amber-600", hoverIcon: "group-hover:bg-amber-500" },
  elderly: { iconBg: "bg-amber-50", iconText: "text-amber-600", hoverIcon: "group-hover:bg-amber-500" },
  sparkles: { iconBg: "bg-amber-50", iconText: "text-amber-600", hoverIcon: "group-hover:bg-amber-500" },
  // 救助類 — navy
  lifeBuoy: { iconBg: "bg-navy-50", iconText: "text-navy-600", hoverIcon: "group-hover:bg-navy-700" },
  cloudRain: { iconBg: "bg-navy-50", iconText: "text-navy-600", hoverIcon: "group-hover:bg-navy-700" },
  handshake: { iconBg: "bg-navy-50", iconText: "text-navy-600", hoverIcon: "group-hover:bg-navy-700" },
  // 培育類 — amber
  graduation: { iconBg: "bg-amber-50", iconText: "text-amber-700", hoverIcon: "group-hover:bg-amber-600" },
  userCheck: { iconBg: "bg-amber-50", iconText: "text-amber-700", hoverIcon: "group-hover:bg-amber-600" },
  bookOpen: { iconBg: "bg-amber-50", iconText: "text-amber-700", hoverIcon: "group-hover:bg-amber-600" },
};

export function ServiceScopeSection() {
  const { services } = aboutConfig;

  return (
    <section className="bg-mist/60 py-20">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="服務範圍"
          title="多元服務，全面關懷"
          description={services.intro}
          className="mb-12"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((s, i) => {
            const Icon = ICONS[s.icon];
            const a = ACCENTS[s.icon];
            return (
              <Reveal key={s.title} delay={(i % 3) * 0.08}>
                <div className="group flex h-full items-start gap-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-navy-200 hover:shadow-soft">
                  <span
                    className={cn(
                      "inline-flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 group-hover:text-white",
                      a.iconBg,
                      a.iconText,
                      a.hoverIcon,
                    )}
                  >
                    <Icon
                      className="size-6 transition-transform duration-300 group-hover:scale-110"
                      strokeWidth={1.5}
                    />
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-navy-900">
                      {s.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                      {s.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
