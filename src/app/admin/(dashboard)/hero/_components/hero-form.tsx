"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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

type ContentType = "image" | "image_text" | "youtube";

const TYPE_LABELS: Record<ContentType, string> = {
  image: "單純圖片",
  image_text: "圖片加文字",
  youtube: "YouTube 影片",
};

function parseYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("?")[0] || null;
    const v = u.searchParams.get("v");
    if (v) return v;
    const m = u.pathname.match(/\/embed\/([^/?]+)/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

export function HeroForm({ slide }: { slide?: HeroSlideRecord }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const posterFileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = Boolean(slide);

  const [contentType, setContentType] = useState<ContentType>(
    (slide?.content_type ?? "image_text") as ContentType,
  );
  const [imageUrl, setImageUrl] = useState(slide?.image_url ?? "");
  const [previewUrl, setPreviewUrl] = useState(slide?.image_url ?? "");
  const [posterImageUrl, setPosterImageUrl] = useState(slide?.poster_image_url ?? "");
  const [posterPreviewUrl, setPosterPreviewUrl] = useState(slide?.poster_image_url ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(slide?.youtube_url ?? "");
  const [youtubeVideoId, setYoutubeVideoId] = useState(slide?.youtube_video_id ?? "");
  const [hasTitle, setHasTitle] = useState(slide?.has_title ?? false);
  const [hasSubtitle, setHasSubtitle] = useState(slide?.has_subtitle ?? false);
  const [hasCta, setHasCta] = useState(slide?.has_cta ?? false);
  const [tone, setTone] = useState<"navy" | "amber">(slide?.tone ?? "navy");
  const [isActive, setIsActive] = useState(slide?.is_active ?? true);
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleYoutubeUrlChange(url: string) {
    setYoutubeUrl(url);
    setYoutubeVideoId(parseYouTubeId(url) ?? "");
  }

  async function handleUpload(file: File, target: "image" | "poster") {
    setMessage(null);
    setUploading(true);
    const blob = URL.createObjectURL(file);
    if (target === "image") setPreviewUrl(blob);
    else setPosterPreviewUrl(blob);

    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadHeroImage(fd);

    if (result.ok) {
      if (target === "image") {
        setImageUrl(result.url);
        setPreviewUrl(result.url);
      } else {
        setPosterImageUrl(result.url);
        setPosterPreviewUrl(result.url);
      }
    } else {
      setMessage(result.message);
      if (target === "image") setPreviewUrl(slide?.image_url ?? "");
      else setPosterPreviewUrl(slide?.poster_image_url ?? "");
    }
    setUploading(false);
  }

  function handleSubmit(formData: FormData) {
    setMessage(null);
    if (contentType === "youtube" && !youtubeVideoId) {
      setMessage("無法解析 YouTube 影片 ID，請確認連結格式");
      return;
    }

    formData.set("content_type", contentType);
    formData.set("image_url", imageUrl);
    formData.set("poster_image_url", posterImageUrl);
    formData.set("youtube_url", youtubeUrl);
    formData.set("youtube_video_id", youtubeVideoId);
    formData.set("has_title", String(hasTitle));
    formData.set("has_subtitle", String(hasSubtitle));
    formData.set("has_cta", String(hasCta));
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

  const showImageUpload = contentType === "image" || contentType === "image_text";
  const showTextFields = contentType === "image_text" || contentType === "youtube";

  return (
    <form action={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-5">
        {/* Hero 型態 */}
        <div className="space-y-2">
          <Label>Hero 型態</Label>
          <div className="grid grid-cols-3 gap-2">
            {(["image", "image_text", "youtube"] as ContentType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setContentType(type)}
                className={`rounded-lg border px-3 py-2.5 text-center text-sm transition ${
                  contentType === type
                    ? "border-navy-700 bg-navy-50 font-medium text-navy-900"
                    : "border-border bg-white text-muted-foreground hover:bg-muted"
                }`}
              >
                {TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        {/* YouTube 網址 */}
        {contentType === "youtube" && (
          <div className="space-y-2">
            <Label htmlFor="youtube_url">YouTube 網址</Label>
            <Input
              id="youtube_url"
              value={youtubeUrl}
              onChange={(e) => handleYoutubeUrlChange(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            {youtubeUrl && !youtubeVideoId && (
              <p className="text-sm text-destructive">
                無法解析影片 ID，請確認連結格式
              </p>
            )}
            {youtubeVideoId && (
              <p className="text-sm text-muted-foreground">影片 ID：{youtubeVideoId}</p>
            )}
          </div>
        )}

        {/* 主標題 */}
        {showTextFields && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>主標題</Label>
              <Switch checked={hasTitle} onCheckedChange={setHasTitle} />
            </div>
            {hasTitle && (
              <Input
                name="title"
                defaultValue={slide?.title ?? ""}
                placeholder="例：讓善意抵達需要的人"
              />
            )}
          </div>
        )}

        {/* 副標題 */}
        {showTextFields && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>副標題</Label>
              <Switch checked={hasSubtitle} onCheckedChange={setHasSubtitle} />
            </div>
            {hasSubtitle && (
              <Textarea
                name="subtitle"
                defaultValue={slide?.subtitle ?? ""}
                placeholder="輸入首頁輪播的補充說明"
                rows={4}
              />
            )}
          </div>
        )}

        {/* CTA（僅 image_text） */}
        {contentType === "image_text" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>CTA 按鈕</Label>
              <Switch checked={hasCta} onCheckedChange={setHasCta} />
            </div>
            {hasCta && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="cta_label">按鈕文字</Label>
                  <Input
                    id="cta_label"
                    name="cta_label"
                    defaultValue={slide?.cta_label ?? ""}
                    placeholder="了解更多"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cta_href">按鈕連結</Label>
                  <Input
                    id="cta_href"
                    name="cta_href"
                    defaultValue={slide?.cta_href ?? ""}
                    placeholder="/about"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 視覺色調（僅 image_text） */}
        {contentType === "image_text" && (
          <div className="space-y-2">
            <Label>視覺色調</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["navy", "amber"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`rounded-lg border px-3 py-3 text-left text-sm transition ${
                    tone === t
                      ? t === "navy"
                        ? "border-navy-700 bg-navy-50 text-navy-900"
                        : "border-amber-500 bg-amber-50 text-amber-800"
                      : "border-border bg-white text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {t === "navy" ? "深藍" : "琥珀"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 顯示狀態 */}
        <div className="flex items-center justify-between rounded-lg border bg-white px-4 py-3">
          <div>
            <Label htmlFor="is_active">顯示在首頁</Label>
            <p className="mt-1 text-xs text-muted-foreground">
              關閉後仍會保留資料，但前台不會顯示。
            </p>
          </div>
          <Switch id="is_active" checked={isActive} onCheckedChange={setIsActive} />
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

      {/* 側欄 */}
      <aside className="space-y-4">
        {/* 圖片上傳（image + image_text） */}
        {showImageUpload && (
          <div className="space-y-3">
            <Label>Hero 圖片</Label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex aspect-16/10 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted text-muted-foreground transition hover:border-amber-400 hover:bg-amber-50"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                <span className="flex flex-col items-center gap-2 text-sm">
                  <ImagePlus className="size-7" />
                  上傳圖片
                </span>
              )}
              {uploading && (
                <span className="absolute inset-0 flex items-center justify-center bg-white/75 text-sm">
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
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleUpload(f, "image");
              }}
            />
            <Input
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setPreviewUrl(e.target.value);
              }}
              placeholder="或直接輸入圖片網址"
            />
          </div>
        )}

        {/* 封面圖（youtube） */}
        {contentType === "youtube" && (
          <div className="space-y-3">
            <Label>封面圖（選填）</Label>
            <button
              type="button"
              onClick={() => posterFileInputRef.current?.click()}
              className="group relative flex aspect-16/10 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted text-muted-foreground transition hover:border-amber-400 hover:bg-amber-50"
            >
              {posterPreviewUrl ? (
                <img
                  src={posterPreviewUrl}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                />
              ) : youtubeVideoId ? (
                <img
                  src={`https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`}
                  alt=""
                  className="absolute inset-0 size-full object-cover opacity-50"
                />
              ) : (
                <span className="flex flex-col items-center gap-2 text-sm">
                  <ImagePlus className="size-7" />
                  封面圖（選填）
                </span>
              )}
              {uploading && (
                <span className="absolute inset-0 flex items-center justify-center bg-white/75 text-sm">
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  上傳中
                </span>
              )}
            </button>
            <input
              ref={posterFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleUpload(f, "poster");
              }}
            />
            <Input
              value={posterImageUrl}
              onChange={(e) => {
                setPosterImageUrl(e.target.value);
                setPosterPreviewUrl(e.target.value);
              }}
              placeholder="或直接輸入封面圖網址"
            />
          </div>
        )}
      </aside>
    </form>
  );
}
