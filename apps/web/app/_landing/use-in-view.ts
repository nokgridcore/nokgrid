"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True once the element has scrolled into view, and stays true — reveals
 * run once, not every time the reader scrolls past.
 */
export function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      // Start just before the element is fully on screen. The huge top margin
      // counts anything already scrolled past as seen, so a fast scroll or an
      // anchor jump over a section doesn't leave it unrevealed.
      { rootMargin: "100000px 0px -15% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}
