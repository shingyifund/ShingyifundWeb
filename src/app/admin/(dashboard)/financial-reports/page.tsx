import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { FinancialReportsTable } from "./_components/financial-reports-table";
import { listFinancialReports } from "./actions";

export default async function FinancialReportsAdminPage() {
  const reports = await listFinancialReports();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mt-1 text-3xl font-semibold text-foreground">
            財務報告
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            共 {reports.length} 份 PDF，前台依年度由新到舊顯示。
          </p>
        </div>
        <Button href="/admin/financial-reports/new">
          <Plus />
          新增報告
        </Button>
      </div>

      <FinancialReportsTable reports={reports} />
    </div>
  );
}
