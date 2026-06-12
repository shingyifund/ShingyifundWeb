"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Camera, Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormAlert } from "@/components/ui/form-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { UploadTrigger } from "@/components/admin/upload-trigger";
import {
  MONTHLY_DONATION_DONOR_TYPES,
  MONTHLY_DONATION_REGIONS,
  buildMonthlyDonationTitle,
} from "@/lib/monthly-donations";
import {
  createMonthlyDonationReport,
  type MonthlyDonationReportRecord,
  updateMonthlyDonationReport,
} from "../actions";

const MAX_UPLOAD_WIDTH = 1200;
const MAX_UPLOAD_HEIGHT = 900;
const UPLOAD_QUALITY = 0.62;
const MAX_ACTION_FILE_BYTES = 500 * 1024;
const MAX_IMAGE_COUNT = 40;

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
  if (!blob) return file;

  const filename = file.name.replace(/\.[^.]+$/, "") || "donation-image";
  return new File([blob], `${filename}.webp`, { type: "image/webp" });
}

function toPeriodValue(report?: MonthlyDonationReportRecord) {
  if (!report) return "";
  return `${report.western_year}-${String(report.month).padStart(2, "0")}`;
}

export function MonthlyDonationForm({
  report,
}: {
  report?: MonthlyDonationReportRecord;
}) {
  const router = useRouter();
  const [period, setPeriod] = useState(toPeriodValue(report));
  const [region, setRegion] = useState<MonthlyDonationReportRecord["region"]>(
    report?.region ?? "taipei",
  );
  const [donorType, setDonorType] = useState<
    MonthlyDonationReportRecord["donor_type"]
  >(report?.donor_type ?? "individual");
  const [donorName, setDonorName] = useState(report?.donor_name ?? "");
  const [isAnonymous, setIsAnonymous] = useState(report?.is_anonymous ?? false);
  const [isPublished, setIsPublished] = useState(report?.is_published ?? true);
  const [customTitle, setCustomTitle] = useState<string | null>(() => {
    if (!report?.title) return null;
    return report.title !==
      buildMonthlyDonationTitle({
        donorName: report.donor_name,
        isAnonymous: report.is_anonymous,
      })
      ? report.title
      : null;
  });
  const [existingCaptions, setExistingCaptions] = useState<
    Record<string, string>
  >(() =>
    Object.fromEntries(
      (report?.images ?? []).map((img) => [img.id, img.caption ?? ""]),
    ),
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [newCaptions, setNewCaptions] = useState<string[]>([]);
  const [deleteImageIds, setDeleteImageIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [message, setMessage] = useState<string | null>(null);
  const submittingRef = useRef(false);
  const [submitStarted, setSubmitStarted] = useState(false);
  const [processingImages, setProcessingImages] = useState(false);
  const [isPending, startTransition] = useTransition();
  const title = useMemo(
    () =>
      customTitle ?? buildMonthlyDonationTitle({ donorName: donorName || null, isAnonymous }),
    [customTitle, donorName, isAnonymous],
  );
  const busy = submitStarted || isPending || processingImages;
  const busyText = processingImages ? "正在壓縮圖片..." : "正在儲存...";
  const selectedPreviews = useMemo(
    () =>
      selectedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [selectedFiles],
  );

  useEffect(() => {
    return () => {
      selectedPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [selectedPreviews]);

  function appendFiles(files: File[]) {
    setSelectedFiles((current) => [...current, ...files]);
    setNewCaptions((current) => [...current, ...files.map(() => "")]);
  }

  function removeSelectedFile(index: number) {
    setSelectedFiles((current) => current.filter((_, i) => i !== index));
    setNewCaptions((current) => current.filter((_, i) => i !== index));
  }

  function resetSubmitState() {
    submittingRef.current = false;
    setSubmitStarted(false);
    setProcessingImages(false);
  }

  async function handleSubmit(formData: FormData) {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitStarted(true);
    setMessage(null);

    if (selectedFiles.length > MAX_IMAGE_COUNT) {
      setMessage(`每筆最多上傳 ${MAX_IMAGE_COUNT} 張圖片`);
      resetSubmitState();
      return;
    }

    setProcessingImages(true);
    const uploadFiles: File[] = [];

    try {
      for (const file of selectedFiles) {
        const uploadFile = await resizeImageForUpload(file);
        if (uploadFile.size > MAX_ACTION_FILE_BYTES) {
          setMessage("圖片壓縮後仍超過 500KB，請換較小圖片。");
          resetSubmitState();
          return;
        }
        uploadFiles.push(uploadFile);
      }
    } catch {
      setMessage("圖片壓縮失敗，請換一張圖片。");
      resetSubmitState();
      return;
    } finally {
      setProcessingImages(false);
    }

    formData.set("period", period);
    formData.set("region", region);
    formData.set("donor_type", donorType);
    formData.set("donor_name", donorName);
    formData.set("is_anonymous", String(isAnonymous));
    formData.set("title", title);
    formData.set("is_published", String(isPublished));
    formData.delete("images");
    formData.delete("new_captions");
    uploadFiles.forEach((file, index) => {
      formData.append("images", file);
      formData.append("new_captions", newCaptions[index] ?? "");
    });
    for (const id of deleteImageIds) formData.append("delete_image_ids", id);
    // 既有圖片說明
    for (const [imageId, caption] of Object.entries(existingCaptions)) {
      formData.set(`image_caption_${imageId}`, caption);
    }

    startTransition(async () => {
      const result = await (report
        ? updateMonthlyDonationReport(report.id, formData)
        : createMonthlyDonationReport(formData)).catch((error) => ({
        ok: false,
        message: error instanceof Error ? error.message : "儲存失敗",
      }));

      if (!result.ok) {
        setMessage(result.message ?? "儲存失敗");
        resetSubmitState();
        return;
      }

      router.push("/admin/monthly-donations");
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="period">年月</Label>
        <Input
          id="period"
          type="month"
          min="1912-01"
          max="2999-12"
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>區域</Label>
          <ToggleGroup
            type="single"
            value={region}
            onValueChange={(v) => {
              if (v) setRegion(v as MonthlyDonationReportRecord["region"]);
            }}
            spacing={0}
            variant="outline"
            className="w-full"
          >
            {MONTHLY_DONATION_REGIONS.map((item) => (
              <ToggleGroupItem key={item.value} value={item.value} className="flex-1 text-sm">
                {item.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="space-y-2">
          <Label>分類</Label>
          <ToggleGroup
            type="single"
            value={donorType}
            onValueChange={(v) => {
              if (v) setDonorType(v as MonthlyDonationReportRecord["donor_type"]);
            }}
            spacing={0}
            variant="outline"
            className="w-full"
          >
            {MONTHLY_DONATION_DONOR_TYPES.map((item) => (
              <ToggleGroupItem key={item.value} value={item.value} className="flex-1 text-sm">
                {item.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
        <div>
          <Label htmlFor="is_anonymous">匿名捐贈</Label>
          <p className="mt-1 text-xs text-muted-foreground">
            開啟後前台顯示「善心人士」，不公開姓名。
          </p>
        </div>
        <Switch
          id="is_anonymous"
          checked={isAnonymous}
          onCheckedChange={setIsAnonymous}
        />
      </div>

      {!isAnonymous && (
        <div className="space-y-2">
          <Label htmlFor="donor_name">捐贈者名稱</Label>
          <Input
            id="donor_name"
            value={donorName}
            onChange={(event) => setDonorName(event.target.value)}
            placeholder="例：沈小姐 / 里仁有機商店"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">標題</Label>
        <Input
          id="title"
          value={title}
          onChange={(event) => setCustomTitle(event.target.value)}
          placeholder="感謝 善心人士 捐贈物資"
          required
        />
        <p className="text-xs text-muted-foreground">
          標題會依捐贈者名稱自動產生，也可手動修改。
        </p>
      </div>

      {report?.images.length ? (
        <div className="space-y-3">
          <Label>目前圖片</Label>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {report.images.map((image) => {
              const deleting = deleteImageIds.has(image.id);
              return (
                <div
                  key={image.id}
                  className="group overflow-hidden rounded-lg border bg-white"
                >
                  <div className="relative aspect-4/3 bg-muted">
                    <Image
                      src={image.image_url}
                      alt={image.file_name ?? "捐贈物資照片"}
                      fill
                      sizes="(min-width: 1024px) 240px, 50vw"
                      className="object-cover"
                    />
                    {deleting && (
                      <div className="absolute inset-0 flex items-center justify-center bg-destructive/70 text-sm font-semibold text-white">
                        將刪除
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 px-3 py-2">
                    <Input
                      value={existingCaptions[image.id] ?? ""}
                      onChange={(event) =>
                        setExistingCaptions((current) => ({
                          ...current,
                          [image.id]: event.target.value,
                        }))
                      }
                      placeholder="圖片說明（物資內容）"
                      disabled={deleting}
                      className="h-9 text-sm"
                    />
                    <span className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={deleting}
                        onChange={(event) => {
                          setDeleteImageIds((current) => {
                            const next = new Set(current);
                            if (event.target.checked) next.add(image.id);
                            else next.delete(image.id);
                            return next;
                          });
                        }}
                      />
                      刪除此圖片
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        <Label>新增圖片</Label>
        <div className="grid gap-2 sm:grid-cols-2">
          <UploadTrigger
            multiple
            accept="image/*"
            label="選擇圖片"
            hint="可多選相簿照片"
            onFilesSelected={appendFiles}
            className="sm:col-span-2"
          />
          {/* 拍照鈕只在手機顯示（桌機 capture 無效，會退化成選單張） */}
          <UploadTrigger
            accept="image/*"
            capture="environment"
            label="拍照"
            hint="直接開相機拍照"
            icon={<Camera className="size-5" strokeWidth={1.8} />}
            onFilesSelected={appendFiles}
            className="sm:hidden"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          送出前會自動壓縮，每張壓縮後需小於 500KB。
        </p>
        {selectedPreviews.length > 0 && (
          <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
            <p className="text-sm text-muted-foreground">
              已選擇 {selectedPreviews.length} 張圖片
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {selectedPreviews.map((preview, index) => (
                <div
                  key={`${preview.file.name}-${preview.file.lastModified}-${index}`}
                  className="overflow-hidden rounded-lg border bg-white"
                >
                  <div className="relative aspect-4/3 bg-muted">
                    <img
                      src={preview.url}
                      alt={preview.file.name}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="space-y-2 px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="min-w-0 truncate text-sm text-foreground">
                        {preview.file.name}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`移除 ${preview.file.name}`}
                        onClick={() => removeSelectedFile(index)}
                      >
                        <X />
                      </Button>
                    </div>
                    <Input
                      value={newCaptions[index] ?? ""}
                      onChange={(event) =>
                        setNewCaptions((current) => {
                          const next = [...current];
                          next[index] = event.target.value;
                          return next;
                        })
                      }
                      placeholder="圖片說明（物資內容）"
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
        <div>
          <Label htmlFor="is_published">公開顯示</Label>
          <p className="mt-1 text-xs text-muted-foreground">
            關閉後只會留在後台，不會顯示在前台。
          </p>
        </div>
        <Switch
          id="is_published"
          checked={isPublished}
          onCheckedChange={setIsPublished}
        />
      </div>

      <FormAlert message={message} />

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button type="submit" disabled={busy}>
          {busy && <Loader2 className="size-4 animate-spin" />}
          {busy ? "儲存中..." : "儲存"}
          {!busy && <Save />}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={() => router.back()}
        >
          <X />
          取消
        </Button>
        {busy && (
          <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-navy-700" />
            {busyText}
          </span>
        )}
      </div>
    </form>
  );
}
