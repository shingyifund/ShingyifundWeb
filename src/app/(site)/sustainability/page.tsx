import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FileDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { getRequestLocale } from "@/i18n/request";
import { translate } from "@/i18n/translations";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return locale === "en"
    ? { title: "Sustainability", description: "Shing Yi Foundation advances the United Nations Sustainable Development Goals. Download our 2024 Sustainability Report." }
    : { title: "永續興毅", description: "財團法人興毅社會福利慈善事業基金會致力於聯合國永續發展目標（SDGs），2024年永續報告書公開下載。" };
}

const SDG_NUMBERS = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 16, 17];

const PDF_PATH = "/sustainability.pdf";

export default async function SustainabilityPage() {
  const locale = await getRequestLocale();
  return (
    <>
      <PageHero
        image="/images/sustainability-hero.jpg"
        eyebrow="Sustainability"
        title={translate(locale, "永續興毅")}
        align="center"
        overlay="center"
      />

      {/* SDG */}
      <section className="py-14">
        <Container>
          <h2 className="mb-8 text-center font-serif text-3xl font-bold text-navy-900">
            {translate(locale, "已落實聯合國永續發展目標（SDGs）")}
          </h2>
          <div className="mx-auto grid max-w-3xl grid-cols-4 gap-3 sm:grid-cols-7 sm:gap-3">
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
        </Container>
      </section>

      {/* PDF 永續報告書 */}
      <section className="bg-mist py-14">
        <Container>
          <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <h2 className="font-serif text-2xl font-bold text-navy-900">
              {locale === "en" ? "2024 Shing Yi Foundation Sustainability Report" : "2024年 財團法人興毅社會福利慈善事業基金會 永續報告書"}
            </h2>
            <Link
              href={PDF_PATH}
              download
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-navy-700 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-navy-600 hover:-translate-y-0.5"
            >
              <FileDown className="size-4" />
              {locale === "en" ? "Download PDF" : "下載 PDF"}
            </Link>
          </div>

          {/* 嵌入 PDF — 桌機直接顯示，手機顯示下載提示 */}
          <div className="overflow-hidden rounded-2xl border border-navy-100 shadow-card">
            <iframe
              src={PDF_PATH}
              className="hidden h-[80vh] w-full sm:block"
              title={locale === "en" ? "2024 Sustainability Report" : "2024年永續報告書"}
            />
            <div className="flex flex-col items-center gap-4 py-12 sm:hidden">
              <FileDown className="size-12 text-navy-300" />
              <p className="text-sm text-ink-soft">{locale === "en" ? "Use the button below to open the report on a mobile device." : "手機裝置請點下方按鈕開啟報告書"}</p>
              <Link
                href={PDF_PATH}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-full bg-navy-700 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-600"
              >
                <FileDown className="size-4" />
                {locale === "en" ? "Open PDF" : "開啟 PDF"}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
