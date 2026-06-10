import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type FormAlertProps = {
  message?: string | null;
  variant?: "error" | "success";
  className?: string;
};

/** 表單共用提示框（取代 alert()）。message 為空時不渲染。 */
export function FormAlert({ message, variant = "error", className }: FormAlertProps) {
  if (!message) return null;

  const Icon = variant === "error" ? AlertCircle : CheckCircle2;

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm",
        variant === "error"
          ? "border-destructive/20 bg-destructive/10 text-destructive"
          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <span className="leading-relaxed">{message}</span>
    </div>
  );
}
