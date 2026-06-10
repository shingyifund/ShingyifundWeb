"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { FormAlert } from "@/components/ui/form-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FileUploadField } from "./file-upload-field";
import {
  createSlide,
  type HeroSlideRecord,
  updateSlide,
} from "../actions";

type ContentType = "image" | "image_text" | "youtube";

const TYPE_LABELS: Record<ContentType, string> = {
  image: "單純圖片",
  image_text: "圖片加文字",
  youtube: "YouTube 影片",
};

const MAX_UPLOAD_WIDTH = 1600;
const MAX_UPLOAD_HEIGHT = 900;
const UPLOAD_QUALITY = 0.72;
const MAX_ACTION_FILE_BYTES = 900 * 1024;

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

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}

async function resizeImageForUpload(file: File) {
  const image = await createImageBitmap(file);
  const scale = Math.min(
    1,
    MAX_UPLOAD_WIDTH / image.width,
    MAX_UPLOAD_HEIGHT / image.height,
  );
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    image.close();
    return file;
  }

  ctx.drawImage(image, 0, 0, width, height);
  image.close();

  const blob = await canvasToBlob(canvas, "image/webp", UPLOAD_QUALITY);
  if (!blob || blob.size >= file.size) return file;

  const filename = file.name.replace(/\.[^.]+$/, "") || "hero-image";
  return new File([blob], `${filename}.webp`, { type: "image/webp" });
}

export function HeroForm({ slide }: { slide?: HeroSlideRecord }) {
  const router = useRouter();
  const isEdit = Boolean(slide);

  const [contentType, setContentType] = useState<ContentType>(
    (slide?.content_type ?? "image_text") as ContentType,
  );
  const [imageUrl, setImageUrl] = useState(slide?.image_url ?? "");
  const [previewUrl, setPreviewUrl] = useState(slide?.image_url ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState(slide?.link_url ?? "");
  const [posterImageUrl, setPosterImageUrl] = useState(slide?.poster_image_url ?? "");
  const [posterPreviewUrl, setPosterPreviewUrl] = useState(slide?.poster_image_url ?? "");
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState(slide?.youtube_url ?? "");
  const [youtubeVideoId, setYoutubeVideoId] = useState(slide?.youtube_video_id ?? "");
  const [hasTitle, setHasTitle] = useState(slide?.has_title ?? false);
  const [hasSubtitle, setHasSubtitle] = useState(slide?.has_subtitle ?? false);
  const [hasCta, setHasCta] = useState(slide?.has_cta ?? false);
  const [tone, setTone] = useState<"navy" | "amber">(slide?.tone ?? "navy");
  const [isActive, setIsActive] = useState(slide?.is_active ?? true);
  const [message, setMessage] = useState<string | null>(null);
  const [processingImage, setProcessingImage] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleYoutubeUrlChange(url: string) {
    setYoutubeUrl(url);
    setYoutubeVideoId(parseYouTubeId(url) ?? "");
  }

  async function handleFileSelect(file: File, target: "image" | "poster") {
    setMessage(null);
    setProcessingImage(true);

    try {
      const uploadFile = await resizeImageForUpload(file);

      if (uploadFile.size > MAX_ACTION_FILE_BYTES) {
        setMessage("圖片壓縮後仍超過 900KB，請換較小圖片。");
        return;
      }

      const blob = URL.createObjectURL(uploadFile);
      if (target === "image") {
        if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
        setImageFile(uploadFile);
        setImageUrl("");
        setPreviewUrl(blob);
      } else {
        if (posterPreviewUrl.startsWith("blob:")) URL.revokeObjectURL(posterPreviewUrl);
        setPosterFile(uploadFile);
        setPosterImageUrl("");
        setPosterPreviewUrl(blob);
      }
    } catch {
      setMessage("圖片壓縮失敗，請換一張圖片或直接輸入圖片網址");
      if (target === "image") setPreviewUrl(slide?.image_url ?? "");
      else setPosterPreviewUrl(slide?.poster_image_url ?? "");
    } finally {
      setProcessingImage(false);
    }
  }

  function handleSubmit(formData: FormData) {
    setMessage(null);
    if (contentType === "youtube" && !youtubeVideoId) {
      setMessage("無法解析 YouTube 影片 ID，請確認連結格式");
      return;
    }

    formData.set("content_type", contentType);
    formData.set("image_url", imageUrl);
    formData.set("link_url", linkUrl);
    formData.set("poster_image_url", posterImageUrl);
    if (showImageUpload && imageFile) formData.set("image_file", imageFile);
    if (contentType === "youtube" && posterFile) {
      formData.set("poster_file", posterFile);
    }
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
          {isEdit ? (
            <div className="inline-flex items-center rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
              {TYPE_LABELS[contentType]}
            </div>
          ) : (
            <ToggleGroup
              type="single"
              value={contentType}
              onValueChange={(v) => { if (v) setContentType(v as ContentType); }}
              spacing={0}
              variant="outline"
              className="w-full"
            >
              {(["image", "image_text", "youtube"] as ContentType[]).map((type) => (
                <ToggleGroupItem key={type} value={type} className="flex-1 text-sm">
                  {TYPE_LABELS[type]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}
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
              <Label htmlFor="has_title">主標題</Label>
              <div className="flex items-center gap-1.5">
                <Label htmlFor="has_title" className="cursor-pointer text-xs text-muted-foreground">
                  {hasTitle ? "顯示" : "隱藏"}
                </Label>
                <Switch id="has_title" checked={hasTitle} onCheckedChange={setHasTitle} />
              </div>
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
              <Label htmlFor="has_subtitle">副標題</Label>
              <div className="flex items-center gap-1.5">
                <Label htmlFor="has_subtitle" className="cursor-pointer text-xs text-muted-foreground">
                  {hasSubtitle ? "顯示" : "隱藏"}
                </Label>
                <Switch id="has_subtitle" checked={hasSubtitle} onCheckedChange={setHasSubtitle} />
              </div>
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
              <Label htmlFor="has_cta">CTA 按鈕</Label>
              <div className="flex items-center gap-1.5">
                <Label htmlFor="has_cta" className="cursor-pointer text-xs text-muted-foreground">
                  {hasCta ? "顯示" : "隱藏"}
                </Label>
                <Switch id="has_cta" checked={hasCta} onCheckedChange={setHasCta} />
              </div>
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
            <RadioGroup
              value={tone}
              onValueChange={(v) => setTone(v as "navy" | "amber")}
              className="grid grid-cols-2 gap-2"
            >
              {(["navy", "amber"] as const).map((t) => (
                <div key={t}>
                  <RadioGroupItem value={t} id={`tone-${t}`} className="sr-only" />
                  <Label
                    htmlFor={`tone-${t}`}
                    className={cn(
                      "flex cursor-pointer rounded-lg border px-3 py-3 text-sm transition",
                      tone === t
                        ? t === "navy"
                          ? "border-navy-700 bg-navy-50 font-medium text-navy-900"
                          : "border-amber-500 bg-amber-50 font-medium text-amber-800"
                        : "border-border bg-white font-normal text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {t === "navy" ? "深藍" : "琥珀"}
                  </Label>
                </div>
              ))}
            </RadioGroup>
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

        <FormAlert message={message} />

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isPending || processingImage}>
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
        {showImageUpload && (
          <div className="space-y-3">
            <Label>Hero 圖片</Label>
            <FileUploadField
              previewUrl={previewUrl}
              urlValue={imageUrl}
              uploading={processingImage}
              onFileSelect={(f) => handleFileSelect(f, "image")}
              onUrlChange={(url) => {
                if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
                setImageFile(null);
                setImageUrl(url);
                setPreviewUrl(url);
              }}
              emptyLabel="上傳圖片"
              urlPlaceholder="或直接輸入圖片網址"
              showUrlInput={!isEdit}
            />
            {contentType === "image" && (
              <div className="space-y-1.5">
                <Label htmlFor="link_url">點擊連結（選填）</Label>
                <Input
                  id="link_url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                />
                <p className="text-xs text-muted-foreground">填入後點擊圖片會開新視窗前往此連結</p>
              </div>
            )}
          </div>
        )}

        {contentType === "youtube" && (
          <div className="space-y-3">
            <Label>封面圖（選填）</Label>
            <FileUploadField
              previewUrl={posterPreviewUrl}
              urlValue={posterImageUrl}
              uploading={processingImage}
              onFileSelect={(f) => handleFileSelect(f, "poster")}
              onUrlChange={(url) => {
                if (posterPreviewUrl.startsWith("blob:")) URL.revokeObjectURL(posterPreviewUrl);
                setPosterFile(null);
                setPosterImageUrl(url);
                setPosterPreviewUrl(url);
              }}
              emptyLabel="封面圖（選填）"
              urlPlaceholder="或直接輸入封面圖網址"
              showUrlInput={!isEdit}
              fallbackSrc={
                youtubeVideoId
                  ? `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`
                  : undefined
              }
            />
          </div>
        )}
      </aside>
    </form>
  );
}
