import type { Metadata, Viewport } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.shingyifund.org"),
  title: {
    default: "財團法人興毅社會福利慈善事業基金會",
    template: "%s｜興毅基金會",
  },
  description:
    "讓愛延續，讓需要被看見。興毅基金會透過社會救助與忠信食物銀行服務，陪伴弱勢家庭度過難關。",
  keywords: ["興毅基金會", "社會救助", "食物銀行", "慈善捐款", "弱勢家庭", "公益"],
  icons: {
    icon: [
      { url: "/brand/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/brand/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName: "興毅基金會",
    title: "財團法人興毅社會福利慈善事業基金會",
    description: "讓愛延續，讓需要被看見。",
    images: [
      {
        url: "/images/about-hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "興毅基金會",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#1b3d72",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body className="bg-grain min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
