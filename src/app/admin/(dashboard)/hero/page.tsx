import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import { SlideRow } from "./SlideRow";

export default async function HeroAdminPage() {
  const supabase = await createAdminClient();
  const { data: slides } = await supabase
    .from("hero_slides")
    .select("*")
    .order("sort");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-600">
            後台
          </Link>
          <span className="mx-1.5 text-gray-300">/</span>
          <span className="text-sm font-medium text-gray-700">首頁輪播</span>
        </div>
        <Link
          href="/admin/hero/new"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-400"
        >
          <Plus className="size-4" />
          新增 Slide
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {slides && slides.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">順序</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">標題</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">主題色</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">狀態</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">動作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {slides.map((slide) => (
                <SlideRow key={slide.id} slide={slide} />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-16 text-center text-gray-400">尚無 Slide，點右上角新增</div>
        )}
      </div>
    </div>
  );
}
