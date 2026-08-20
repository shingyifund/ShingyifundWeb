"use client";

import type { FormEvent } from "react";
import { Factory, PackageCheck, Send } from "lucide-react";

type SustainabilityEmailFormProps = {
  email: string;
  title: string;
  subject: string;
  fields: string[];
  emailField: string;
  note: string;
  submitLabel: string;
  type: "supplies" | "partnership";
  photoLabel?: string;
  messageLabel?: string;
};

export function SustainabilityEmailForm({
  email,
  title,
  subject,
  fields,
  emailField,
  note,
  submitLabel,
  type,
  photoLabel,
  messageLabel,
}: SustainabilityEmailFormProps) {
  const isSupplies = type === "supplies";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const bodyLines = fields.map((label) => {
      const value = formData.get(label);
      return `${label}：${typeof value === "string" ? value.trim() : ""}`;
    });

    if (messageLabel) {
      const message = formData.get(messageLabel);
      bodyLines.push("", `${messageLabel}：`, typeof message === "string" ? message.trim() : "");
    }

    if (isSupplies && photoLabel) {
      bodyLines.push("", `${photoLabel}：請見郵件附件`);
    }

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\r\n"))}`;
    window.open(mailtoUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={handleSubmit} acceptCharset="UTF-8" className="rounded-2xl bg-white p-6 shadow-md">
      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-navy-700 text-white">
          {isSupplies ? <PackageCheck className="size-5" /> : <Factory className="size-5" />}
        </span>
        <h3 className="font-serif text-xl font-bold text-navy-900">{title}</h3>
      </div>

      <div className="mt-5 space-y-3">
        {fields.map((label, index) => (
          <label key={label} className="block text-xs font-semibold text-navy-700">
            {label}
            <input
              name={label}
              type={label === emailField ? "email" : "text"}
              required={index < 3}
              className="mt-1.5 h-10 w-full rounded-lg border border-navy-200 bg-white px-3 text-sm font-normal outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </label>
        ))}

        {isSupplies && photoLabel ? (
          <label className="block text-xs font-semibold text-navy-700">
            {photoLabel}
            <input
              name={photoLabel}
              type="file"
              accept="image/*"
              className="mt-1.5 block w-full text-xs text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-navy-50 file:px-3 file:py-2 file:font-semibold file:text-navy-700"
            />
          </label>
        ) : messageLabel ? (
          <label className="block text-xs font-semibold text-navy-700">
            {messageLabel}
            <textarea
              name={messageLabel}
              required
              rows={5}
              className="mt-1.5 w-full resize-y rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm font-normal outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </label>
        ) : null}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink-muted">{note}</p>
      <button type="submit" className="mt-5 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-navy-700 px-5 text-sm font-semibold text-white transition hover:bg-navy-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500">
        <Send className="size-4" />
        {submitLabel}
      </button>
    </form>
  );
}
