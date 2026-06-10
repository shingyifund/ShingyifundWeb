import Image from "next/image";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin-auth-server";
import { FormAlert } from "@/components/ui/form-alert";
import { LoginButton } from "./LoginButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getAdminUser();
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

        <FormAlert
          message={
            error === "unauthorized"
              ? "這個 Google 帳號沒有後台權限。"
              : error === "auth_failed"
                ? "登入失敗，請重新嘗試。"
                : null
          }
          className="mb-4"
        />

        <LoginButton />
      </section>
    </main>
  );
}
