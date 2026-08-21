import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { MonthlyDonationDonorType } from "@/lib/types";
import { MonthlyDonationsListView } from "./_components/monthly-donations-list-view";
import { listMonthlyDonationReportsPaged } from "./actions";

const PAGE_SIZE = 10;

export default async function MonthlyDonationsAdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;

  const year = sp.year ? Number(sp.year) : undefined;
  const month = sp.month ? Number(sp.month) : undefined;
  const donorType = sp.donorType as MonthlyDonationDonorType | undefined;
  const donorName = sp.donorName?.trim() || undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const { rows, total } = await listMonthlyDonationReportsPaged({
    year,
    month,
    donorType,
    donorName,
    page,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (page > totalPages) {
    const params = new URLSearchParams();
    if (year) params.set("year", String(year));
    if (month) params.set("month", String(month));
    if (donorType) params.set("donorType", donorType);
    if (donorName) params.set("donorName", donorName);
    if (totalPages > 1) params.set("page", String(totalPages));

    const queryString = params.toString();
    redirect(`/admin/monthly-donations${queryString ? `?${queryString}` : ""}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mt-1 text-3xl font-semibold text-foreground">
            每月捐物清單
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            共 {total} 筆資料，前台依年月、區域與個人/團體歸檔顯示。
          </p>
        </div>
        <Button href="/admin/monthly-donations/new">
          <Plus />
          新增清單
        </Button>
      </div>

      <MonthlyDonationsListView
        reports={rows}
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        totalPages={totalPages}
        currentYear={year}
        currentMonth={month}
        currentDonorType={donorType}
        currentDonorName={donorName ?? ""}
      />
    </div>
  );
}
