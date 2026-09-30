"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const RESET_AFTER_MS = 1500;

/** Copies text to the clipboard and reports `copied` briefly afterwards. */
export function useCopy() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), RESET_AFTER_MS);
    } catch {
      setCopied(false);
    }
  }, []);

  return { copied, copy };
}
