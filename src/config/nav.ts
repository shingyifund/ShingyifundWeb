/** 導覽列結構（單一來源；桌機與手機共用） */
export type NavChild = { label: string; href: string };
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
      { label: "社會公益活動", href: "/services/charity" },
    ],
  },
  { label: "永續興毅", href: "/sustainability" },
  {
    label: "愛心捐獻",
    href: "/donate",
    children: [{ label: "捐款專案", href: "/donate/projects" }],
  },
  {
    label: "徵信明細",
    href: "/transparency",
    children: [
      { label: "捐款芳名錄", href: "/transparency/donors" },
      { label: "受贈者名單", href: "/transparency/recipients" },
      { label: "每月捐物清單", href: "/transparency/needs" },
      { label: "財務報告", href: "/transparency/financial" },
      { label: "勸募成果報告", href: "/transparency/fundraising" },
    ],
  },
];
