"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Factory, Loader2, PackageCheck, Send } from "lucide-react";
import { sendSustainabilityInquiry } from "@/app/(site)/sustainability/action/actions";
import type { Locale } from "@/i18n/config";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type SustainabilityFormFieldName =
  | "name"
  | "phone"
  | "contactEmail"
  | "item"
  | "quantity"
  | "expiry"
  | "storage"
  | "location"
  | "available";

type SustainabilityEmailFormProps = {
  title: string;
  fields: Array<{
    name: SustainabilityFormFieldName;
    label: string;
    type?: "email" | "text";
  }>;
  note: string;
  submitLabel: string;
  type: "supplies" | "partnership";
  locale: Locale;
  photoLabel?: string;
  messageLabel?: string;
};

type SubmissionStatus = {
  kind: "success" | "error";
  message: string;
} | null;

export function SustainabilityEmailForm({
  title,
  fields,
  note,
  submitLabel,
  type,
  locale,
  photoLabel,
  messageLabel,
}: SustainabilityEmailFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<SubmissionStatus>(null);
  const [isPending, startTransition] = useTransition();
  const isSupplies = type === "supplies";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const photo = formData.get("photo");

    setStatus(null);

    if (
      photo instanceof File &&
      photo.size > 0 &&
      (photo.size > MAX_PHOTO_SIZE || !ALLOWED_PHOTO_TYPES.has(photo.type))
    ) {
      setStatus({
        kind: "error",
        message:
          locale === "en"
            ? "Photos must be JPG, PNG, or WebP and no larger than 5 MB."
            : "照片僅接受 JPG、PNG 或 WebP，且不可超過 5 MB。",
      });
      return;
    }

    startTransition(async () => {
      const result = await sendSustainabilityInquiry(formData);
      setStatus({ kind: result.ok ? "success" : "error", message: result.message });
      if (result.ok) formRef.current?.reset();
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      acceptCharset="UTF-8"
      aria-busy={isPending}
      className="rounded-2xl bg-white p-6 shadow-md"
    >
      <input type="hidden" name="_type" value={type} />
      <input type="hidden" name="_locale" value={locale} />
      <label className="absolute -left-[9999px] top-auto size-px overflow-hidden" aria-hidden="true">
        Website
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-navy-700 text-white">
          {isSupplies ? <PackageCheck className="size-5" /> : <Factory className="size-5" />}
        </span>
        <h3 className="font-serif text-xl font-bold text-navy-900">{title}</h3>
      </div>

      <div className="mt-5 space-y-3">
        {fields.map((field, index) => (
          <label key={field.name} className="block text-xs font-semibold text-navy-700">
            {field.label}
            <input
              name={field.name}
              type={field.type ?? "text"}
              required={index < 3}
              disabled={isPending}
              className="mt-1.5 h-10 w-full rounded-lg border border-navy-200 bg-white px-3 text-sm font-normal outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 disabled:cursor-wait disabled:bg-navy-50"
            />
          </label>
        ))}

        {isSupplies && photoLabel ? (
          <label className="block text-xs font-semibold text-navy-700">
            {photoLabel}
            <input
              name="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={isPending}
              className="mt-1.5 block w-full text-xs text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-navy-50 file:px-3 file:py-2 file:font-semibold file:text-navy-700 disabled:cursor-wait"
            />
          </label>
        ) : messageLabel ? (
          <label className="block text-xs font-semibold text-navy-700">
            {messageLabel}
            <textarea
              name="message"
              required
              rows={5}
              maxLength={3000}
              disabled={isPending}
              className="mt-1.5 w-full resize-y rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm font-normal outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 disabled:cursor-wait disabled:bg-navy-50"
            />
          </label>
        ) : null}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink-muted">{note}</p>

      {status ? (
        <div
          role={status.kind === "error" ? "alert" : "status"}
          aria-live="polite"
          className={`mt-4 flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs leading-relaxed ${
            status.kind === "success"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-red-50 text-red-700"
          }`}
        >
          {status.kind === "success" ? (
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
          )}
          <span>{status.message}</span>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-5 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-navy-700 px-5 text-sm font-semibold text-white transition hover:bg-navy-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 disabled:cursor-wait disabled:bg-navy-500"
      >
        {isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        {isPending ? (locale === "en" ? "Sending…" : "寄送中…") : submitLabel}
      </button>
    </form>
  );
}
