import { AlertCircle, Database, History } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server";
import { formatDonationAmount } from "@/lib/donation-registry";
import { DonationWorkbookImporter } from "./_components/donation-workbook-importer";
import { DeleteImportButton } from "./_components/delete-import-button";

type ImportBatch = {
  id: string;
  file_name: string;
  file_size: number;
  record_count: number;
  period_count: number;
  total_amount: number;
  created_at: string;
};

async function getImportBatches() {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("donation_import_batches")
      .select("id, file_name, file_size, record_count, period_count, total_amount, created_at")
      .order("created_at", { ascending: false })
      .limit(30);
    if (error) throw error;
    return { rows: (data ?? []) as ImportBatch[], ready: true };
  } catch {
    return { rows: [] as ImportBatch[], ready: false };
  }
}
function formatBytes(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default async function DonationAdminPage() {
  const { rows, ready } = await getImportBatches();

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Public registry</p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-navy-900">捐款芳名錄</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
            上傳會先在瀏覽器解析與預覽，確認後才以單一交易更新公開芳名錄；原始 Excel 不會保存。
          </p>
        </div>
        <a
          href="/tw/transparency/donors"
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold text-navy-700 underline decoration-navy-200 underline-offset-4 hover:text-amber-700"
        >
          查看前台芳名錄 ↗
        </a>
      </header>

      {!ready ? (
        <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertCircle className="mt-0.5 size-5 shrink-0" />
          <p>尚未建立捐款芳名錄資料表。請先到 Supabase SQL Editor 執行本次提供的 SQL，再回來上傳。</p>
        </div>
      ) : null}

      <DonationWorkbookImporter />

      <section className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
        <div className="flex items-center gap-3 border-b border-navy-100 bg-navy-50/60 px-5 py-4 sm:px-6">
          <History className="size-5 text-navy-600" />
          <div>
            <h2 className="font-serif text-xl font-bold text-navy-900">目前有效的匯入批次</h2>
            <p className="mt-0.5 text-xs text-ink-muted">完全被新版取代的舊批次會自動移除，節省資料庫容量。</p>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <Database className="size-9 text-navy-300" />
            <p className="mt-3 font-semibold text-navy-900">目前沒有匯入紀錄</p>
            <p className="mt-1 text-sm text-ink-muted">執行 SQL 並匯入第一份 Excel 後會顯示在這裡。</p>
          </div>
        ) : (
          <div className="divide-y divide-navy-100">
            {rows.map((batch) => (
              <article key={batch.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-navy-900">{batch.file_name}</h3>
                  <p className="mt-1 text-xs leading-5 text-ink-muted">
                    {new Intl.DateTimeFormat("zh-TW", { dateStyle: "medium", timeStyle: "short" }).format(new Date(batch.created_at))}
                    {" · "}{formatBytes(batch.file_size)}
                    {" · "}{batch.period_count} 個月份／類別
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">
                    {batch.record_count.toLocaleString("zh-TW")} 筆 · {formatDonationAmount(batch.total_amount)}
                  </p>
                </div>
                <DeleteImportButton id={batch.id} fileName={batch.file_name} />
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
