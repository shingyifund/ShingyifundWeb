import { CircleAlert, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { foodbankConfig } from "@/config/foodbank";

/**
 * 申請前最重要的前置條件：採實體據點制、須先取得會員資格。
 * 置於頁面最前段，避免民眾誤以為可直接到店領取而白跑一趟。
 */
export function FoodbankNotice() {
  const { notice } = foodbankConfig;

  return (
    <section className="bg-cream py-16 sm:py-20">
      <Container>
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-amber-200 bg-amber-50 shadow-card">
            <div className="flex flex-col gap-5 p-6 sm:flex-row sm:gap-6 sm:p-8">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
                <CircleAlert className="size-6" strokeWidth={1.5} />
              </span>

              <div className="min-w-0">
                <h2 className="font-serif text-2xl font-bold text-navy-900 sm:text-3xl">
                  {notice.title}
                </h2>
                <p className="mt-2 font-medium text-amber-800">{notice.lead}</p>
                <p className="mt-4 text-base leading-relaxed text-ink-soft">
                  {notice.body}
                </p>
              </div>
            </div>

            <div className="border-t border-amber-200 bg-white/70 p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-600">
                  <MapPin className="size-5" strokeWidth={1.5} />
                </span>
                <div className="min-w-0">
                  <h3 className="font-serif text-lg font-bold text-navy-900">
                    不在服務據點範圍內？
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                    {notice.help}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
