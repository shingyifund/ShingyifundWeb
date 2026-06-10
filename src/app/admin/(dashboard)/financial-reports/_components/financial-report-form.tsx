"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createFinancialReport,
  type FinancialReportRecord,
  updateFinancialReport,
} from "../actions";

function defaultTitle(year: string) {
  if (!year) return "";
  return `${year}年度財務報表及會計師查核報告`;
}

export function FinancialReportForm({
  report,
}: {
  report?: FinancialReportRecord;
}) {
  const router = useRouter();
  const isEdit = Boolean(report);
  const [fiscalYear, setFiscalYear] = useState(String(report?.fiscal_year ?? ""));
  const [comparisonYear, setComparisonYear] = useState(
    String(report?.comparison_year ?? ""),
  );
  const [customTitle, setCustomTitle] = useState<string | null>(() => {
    if (!report?.title) return null;
    return report.title !== defaultTitle(String(report.fiscal_year))
      ? report.title
      : null;
  });
  const title = customTitle ?? defaultTitle(fiscalYear);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setMessage(null);
    formData.set("fiscal_year", fiscalYear);
    formData.set("comparison_year", comparisonYear);
    formData.set("title", title);

    startTransition(async () => {
      const result =
        report === undefined
          ? await createFinancialReport(formData)
          : await updateFinancialReport(report.id, formData);

      if (!result.ok) {
        setMessage(result.message ?? "儲存失敗");
        return;
      }

      router.push("/admin/financial-reports");
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fiscal_year">主要年度</Label>
          <Input
            id="fiscal_year"
            type="number"
            min={1}
            max={999}
            value={fiscalYear}
            onChange={(e) => setFiscalYear(e.target.value)}
            placeholder="例：113"
            required
          />
          <p className="text-xs text-muted-foreground">
            對外顯示與排序使用此年度。
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="comparison_year">比較年度</Label>
          <Input
            id="comparison_year"
            type="number"
            min={1}
            max={999}
            value={comparisonYear}
            onChange={(e) => setComparisonYear(e.target.value)}
            placeholder="例：112"
          />
          <p className="text-xs text-muted-foreground">
            選填；用於說明 PDF 內含比較資訊。
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">標題</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setCustomTitle(e.target.value)}
          placeholder="113年度財務報表及會計師查核報告"
          required
        />
        <p className="text-xs text-muted-foreground">
          標題會依年度自動產生，也可手動修改。
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pdf_file">PDF 檔案</Label>
        <Input
          id="pdf_file"
          name="pdf_file"
          type="file"
          accept="application/pdf,.pdf"
          required={!isEdit}
        />
        <p className="text-xs text-muted-foreground">
          {isEdit
            ? "不選擇檔案會保留目前 PDF；選擇新檔會替換並刪除舊檔。"
            : "新增財務報告需上傳 PDF。"}
        </p>
      </div>

      {report?.file_url && (
        <Button
          href={report.file_url}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          size="sm"
        >
          查看目前 PDF
        </Button>
      )}

      {message && <p className="text-sm text-destructive">{message}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "儲存中..." : "儲存"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          取消
        </Button>
      </div>
    </form>
  );
}
