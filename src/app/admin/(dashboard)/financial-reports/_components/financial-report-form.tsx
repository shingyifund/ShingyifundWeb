"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadTrigger } from "@/components/admin/upload-trigger";
import { createClient } from "@/lib/supabase/client";
import {
  createFinancialReport,
  prepareFinancialReportUpload,
  type FinancialReportRecord,
  updateFinancialReport,
} from "../actions";

const MAX_PDF_FILE_SIZE = 50 * 1024 * 1024;

type SubmitPhase = "idle" | "preparing" | "uploading" | "saving";

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
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitPhase, setSubmitPhase] = useState<SubmitPhase>("idle");
  const [isPending, startTransition] = useTransition();
  const isSubmitting = isPending || submitPhase !== "idle";

  function validatePdf(file: File) {
    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) return "檔案格式需為 PDF";
    if (file.size <= 0) return "PDF 檔案不可為空白";
    if (file.size > MAX_PDF_FILE_SIZE) return "PDF 檔案不可超過 50MB";
    return null;
  }

  function handleSubmit(formData: FormData) {
    setMessage(null);
    if (!isEdit && !pdfFile) {
      setMessage("請選擇 PDF 檔案");
      return;
    }

    if (pdfFile) {
      const validationError = validatePdf(pdfFile);
      if (validationError) {
        setMessage(validationError);
        return;
      }
    }

    formData.set("fiscal_year", fiscalYear);
    formData.set("comparison_year", comparisonYear);
    formData.set("title", title);

    startTransition(async () => {
      try {
        if (pdfFile) {
          setSubmitPhase("preparing");
          const prepared = await prepareFinancialReportUpload({
            fiscalYear: Number(fiscalYear),
            fileName: pdfFile.name,
            fileSize: pdfFile.size,
            fileType: pdfFile.type,
          });

          if (!prepared.ok) {
            setMessage(prepared.message);
            return;
          }

          setSubmitPhase("uploading");
          const supabase = createClient();
          const { error } = await supabase.storage
            .from("financial-reports")
            .uploadToSignedUrl(prepared.path, prepared.token, pdfFile, {
              contentType: "application/pdf",
            });

          if (error) {
            setMessage(`PDF 上傳失敗：${error.message}`);
            return;
          }

          formData.set("uploaded_file_path", prepared.path);
          formData.set("uploaded_file_name", pdfFile.name);
          formData.set("uploaded_file_size", String(pdfFile.size));
        }

        setSubmitPhase("saving");
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
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "儲存失敗，請稍後再試");
      } finally {
        setSubmitPhase("idle");
      }
    });
  }

  const submitLabel =
    submitPhase === "preparing"
      ? "準備上傳..."
      : submitPhase === "uploading"
        ? "PDF 上傳中..."
        : submitPhase === "saving"
          ? "儲存資料中..."
          : "儲存";

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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
          disabled={isSubmitting}
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
              ? "不選擇檔案會保留目前 PDF；選擇新檔會替換並刪除舊檔（上限 50MB）。"
              : "新增財務報告需上傳 PDF（上限 50MB）。"
          }
          icon={<FileText className="size-5" strokeWidth={1.8} />}
          disabled={isSubmitting}
          onFilesSelected={(files) => {
            const file = files[0] ?? null;
            setPdfFile(file);
            setMessage(file ? validatePdf(file) : null);
          }}
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

      {message && <p className="text-sm text-destructive">{message}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {submitLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => router.back()}
        >
          取消
        </Button>
      </div>
    </form>
  );
}
