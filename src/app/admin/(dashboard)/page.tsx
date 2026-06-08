import Link from "next/link";
import { Images } from "lucide-react";

export default function AdminPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">管理後台</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/hero"
          className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-amber-300 hover:shadow-md"
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-amber-50">
            <Images className="size-6 text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">首頁輪播</p>
            <p className="text-sm text-gray-500">管理 Banner 內容</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
