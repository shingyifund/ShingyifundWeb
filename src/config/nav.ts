/** 線上捐款系統（neticrm）外部網址 */
export const ONLINE_DONATION_URL =
  "https://shingyifund.neticrm.tw/civicrm/contribute/transact?reset=1&id=2";

/** 導覽列結構（單一來源；桌機與手機共用） */
export type NavChild = { label: string; href: string; external?: boolean };
export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

export const mainNav: NavItem[] = [
  { label: "首頁", href: "/" },
  {
    label: "關於興毅",
    href: "/about",
    children: [
      { label: "興毅緣起", href: "/about/origin" },
      { label: "聯絡我們", href: "/about/contact" },
      { label: "興毅季刊", href: "/about/quarterly" },
    ],
  },
  {
    label: "興毅服務",
    href: "/services",
    children: [
      { label: "社會救助服務", href: "/services/relief" },
      { label: "忠信食物銀行", href: "/services/foodbank" },
    ],
  },
  { label: "永續興毅", href: "/sustainability" },
  {
    label: "愛心捐獻",
    href: "/donate",
    children: [
      { label: "線上捐款", href: ONLINE_DONATION_URL, external: true },
    ],
  },
  {
    label: "徵信明細",
    href: "/transparency",
    children: [
      { label: "捐款芳名錄", href: "/transparency/donors" },
      { label: "受贈者名單", href: "/transparency/recipients" },
      { label: "每月捐物清單", href: "/transparency/monthly-donations" },
      { label: "財務報告", href: "/transparency/financial" },
      { label: "勸募成果報告", href: "/transparency/fundraising" },
    ],
  },
];

import type { Locale } from "@/i18n/config";
import { localizeHref } from "@/i18n/config";
import { translateDeep } from "@/i18n/translations";

export function getMainNav(locale: Locale): NavItem[] {
  return translateDeep(locale, mainNav).map((item) => ({
    ...item,
    href: localizeHref(item.href, locale),
    children: item.children?.map((child) => ({
      ...child,
      href: child.external ? child.href : localizeHref(child.href, locale),
    })),
  }));
}
