import Link from "next/link";
import { ArrowRight, HandHeart, ShoppingBasket, Package, Truck, MapPin, HeartHandshake, Soup, Home } from "lucide-react";
import { getServiceFeatures } from "@/lib/data/queries";
import type { ServiceFeature } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const ICONS = {
  relief: HandHeart,
  foodbank: ShoppingBasket,
} as const;

const BULLET_ICONS = [HeartHandshake, Soup, Home, Package, Truck, MapPin];

export async function FeatureCards() {
  const features = await getServiceFeatures();

  return (
    <section className="relative -mt-10 pb-8">
      <Container>
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((f, i) => (
            <Reveal key={f.id} delay={i * 0.1}>
              <FeatureCard feature={f} accent={i === 0 ? "amber" : "navy"} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FeatureCard({
  feature,
  accent,
}: {
  feature: ServiceFeature;
  accent: "amber" | "navy";
}) {
  const Icon = ICONS[feature.icon];
  const isAmber = accent === "amber";

  return (
    <Link
      href={feature.href}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft sm:p-8",
        isAmber ? "border-amber-100" : "border-navy-100",
      )}
    >
      {/* 角落暈光 */}
      <div
        className={cn(
          "pointer-events-none absolute -right-16 -top-16 size-44 rounded-full opacity-60 blur-2xl transition-opacity group-hover:opacity-100",
          isAmber ? "bg-amber-100" : "bg-navy-100",
        )}
      />

      <div className="relative flex items-center gap-4">
        <span
          className={cn(
            "inline-flex size-14 items-center justify-center rounded-2xl text-white shadow-md",
            isAmber ? "bg-amber-500" : "bg-navy-700",
          )}
        >
          <Icon className="size-7" strokeWidth={1.75} />
        </span>
        <h3 className="font-serif text-2xl font-bold text-navy-900">{feature.title}</h3>
      </div>

      <p className="relative mt-5 text-[15px] leading-relaxed text-ink-soft">
        {feature.description}
      </p>

      <ul className="relative mt-6 flex flex-wrap gap-2">
        {feature.bullets.map((b, i) => {
          const BIcon = BULLET_ICONS[(isAmber ? 0 : 3) + i] ?? Package;
          return (
            <li
              key={b}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium",
                isAmber ? "bg-amber-50 text-amber-700" : "bg-navy-50 text-navy-700",
              )}
            >
              <BIcon className="size-4" />
              {b}
            </li>
          );
        })}
      </ul>

      <span
        className={cn(
          "relative mt-7 inline-flex items-center gap-1.5 text-sm font-semibold",
          isAmber ? "text-amber-600" : "text-navy-700",
        )}
      >
        了解更多
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
