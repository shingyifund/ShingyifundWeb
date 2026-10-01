"use client";

import { useEffect, useRef } from "react";
import { FormAlert } from "@/components/ui/form-alert";

export function ReportFormFeedback({ message }: { message: string | null }) {
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!message) return;
    alertRef.current?.focus({ preventScroll: true });
    alertRef.current?.scrollIntoView({ block: "nearest" });
  }, [message]);

  if (!message) return null;

  return (
    <div ref={alertRef} tabIndex={-1} className="scroll-mt-24 rounded-lg focus-visible:outline-2 focus-visible:outline-destructive">
      <FormAlert message={message} />
    </div>
  );
}
