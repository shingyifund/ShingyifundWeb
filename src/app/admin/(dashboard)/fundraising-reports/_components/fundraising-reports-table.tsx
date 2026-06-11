import { ExternalLink, Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { FundraisingReportRecord } from "../actions";
import { DeleteFundraisingReportDialog } from "./delete-fundraising-report-dialog";

export function FundraisingReportsTable({
  reports,
}: {
  reports: FundraisingReportRecord[];
}) {
  if (reports.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-white p-8 text-center">
        <h2 className="text-lg font-semibold text-foreground">尚無勸募成果報告</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          新增第一份 PDF 後，前台勸募成果頁就會顯示。
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="hidden grid-cols-[100px_minmax(0,1fr)_150px_150px] border-b bg-muted/50 px-4 py-3 text-xs font-medium text-muted-foreground md:grid">
        <span>年度</span>
        <span>標題</span>
        <span>檔案</span>
        <span className="text-right">操作</span>
      </div>

      <div className="divide-y">
        {reports.map((report) => (
          <div
            key={report.id}
            className="grid gap-3 px-4 py-4 md:grid-cols-[100px_minmax(0,1fr)_150px_150px] md:items-center"
          >
            <div className="text-sm font-semibold text-navy-800">
              {report.fiscal_year}年度
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground">{report.title}</p>
              {report.file_name && (
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {report.file_name}
                  {report.file_size ? ` · ${formatFileSize(report.file_size)}` : ""}
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
                href={`/admin/fundraising-reports/${report.id}`}
                variant="ghost"
                size="icon-sm"
                aria-label={`編輯 ${report.title}`}
              >
                <Pencil />
              </Button>
              <DeleteFundraisingReportDialog
                id={report.id}
                filePath={report.file_path}
                title={report.title}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
