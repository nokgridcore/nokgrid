"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Badge } from "@nokgridcore/ui/badge";
import { IconSwap } from "./icon-swap";
import { LINKS } from "./links";

type Theme = "light" | "dark";

const NAV_LINKS = [
  { label: "Documentation", href: LINKS.docs },
  { label: "Components", href: "#components" },
];

// 20px icons get a 40px hit area without changing how they sit in the row.
const ICON_HIT_AREA = "-m-2.5 flex p-2.5";

/**
 * Flips the theme with every transition switched off for the swap, so the
 * page snaps to the new colours instead of every element fading at once.
 */
function applyTheme(next: Theme) {
  const style = document.createElement("style");
  style.append(
    document.createTextNode("*,*::before,*::after{transition:none !important}"),
  );
  document.head.append(style);
  document.documentElement.dataset.theme = next;
  void document.body.offsetHeight; // commit the new colours while transitions are off
  requestAnimationFrame(() => {
    requestAnimationFrame(() => style.remove());
  });
}

function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(
      document.documentElement.dataset.theme === "dark" ? "dark" : "light",
    );
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("nok-theme", next);
    } catch {
      // Storage can be unavailable (private mode); the toggle still works for this visit.
    }
    setTheme(next);
  };

  return { theme, toggle };
}

function IconLinks({
  theme,
  onToggleTheme,
}: {
  theme: Theme;
  onToggleTheme: () => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <a
        href={LINKS.figmaLibrary}
        aria-label="Figma library"
        className={ICON_HIT_AREA}
      >
        <Image src="/landing/figma-logo.svg" alt="" width={20} height={20} />
      </a>
      <a
        href={LINKS.github}
        aria-label="GitHub repository"
        className={ICON_HIT_AREA}
      >
        <span className="flex size-icon-md items-center justify-center">
          {/* The exported mark is stored upside down; the design flips it back. */}
          <Image
            src="/landing/github-mark.svg"
            alt=""
            width={19}
            height={19}
            className="-scale-y-100 dark:hidden"
          />
          <Image
            src="/landing/github-mark-dark.svg"
            alt=""
            width={19}
            height={19}
            className="hidden -scale-y-100 dark:block"
          />
        </span>
      </a>
      <button
        type="button"
        onClick={onToggleTheme}
        aria-label={
          theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
        }
        className={`${ICON_HIT_AREA} text-icon-default`}
      >
        <IconSwap
          active={theme === "dark"}
          activeIcon="Moon"
          inactiveIcon="Sun"
        />
      </button>
    </div>
  );
}

export function Nav() {
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  // Escape closes the mobile menu, as it does every other overlay.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="material-bar sticky top-0 z-10 border-b border-border-default">
      <nav
        aria-label="Main"
        className="flex items-center justify-between px-layout-page-horizontal py-3 lg:py-5"
      >
        <a href="#top" className="flex items-center gap-2.5">
          <Image
            src="/landing/wordmark.svg"
            alt="NokgridCore"
            width={176}
            height={28}
            priority
          />
          <Badge
            variant="neutral"
            appearance="tinted"
            size="small"
            label="v1.0"
          />
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          <ul className="flex items-center gap-6 text-style-body-md text-text-primary">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="motion-safe:transition-colors motion-safe:duration-press hover:text-text-brand"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <IconLinks theme={theme} onToggleTheme={toggle} />
        </div>

        <button
          type="button"
          className={`${ICON_HIT_AREA} text-icon-default lg:hidden`}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <IconSwap
            active={menuOpen}
            activeIcon="X"
            inactiveIcon="Menu"
            size="lg"
          />
        </button>
      </nav>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="flex flex-col gap-4 border-t border-border-default px-layout-page-horizontal py-4 lg:hidden"
        >
          <ul className="flex flex-col gap-3 text-style-body-md text-text-primary">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <IconLinks theme={theme} onToggleTheme={toggle} />
        </div>
      )}
    </header>
  );
}
