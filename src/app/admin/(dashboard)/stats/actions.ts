"use server";

import { isAuthorizedAdminEmail } from "@/lib/admin-auth";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ImpactStatRecord = {
  id: string;
  icon: string;
  top_label: string;
  value: number;
  suffix: string;
  bottom_label: string;
  sort_order: number;
  updated_at: string | null;
};

export type ActionResult = {
  ok: boolean;
  message?: string;
};

const VALID_STAT_IDS = new Set(["s1", "s2", "s3", "s4", "s5"]);
const SELECT_COLS =
  "id, icon, top_label, value, suffix, bottom_label, sort_order, updated_at";

async function getAuthorizedAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAuthorizedAdminEmail(user?.email)) return null;
  return user;
}

async function assertAdmin() {
  const user = await getAuthorizedAdmin();
  if (!user) throw new Error("Unauthorized");
}

function parseNonNegativeInteger(value: unknown) {
  const parsed =
    typeof value === "number" ? value : Number(String(value ?? "").trim());
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

export async function listStats(): Promise<ImpactStatRecord[]> {
  await assertAdmin();

  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("impact_stats")
    .select(SELECT_COLS)
    .order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getStatById(id: string): Promise<ImpactStatRecord | null> {
  await assertAdmin();
  if (!VALID_STAT_IDS.has(id)) return null;

  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("impact_stats")
    .select(SELECT_COLS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateStat(id: string, formData: FormData): Promise<ActionResult> {
  const user = await getAuthorizedAdmin();
  if (!user) return { ok: false, message: "未授權" };
  if (!VALID_STAT_IDS.has(id)) return { ok: false, message: "無效的指標" };

  const value = parseNonNegativeInteger(formData.get("value"));
  if (value === null) return { ok: false, message: "請輸入有效數值" };

  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("impact_stats")
    .update({ value, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/");
  revalidatePath("/admin/stats");

  return { ok: true };
}

export async function updateAllStats(
  updates: { id: string; value: number }[]
): Promise<ActionResult> {
  const user = await getAuthorizedAdmin();
  if (!user) return { ok: false, message: "未授權" };

  if (updates.length === 0) return { ok: false, message: "沒有可更新的資料" };

  const valuesById = new Map<string, number>();
  for (const { id, value } of updates) {
    const parsed = parseNonNegativeInteger(value);
    if (!VALID_STAT_IDS.has(id) || parsed === null) {
      return { ok: false, message: "請確認所有指標數值皆為有效數字" };
    }
    valuesById.set(id, parsed);
  }

  const supabase = await createAdminClient();
  const now = new Date().toISOString();

  const { data: existing, error: readError } = await supabase
    .from("impact_stats")
    .select(SELECT_COLS)
    .in("id", Array.from(valuesById.keys()));

  if (readError) return { ok: false, message: readError.message };

  const rows = (existing ?? []).map((row) => ({
    ...row,
    value: valuesById.get(row.id) ?? row.value,
    updated_at: now,
  }));

  if (rows.length !== valuesById.size) {
    return { ok: false, message: "找不到指定的指標資料" };
  }

  const { error } = await supabase
    .from("impact_stats")
    .upsert(rows, { onConflict: "id" });

  if (error) return { ok: false, message: error.message };

  revalidatePath("/");
  revalidatePath("/admin/stats");

  return { ok: true };
}
