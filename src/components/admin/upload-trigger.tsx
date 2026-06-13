"use client";

import { useRef, type ReactNode } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

type UploadTriggerProps = {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  /** "environment" 後鏡頭、"user" 前鏡頭；設定後手機點擊直接開相機（iOS 需單選） */
  capture?: "environment" | "user";
  label?: string;
  hint?: string;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
  /**
   * "dropzone"（預設）：虛線大框，適合 PDF 等明確的單次上傳。
   * "button"：緊湊行內按鈕，適合圖片多選等頻繁操作。
   */
  variant?: "dropzone" | "button";
};

/**
 * 共用「上傳觸發鈕」：點擊開啟系統檔案選擇。
 * variant="dropzone" 為大框虛線，variant="button" 為緊湊行內鈕。
 */
export function UploadTrigger({
  onFilesSelected,
  accept = "image/*",
  multiple = false,
  capture,
  label = "選擇檔案",
  hint,
  icon,
  disabled = false,
  className,
  variant = "dropzone",
}: UploadTriggerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length > 0) onFilesSelected(files);
    event.target.value = "";
  };

  if (variant === "button") {
    return (
      <span className={cn("inline-flex", className)}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-1.5 text-sm font-medium text-foreground shadow-xs transition-colors hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 disabled:pointer-events-none disabled:opacity-50"
        >
          <span className="flex shrink-0 items-center text-amber-600">
            {icon ?? <UploadCloud className="size-4" strokeWidth={1.8} />}
          </span>
          {label}
          {hint && <span className="text-xs font-normal text-muted-foreground">· {hint}</span>}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          capture={capture}
          className="hidden"
          onChange={handleChange}
        />
      </span>
    );
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-7 text-center transition-colors hover:border-amber-400 hover:bg-amber-50 disabled:pointer-events-none disabled:opacity-50"
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-white text-amber-600 shadow-sm">
          {icon ?? <UploadCloud className="size-5" strokeWidth={1.8} />}
        </span>
        <span className="text-sm font-medium text-foreground">{label}</span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        capture={capture}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
