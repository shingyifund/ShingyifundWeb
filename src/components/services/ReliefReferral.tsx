import {
  GraduationCap,
  Handshake,
  HeartHandshake,
  Landmark,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { reliefConfig, type ReferralOrg } from "@/config/relief";

const ICONS: Record<ReferralOrg["icon"], LucideIcon> = {
  government: Landmark,
  welfare: HeartHandshake,
  medical: Stethoscope,
  school: GraduationCap,
  other: Handshake,
};

export function ReliefReferral() {
  const { referral } = reliefConfig;

  return (
    <section className="bg-mist/60 py-20">
      <Container>
        <SectionHeading
          align="center"
          eyebrow={referral.eyebrow}
          title={referral.title}
          description={referral.description}
          className="mb-12"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {referral.orgs.map((org, i) => {
            const Icon = ICONS[org.icon];
            return (
              <Reveal key={org.title} delay={(i % 3) * 0.08}>
                <div className="group flex h-full items-center gap-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-navy-200 hover:shadow-soft">
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-600 transition-colors duration-300 group-hover:bg-navy-700 group-hover:text-white">
                    <Icon
                      className="size-6 transition-transform duration-300 group-hover:scale-110"
                      strokeWidth={1.5}
                    />
                  </span>
                  <h3 className="font-serif text-lg font-bold text-navy-900">
                    {org.title}
                  </h3>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* 轉介單位送件須知 */}
        <Reveal delay={0.1}>
          <div className="mt-8 rounded-2xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
            <h3 className="font-serif text-lg font-bold text-navy-900">
              轉介單位送件須知
            </h3>
            <ol className="mt-4 space-y-4">
              {referral.steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-100 font-serif text-sm font-bold text-amber-800">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-ink-soft sm:text-base">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
