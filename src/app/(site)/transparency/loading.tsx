import { Loader2 } from "lucide-react";
import { Container } from "@/components/ui/Container";

export default function TransparencyLoading() {
  return (
    <>
      {/* navy hero 骨架 */}
      <section className="relative overflow-hidden bg-navy-900 py-12 text-white sm:py-14">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/75 to-navy-900/20" />
        <Container className="relative">
          <div className="max-w-3xl space-y-4">
            <div className="h-4 w-40 rounded bg-white/15" />
            <div className="h-10 w-72 rounded bg-white/20 sm:h-12" />
            <div className="h-4 w-full max-w-md rounded bg-white/10" />
          </div>
        </Container>
      </section>

      {/* 內容區 loading */}
      <main className="bg-[#f5f7f4] py-8 sm:py-10">
        <Container>
          <div
            className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-navy-700"
            role="status"
            aria-live="polite"
          >
            <Loader2 className="size-8 animate-spin text-amber-500" />
            <p className="font-serif text-sm font-medium">載入中…</p>
          </div>
        </Container>
      </main>
    </>
  );
}
