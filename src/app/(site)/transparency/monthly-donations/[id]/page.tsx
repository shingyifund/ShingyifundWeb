import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getMonthlyDonationReportById } from "@/lib/data/queries";
import {
  formatMonthlyDonationPeriod,
  getMonthlyDonationDonorDisplayName,
  getMonthlyDonationDonorTypeLabel,
  getMonthlyDonationRegionLabel,
} from "@/lib/monthly-donations";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const report = await getMonthlyDonationReportById(id);

  if (!report) return { title: "每月捐物清單" };

  return {
    title: report.title,
    description: "興毅基金會每月物資捐贈明細與照片。",
  };
}

export default async function MonthlyDonationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await getMonthlyDonationReportById(id);
  if (!report) notFound();

  const period = formatMonthlyDonationPeriod(report.westernYear, report.month);
  const regionLabel = getMonthlyDonationRegionLabel(report.region);
  const donorTypeLabel = getMonthlyDonationDonorTypeLabel(report.donorType);
  const donorName = getMonthlyDonationDonorDisplayName({
    donorName: report.donorName,
    isAnonymous: report.isAnonymous,
  });
  const imageGridClass =
    report.images.length === 1
      ? "mt-8 max-w-4xl"
      : report.images.length === 2
        ? "mt-8 grid gap-5 md:grid-cols-2"
        : "mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3";
  const imageSizes =
    report.images.length === 1
      ? "(min-width: 1024px) 896px, 100vw"
      : report.images.length === 2
        ? "(min-width: 768px) 50vw, 100vw"
        : "(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw";

  return (
    <>
      <PageHero
        image="/images/about-hero-bg.jpg"
        imagePosition="right"
        eyebrow="Monthly Donations"
        title={report.title}
        align="left"
        overlay="gradient"
      >
        <p className="mt-6 max-w-xl text-base leading-relaxed text-navy-100/85 sm:text-lg">
          {period} · {regionLabel} · {donorTypeLabel}
        </p>
      </PageHero>

      <main className="bg-[#f5f7f4] py-14 sm:py-20">
        <Container>
          <div className="mb-6">
            <Button
              href="/transparency/monthly-donations"
              variant="ghost"
              className="text-navy-700"
            >
              <ArrowLeft />
              返回每月捐物清單
            </Button>
          </div>

          <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
            <p className="text-sm font-semibold text-amber-700">{donorTypeLabel}</p>
            <h1 className="mt-1 font-serif text-2xl font-black text-navy-900 sm:text-3xl">
              {donorName}
            </h1>

            {report.images.length > 0 ? (
              <div className={imageGridClass}>
                {report.images.map((image, index) => (
                  <figure
                    key={image.id}
                    className="overflow-hidden rounded-2xl border border-navy-100 bg-white"
                  >
                    <a
                      href={image.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <div className="relative aspect-video bg-muted">
                        <Image
                          src={image.imageUrl}
                          alt={image.caption ?? image.fileName ?? `物品照片 ${index + 1}`}
                          fill
                          sizes={imageSizes}
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </a>
                    {image.caption && (
                      <figcaption className="px-3 py-2.5 text-sm leading-relaxed text-foreground">
                        {image.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-sm text-muted-foreground">尚無物品照片。</p>
            )}
          </section>
        </Container>
      </main>
    </>
  );
}
