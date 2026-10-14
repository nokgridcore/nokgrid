"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "./toast-region";

const RESET_AFTER_MS = 1500;

/**
 * Copies text to the clipboard, flips `copied` briefly (for the icon swap) and
 * confirms with a toast, so the result is clear even if the icon is missed.
 */
export function useCopy() {
  const [copied, setCopied] = useState(false);
  const toast = useToast();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        toast("Copied to clipboard");
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), RESET_AFTER_MS);
      } catch {
        setCopied(false);
        toast("Couldn't copy. Select the command and copy it manually.");
      }
    },
    [toast],
  );

  return { copied, copy };
}
