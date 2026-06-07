"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** 全站動畫設定。一律啟用動畫（不依系統「減少動態」偏好）。 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="never">{children}</MotionConfig>;
}
