"use server";

import { isAuthorizedAdminEmail } from "@/lib/admin-auth";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAuthorizedAdminEmail(user?.email)) {
    throw new Error("Unauthorized");
  }
}

export async function uploadImage(formData: FormData) {
  await assertAdmin();

  const file = formData.get("file") as File;
  if (!file || !file.size) return { error: "No file", url: null };

  const supabase = await createAdminClient();
  const ext = file.name.split(".").pop();
  const filename = `${Date.now()}.${ext}`;
  const bytes = await file.arrayBuffer();

  const { data, error } = await supabase.storage
    .from("hero-images")
    .upload(filename, bytes, { contentType: file.type, upsert: true });

  if (error) return { error: error.message, url: null };

  const { data: { publicUrl } } = supabase.storage
    .from("hero-images")
    .getPublicUrl(data.path);

  return { error: null, url: publicUrl };
}

export async function createSlide(formData: FormData) {
  await assertAdmin();

  const supabase = await createAdminClient();
  const { count } = await supabase
    .from("hero_slides")
    .select("*", { count: "exact", head: true });

  await supabase.from("hero_slides").insert({
    title: formData.get("title") as string,
    subtitle: (formData.get("subtitle") as string) || null,
    image: (formData.get("image") as string) || null,
    tone: formData.get("tone") as string,
    cta_label: (formData.get("cta_label") as string) || null,
    cta_href: (formData.get("cta_href") as string) || null,
    sort: count ?? 0,
    is_active: formData.get("is_active") === "true",
  });
  revalidatePath("/admin/hero");
  revalidatePath("/");
}

export async function updateSlide(id: string, formData: FormData) {
  await assertAdmin();

  const supabase = await createAdminClient();
  await supabase
    .from("hero_slides")
    .update({
      title: formData.get("title") as string,
      subtitle: (formData.get("subtitle") as string) || null,
      image: (formData.get("image") as string) || null,
      tone: formData.get("tone") as string,
      cta_label: (formData.get("cta_label") as string) || null,
      cta_href: (formData.get("cta_href") as string) || null,
      is_active: formData.get("is_active") === "true",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  revalidatePath("/admin/hero");
  revalidatePath("/");
}

export async function deleteSlide(id: string, imageUrl?: string | null) {
  await assertAdmin();

  const supabase = await createAdminClient();
  await supabase.from("hero_slides").delete().eq("id", id);

  // 若圖片存在 Supabase Storage，一併刪除
  if (imageUrl?.includes("/storage/v1/object/public/hero-images/")) {
    const path = imageUrl.split("/hero-images/")[1];
    if (path) await supabase.storage.from("hero-images").remove([path]);
  }

  revalidatePath("/admin/hero");
  revalidatePath("/");
}

export async function toggleActive(id: string, current: boolean) {
  await assertAdmin();

  const supabase = await createAdminClient();
  await supabase
    .from("hero_slides")
    .update({ is_active: !current, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/hero");
  revalidatePath("/");
}
