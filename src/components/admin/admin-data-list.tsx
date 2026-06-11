import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AdminDataListColumn = {
  label: string;
  className?: string;
};

export function AdminDataList({
  columns,
  gridClassName,
  headerVisibleClassName = "md:grid",
  children,
}: {
  columns: AdminDataListColumn[];
  gridClassName: string;
  headerVisibleClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div
        className={cn(
          "hidden border-b bg-muted/50 px-4 py-3 text-xs font-medium text-muted-foreground",
          gridClassName,
          headerVisibleClassName,
        )}
      >
        {columns.map((column) => (
          <span key={column.label} className={column.className}>
            {column.label}
          </span>
        ))}
      </div>

      <div className="divide-y">{children}</div>
    </div>
  );
}

export function AdminDataListRow({
  gridClassName,
  itemAlignClassName = "md:items-center",
  children,
}: {
  gridClassName: string;
  itemAlignClassName?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid gap-3 px-4 py-4",
        gridClassName,
        itemAlignClassName,
      )}
    >
      {children}
    </div>
  );
}
