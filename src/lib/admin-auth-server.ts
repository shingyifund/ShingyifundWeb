import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isAuthorizedAdminEmail } from "@/lib/admin-auth";

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getAdminUser = cache(async () => {
  const user = await getCurrentUser();
  return isAuthorizedAdminEmail(user?.email) ? user : null;
});
