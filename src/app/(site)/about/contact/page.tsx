import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactSection } from "@/components/contact/ContactSection";

export const metadata: Metadata = {
  title: "聯絡我們",
  description:
    "興毅基金會總部及台北、台南、新北忠信食物銀行、桃園惜食基地等服務據點地址、電話與聯絡方式。",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactSection />
    </>
  );
}
