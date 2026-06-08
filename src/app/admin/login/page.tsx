import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LoginButton } from "./LoginButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/admin");

  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold text-gray-900">興毅基金會</h1>
          <p className="mt-1 text-sm text-gray-500">管理後台</p>
        </div>

        {error === "unauthorized" && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            此帳號沒有後台存取權限
          </p>
        )}
        {error === "auth_failed" && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            登入失敗，請重試
          </p>
        )}

        <LoginButton />
      </div>
    </div>
  );
}
