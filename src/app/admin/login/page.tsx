import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LoginButton } from "./LoginButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/admin");

  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7f4] px-4">
      <section className="w-full max-w-sm rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <Image
            src="/brand/logo.svg"
            alt="興毅基金會"
            width={196}
            height={35}
            priority
            className="mb-5 h-9 w-auto"
          />
          <h1 className="mt-2 text-2xl font-semibold text-foreground">後台管理</h1>
        </div>

        {error === "unauthorized" && (
          <p className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            這個 Google 帳號沒有後台權限。
          </p>
        )}
        {error === "auth_failed" && (
          <p className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            登入失敗，請重新嘗試。
          </p>
        )}

        <LoginButton />
      </section>
    </main>
  );
}
