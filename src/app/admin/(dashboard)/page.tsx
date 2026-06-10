import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, BarChart3, ArrowRight, FileBarChart } from "lucide-react";

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
];

export default function AdminPage() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {modules.map((module) => {
        const Icon = module.icon;

        return (
          <Card key={module.href} className="rounded-lg bg-white">
            <CardHeader>
              <div className="flex items-center gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                  <Icon className="size-6" />
                </span>
                <CardTitle className="text-lg">{module.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">
                {module.description}
              </p>
              <Button href={module.href} variant="outline" className="w-full">
                進入管理
                <ArrowRight />
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
