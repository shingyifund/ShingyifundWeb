import { ImageIcon, Pencil } from "lucide-react";
import {
  AdminDataList,
  AdminDataListRow,
} from "@/components/admin/admin-data-list";
import { Button } from "@/components/ui/Button";
import {
  getMonthlyDonationDonorTypeLabel,
  getMonthlyDonationRegionLabel,
} from "@/lib/monthly-donations";
import type { MonthlyDonationListRecord } from "../actions";
import { DeleteMonthlyDonationDialog } from "./delete-monthly-donation-dialog";
import { MonthlyDonationPublishSwitch } from "./monthly-donation-publish-switch";

const GRID_CLASS =
  "lg:grid-cols-[72px_180px_140px_minmax(0,1fr)_100px_130px]";

function Thumbnail({ url }: { url: string | null }) {
  return (
    <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="size-full object-cover" />
      ) : (
        <div className="flex size-full items-center justify-center">
          <ImageIcon className="size-5 text-muted-foreground/40" />
        </div>
      )}
    </div>
  );
}

export function MonthlyDonationsTable({
  reports,
}: {
  reports: MonthlyDonationListRecord[];
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
    <>
      {/* 手機版：緊湊卡片 */}
      <div className="space-y-3 lg:hidden">
        {reports.map((report) => {
          const donor = report.is_anonymous
            ? "（匿名）"
            : report.donor_name ?? "—";
          return (
            <div
              key={report.id}
              className="flex gap-3 rounded-lg border bg-white p-3"
            >
              <Thumbnail url={report.firstImageUrl} />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">{report.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {report.western_year}年{String(report.month).padStart(2, "0")}月
                  {" · "}{getMonthlyDonationRegionLabel(report.region)}
                  {" · "}{getMonthlyDonationDonorTypeLabel(report.donor_type)}
                  {" · "}{donor}
                  {" · "}{report.imageCount} 張
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <MonthlyDonationPublishSwitch
                    id={report.id}
                    title={report.title}
                    isPublished={report.is_published}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      href={`/admin/monthly-donations/${report.id}`}
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`編輯 ${report.title}`}
                    >
                      <Pencil />
                    </Button>
                    <DeleteMonthlyDonationDialog
                      id={report.id}
                      title={report.title}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 桌面版：表格 */}
      <div className="hidden lg:block">
        <AdminDataList
          columns={[
            { label: "圖片" },
            { label: "年月 / 區域 / 分類" },
            { label: "捐贈者" },
            { label: "標題" },
            { label: "狀態" },
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
              <Thumbnail url={report.firstImageUrl} />
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-navy-800">
                  {report.western_year}年{String(report.month).padStart(2, "0")}月
                </p>
                <p className="text-xs text-muted-foreground">
                  {getMonthlyDonationRegionLabel(report.region)}
                  {" · "}
                  {getMonthlyDonationDonorTypeLabel(report.donor_type)}
                </p>
              </div>
              <div className="min-w-0 text-sm">
                {report.is_anonymous ? (
                  <span className="text-muted-foreground italic">（匿名）</span>
                ) : (
                  <span className="text-foreground">
                    {report.donor_name ?? "—"}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground">{report.title}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {report.imageCount} 張圖片
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
                <DeleteMonthlyDonationDialog
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
