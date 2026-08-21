"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { deleteDonationImport } from "../actions";

export function DeleteImportButton({ id, fileName }: { id: string; fileName: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm(`確定刪除「${fileName}」仍在使用的捐款資料？此操作無法復原。`)) return;
        startTransition(async () => {
          await deleteDonationImport(id);
          router.refresh();
        });
      }}
    >
      {isPending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      刪除
    </Button>
  );
}
