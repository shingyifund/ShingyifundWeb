"use server";

import { isAuthorizedAdminEmail } from "@/lib/admin-auth";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type HeroSlideRecord = {
  id: string;
  content_type: "image" | "image_text" | "youtube";
  has_title: boolean;
  title: string | null;
  has_subtitle: boolean;
  subtitle: string | null;
  image_url: string | null;
  poster_image_url: string | null;
  youtube_url: string | null;
  youtube_video_id: string | null;
  has_cta: boolean;
  cta_label: string | null;
  cta_href: string | null;
  tone: "navy" | "amber";
  sort_order: number;
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
  const content_type = textValue(formData, "content_type");
  if (!content_type || !["image", "image_text", "youtube"].includes(content_type)) {
    return { error: "請選擇 Hero 型態" as const };
  }

  const has_title = formData.get("has_title") === "true";
  const has_subtitle = formData.get("has_subtitle") === "true";
  const has_cta = formData.get("has_cta") === "true";
  const tone = textValue(formData, "tone");

  const base = {
    content_type,
    has_title,
    title: has_title ? textValue(formData, "title") : null,
    has_subtitle,
    subtitle: has_subtitle ? textValue(formData, "subtitle") : null,
    image_url: null as string | null,
    poster_image_url: null as string | null,
    youtube_url: null as string | null,
    youtube_video_id: null as string | null,
    has_cta: false,
    cta_label: null as string | null,
    cta_href: null as string | null,
    tone: tone === "amber" ? "amber" : ("navy" as "navy" | "amber"),
    is_active: formData.get("is_active") === "true",
  };

  if (content_type === "image") {
    base.image_url = textValue(formData, "image_url");
  } else if (content_type === "image_text") {
    base.image_url = textValue(formData, "image_url");
    base.has_cta = has_cta;
    base.cta_label = has_cta ? textValue(formData, "cta_label") : null;
    base.cta_href = has_cta ? textValue(formData, "cta_href") : null;
  } else if (content_type === "youtube") {
    base.youtube_url = textValue(formData, "youtube_url");
    base.youtube_video_id = textValue(formData, "youtube_video_id");
    base.poster_image_url = textValue(formData, "poster_image_url");
  }

  return { data: base };
}

const SELECT_COLS =
  "id, content_type, has_title, title, has_subtitle, subtitle, image_url, poster_image_url, youtube_url, youtube_video_id, has_cta, cta_label, cta_href, tone, sort_order, is_active, updated_at";

function mapRow(row: Record<string, unknown>): HeroSlideRecord {
  return {
    id: row.id as string,
    content_type: row.content_type as "image" | "image_text" | "youtube",
    has_title: row.has_title as boolean,
    title: row.title as string | null,
    has_subtitle: row.has_subtitle as boolean,
    subtitle: row.subtitle as string | null,
    image_url: row.image_url as string | null,
    poster_image_url: row.poster_image_url as string | null,
    youtube_url: row.youtube_url as string | null,
    youtube_video_id: row.youtube_video_id as string | null,
    has_cta: row.has_cta as boolean,
    cta_label: row.cta_label as string | null,
    cta_href: row.cta_href as string | null,
    tone: row.tone === "amber" ? "amber" : "navy",
    sort_order: row.sort_order as number,
    is_active: row.is_active as boolean,
    updated_at: row.updated_at as string | null,
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
    .select(SELECT_COLS)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map(mapRow);
}

export async function getSlideById(id: string): Promise<HeroSlideRecord | null> {
  await assertAdmin();

  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select(SELECT_COLS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return mapRow(data);
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
    sort_order: count ?? 0,
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
    .update({ is_active: isActive })
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

  const supabase = await createAdminClient();

  const { data, error: fetchError } = await supabase
    .from("hero_slides")
    .select("id, sort_order")
    .order("sort_order", { ascending: true });

  if (fetchError) return { ok: false, message: fetchError.message };

  const slides = data ?? [];
  const index = slides.findIndex((s) => s.id === id);
  const targetIndex = direction === "up" ? index - 1 : index + 1;

  if (index < 0 || targetIndex < 0 || targetIndex >= slides.length) {
    return { ok: true };
  }

  const reordered = [...slides];
  const [item] = reordered.splice(index, 1);
  reordered.splice(targetIndex, 0, item);

  for (let i = 0; i < reordered.length; i++) {
    const { error } = await supabase
      .from("hero_slides")
      .update({ sort_order: i })
      .eq("id", reordered[i].id);
    if (error) return { ok: false, message: error.message };
  }

  revalidateHero();
  return { ok: true };
}
