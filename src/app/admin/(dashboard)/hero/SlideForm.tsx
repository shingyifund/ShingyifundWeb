"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createSlide, updateSlide, uploadImage } from "./actions";

type Slide = {
  id: string;
  title: string;
  subtitle: string | null;
  image: string | null;
  tone: string;
  cta_label: string | null;
  cta_href: string | null;
  sort: number;
  is_active: boolean;
};

export function SlideForm({ slide }: { slide?: Slide }) {
  const router = useRouter();
  const isEdit = !!slide;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState(slide?.image ?? "");
  const [preview, setPreview] = useState(slide?.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const fd = new FormData();
    fd.append("file", file);
    const { error, url } = await uploadImage(fd);

    if (error || !url) {
      setUploadError(error ?? "未知錯誤");
      setPreview(slide?.image ?? "");
    } else {
      setUploadError(null);
      setImageUrl(url);
    }

    setUploading(false);
  }

  function handleSubmit(formData: FormData) {
    formData.set("image", imageUrl);
    startTransition(async () => {
      if (isEdit) {
        await updateSlide(slide.id, formData);
      } else {
        await createSlide(formData);
      }
      router.push("/admin/hero");
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {/* 圖片上傳 */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">圖片</label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition hover:border-amber-400 hover:bg-amber-50"
          style={{ minHeight: 180 }}
        >
          {preview ? (
            <img src={preview} alt="預覽" className="h-44 w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 py-10 text-gray-400">
              <ImagePlus className="size-8" />
              <span className="text-sm">點此選擇圖片</span>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Loader2 className="size-6 animate-spin text-amber-500" />
              <span className="ml-2 text-sm text-gray-600">上傳中...</span>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          type="text"
          placeholder="或直接填圖片路徑 /images/..."
          value={imageUrl}
          onChange={(e) => {
            setImageUrl(e.target.value);
            setPreview(e.target.value);
            setUploadError(null);
          }}
          className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
        />
        {uploadError && (
          <p className="mt-1.5 text-sm text-red-500">上傳失敗：{uploadError}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          標題 <span className="text-red-500">*</span>
        </label>
        <input
          name="title"
          defaultValue={slide?.title}
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">副標題</label>
        <input
          name="subtitle"
          defaultValue={slide?.subtitle ?? ""}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">主題色</label>
          <select
            name="tone"
            defaultValue={slide?.tone ?? "navy"}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          >
            <option value="navy">navy（深藍）</option>
            <option value="amber">amber（琥珀）</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">排序</label>
          <input
            name="sort"
            type="number"
            defaultValue={slide?.sort ?? 0}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">按鈕文字</label>
          <input
            name="cta_label"
            defaultValue={slide?.cta_label ?? ""}
            placeholder="了解服務"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">按鈕連結</label>
          <input
            name="cta_href"
            defaultValue={slide?.cta_href ?? ""}
            placeholder="/services"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          value="true"
          defaultChecked={slide?.is_active ?? true}
          className="size-4 rounded border-gray-300 accent-amber-500"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
          啟用（顯示在首頁）
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={uploading || isPending}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {isEdit ? "儲存變更" : "新增 Slide"}
        </Button>
        <Button
          type="button"
          variant="white"
          disabled={isPending}
          onClick={() => router.push("/admin/hero")}
        >
          取消
        </Button>
      </div>
    </form>
  );
}
