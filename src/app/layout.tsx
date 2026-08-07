import type { Metadata, Viewport } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { LocaleProvider } from "@/i18n/provider";
import { getRequestLocale, getRequestPath } from "@/i18n/request";
import { localeToHtmlLang } from "@/i18n/config";

const notoSans = Noto_Sans_TC({
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-noto-sans-tc",
  display: "swap",
  preload: false,
});

const notoSerif = Noto_Serif_TC({
  weight: ["500", "600", "700", "900"],
  variable: "--font-noto-serif-tc",
  display: "swap",
  preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const pathname = await getRequestPath();
  const pathWithoutLocale = pathname?.replace(/^\/(tw|en)(?=\/|$)/, "") || "";
  const isEnglish = locale === "en";
  const name = isEnglish
    ? "Shing Yi Social Welfare and Charity Foundation"
    : "財團法人興毅社會福利慈善事業基金會";
  const shortName = isEnglish ? "Shing Yi Foundation" : "興毅基金會";
  const description = isEnglish
    ? "Continuing compassion and making every need visible. Shing Yi Foundation supports vulnerable families through social assistance and food bank services."
    : "讓愛延續，讓需要被看見。興毅基金會透過社會救助與忠信食物銀行服務，陪伴弱勢家庭度過難關。";

  return {
    metadataBase: new URL("https://www.shingyifund.org"),
    title: { default: name, template: `%s｜${shortName}` },
    description,
    alternates: pathname
      ? {
          canonical: `/${locale}${pathWithoutLocale}`,
          languages: {
            "zh-Hant-TW": `/tw${pathWithoutLocale}`,
            en: `/en${pathWithoutLocale}`,
          },
        }
      : undefined,
    keywords: isEnglish
      ? ["Shing Yi Foundation", "social assistance", "food bank", "charity", "Taiwan"]
      : ["興毅基金會", "社會救助", "食物銀行", "慈善捐款", "弱勢家庭", "公益"],
    icons: {
      icon: [
        { url: "/brand/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/brand/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: "/brand/apple-touch-icon.png",
    },
    openGraph: {
      type: "website",
      locale: isEnglish ? "en_US" : "zh_TW",
      alternateLocale: isEnglish ? ["zh_TW"] : ["en_US"],
      siteName: shortName,
      title: name,
      description,
      images: [{ url: "/images/about-hero-bg.jpg", width: 1200, height: 630, alt: shortName }],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#1b3d72",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getRequestLocale();

  return (
    <html lang={localeToHtmlLang(locale)} className={cn(notoSans.variable, notoSerif.variable, "font-sans")}>
      <body className="bg-grain min-h-screen antialiased">
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}
