import Link from "next/link";
import { Bell, HandHeart, ImageIcon } from "lucide-react";
import { FacebookIcon } from "@/components/brand/SocialIcons";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { FacebookPagePlugin } from "./FacebookPagePlugin";

const REASONS = [
  {
    icon: Bell,
    title: "即時動態",
    desc: "活動公告、發放通知第一手送達。",
  },
  {
    icon: ImageIcon,
    title: "物資現場",
    desc: "看見每一份物資抵達需要的人手中。",
  },
  {
    icon: HandHeart,
    title: "愛心故事",
    desc: "捐贈者與受助家庭的真實互動。",
  },
];

export function FacebookFeed() {
  return (
    <section className="bg-mist/60 py-4">
      <Container>
        {/* 深藍外框，把 plugin 白卡鑲嵌在框內 */}
        <div className="relative overflow-hidden rounded-3xl bg-navy-900 p-6 text-white sm:p-8 lg:p-10">
          {/* 裝飾光暈，實色合成層，不用 backdrop-blur */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-amber-500/15 blur-2xl"
            style={{ transform: "translateZ(0)" }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-16 size-56 rounded-full bg-navy-500/20 blur-2xl"
            style={{ transform: "translateZ(0)" }}
          />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_500px]">
            {/* 左：文案 + 追蹤理由 + CTA */}
            <div>
              <span className="inline-flex items-center gap-2 text-sm font-medium tracking-wide text-amber-300">
                <span className="h-px w-6 bg-current opacity-60" />
                最新動態
              </span>
              <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-white sm:text-4xl">
                追蹤興毅，
                <br />
                看見愛心的流動
              </h2>

              <ul className="mt-8 space-y-5">
                {REASONS.map((reason) => {
                  const Icon = reason.icon;
                  return (
                    <li key={reason.title} className="flex items-start gap-4">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-amber-300">
                        <Icon className="size-5" strokeWidth={1.8} />
                      </span>
                      <div>
                        <p className="font-semibold text-white">{reason.title}</p>
                        <p className="mt-0.5 text-sm leading-relaxed text-navy-100/80">
                          {reason.desc}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <Link
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#1877F2] px-6 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
              >
                <FacebookIcon className="size-4" />
                追蹤粉絲專頁
              </Link>
            </div>

            {/* 右：FB 官方 Page Plugin，白卡鑲嵌深藍框內 */}
            <FacebookPagePlugin width={500} height={560} />
          </div>
        </div>
      </Container>
    </section>
  );
}
