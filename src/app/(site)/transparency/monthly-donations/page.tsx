import type { Metadata } from "next";
import { ArrowRight, PackageOpen } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getMonthlyDonationReports } from "@/lib/data/queries";
import {
  formatMonthlyDonationPeriod,
  getMonthlyDonationDonorDisplayName,
  getMonthlyDonationDonorTypeLabel,
  getMonthlyDonationRegionLabel,
} from "@/lib/monthly-donations";
import type { MonthlyDonationReport } from "@/lib/types";

export const metadata: Metadata = {
  title: "每月捐物清單",
  description: "興毅基金會每月物資捐贈明細與照片公開查詢。",
};

export default async function MonthlyDonationsPage() {
  const reports = await getMonthlyDonationReports();
  const groups = groupByPeriod(reports);

  return (
    <>
      <PageHero
        image="/images/about-hero-bg.jpg"
        imagePosition="right"
        eyebrow="Monthly Donations"
        title="每月捐物清單"
        align="left"
        overlay="gradient"
      >
        <p className="mt-6 max-w-xl text-base leading-relaxed text-navy-100/85 sm:text-lg">
          公開每月物資捐贈明細與照片，讓每一份物資流向都清楚可查。
        </p>
      </PageHero>

      <main className="bg-[#f5f7f4] py-14 sm:py-20">
        <Container>
          {groups.length === 0 ? (
            <section className="rounded-2xl border border-dashed border-navy-200 bg-white p-8 text-center">
              <h2 className="font-serif text-2xl font-bold text-navy-900">
                目前尚無每月捐物清單
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                後台新增資料後，清單會顯示在此頁。
              </p>
            </section>
          ) : (
            <section className="space-y-8">
              {groups.map(([period, items]) => (
                <div key={period}>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-amber-700">
                      Donation Archive
                    </p>
                    <h2 className="mt-1 font-serif text-2xl font-black text-navy-900">
                      {period}
                    </h2>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((report) => (
                      <DonorCard key={report.id} report={report} />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}
        </Container>
      </main>
    </>
  );
}

function DonorCard({ report }: { report: MonthlyDonationReport }) {
  const donorName = getMonthlyDonationDonorDisplayName({
    donorName: report.donorName,
    isAnonymous: report.isAnonymous,
  });

  return (
    <article className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
          <PackageOpen className="size-6" strokeWidth={1.6} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-amber-700">
            {getMonthlyDonationRegionLabel(report.region)} ·{" "}
            {getMonthlyDonationDonorTypeLabel(report.donorType)}
          </p>
          <h3 className="mt-1 font-serif text-lg font-bold leading-snug text-navy-900">
            {donorName}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {report.images.length > 0
              ? `${report.images.length} 張照片`
              : "尚無照片"}
          </p>
        </div>
      </div>
      <div className="mt-5">
        <Button
          href={`/transparency/monthly-donations/${report.id}`}
          variant="outline"
          className="w-full"
        >
          查看明細
          <ArrowRight />
        </Button>
      </div>
    </article>
  );
}

function groupByPeriod(reports: MonthlyDonationReport[]) {
  const grouped = new Map<string, MonthlyDonationReport[]>();
  for (const report of reports) {
    const period = formatMonthlyDonationPeriod(report.westernYear, report.month);
    const group = grouped.get(period) ?? [];
    group.push(report);
    grouped.set(period, group);
  }
  return Array.from(grouped.entries());
}
