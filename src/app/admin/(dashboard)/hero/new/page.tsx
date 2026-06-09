import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { HeroForm } from "../_components/hero-form";

export default function NewSlidePage() {
  return (
    <div className="space-y-6">
      <Button href="/admin/hero" variant="ghost" size="sm">
        <ArrowLeft />
        返回列表
      </Button>

      <section className="rounded-lg border bg-white p-6">
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground">新增 slide</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">
            建立首頁輪播
          </h1>
        </div>
        <HeroForm />
      </section>
    </div>
  );
}
