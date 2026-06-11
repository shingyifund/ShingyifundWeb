import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FundraisingReportForm } from "../_components/fundraising-report-form";

export default function NewFundraisingReportPage() {
  return (
    <div className="space-y-6">
      <Button href="/admin/fundraising-reports" variant="ghost" size="sm">
        <ArrowLeft />
        返回列表
      </Button>

      <section className="rounded-lg border bg-white p-6">
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground">新增報告</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">
            上傳勸募成果報告 PDF
          </h1>
        </div>
        <FundraisingReportForm />
      </section>
    </div>
  );
}
