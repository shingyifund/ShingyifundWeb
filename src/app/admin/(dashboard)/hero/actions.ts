"use server";

import { isAuthorizedAdminEmail } from "@/lib/admin-auth";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type HeroSlideRecord = {
  id: string;
  title: string;
  subtitle: string | null;
  image: string | null;
  tone: "navy" | "amber";
  cta_label: string | null;
  cta_href: string | null;
  sort: number;
  is_active: boolean;
  updated_at: string | null;
};

export type ActionResult = {
  ok: boolean;
  message?: string;
};

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAuthorizedAdminEmail(user?.email)) {
    throw new Error("Unauthorized");
  }
}

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function slidePayload(formData: FormData) {
  const title = textValue(formData, "title");

  if (!title) {
    return { error: "請輸入標題" as const };
  }

  const tone = textValue(formData, "tone");

  return {
    data: {
      title,
      subtitle: textValue(formData, "subtitle"),
      image: textValue(formData, "image"),
      tone: tone === "amber" ? "amber" : "navy",
      cta_label: textValue(formData, "cta_label"),
      cta_href: textValue(formData, "cta_href"),
      is_active: formData.get("is_active") === "true",
      updated_at: new Date().toISOString(),
    },
  };
}

function revalidateHero() {
  revalidatePath("/");
  revalidatePath("/admin/hero");
}

export async function listSlides(): Promise<HeroSlideRecord[]> {
  await assertAdmin();

  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("id, title, subtitle, image, tone, cta_label, cta_href, sort, is_active, updated_at")
    .order("sort", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    image: row.image,
    tone: row.tone === "amber" ? "amber" : "navy",
    cta_label: row.cta_label,
    cta_href: row.cta_href,
    sort: row.sort,
    is_active: row.is_active,
    updated_at: row.updated_at,
  }));
}

export async function getSlideById(id: string): Promise<HeroSlideRecord | null> {
  await assertAdmin();

  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("id, title, subtitle, image, tone, cta_label, cta_href, sort, is_active, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    subtitle: data.subtitle,
    image: data.image,
    tone: data.tone === "amber" ? "amber" : "navy",
    cta_label: data.cta_label,
    cta_href: data.cta_href,
    sort: data.sort,
    is_active: data.is_active,
    updated_at: data.updated_at,
  };
}

export async function uploadHeroImage(formData: FormData): Promise<
  { ok: true; url: string } | { ok: false; message: string }
> {
  await assertAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "請選擇圖片" };
  }

  if (!file.type.startsWith("image/")) {
    return { ok: false, message: "檔案格式需為圖片" };
  }

  const supabase = await createAdminClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext.toLowerCase()}`;
  const bytes = await file.arrayBuffer();

  const { data, error } = await supabase.storage
    .from("hero-images")
    .upload(path, bytes, { contentType: file.type, upsert: false });

  if (error) return { ok: false, message: error.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from("hero-images").getPublicUrl(data.path);

  return { ok: true, url: publicUrl };
}

export async function createSlide(formData: FormData): Promise<ActionResult> {
  await assertAdmin();

  const payload = slidePayload(formData);
  if ("error" in payload) return { ok: false, message: payload.error };

  const supabase = await createAdminClient();
  const { count } = await supabase
    .from("hero_slides")
    .select("*", { count: "exact", head: true });

  const { error } = await supabase.from("hero_slides").insert({
    ...payload.data,
    sort: count ?? 0,
  });

  if (error) return { ok: false, message: error.message };

  revalidateHero();
  return { ok: true };
}

export async function updateSlide(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  await assertAdmin();

  const payload = slidePayload(formData);
  if ("error" in payload) return { ok: false, message: payload.error };

  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("hero_slides")
    .update(payload.data)
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  revalidateHero();
  return { ok: true };
}

export async function deleteSlide(
  id: string,
  imageUrl?: string | null,
): Promise<ActionResult> {
  await assertAdmin();

  const supabase = await createAdminClient();
  const { error } = await supabase.from("hero_slides").delete().eq("id", id);

  if (error) return { ok: false, message: error.message };

  if (imageUrl?.includes("/storage/v1/object/public/hero-images/")) {
    const path = imageUrl.split("/hero-images/")[1];
    if (path) await supabase.storage.from("hero-images").remove([path]);
  }

  revalidateHero();
  return { ok: true };
}

export async function toggleSlideActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  await assertAdmin();

  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("hero_slides")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  revalidateHero();
  return { ok: true };
}

export async function moveSlide(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  await assertAdmin();

  const slides = await listSlides();
  const index = slides.findIndex((slide) => slide.id === id);
  const targetIndex = direction === "up" ? index - 1 : index + 1;

  if (index < 0 || targetIndex < 0 || targetIndex >= slides.length) {
    return { ok: true };
  }

  const reordered = [...slides];
  const [item] = reordered.splice(index, 1);
  reordered.splice(targetIndex, 0, item);

  const supabase = await createAdminClient();
  const updates = reordered.map((slide, sort) =>
    supabase
      .from("hero_slides")
      .update({ sort, updated_at: new Date().toISOString() })
      .eq("id", slide.id),
  );

  const results = await Promise.all(updates);
  const failed = results.find((result) => result.error);

  if (failed?.error) return { ok: false, message: failed.error.message };

  revalidateHero();
  return { ok: true };
}
