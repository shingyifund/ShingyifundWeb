import { ExternalLink, Pencil } from "lucide-react";
import {
  AdminDataList,
  AdminDataListRow,
} from "@/components/admin/admin-data-list";
import { Button } from "@/components/ui/Button";
import type { FinancialReportRecord } from "../actions";
import { DeleteFinancialReportDialog } from "./delete-financial-report-dialog";

const GRID_CLASS = "lg:grid-cols-[120px_minmax(0,1fr)_150px_150px]";

export function FinancialReportsTable({
  reports,
}: {
  reports: FinancialReportRecord[];
}) {
  if (reports.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-white p-8 text-center">
        <h2 className="text-lg font-semibold text-foreground">尚無財務報告</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          新增第一份 PDF 後，前台財務報告頁就會顯示。
        </p>
      </div>
    );
  }

  return (
    <>
      {/* 手機版：緊湊卡片 */}
      <div className="space-y-3 lg:hidden">
        {reports.map((report) => (
          <div key={report.id} className="rounded-lg border bg-white px-4 py-3">
            <p className="font-medium text-foreground">{report.title}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {report.fiscal_year}
              {report.comparison_year ? ` / ${report.comparison_year}` : ""} 年度
              {report.file_name ? ` · ${report.file_name}` : ""}
              {report.file_size ? ` · ${formatFileSize(report.file_size)}` : ""}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <Button
                href={report.file_url}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="sm"
              >
                查看 PDF
                <ExternalLink />
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  href={`/admin/financial-reports/${report.id}`}
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`編輯 ${report.title}`}
                >
                  <Pencil />
                </Button>
                <DeleteFinancialReportDialog
                  id={report.id}
                  title={report.title}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 桌面版：表格 */}
      <div className="hidden lg:block">
        <AdminDataList
          columns={[
            { label: "年度" },
            { label: "標題" },
            { label: "檔案" },
            { label: "操作", className: "text-right" },
          ]}
          gridClassName={GRID_CLASS}
          headerVisibleClassName="lg:grid"
        >
          {reports.map((report) => (
            <AdminDataListRow
              key={report.id}
              gridClassName={GRID_CLASS}
              itemAlignClassName="lg:items-center"
            >
              <div className="text-sm font-semibold text-navy-800">
                {report.fiscal_year}
                {report.comparison_year ? ` / ${report.comparison_year}` : ""}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground">{report.title}</p>
                {report.file_name && (
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {report.file_name}
                    {report.file_size
                      ? ` · ${formatFileSize(report.file_size)}`
                      : ""}
                  </p>
                )}
              </div>
              <div>
                <Button
                  href={report.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  size="sm"
                >
                  查看 PDF
                  <ExternalLink />
                </Button>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button
                  href={`/admin/financial-reports/${report.id}`}
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`編輯 ${report.title}`}
                >
                  <Pencil />
                </Button>
                <DeleteFinancialReportDialog
                  id={report.id}
                  title={report.title}
                />
              </div>
            </AdminDataListRow>
          ))}
        </AdminDataList>
      </div>
    </>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
