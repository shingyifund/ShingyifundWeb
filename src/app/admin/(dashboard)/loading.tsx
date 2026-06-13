import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="size-8 animate-spin text-navy-700" />
      <p className="text-sm font-medium">載入中…</p>
    </div>
  );
}
