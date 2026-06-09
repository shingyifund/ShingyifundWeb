import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { HeroForm } from "../_components/hero-form";
import { getSlideById } from "../actions";

export default async function EditSlidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const slide = await getSlideById(id);

  if (!slide) notFound();

  return (
    <div className="space-y-6">
      <Button href="/admin/hero" variant="ghost" size="sm">
        <ArrowLeft />
        返回列表
      </Button>

      <section className="rounded-lg border bg-white p-6">
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground">編輯 slide</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">
            {slide.title}
          </h1>
        </div>
        <HeroForm slide={slide} />
      </section>
    </div>
  );
}
