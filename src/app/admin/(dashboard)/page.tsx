import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  FileBarChart,
  ImageIcon,
  PackageOpen,
  Plus,
  TrendingUp,
} from "lucide-react";
import { ModuleLinkButton } from "./_components/module-link-button";

const modules = [
  {
    title: "首頁 Hero 輪播",
    description: "維護首頁主視覺圖片、標題、按鈕連結、顯示狀態與排序。",
    href: "/admin/hero",
    icon: ImageIcon,
  },
  {
    title: "服務成效",
    description: "維護首頁「我們的服務成效」區塊的五項指標數字。",
    href: "/admin/stats",
    icon: BarChart3,
  },
  {
    title: "財務報告",
    description: "上傳與管理徵信明細中的年度財務報告 PDF。",
    href: "/admin/financial-reports",
    icon: FileBarChart,
  },
  {
    title: "每月捐物清單",
    description: "管理徵信明細中的每月捐物文字明細與物品照片。",
    href: "/admin/monthly-donations",
    icon: PackageOpen,
  },
  {
    title: "勸募成果報告",
    description: "上傳與管理徵信明細中的年度勸募成果報告 PDF。",
    href: "/admin/fundraising-reports",
    icon: TrendingUp,
  },
];

export default function AdminPage() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* 快速新增捐物清單（強調卡） */}
      <Card className="flex flex-col rounded-lg border-amber-300 bg-amber-50">
        <CardHeader>
          <div className="flex items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white">
              <Plus className="size-6" />
            </span>
            <CardTitle className="text-lg text-amber-900">快速新增捐物</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          <p className="flex-1 text-sm leading-6 text-amber-800/80">
            直接建立一筆每月捐物清單，省去先進入管理頁的步驟。
          </p>
          <ModuleLinkButton
            href="/admin/monthly-donations/new"
            label="新增捐物清單"
            variant="default"
            icon="plus"
          />
        </CardContent>
      </Card>

      {modules.map((module) => {
        const Icon = module.icon;

        return (
          <Card key={module.href} className="flex flex-col rounded-lg bg-white">
            <CardHeader>
              <div className="flex items-center gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                  <Icon className="size-6" />
                </span>
                <CardTitle className="text-lg">{module.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              <p className="flex-1 text-sm leading-6 text-muted-foreground">
                {module.description}
              </p>
              <ModuleLinkButton href={module.href} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
