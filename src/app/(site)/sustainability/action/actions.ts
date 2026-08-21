"use server";

import nodemailer from "nodemailer";
import { getSustainabilityActionContent } from "@/config/sustainability-action";
import type { Locale } from "@/i18n/config";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const DEFAULT_RECIPIENT = "shingyifund@gmail.com";

type InquiryType = "supplies" | "partnership";

type InquiryResult = {
  ok: boolean;
  message: string;
};

function getText(formData: FormData, key: string, maxLength: number) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function resultMessage(locale: Locale, kind: "success" | "invalid" | "file" | "error") {
  const messages = {
    tw: {
      success: "已成功送出，我們會儘快與您聯繫。",
      invalid: "請確認必填欄位及 Email 格式是否正確。",
      file: "照片僅接受 JPG、PNG 或 WebP，且不可超過 5 MB。",
      error: "目前無法送出，請稍後再試，或改由聯絡我們頁面與本會聯繫。",
    },
    en: {
      success: "Your message has been sent. We will contact you as soon as possible.",
      invalid: "Please check the required fields and email address.",
      file: "Photos must be JPG, PNG, or WebP and no larger than 5 MB.",
      error: "We could not send your message. Please try again later or contact us directly.",
    },
  } as const;

  return messages[locale][kind];
}

function safeFilename(filename: string) {
  const cleaned = filename.replace(/[^\p{L}\p{N}._ -]/gu, "_").slice(0, 120);
  return cleaned || "supply-photo";
}

export async function sendSustainabilityInquiry(formData: FormData): Promise<InquiryResult> {
  const locale: Locale = formData.get("_locale") === "en" ? "en" : "tw";
  const typeValue = formData.get("_type");
  const type: InquiryType | null = typeValue === "supplies" || typeValue === "partnership" ? typeValue : null;

  // Honeypot: real users never see or complete this field.
  if (getText(formData, "website", 200)) {
    return { ok: true, message: resultMessage(locale, "success") };
  }

  const name = getText(formData, "name", 120);
  const phone = getText(formData, "phone", 50);
  const contactEmail = getText(formData, "contactEmail", 254);
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail);

  if (!type || !name || !phone || !emailIsValid) {
    return { ok: false, message: resultMessage(locale, "invalid") };
  }

  const content = getSustainabilityActionContent(locale);
  const labels = content.fields;
  const rows: Array<[string, string]> = [
    [labels.name, name],
    [labels.phone, phone],
    [labels.email, contactEmail],
  ];

  let photo: File | null = null;

  if (type === "supplies") {
    rows.push(
      [labels.item, getText(formData, "item", 300)],
      [labels.quantity, getText(formData, "quantity", 300)],
      [labels.expiry, getText(formData, "expiry", 300)],
      [labels.storage, getText(formData, "storage", 300)],
      [labels.location, getText(formData, "location", 300)],
      [labels.available, getText(formData, "available", 300)],
    );

    const photoValue = formData.get("photo");
    if (photoValue instanceof File && photoValue.size > 0) {
      if (photoValue.size > MAX_PHOTO_SIZE || !ALLOWED_PHOTO_TYPES.has(photoValue.type)) {
        return { ok: false, message: resultMessage(locale, "file") };
      }
      photo = photoValue;
    }
  } else {
    const message = getText(formData, "message", 3000);
    if (!message) {
      return { ok: false, message: resultMessage(locale, "invalid") };
    }
    rows.push([labels.message, message]);
  }

  const smtpHost = process.env.SMTP_HOST ?? "smtp.gmail.com";
  const parsedPort = Number(process.env.SMTP_PORT ?? "465");
  const smtpPort = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 465;
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPassword = process.env.SMTP_APP_PASSWORD?.replaceAll(" ", "").trim();
  const recipients = (process.env.SUSTAINABILITY_FORM_TO ?? DEFAULT_RECIPIENT)
    .split(",")
    .map((recipient) => recipient.trim())
    .filter(Boolean);

  if (!smtpUser || !smtpPassword || recipients.length === 0) {
    console.error("Sustainability form email settings are incomplete.");
    return { ok: false, message: resultMessage(locale, "error") };
  }

  const formTitle = type === "supplies" ? content.provide : content.cooperate;
  const subject = `[${content.title}] ${formTitle}`;
  const text = rows.map(([label, value]) => `${label}：${value || "-"}`).join("\n");
  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><th style="padding:10px 12px;border:1px solid #dbe5f0;text-align:left;vertical-align:top;background:#f5f8fc;white-space:nowrap">${escapeHtml(label)}</th><td style="padding:10px 12px;border:1px solid #dbe5f0;white-space:pre-wrap">${escapeHtml(value || "-")}</td></tr>`,
    )
    .join("");

  try {
    const attachments = photo
      ? [
          {
            filename: safeFilename(photo.name),
            content: Buffer.from(await photo.arrayBuffer()),
            contentType: photo.type,
          },
        ]
      : undefined;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });

    await transporter.sendMail({
      from: { name: "興毅基金會網站", address: smtpUser },
      to: recipients,
      replyTo: { name, address: contactEmail },
      subject,
      text,
      html: `<div style="font-family:Arial,sans-serif;color:#102d55;line-height:1.6"><h2>${escapeHtml(formTitle)}</h2><table style="border-collapse:collapse;width:100%;max-width:760px">${tableRows}</table></div>`,
      attachments,
    });

    return { ok: true, message: resultMessage(locale, "success") };
  } catch (error) {
    console.error("Sustainability form SMTP request failed.", error instanceof Error ? error.message : "Unknown error");
    return { ok: false, message: resultMessage(locale, "error") };
  }
}
