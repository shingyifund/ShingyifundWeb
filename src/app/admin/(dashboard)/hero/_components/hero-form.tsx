"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { ImagePlus, Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  createSlide,
  type HeroSlideRecord,
  updateSlide,
  uploadHeroImage,
} from "../actions";

export function HeroForm({ slide }: { slide?: HeroSlideRecord }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = Boolean(slide);

  const [imageUrl, setImageUrl] = useState(slide?.image ?? "");
  const [previewUrl, setPreviewUrl] = useState(slide?.image ?? "");
  const [isActive, setIsActive] = useState(slide?.is_active ?? true);
  const [tone, setTone] = useState<"navy" | "amber">(slide?.tone ?? "navy");
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleUpload(file: File) {
    setMessage(null);
    setUploading(true);
    setPreviewUrl(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadHeroImage(formData);

    if (result.ok) {
      setImageUrl(result.url);
      setPreviewUrl(result.url);
    } else {
      setMessage(result.message);
      setPreviewUrl(slide?.image ?? "");
    }

    setUploading(false);
  }

  function handleSubmit(formData: FormData) {
    formData.set("image", imageUrl);
    formData.set("tone", tone);
    formData.set("is_active", String(isActive));

    startTransition(async () => {
      const result = slide
        ? await updateSlide(slide.id, formData)
        : await createSlide(formData);

      if (!result.ok) {
        setMessage(result.message ?? "儲存失敗");
        return;
      }

      router.push("/admin/hero");
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="title">主標題</Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={slide?.title ?? ""}
            placeholder="例：讓善意抵達需要的人"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">副標題</Label>
          <Textarea
            id="subtitle"
            name="subtitle"
            defaultValue={slide?.subtitle ?? ""}
            placeholder="輸入首頁輪播的補充說明"
            rows={5}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cta_label">按鈕文字</Label>
            <Input
              id="cta_label"
              name="cta_label"
              defaultValue={slide?.cta_label ?? ""}
              placeholder="了解更多"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cta_href">按鈕連結</Label>
            <Input
              id="cta_href"
              name="cta_href"
              defaultValue={slide?.cta_href ?? ""}
              placeholder="/about/origin"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>視覺色調</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTone("navy")}
                className={`rounded-lg border px-3 py-3 text-left text-sm transition ${
                  tone === "navy"
                    ? "border-navy-700 bg-navy-50 text-navy-900"
                    : "border-border bg-white text-muted-foreground hover:bg-muted"
                }`}
              >
                深藍
              </button>
              <button
                type="button"
                onClick={() => setTone("amber")}
                className={`rounded-lg border px-3 py-3 text-left text-sm transition ${
                  tone === "amber"
                    ? "border-amber-500 bg-amber-50 text-amber-800"
                    : "border-border bg-white text-muted-foreground hover:bg-muted"
                }`}
              >
                琥珀
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border bg-white px-4 py-3">
            <div>
              <Label htmlFor="is_active">顯示在首頁</Label>
              <p className="mt-1 text-xs text-muted-foreground">
                關閉後仍會保留資料，但前台不會顯示。
              </p>
            </div>
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </div>

        {message && (
          <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {message}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isPending || uploading}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <Save />}
            {isEdit ? "儲存變更" : "建立 slide"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => router.push("/admin/hero")}
          >
            <X />
            取消
          </Button>
        </div>
      </div>

      <aside className="space-y-3">
        <Label>Hero 圖片</Label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted text-muted-foreground transition hover:border-amber-400 hover:bg-amber-50"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Hero preview"
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <span className="flex flex-col items-center gap-2 text-sm">
              <ImagePlus className="size-7" />
              上傳圖片
            </span>
          )}
          {uploading && (
            <span className="absolute inset-0 flex items-center justify-center bg-white/75 text-sm text-foreground">
              <Loader2 className="mr-2 size-4 animate-spin" />
              上傳中
            </span>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleUpload(file);
          }}
        />
        <Input
          value={imageUrl}
          onChange={(event) => {
            setImageUrl(event.target.value);
            setPreviewUrl(event.target.value);
          }}
          placeholder="/images/hero.jpg 或 Supabase public URL"
        />
      </aside>
    </form>
  );
}
