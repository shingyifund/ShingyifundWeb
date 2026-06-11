import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MonthlyDonationsTable } from "./_components/monthly-donations-table";
import { listMonthlyDonationReports } from "./actions";

export default async function MonthlyDonationsAdminPage() {
  const reports = await listMonthlyDonationReports();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mt-1 text-3xl font-semibold text-foreground">
            每月捐物清單
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            共 {reports.length} 筆資料，前台依年月、區域與個人/團體歸檔顯示。
          </p>
        </div>
        <Button href="/admin/monthly-donations/new">
          <Plus />
          新增清單
        </Button>
      </div>

      <MonthlyDonationsTable reports={reports} />
    </div>
  );
}
