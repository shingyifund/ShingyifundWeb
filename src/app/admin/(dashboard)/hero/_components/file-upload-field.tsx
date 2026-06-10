"use client";

import { useRef } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";

type Props = {
  previewUrl: string;
  urlValue: string;
  uploading: boolean;
  onFileSelect: (file: File) => void;
  onUrlChange: (url: string) => void;
  emptyLabel?: string;
  urlPlaceholder?: string;
  fallbackSrc?: string;
};

export function FileUploadField({
  previewUrl,
  urlValue,
  uploading,
  onFileSelect,
  onUrlChange,
  emptyLabel = "上傳圖片",
  urlPlaceholder = "或直接輸入圖片網址",
  fallbackSrc,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="group relative flex h-auto aspect-video w-full items-center justify-center overflow-hidden rounded-lg border-dashed text-muted-foreground hover:border-amber-400 hover:bg-amber-50"
        onClick={() => inputRef.current?.click()}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="" className="absolute inset-0 size-full object-cover" />
        ) : fallbackSrc ? (
          <img src={fallbackSrc} alt="" className="absolute inset-0 size-full object-cover opacity-50" />
        ) : (
          <span className="flex flex-col items-center gap-2 text-sm">
            <ImagePlus className="size-7" />
            {emptyLabel}
          </span>
        )}
        {uploading && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/75 text-sm">
            <Loader2 className="mr-2 size-4 animate-spin" />
            上傳中
          </span>
        )}
      </Button>

      {/* 瀏覽器 file picker 必須使用 <input type="file">，封裝於此不外露 */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFileSelect(f);
        }}
      />

      <Input
        value={urlValue}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder={urlPlaceholder}
      />
    </div>
  );
}
