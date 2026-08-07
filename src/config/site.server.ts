import "server-only";

import { siteConfig } from "./site";
import { getRequestLocale } from "@/i18n/request";
import { translateDeep } from "@/i18n/translations";

export async function getSiteConfig() {
  return translateDeep(await getRequestLocale(), siteConfig);
}
