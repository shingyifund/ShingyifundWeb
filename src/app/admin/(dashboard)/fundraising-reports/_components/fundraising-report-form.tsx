"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/ui/form-alert";
import { UploadTrigger } from "@/components/admin/upload-trigger";
import {
  createFundraisingReport,
  type FundraisingReportRecord,
  updateFundraisingReport,
} from "../actions";

function defaultTitle(year: string) {
  if (!year) return "";
  return `${year}年度勸募成果報告`;
}

export function FundraisingReportForm({
  report,
}: {
  report?: FundraisingReportRecord;
}) {
  const router = useRouter();
  const isEdit = Boolean(report);
  const [fiscalYear, setFiscalYear] = useState(String(report?.fiscal_year ?? ""));
  const [customTitle, setCustomTitle] = useState<string | null>(() => {
    if (!report?.title) return null;
    return report.title !== defaultTitle(String(report.fiscal_year))
      ? report.title
      : null;
  });
  const title = customTitle ?? defaultTitle(fiscalYear);
  const [message, setMessage] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setMessage(null);
    if (!isEdit && !pdfFile) {
      setMessage("請選擇 PDF 檔案");
      return;
    }
    formData.set("fiscal_year", fiscalYear);
    formData.set("title", title);
    if (pdfFile) formData.set("pdf_file", pdfFile);

    startTransition(async () => {
      const result =
        report === undefined
          ? await createFundraisingReport(formData)
          : await updateFundraisingReport(report.id, formData);

      if (!result.ok) {
        setMessage(result.message ?? "儲存失敗");
        return;
      }

      router.push("/admin/fundraising-reports");
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="fiscal_year">年度</Label>
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
        <p className="text-xs text-muted-foreground">對外顯示與排序使用此年度。</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">標題</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setCustomTitle(e.target.value)}
          placeholder="113年度勸募成果報告"
          required
        />
        <p className="text-xs text-muted-foreground">
          標題會依年度自動產生，也可手動修改。
        </p>
      </div>

      <div className="space-y-2">
        <Label>PDF 檔案</Label>
        <UploadTrigger
          accept="application/pdf,.pdf"
          label={pdfFile ? pdfFile.name : "選擇 PDF 檔案"}
          hint={
            isEdit
              ? "不選擇檔案會保留目前 PDF；選擇新檔會替換並刪除舊檔。"
              : "新增勸募成果報告需上傳 PDF。"
          }
          icon={<FileText className="size-5" strokeWidth={1.8} />}
          onFilesSelected={(files) => setPdfFile(files[0] ?? null)}
        />
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

      <FormAlert message={message} />

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
