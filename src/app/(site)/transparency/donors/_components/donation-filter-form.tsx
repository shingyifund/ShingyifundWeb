"use client";

import {
  createContext,
  useContext,
  useTransition,
  type FormEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/i18n/config";

const DonationFilterPendingContext = createContext(false);

export function DonationFilterForm({
  action,
  className,
  children,
}: {
  action: string;
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    for (const [name, value] of formData.entries()) {
      if (typeof value !== "string") continue;
      const normalizedValue = value.trim();
      if (normalizedValue && normalizedValue !== "all") {
        params.set(name, normalizedValue);
      }
    }

    const queryString = params.toString();
    startTransition(() => {
      router.push(`${action}${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    });
  }

  return (
    <DonationFilterPendingContext.Provider value={isPending}>
      <form
        onSubmit={handleSubmit}
        className={className}
        aria-busy={isPending}
      >
        {children}
      </form>
    </DonationFilterPendingContext.Provider>
  );
}

export function DonationSearchButton({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const isPending = useContext(DonationFilterPendingContext);

  return (
    <Button
      type="submit"
      size="md"
      className={className}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2
          className="size-4 animate-spin"
          aria-label={locale === "en" ? "Searching" : "查詢中"}
        />
      ) : (
        <Search className="size-4" />
      )}
      {locale === "en" ? "Search" : "查詢"}
    </Button>
  );
}
