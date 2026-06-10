import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FinancialReportForm } from "../_components/financial-report-form";

export default function NewFinancialReportPage() {
  return (
    <div className="space-y-6">
      <Button href="/admin/financial-reports" variant="ghost" size="sm">
        <ArrowLeft />
        返回列表
      </Button>

      <section className="rounded-lg border bg-white p-6">
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground">新增報告</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">
            上傳財務報告 PDF
          </h1>
        </div>
        <FinancialReportForm />
      </section>
    </div>
  );
}
