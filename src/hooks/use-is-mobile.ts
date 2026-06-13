"use client";

import { useEffect, useState } from "react";

const MOBILE_UA_PATTERN = /Android|iPhone|iPad|iPod|Mobile/i;

/**
 * 回傳是否為行動裝置（依 User-Agent 判斷）。
 * SSR 階段永遠回傳 false，client hydrate 後更新。
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(MOBILE_UA_PATTERN.test(navigator.userAgent));
  }, []);

  return isMobile;
}
