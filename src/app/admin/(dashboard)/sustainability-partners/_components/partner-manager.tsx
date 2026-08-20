"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ExternalLink, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { UploadTrigger } from "@/components/admin/upload-trigger";
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
import { FormAlert } from "@/components/ui/form-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  createSustainabilityPartner,
  deleteSustainabilityPartner,
  moveSustainabilityPartner,
  toggleSustainabilityPartner,
  type SustainabilityPartnerRecord,
} from "../actions";

export function PartnerManager({ partners }: { partners: SustainabilityPartnerRecord[] }) {
  const router = useRouter();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCreate(formData: FormData) {
    setMessage(null);
    if (!logoFile) {
      setMessage("請選擇 Logo 圖片");
      return;
    }
    formData.set("logo_file", logoFile);

    startTransition(async () => {
      const result = await createSustainabilityPartner(formData);
      if (!result.ok) {
        setMessage(result.message ?? "新增失敗");
        return;
      }
      setLogoFile(null);
      const form = document.getElementById("partner-create-form") as HTMLFormElement | null;
      form?.reset();
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <form id="partner-create-form" action={handleCreate} className="rounded-lg border bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-foreground">新增合作夥伴</h2>
          <p className="mt-1 text-sm text-muted-foreground">上傳後會依排序顯示於「興毅永續行動」第 8 區。</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="space-y-2">
            <Label>Logo 圖片</Label>
            <UploadTrigger
              accept="image/png,image/jpeg,image/webp"
              label={logoFile?.name ?? "選擇 Logo 圖片"}
              hint="JPG、PNG、WebP，最多 5MB"
              icon={<ImagePlus className="size-5" />}
              disabled={isPending}
              onFilesSelected={(files) => setLogoFile(files[0] ?? null)}
            />
          </div>

          <div className="grid content-start gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="partner-name">中文名稱</Label>
              <Input id="partner-name" name="name" required placeholder="例：興毅企業股份有限公司" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partner-name-en">英文名稱</Label>
              <Input id="partner-name-en" name="name_en" placeholder="選填" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="partner-website">官方網站</Label>
              <Input id="partner-website" name="website_url" type="url" placeholder="https://（選填，點 Logo 時開啟）" />
            </div>
            <FormAlert message={message} className="sm:col-span-2" />
            <div className="sm:col-span-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
                {isPending ? "上傳中..." : "新增合作夥伴"}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {partners.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-white px-6 py-14 text-center">
          <ImagePlus className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">目前沒有合作夥伴 Logo</p>
          <p className="mt-1 text-sm text-muted-foreground">請使用上方表單新增第一筆資料。</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-white">
          <div className="divide-y">
            {partners.map((partner, index) => (
              <PartnerRow
                key={partner.id}
                partner={partner}
                isFirst={index === 0}
                isLast={index === partners.length - 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PartnerRow({ partner, isFirst, isLast }: { partner: SustainabilityPartnerRecord; isFirst: boolean; isLast: boolean }) {
  const router = useRouter();
  const [active, setActive] = useState(partner.is_active);
  const [isPending, startTransition] = useTransition();

  function toggle(nextValue: boolean) {
    setActive(nextValue);
    startTransition(async () => {
      const result = await toggleSustainabilityPartner(partner.id, nextValue);
      if (!result.ok) setActive(partner.is_active);
      router.refresh();
    });
  }

  function move(direction: "up" | "down") {
    startTransition(async () => {
      const result = await moveSustainabilityPartner(partner.id, direction);
      if (result.ok) router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="flex h-20 w-32 shrink-0 items-center justify-center rounded-md border bg-white p-3">
          <Image src={partner.logo_url} alt={partner.name} width={128} height={80} className="max-h-full max-w-full object-contain" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">{partner.name}</p>
          {partner.name_en && <p className="mt-0.5 truncate text-sm text-muted-foreground">{partner.name_en}</p>}
          {partner.website_url && (
            <a href={partner.website_url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-amber-700 hover:underline">
              查看網站 <ExternalLink className="size-3" />
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        {isPending && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
        <div className="flex items-center gap-2">
          <Switch id={`partner-${partner.id}`} checked={active} onCheckedChange={toggle} />
          <Label htmlFor={`partner-${partner.id}`} className="cursor-pointer text-xs text-muted-foreground">{active ? "顯示" : "停用"}</Label>
        </div>
        <span className="mx-1 h-5 w-px bg-border" />
        <Button type="button" variant="ghost" size="icon-sm" disabled={isPending || isFirst} onClick={() => move("up")} aria-label="往上排序"><ArrowUp /></Button>
        <Button type="button" variant="ghost" size="icon-sm" disabled={isPending || isLast} onClick={() => move("down")} aria-label="往下排序"><ArrowDown /></Button>
        <DeletePartnerDialog partner={partner} />
      </div>
    </div>
  );
}

function DeletePartnerDialog({ partner }: { partner: SustainabilityPartnerRecord }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function remove() {
    startTransition(async () => {
      const result = await deleteSustainabilityPartner(partner.id);
      if (!result.ok) {
        setMessage(result.message ?? "刪除失敗");
        return;
      }
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="ghost" size="icon-sm" aria-label={`刪除 ${partner.name}`}><Trash2 className="text-destructive" /></Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>刪除合作夥伴？</DialogTitle>
          <DialogDescription>這會移除「{partner.name}」，並同步刪除 Storage 裡的 Logo，無法復原。</DialogDescription>
        </DialogHeader>
        <FormAlert message={message} />
        <DialogFooter>
          <DialogClose asChild><Button variant="outline" disabled={isPending}>取消</Button></DialogClose>
          <Button variant="destructive" disabled={isPending} onClick={remove}>{isPending && <Loader2 className="size-4 animate-spin" />}刪除</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
