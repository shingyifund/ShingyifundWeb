import { headers } from "next/headers";
import { defaultLocale, isLocale, type Locale } from "./config";

export async function getRequestLocale(): Promise<Locale> {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-site-locale");
  return isLocale(locale) ? locale : defaultLocale;
}

export async function getRequestPath() {
  const requestHeaders = await headers();
  return requestHeaders.get("x-site-path");
}
