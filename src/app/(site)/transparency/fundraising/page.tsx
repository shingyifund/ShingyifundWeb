import type { Metadata } from "next";
import { ExternalLink, FileText } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getFundraisingReports } from "@/lib/data/queries";
import type { FundraisingReport } from "@/lib/types";
import { getRequestLocale } from "@/i18n/request";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return locale === "en"
    ? { title: "Fundraising Reports", description: "Download Shing Yi Foundation's annual fundraising outcome reports." }
    : { title: "勸募成果報告", description: "興毅基金會年度勸募成果報告公開下載。" };
}

export default async function FundraisingReportsPage() {
  const locale = await getRequestLocale();
  const reports = await getFundraisingReports();
  const [latestReport, ...pastReports] = reports;

  return (
    <>
      <PageHero
        image="/images/about-hero-bg.jpg"
        imagePosition="right"
        eyebrow="Fundraising Report"
        title={locale === "en" ? "Fundraising Reports" : "勸募成果報告"}
        align="left"
        overlay="gradient"
      >
        <p className="mt-6 max-w-xl text-base leading-relaxed text-navy-100/85 sm:text-lg">
          {locale === "en" ? "Download annual fundraising results and charitable expenditure reports for a clear view of every contribution." : "年度勸募成果與公益支出公開下載，讓每一份支持都清楚透明。"}
        </p>
      </PageHero>

      <main className="bg-[#f5f7f4] py-14 sm:py-20">
        <Container>
          {latestReport ? (
            <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
              <p className="text-sm font-semibold text-amber-700">{locale === "en" ? "Latest Report" : "最新報告"}</p>
              <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <h2 className="font-serif text-2xl font-black leading-snug text-navy-900 sm:text-3xl">
                    {latestReport.title}
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {locale === "en" ? `Fiscal Year ${latestReport.fiscalYear} / PDF` : `${latestReport.fiscalYear}年度 / PDF 格式`}
                  </p>
                </div>
                <Button
                  href={latestReport.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {locale === "en" ? "View PDF" : "查看 PDF"}
                  <ExternalLink />
                </Button>
              </div>
            </section>
          ) : (
            <section className="rounded-2xl border border-dashed border-navy-200 bg-white p-8 text-center">
              <h2 className="font-serif text-2xl font-bold text-navy-900">
                {locale === "en" ? "No fundraising reports are currently available" : "目前尚無勸募成果報告"}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                {locale === "en" ? "Reports will appear here after they are published." : "後台上傳 PDF 後，報告會顯示在此頁。"}
              </p>
            </section>
          )}

          {pastReports.length > 0 && (
            <section className="mt-10">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-amber-700">
                    Historical Reports
                  </p>
                  <h2 className="mt-1 font-serif text-2xl font-black text-navy-900">
                    {locale === "en" ? "Past Fundraising Reports" : "歷年勸募成果報告"}
                  </h2>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {pastReports.map((report) => (
                  <ReportCard key={report.id} report={report} locale={locale} />
                ))}
              </div>
            </section>
          )}
        </Container>
      </main>
    </>
  );
}

function ReportCard({ report, locale }: { report: FundraisingReport; locale: "tw" | "en" }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
          <FileText className="size-6" strokeWidth={1.6} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-amber-700">
            {locale === "en" ? `Fiscal Year ${report.fiscalYear}` : `${report.fiscalYear}年度`}
          </p>
          <h3 className="mt-1 font-serif text-xl font-bold leading-snug text-navy-900">
            {report.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">{locale === "en" ? "PDF" : "PDF 格式"}</p>
        </div>
      </div>
      <div className="mt-5">
        <Button
          href={report.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          className="w-full"
        >
          {locale === "en" ? "View PDF" : "查看 PDF"}
          <ExternalLink />
        </Button>
      </div>
    </article>
  );
}
