"use client";

import { useRef, type ReactNode } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

type UploadTriggerProps = {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  hint?: string;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
};

/**
 * 共用「上傳觸發鈕」：虛線框 + icon + 文字，點擊開啟系統檔案選擇。
 * 封裝原生 <input type="file">，不外露。各場景自接檔案處理邏輯。
 */
export function UploadTrigger({
  onFilesSelected,
  accept = "image/*",
  multiple = false,
  label = "選擇檔案",
  hint,
  icon,
  disabled = false,
  className,
}: UploadTriggerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

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
        className="hidden"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          if (files.length > 0) onFilesSelected(files);
          // 清空以便重選同檔
          event.target.value = "";
        }}
      />
    </div>
  );
}
