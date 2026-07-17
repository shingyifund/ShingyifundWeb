import Link from "next/link";
import {
  ArrowRight,
  HandHeart,
  HeartHandshake,
  PackageOpen,
  PackageSearch,
  ShoppingBasket,
  Users,
  type LucideIcon,
} from "lucide-react";
import { getServiceFeatures } from "@/lib/data/queries";
import type { ServiceBulletIcon, ServiceFeature } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { cn } from "@/lib/utils";

const BADGE_ICONS: Record<ServiceFeature["icon"], LucideIcon> = {
  relief: HandHeart,
  foodbank: ShoppingBasket,
};

const BULLET_ICONS: Record<ServiceBulletIcon, LucideIcon> = {
  handHeart: HandHeart,
  lifeKit: PackageOpen,
  visit: Users,
  collect: ShoppingBasket,
  sort: PackageSearch,
  distribute: HeartHandshake,
};

export async function FeatureCards() {
  const features = await getServiceFeatures();

  return (
    <section className="relative pt-1 pb-6 sm:pt-2 sm:pb-7">
      <Container>
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((f, i) => (
            <Reveal key={f.id} delay={i * 0.1}>
              <FeatureCard feature={f} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FeatureCard({ feature }: { feature: ServiceFeature }) {
  const Badge = BADGE_ICONS[feature.icon];
  const isAmber = feature.accent === "amber";

  const accent = {
    badge: isAmber ? "bg-amber-500" : "bg-navy-700",
    text: isAmber ? "text-amber-600" : "text-navy-700",
    bullet: isAmber ? "text-amber-500" : "text-navy-600",
    border: isAmber ? "border-amber-300" : "border-navy-300",
    surface: isAmber
      ? "from-white to-amber-50/70 border-amber-100"
      : "from-white to-navy-50/70 border-navy-100",
    btnHover: isAmber
      ? "hover:bg-amber-500 hover:text-white"
      : "hover:bg-navy-700 hover:text-white",
  };

  return (
    <Link
      href={feature.href}
      className="group block h-full overflow-hidden rounded-[1.75rem] shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft active:scale-[0.99]"
    >
      {/* 照片 */}
      <div className="relative h-44 overflow-hidden sm:h-52">
        <ImagePlaceholder
          src={feature.image}
          alt={feature.title}
          tone={isAmber ? "amber" : "navy"}
          label="示意圖片"
          sizes="(max-width: 768px) 100vw, 50vw"
          className="absolute inset-0 size-full"
          imgClassName="object-top transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* 內容 */}
      <div
        className={cn(
          "relative rounded-b-[1.75rem] border border-t-0 bg-gradient-to-b px-7 pb-7 pt-7",
          accent.surface,
        )}
      >
        {/* 徽章（往上疊到照片） */}
        <span
          className={cn(
            "absolute -top-9 left-7 inline-flex size-[72px] items-center justify-center rounded-2xl text-white shadow-lg ring-4 ring-white",
            accent.badge,
          )}
        >
          <Badge className="size-9" strokeWidth={1.5} />
        </span>

        {/* 標題（在徽章右側） */}
        <h3 className="ml-[92px] flex min-h-[40px] items-center font-serif text-2xl font-bold text-navy-900">
          {feature.title}
        </h3>

        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
          {feature.description}
        </p>

        {/* 三項服務 */}
        <div className="mt-6 grid grid-cols-3 gap-2 border-t border-black/5 pt-6">
          {feature.bullets.map((b) => {
            const BIcon = BULLET_ICONS[b.icon];
            return (
              <div key={b.label} className="flex flex-col items-center gap-2 text-center">
                <BIcon className={cn("size-7", accent.bullet)} strokeWidth={1.5} />
                <span className="text-sm font-medium text-navy-800">{b.label}</span>
              </div>
            );
          })}
        </div>

        {/* 了解更多 */}
        <div className="mt-7 flex justify-center">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full border-2 bg-white/60 px-7 py-2.5 text-sm font-semibold transition-colors",
              accent.border,
              accent.text,
              accent.btnHover,
            )}
          >
            了解更多
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
