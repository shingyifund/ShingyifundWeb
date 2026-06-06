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
    ],
  },
  {
    label: "興毅訊息",
    href: "/news",
    children: [
      { label: "興毅新聞", href: "/news" },
      { label: "興毅報導", href: "/news/reports" },
      { label: "興毅故事", href: "/news/stories" },
      { label: "興毅季刊", href: "/news/quarterly" },
    ],
  },
  {
    label: "興毅服務",
    href: "/services",
    children: [
      { label: "兒少福利服務", href: "/services/children" },
      { label: "老人福利服務", href: "/services/elderly" },
      { label: "身障福利服務", href: "/services/disability" },
      { label: "社會救助服務", href: "/services/relief" },
      { label: "社會公益活動", href: "/services/charity" },
      { label: "其他社福服務", href: "/services/others" },
      { label: "志願服務", href: "/services/volunteer" },
      { label: "志工培訓", href: "/services/training" },
    ],
  },
  { label: "永續興毅", href: "/sustainability" },
  {
    label: "忠信食物銀行",
    href: "/foodbank",
    children: [
      { label: "關於食物銀行", href: "/foodbank/about" },
      { label: "申請說明", href: "/foodbank/apply" },
      { label: "每月捐物清單", href: "/foodbank/needs" },
    ],
  },
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
      { label: "財務報告", href: "/transparency/financial" },
      { label: "勸募成果報告", href: "/transparency/fundraising" },
    ],
  },
];
