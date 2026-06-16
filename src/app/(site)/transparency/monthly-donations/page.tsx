import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { getMonthlyDonationReportsPaged } from "@/lib/data/queries";
import type { MonthlyDonationDonorType } from "@/lib/types";
import { MonthlyDonationLedger } from "./_components/monthly-donation-ledger";

export const metadata: Metadata = {
  title: "每月捐物清單",
  description: "興毅基金會每月物資捐贈明細與照片公開查詢。",
};

const PAGE_SIZE = 10;

export default async function MonthlyDonationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;

  const year = sp.year ? Number(sp.year) : undefined;
  const month = sp.month ? Number(sp.month) : undefined;
  const donorType = sp.donorType as MonthlyDonationDonorType | undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const { rows, total } = await getMonthlyDonationReportsPaged({
    year,
    month,
    donorType,
    page,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <section className="relative overflow-hidden bg-navy-900 py-12 text-white sm:py-14">
        <Image
          src="/images/about-hero-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="pointer-events-none object-cover object-right opacity-70"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-navy-950 via-navy-900/75 to-navy-900/20" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.06)_1px,transparent_0)] bg-size-[26px_26px]" />

        <Container className="relative">
          <div className="max-w-3xl">
            <p className="font-serif text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
              Monthly donations
            </p>
            <h1 className="mt-3 font-serif text-4xl font-black leading-tight text-white sm:text-5xl">
              每月捐物清單
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-navy-100/85 sm:text-base">
              公開每月物資捐贈明細與照片，讓每一份物資流向都清楚可查。
            </p>
          </div>
        </Container>
      </section>

      <main className="bg-[#f5f7f4] py-8 sm:py-10">
        <Container>
          <Suspense>
            <MonthlyDonationLedger
              reports={rows}
              total={total}
              page={page}
              pageSize={PAGE_SIZE}
              totalPages={totalPages}
              currentYear={year}
              currentMonth={month}
              currentDonorType={donorType}
            />
          </Suspense>
        </Container>
      </main>
    </>
  );
}
