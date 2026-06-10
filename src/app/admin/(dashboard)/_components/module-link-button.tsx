"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ModuleLinkButton({ href }: { href: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
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
          進入管理
          <ArrowRight />
        </>
      )}
    </Button>
  );
}
