import { CreditCard, Heart, Landmark, Receipt } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function DonationCTA() {
  const { donation } = siteConfig;

  const items = [
    { icon: Landmark, label: "銀行匯款", value: `${donation.bank}`, sub: donation.bankAccount },
    { icon: CreditCard, label: "郵政劃撥", value: "劃撥帳號", sub: donation.postal },
    { icon: Receipt, label: "發票愛心碼", value: "捐贈發票", sub: donation.loveCode },
  ];

  return (
    <section className="py-12">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 px-7 py-12 shadow-glow sm:px-12 sm:py-14">
            {/* 裝飾 */}
            <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-amber-300/40 blur-2xl" />
            <Heart className="pointer-events-none absolute right-10 top-8 size-24 rotate-12 fill-white/10 text-white/10" />

            <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
              {/* 文案 */}
              <div className="text-navy-900">
                <span className="inline-flex items-center gap-2 rounded-full bg-navy-900/10 px-4 py-1.5 text-sm font-semibold">
                  <Heart className="size-4 fill-current" />
                  您的支持，持續不間斷
                </span>
                <h2 className="mt-5 font-serif text-3xl font-black leading-tight sm:text-4xl">
                  每一份捐款，
                  <br />
                  都是弱勢家庭的一道光
                </h2>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-navy-900/75">
                  無論金額多寡，您的心意都將化為實際的物資與服務，送到最需要的人手中。
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button href="/donate" variant="secondary" size="lg">
                    <Heart className="size-4 fill-current" />
                    立即捐款
                  </Button>
                  <Button href="/donate/projects" variant="white" size="lg">
                    捐款專案
                  </Button>
                </div>
              </div>

              {/* 捐款方式卡 */}
              <div className="grid gap-3 sm:grid-cols-3 lg:gap-4">
                {items.map((it) => (
                  <div
                    key={it.label}
                    className="rounded-2xl bg-white/95 p-5 shadow-md backdrop-blur"
                  >
                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                      <it.icon className="size-5" />
                    </span>
                    <p className="mt-3 text-xs font-medium text-ink-muted">{it.label}</p>
                    <p className="mt-1 text-sm font-semibold text-navy-900">{it.value}</p>
                    <p className="font-mono text-base font-bold tracking-wide text-amber-600">
                      {it.sub}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
