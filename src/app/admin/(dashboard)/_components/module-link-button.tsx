"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ArrowRight, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Props = {
  href: string;
  label?: string;
  variant?: "outline" | "default";
  icon?: "arrow" | "plus";
};

export function ModuleLinkButton({
  href,
  label = "進入管理",
  variant = "outline",
  icon = "arrow",
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant={variant}
      className="w-full"
      disabled={isPending}
      onClick={() => startTransition(() => router.push(href))}
    >
      {isPending ? (
        <>
          <Loader2 className="animate-spin" />
          載入中
        </>
      ) : (
        <>
          {icon === "plus" && <Plus />}
          {label}
          {icon === "arrow" && <ArrowRight />}
        </>
      )}
    </Button>
  );
}
