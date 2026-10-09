"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Toast } from "@nokgridcore/ui/toast";

const SHOW_FOR_MS = 2500;

type ShowToast = (title: string) => void;

const ToastContext = createContext<ShowToast>(() => {});

/** Shows a short confirmation toast, e.g. after copying the install command. */
export function useToast() {
  return useContext(ToastContext);
}

/**
 * One toast at a time: bottom-centre on phones, bottom-right from lg up. The live region is always rendered (and
 * empty when idle) so screen readers reliably announce each new message.
 */
export function ToastRegion({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; title: string } | null>(
    null,
  );
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = useCallback<ShowToast>((title) => {
    clearTimeout(timer.current);
    // A new id remounts the toast, so repeat copies replay its entrance.
    setToast({ id: Date.now(), title });
    timer.current = setTimeout(() => setToast(null), SHOW_FOR_MS);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center px-layout-page-horizontal lg:justify-end"
      >
        {toast && (
          <Toast
            key={toast.id}
            color="neutral"
            icon="CircleCheck"
            position="bottom"
            title={toast.title}
            showText={false}
            showClose={false}
            className="pointer-events-auto"
            style={{ maxWidth: "100%" }}
          />
        )}
      </div>
    </ToastContext.Provider>
  );
}
