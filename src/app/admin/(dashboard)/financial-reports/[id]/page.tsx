import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FinancialReportForm } from "../_components/financial-report-form";
import { getFinancialReportById } from "../actions";

export default async function EditFinancialReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await getFinancialReportById(id);

  if (!report) notFound();

  return (
    <div className="space-y-6">
      <Button href="/admin/financial-reports" variant="ghost" size="sm">
        <ArrowLeft />
        返回列表
      </Button>

      <section className="rounded-lg border bg-white p-6">
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground">編輯報告</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">
            {report.title}
          </h1>
        </div>
        <FinancialReportForm report={report} />
      </section>
    </div>
  );
}
