import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, Printer } from "lucide-react";
import { siteConfig } from "@/config/site";
import { mainNav } from "@/config/nav";
import { FacebookIcon, YoutubeIcon } from "@/components/brand/SocialIcons";

/** 基金會已落實的 SDGs（依原站，跳過 6、14、15） */
const SDG_NUMBERS = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 16, 17];

export function SiteFooter() {
  const { contact, donation, registration } = siteConfig;

  return (
    <footer className="relative mt-24 bg-navy-900 text-navy-100">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-12">
        {/* 品牌 + 聯絡 */}
        <div className="lg:col-span-5">
          <Image
            src="/brand/logo.svg"
            alt={siteConfig.shortName}
            width={245}
            height={43}
            className="h-11 w-auto rounded-md bg-white/95 p-1.5"
          />
          <p className="mt-5 max-w-md text-sm leading-relaxed text-navy-100/70">
            {siteConfig.name}
            <br />
            {siteConfig.slogan}，{siteConfig.description}
          </p>

          <ul className="mt-6 space-y-3 text-sm text-navy-100/80">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-amber-400" />
              {contact.address}
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-4 shrink-0 text-amber-400" />
              {contact.tel}
            </li>
            <li className="flex items-center gap-3">
              <Printer className="size-4 shrink-0 text-amber-400" />
              {contact.fax}
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-4 shrink-0 text-amber-400" />
              <a href={`mailto:${contact.email}`} className="hover:text-amber-300">
                {contact.email}
              </a>
            </li>
          </ul>

          <div className="mt-6 flex gap-3">
            <SocialLink href={siteConfig.social.facebook} label="Facebook">
              <FacebookIcon className="size-5" />
            </SocialLink>
            <SocialLink href={siteConfig.social.youtube} label="YouTube">
              <YoutubeIcon className="size-5" />
            </SocialLink>
          </div>
        </div>

        {/* 快速連結 */}
        <div className="lg:col-span-3">
          <h3 className="font-serif text-lg font-semibold text-white">網站導覽</h3>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-navy-100/75">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-amber-300">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 捐款資訊 */}
        <div className="lg:col-span-4">
          <h3 className="font-serif text-lg font-semibold text-white">愛心捐款</h3>
          <dl className="mt-5 space-y-3 text-sm">
            <Row label="銀行匯款" value={`${donation.bank}　${donation.bankAccount}`} />
            <Row label="郵政劃撥" value={donation.postal} />
            <Row label="發票愛心碼" value={donation.loveCode} highlight />
          </dl>
          <p className="mt-5 text-xs leading-relaxed text-navy-100/50">
            勸募字號：{registration.fundraising}
            <br />
            立案：{registration.approval}
          </p>
        </div>
      </div>

      {/* SDGs */}
      <div className="border-t border-white/10">
        <div className="container-x py-10">
          <p className="mb-6 text-center text-sm font-semibold tracking-wide text-navy-100/80">
            已落實聯合國永續發展目標（SDGs）
          </p>
          <div className="mx-auto grid max-w-3xl grid-cols-4 gap-2 sm:grid-cols-7 sm:gap-2.5">
            {SDG_NUMBERS.map((n) => (
              <Image
                key={n}
                src={`/images/sdg/sdg-${n}.png`}
                alt={`SDG ${n}`}
                width={160}
                height={160}
                className="w-full rounded-md shadow-sm transition-transform hover:scale-105"
              />
            ))}
          </div>
        </div>
      </div>

      {/* 版權 */}
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-navy-100/65 sm:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.name}．版權所有</p>
          <p className="flex items-center gap-2">
            <span>{siteConfig.enName}</span>
            <span className="text-navy-100/30">·</span>
            <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-navy-100/40">
              {siteConfig.version}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-navy-100 transition-all hover:bg-amber-500 hover:text-navy-900"
    >
      {children}
    </a>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 rounded-xl bg-white/[0.04] px-4 py-2.5">
      <dt className="shrink-0 text-navy-100/60">{label}</dt>
      <dd className={highlight ? "font-semibold text-amber-300" : "text-white"}>
        {value}
      </dd>
    </div>
  );
}
