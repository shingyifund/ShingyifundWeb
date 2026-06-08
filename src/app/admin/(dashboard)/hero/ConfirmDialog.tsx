"use client";

import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";

type Props = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ message, onConfirm, onCancel }: Props) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-6 text-sm text-gray-700">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="white" onClick={onCancel}>取消</Button>
          <Button variant="secondary" onClick={onConfirm}>確定刪除</Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
