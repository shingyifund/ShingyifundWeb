import Image from "next/image";
import Link from "next/link";
import { isAuthorizedAdminEmail } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogoutButton } from "./LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAuthorizedAdminEmail(user?.email)) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#f5f7f4] text-foreground">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/admin" className="flex items-center gap-3" aria-label="回到後台總覽">
            <Image
              src="/brand/logo.svg"
              alt="興毅基金會"
              width={196}
              height={35}
              priority
              className="h-9 w-auto"
            />
            <span className="hidden h-6 w-px bg-border sm:block" />
            <span className="hidden text-sm font-semibold text-foreground sm:inline">
              後台管理
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user?.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
