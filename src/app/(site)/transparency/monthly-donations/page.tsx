import type { Metadata } from "next";
import { ArrowRight, PackageOpen } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getMonthlyDonationReports } from "@/lib/data/queries";
import {
  formatMonthlyDonationPeriod,
  getMonthlyDonationDonorTypeLabel,
  getMonthlyDonationRegionLabel,
  monthlyDonationSlug,
} from "@/lib/monthly-donations";
import type {
  MonthlyDonationDonorType,
  MonthlyDonationRegion,
} from "@/lib/types";

export const metadata: Metadata = {
  title: "每月捐物清單",
  description: "興毅基金會每月物資捐贈明細與照片公開查詢。",
};

type ArchiveItem = {
  westernYear: number;
  month: number;
  region: MonthlyDonationRegion;
  donorTypes: MonthlyDonationDonorType[];
  imageCount: number;
};

export default async function MonthlyDonationsPage() {
  const reports = await getMonthlyDonationReports();
  const archives = buildArchives(reports);

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
          {archives.length === 0 ? (
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
              {archives.map(([period, items]) => (
                <div key={period}>
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-amber-700">
                        Donation Archive
                      </p>
                      <h2 className="mt-1 font-serif text-2xl font-black text-navy-900">
                        {period}
                      </h2>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {items.map((item) => (
                      <ArchiveCard
                        key={`${period}-${item.region}`}
                        item={item}
                      />
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

function ArchiveCard({ item }: { item: ArchiveItem }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
          <PackageOpen className="size-6" strokeWidth={1.6} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-amber-700">
            {formatMonthlyDonationPeriod(item.westernYear, item.month)}
          </p>
          <h3 className="mt-1 font-serif text-xl font-bold leading-snug text-navy-900">
            {getMonthlyDonationRegionLabel(item.region)}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {item.donorTypes.map(getMonthlyDonationDonorTypeLabel).join("、")}
            {item.imageCount > 0 ? ` / ${item.imageCount} 張照片` : ""}
          </p>
        </div>
      </div>
      <div className="mt-5">
        <Button
          href={`/transparency/monthly-donations/${monthlyDonationSlug(item)}`}
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

function buildArchives(
  reports: Awaited<ReturnType<typeof getMonthlyDonationReports>>,
) {
  const map = new Map<string, ArchiveItem>();

  for (const report of reports) {
    const key = `${report.westernYear}-${report.month}-${report.region}`;
    const current =
      map.get(key) ??
      ({
        westernYear: report.westernYear,
        month: report.month,
        region: report.region,
        donorTypes: [],
        imageCount: 0,
      } satisfies ArchiveItem);

    if (!current.donorTypes.includes(report.donorType)) {
      current.donorTypes.push(report.donorType);
    }
    current.imageCount += report.images.length;
    map.set(key, current);
  }

  const items = Array.from(map.values()).sort((a, b) => {
    if (a.westernYear !== b.westernYear) {
      return b.westernYear - a.westernYear;
    }
    if (a.month !== b.month) return b.month - a.month;
    return getMonthlyDonationRegionLabel(a.region).localeCompare(
      getMonthlyDonationRegionLabel(b.region),
      "zh-Hant",
    );
  });

  const grouped = new Map<string, ArchiveItem[]>();
  for (const item of items) {
    const period = formatMonthlyDonationPeriod(item.westernYear, item.month);
    const group = grouped.get(period) ?? [];
    group.push(item);
    grouped.set(period, group);
  }

  return Array.from(grouped.entries());
}
