import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  getMonthlyDonationDonorTypeLabel,
  getMonthlyDonationRegionLabel,
} from "@/lib/monthly-donations";
import type { MonthlyDonationReportRecord } from "../actions";
import { DeleteMonthlyDonationDialog } from "./delete-monthly-donation-dialog";
import { MonthlyDonationPublishSwitch } from "./monthly-donation-publish-switch";

export function MonthlyDonationsTable({
  reports,
}: {
  reports: MonthlyDonationReportRecord[];
}) {
  if (reports.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-white p-8 text-center">
        <h2 className="text-lg font-semibold text-foreground">尚無每月捐物清單</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          新增第一筆資料後，前台每月捐物清單頁就會顯示。
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="hidden grid-cols-[120px_90px_90px_minmax(0,1fr)_100px_130px] border-b bg-muted/50 px-4 py-3 text-xs font-medium text-muted-foreground lg:grid">
        <span>年月</span>
        <span>區域</span>
        <span>分類</span>
        <span>標題</span>
        <span>狀態</span>
        <span className="text-right">操作</span>
      </div>

      <div className="divide-y">
        {reports.map((report) => (
          <div
            key={report.id}
            className="grid gap-3 px-4 py-4 lg:grid-cols-[120px_90px_90px_minmax(0,1fr)_100px_130px] lg:items-center"
          >
            <div className="text-sm font-semibold text-navy-800">
              {report.western_year}年{String(report.month).padStart(2, "0")}月
            </div>
            <div className="text-sm text-foreground">
              {getMonthlyDonationRegionLabel(report.region)}
            </div>
            <div className="text-sm text-foreground">
              {getMonthlyDonationDonorTypeLabel(report.donor_type)}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground">{report.title}</p>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {report.images.length} 張圖片
              </p>
            </div>
            <div>
              <MonthlyDonationPublishSwitch
                id={report.id}
                title={report.title}
                isPublished={report.is_published}
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button
                href={`/admin/monthly-donations/${report.id}`}
                variant="ghost"
                size="icon-sm"
                aria-label={`編輯 ${report.title}`}
              >
                <Pencil />
              </Button>
              <DeleteMonthlyDonationDialog id={report.id} title={report.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
