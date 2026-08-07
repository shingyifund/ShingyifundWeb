import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { DonateFab } from "@/components/donate/DonateFab";
import { BackToTop } from "@/components/ui/BackToTop";
import { getRequestLocale } from "@/i18n/request";
import { translate } from "@/i18n/translations";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const locale = await getRequestLocale();
  return (
    <MotionProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-navy-800 focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white"
      >
        {translate(locale, "跳到主要內容")}
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <DonateFab />
      <BackToTop />
    </MotionProvider>
  );
}
