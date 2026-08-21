"use client";

import { useId } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  value: string;
  label: string;
};

export function DonationFilterSelect({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue: string;
  options: Option[];
}) {
  const triggerId = useId();

  return (
    <div className="grid min-w-0 gap-1.5 text-sm font-semibold text-navy-900">
      <label htmlFor={triggerId}>{label}</label>
      <Select key={`${name}-${defaultValue}`} name={name} defaultValue={defaultValue}>
        <SelectTrigger id={triggerId} aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="start">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
