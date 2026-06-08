import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SlideForm } from "../SlideForm";

export default async function EditSlidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: slide } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("id", id)
    .single();

  if (!slide) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link href="/admin/hero" className="text-sm text-gray-400 hover:text-gray-600">
          首頁輪播
        </Link>
        <span className="mx-1.5 text-gray-300">/</span>
        <span className="text-sm font-medium text-gray-700">編輯 Slide</span>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-lg font-bold text-gray-900">編輯 Slide</h1>
        <SlideForm slide={slide} />
      </div>
    </div>
  );
}
