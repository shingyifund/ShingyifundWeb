"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteFinancialReport } from "../actions";

export function DeleteFinancialReportDialog({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    setMessage(null);
    startTransition(async () => {
      const result = await deleteFinancialReport(id);

      if (!result.ok) {
        setMessage(result.message ?? "刪除失敗");
        return;
      }

      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`刪除 ${title}`}>
          <Trash2 className="text-destructive" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>刪除財務報告？</DialogTitle>
          <DialogDescription>
            這會移除「{title}」，並同步刪除 Storage 裡的 PDF 檔案。
          </DialogDescription>
        </DialogHeader>
        {message && <p className="text-sm text-destructive">{message}</p>}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              取消
            </Button>
          </DialogClose>
          <Button variant="destructive" disabled={isPending} onClick={handleDelete}>
            {isPending && <Loader2 className="size-4 animate-spin" />}
            刪除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
