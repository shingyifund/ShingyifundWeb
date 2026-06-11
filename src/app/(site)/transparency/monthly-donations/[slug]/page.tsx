import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { getMonthlyDonationReportsByArchive } from "@/lib/data/queries";
import {
  formatMonthlyDonationPeriod,
  getMonthlyDonationDonorTypeLabel,
  getMonthlyDonationRegionLabel,
  parseMonthlyDonationSlug,
} from "@/lib/monthly-donations";
import type { MonthlyDonationReport } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseMonthlyDonationSlug(slug);

  if (!parsed) return { title: "每月捐物清單" };

  return {
    title: `${formatMonthlyDonationPeriod(parsed.westernYear, parsed.month)}${getMonthlyDonationRegionLabel(parsed.region)}每月捐物清單`,
    description: "興毅基金會每月物資捐贈明細與照片。",
  };
}

export default async function MonthlyDonationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parseMonthlyDonationSlug(slug);
  if (!parsed) notFound();

  const reports = await getMonthlyDonationReportsByArchive(parsed);
  if (reports.length === 0) notFound();

  const period = formatMonthlyDonationPeriod(parsed.westernYear, parsed.month);
  const regionLabel = getMonthlyDonationRegionLabel(parsed.region);

  return (
    <>
      <PageHero
        image="/images/about-hero-bg.jpg"
        imagePosition="right"
        eyebrow="Monthly Donations"
        title={`${period}${regionLabel}捐物清單`}
        align="left"
        overlay="gradient"
      >
        <p className="mt-6 max-w-xl text-base leading-relaxed text-navy-100/85 sm:text-lg">
          依個人與團體分類公開捐贈明細，並保留物資照片紀錄。
        </p>
      </PageHero>

      <main className="bg-[#f5f7f4] py-14 sm:py-20">
        <Container>
          <div className="space-y-8">
            {reports.map((report) => (
              <ReportSection key={report.id} report={report} />
            ))}
          </div>
        </Container>
      </main>
    </>
  );
}

function ReportSection({ report }: { report: MonthlyDonationReport }) {
  return (
    <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-amber-700">
            {getMonthlyDonationDonorTypeLabel(report.donorType)}
          </p>
          <h2 className="mt-1 font-serif text-2xl font-black text-navy-900">
            {report.title}
          </h2>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-navy-100 bg-[#f8faf8] p-4 sm:p-5">
        <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-foreground sm:text-base">
          {report.contentText}
        </pre>
      </div>

      {report.images.length > 0 && (
        <div className="mt-8">
          <h3 className="font-serif text-xl font-bold text-navy-900">物品照片</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {report.images.map((image, index) => (
              <a
                key={image.id}
                href={image.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-xl border border-navy-100 bg-white"
              >
                <div className="relative aspect-[4/3] bg-muted">
                  <Image
                    src={image.imageUrl}
                    alt={image.fileName ?? `物品照片 ${index + 1}`}
                    fill
                    sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
