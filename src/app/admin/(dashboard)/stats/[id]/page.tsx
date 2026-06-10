import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { StatForm } from "../_components/stat-form";
import { getStatById } from "../actions";

export default async function EditStatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const stat = await getStatById(id);

  if (!stat) notFound();

  return (
    <div className="space-y-6">
      <Button href="/admin/stats" variant="ghost" size="sm">
        <ArrowLeft />
        返回列表
      </Button>

      <section className="max-w-md rounded-lg border bg-white p-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-foreground">編輯成效指標</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            修改後立即反映到首頁。
          </p>
        </div>
        <StatForm stat={stat} />
      </section>
    </div>
  );
}
