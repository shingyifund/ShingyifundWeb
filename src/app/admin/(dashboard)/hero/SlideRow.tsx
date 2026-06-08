"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { deleteSlide, toggleActive } from "./actions";
import { ConfirmDialog } from "./ConfirmDialog";

type Slide = {
  id: string;
  title: string;
  tone: string;
  sort: number;
  is_active: boolean;
  image: string | null;
};

export function SlideRow({ slide }: { slide: Slide }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      {showConfirm && (
        <ConfirmDialog
          message={`確定要刪除「${slide.title}」？`}
          onConfirm={async () => {
            setShowConfirm(false);
            await deleteSlide(slide.id, slide.image);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-3 text-gray-400">{slide.sort}</td>
        <td className="px-4 py-3 font-medium text-gray-900">{slide.title}</td>
        <td className="px-4 py-3">
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
              slide.tone === "amber"
                ? "bg-amber-100 text-amber-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {slide.tone}
          </span>
        </td>
        <td className="px-4 py-3">
          <button
            onClick={() => toggleActive(slide.id, slide.is_active)}
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium transition ${
              slide.is_active
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {slide.is_active ? "顯示中" : "已隱藏"}
          </button>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/admin/hero/${slide.id}`}
              className="inline-flex size-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            >
              <Pencil className="size-4" />
            </Link>
            <button
              onClick={() => setShowConfirm(true)}
              className="inline-flex size-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}
