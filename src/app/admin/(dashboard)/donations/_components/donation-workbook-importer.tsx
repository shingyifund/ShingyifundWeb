"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
  RotateCcw,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatDonationAmount, getDonationTypeLabel } from "@/lib/donation-registry";
import {
  MAX_DONATION_WORKBOOK_BYTES,
  parseDonationWorkbook,
  type ParsedDonationWorkbook,
} from "@/lib/donation-workbook";
import { importDonationWorkbook } from "../actions";

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
export function DonationWorkbookImporter() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [parsed, setParsed] = useState<ParsedDonationWorkbook | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setParsed(null);
    setError(null);
    setSuccess(null);
    setIsParsing(true);
    try {
      setParsed(await parseDonationWorkbook(file));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "無法解析這份 Excel。");
    } finally {
      setIsParsing(false);
    }
  }

  function reset() {
    setParsed(null);
    setError(null);
    setSuccess(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function submitImport() {
    if (!parsed || parsed.issues.length > 0) return;
    startTransition(async () => {
      const result = await importDonationWorkbook({
        file_name: parsed.file_name,
        file_size: parsed.file_size,
        file_hash: parsed.file_hash,
        records: parsed.records,
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setError(null);
      setSuccess(result.message);
      setParsed(null);
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    });
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
      <div className="border-b border-navy-100 bg-navy-50/60 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <FileSpreadsheet className="size-5" />
          </span>
          <div>
            <h2 className="font-serif text-xl font-bold text-navy-900">上傳捐款芳名錄 Excel</h2>
            <p className="mt-1 text-sm leading-6 text-ink-muted">
              支援 .xls／.xlsx，系統會依「年份＋月份＋一般／勸募」取代既有資料，不保存原始檔案。
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {!parsed ? (
          <label className="group flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-navy-200 bg-[#fffdf8] px-6 py-10 text-center transition-colors hover:border-amber-400 hover:bg-amber-50/50">
            {isParsing ? (
              <Loader2 className="size-10 animate-spin text-amber-600" />
            ) : (
              <UploadCloud className="size-10 text-navy-400 transition-transform group-hover:-translate-y-1" />
            )}
            <span className="mt-4 font-semibold text-navy-900">
              {isParsing ? "正在解析工作表…" : "選擇 Excel 檔案"}
            </span>
            <span className="mt-1 text-sm text-ink-muted">
              單檔最大 {formatBytes(MAX_DONATION_WORKBOOK_BYTES)}，最多 25,000 筆
            </span>
            <input
              ref={inputRef}
              type="file"
              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="sr-only"
              disabled={isParsing || isPending}
              onChange={(event) => void handleFile(event.target.files?.[0])}
            />
          </label>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-col gap-3 rounded-xl bg-navy-900 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate font-semibold">{parsed.file_name}</p>
                <p className="mt-1 text-xs text-navy-200">
                  {formatBytes(parsed.file_size)} · {parsed.sheets.length} 個工作表
                </p>
              </div>
              <Button type="button" variant="white" size="sm" onClick={reset} disabled={isPending}>
                <RotateCcw className="size-4" />
                重新選擇
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Summary label="明細筆數" value={`${parsed.records.length.toLocaleString("zh-TW")} 筆`} />
              <Summary label="月份／類別" value={`${parsed.periodCount} 組`} />
              <Summary label="金額合計" value={formatDonationAmount(parsed.totalAmount)} />
            </div>

            <div className="overflow-hidden rounded-xl border border-navy-100">
              <div className="border-b border-navy-100 bg-navy-50 px-4 py-3 text-sm font-semibold text-navy-900">
                本次覆蓋範圍
              </div>
              <div className="grid gap-px bg-navy-100 sm:grid-cols-2 lg:grid-cols-3">
                {parsed.sheets.map((sheet) => (
                  <div key={sheet.sheet} className="bg-white px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate font-semibold text-navy-900">{sheet.sheet}</span>
                      <span className="shrink-0 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                        {getDonationTypeLabel(sheet.donationType)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ink-muted">
                      {sheet.recordCount.toLocaleString("zh-TW")} 筆 · {formatDonationAmount(sheet.totalAmount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {parsed.issues.length > 0 ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertCircle className="size-5" />
                  發現 {parsed.issues.length} 個問題，修正 Excel 後才能匯入
                </div>
                <ul className="mt-3 max-h-48 space-y-1 overflow-y-auto text-sm">
                  {parsed.issues.map((issue, index) => (
                    <li key={`${issue.sheet}-${issue.row}-${index}`}>
                      {issue.sheet}{issue.row > 0 ? ` 第 ${issue.row} 列` : ""}：{issue.message}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                <p>
                  格式與總筆數檢查完成。按下匯入後，資料庫中相同年月與類別的資料會由這份 Excel 完整取代。
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="button"
                size="lg"
                onClick={submitImport}
                disabled={isPending || parsed.issues.length > 0}
              >
                {isPending ? <Loader2 className="size-5 animate-spin" /> : <UploadCloud className="size-5" />}
                {isPending ? "正在匯入…" : "確認覆蓋並匯入"}
              </Button>
            </div>
          </div>
        )}

        {error ? (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
            <AlertCircle className="mt-0.5 size-5 shrink-0" />
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900" role="status">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
            {success}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-navy-100 bg-[#fffdf8] px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">{label}</p>
      <p className="mt-1 font-serif text-xl font-bold text-navy-900">{value}</p>
    </div>
  );
}
