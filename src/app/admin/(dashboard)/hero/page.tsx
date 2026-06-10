import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { HeroTable } from "./_components/hero-table";
import { listSlides } from "./actions";

export default async function HeroAdminPage() {
  const slides = await listSlides();
  const activeCount = slides.filter((slide) => slide.is_active).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mt-1 text-3xl font-semibold text-foreground">
            Hero輪播
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            共 {slides.length} 張 slide，{activeCount} 張正在首頁顯示。
          </p>
        </div>
        <Button href="/admin/hero/new">
          <Plus />
          新增 slide
        </Button>
      </div>

      <HeroTable slides={slides} />
    </div>
  );
}
