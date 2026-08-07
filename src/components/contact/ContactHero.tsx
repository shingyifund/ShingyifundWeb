import { Container } from "@/components/ui/Container";
import { getRequestLocale } from "@/i18n/request";
import { translate } from "@/i18n/translations";

export async function ContactHero() {
  const locale = await getRequestLocale();
  return (
    <section className="relative overflow-hidden bg-navy-900 py-16 text-white sm:py-20">
      {/* 裝飾光暈 */}
      <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-navy-600/40 blur-2xl" style={{ transform: "translateZ(0)" }} />
      <div className="pointer-events-none absolute -bottom-28 -right-20 size-72 rounded-full bg-amber-500/15 blur-2xl" style={{ transform: "translateZ(0)" }} />
      {/* 細格紋 */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.06)_1px,transparent_0)] bg-size-[28px_28px]" />

      <Container className="relative text-center">
        <p className="font-serif text-sm font-medium uppercase tracking-[0.3em] text-amber-300">
          Contact Us
        </p>
        <h1 className="mt-4 font-serif text-4xl font-black tracking-wide sm:text-5xl">
          {translate(locale, "聯絡我們")}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-navy-100/80 sm:text-lg">
          {locale === "en"
            ? "Our service locations support communities across Taiwan. Contact the location nearest you and help compassion continue."
            : "興毅遍布北中南的服務據點，歡迎您就近聯繫，一起讓愛延續、讓需要被看見。"}
        </p>
      </Container>
    </section>
  );
}
