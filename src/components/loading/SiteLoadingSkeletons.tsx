import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const pulse = "animate-pulse motion-reduce:animate-none";

function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("rounded-xl bg-navy-100/75", pulse, className)} />;
}

export function DonationMarqueeSkeleton() {
  return (
    <section className="bg-cream pt-2" aria-hidden="true">
      <Container>
        <div className="mb-3 flex items-center justify-between px-1">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-14" />
        </div>
        <div className="flex gap-3 overflow-hidden">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-12 w-52 shrink-0 rounded-full" />
          ))}
        </div>
      </Container>
    </section>
  );
}

export function HeroSkeleton() {
  return (
    <section className="pt-2 pb-4 sm:pb-5" aria-hidden="true">
      <Container>
        <div className={cn("relative aspect-video overflow-hidden rounded-2xl bg-navy-100 lg:aspect-[16/7]", pulse)}>
          <div className="absolute inset-y-0 left-0 flex w-3/5 flex-col justify-center gap-4 p-7 sm:p-10 lg:p-14">
            <div className="h-8 w-4/5 rounded-xl bg-white/65 sm:h-12" />
            <div className="h-4 w-3/5 rounded-lg bg-white/55" />
            <div className="mt-2 h-11 w-32 rounded-full bg-amber-200/80" />
          </div>
        </div>
      </Container>
    </section>
  );
}

export function StatsSkeleton() {
  return (
    <section aria-hidden="true">
      <Container>
        <div className={cn("rounded-3xl bg-navy-800 px-6 py-9 sm:px-10 sm:py-10", pulse)}>
          <div className="mx-auto mb-8 h-9 w-48 rounded-xl bg-white/15" />
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {[0, 1, 2, 3, 4].map((item) => (
              <div key={item} className="space-y-3 px-3">
                <div className="h-3 w-20 rounded bg-white/10" />
                <div className="h-9 w-24 rounded-lg bg-amber-300/20" />
                <div className="h-3 w-16 rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function HomePanelSkeleton({
  tone = "light",
  className,
}: {
  tone?: "light" | "navy";
  className?: string;
}) {
  const dark = tone === "navy";
  return (
    <section className="py-4 sm:py-6" aria-hidden="true">
      <Container>
        <div
          className={cn(
            "grid min-h-80 gap-8 overflow-hidden rounded-3xl p-7 sm:p-9 lg:grid-cols-2",
            dark ? "bg-navy-900" : "border border-navy-100 bg-paper",
            pulse,
            className,
          )}
        >
          <div className="space-y-5">
            <div className={cn("h-4 w-24 rounded", dark ? "bg-amber-300/20" : "bg-amber-200/70")} />
            <div className={cn("h-10 w-4/5 rounded-xl", dark ? "bg-white/15" : "bg-navy-100")} />
            <div className={cn("h-4 w-full rounded", dark ? "bg-white/10" : "bg-navy-100/80")} />
            <div className={cn("h-4 w-3/4 rounded", dark ? "bg-white/10" : "bg-navy-100/80")} />
            <div className={cn("mt-3 h-11 w-32 rounded-full", dark ? "bg-amber-300/20" : "bg-amber-200/70")} />
          </div>
          <div className={cn("min-h-52 rounded-2xl", dark ? "bg-white/10" : "bg-navy-100/70")} />
        </div>
      </Container>
    </section>
  );
}

export function FeatureCardsSkeleton() {
  return (
    <section className="pt-1 pb-6 sm:pt-2 sm:pb-7" aria-hidden="true">
      <Container>
        <div className="grid gap-6 md:grid-cols-2">
          {[0, 1].map((item) => (
            <div key={item} className={cn("overflow-hidden rounded-[1.75rem] border border-navy-100 bg-paper", pulse)}>
              <div className="h-44 bg-navy-100/80 sm:h-52" />
              <div className="space-y-4 p-7">
                <div className="h-8 w-1/2 rounded-lg bg-navy-100" />
                <div className="h-4 w-full rounded bg-navy-100/80" />
                <div className="h-4 w-4/5 rounded bg-navy-100/80" />
                <div className="grid grid-cols-3 gap-3 pt-4">
                  {[0, 1, 2].map((cell) => (
                    <div key={cell} className="h-14 rounded-xl bg-amber-100/60" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function TransparencySkeleton() {
  return (
    <section className="py-16" aria-hidden="true">
      <Container>
        <div className="mx-auto mb-12 space-y-4 text-center">
          <Skeleton className="mx-auto h-10 w-56" />
          <Skeleton className="mx-auto h-4 w-80 max-w-full" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <Skeleton key={item} className="h-44 rounded-2xl" />
          ))}
        </div>
      </Container>
    </section>
  );
}

export function SiteRouteSkeleton() {
  return (
    <div className="bg-cream" role="status" aria-live="polite" aria-label="載入中">
      <span className="sr-only">載入中…</span>
      <HeroSkeleton />
      <div className="space-y-2 pb-12">
        <HomePanelSkeleton />
        <FeatureCardsSkeleton />
      </div>
    </div>
  );
}
