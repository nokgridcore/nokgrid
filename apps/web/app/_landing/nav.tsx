"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Badge } from "@nokgridcore/ui/badge";
import { Icon } from "@nokgridcore/ui/icon";
import { IconSwap } from "./icon-swap";
import { LINKS } from "./links";

type Theme = "light" | "dark";

const NAV_LINKS = [{ label: "Documentation", href: LINKS.docs }];

// Links that leave the site open in a new tab, so the page stays where it was.
const isExternal = (href: string) => href.startsWith("http");
const newTab = { target: "_blank", rel: "noopener noreferrer" } as const;

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
        {...newTab}
        aria-label="Figma library (opens in a new tab)"
        className={ICON_HIT_AREA}
      >
        <Image src="/landing/figma-logo.svg" alt="" width={20} height={20} />
      </a>
      <a
        href={LINKS.github}
        {...newTab}
        aria-label="GitHub repository (opens in a new tab)"
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

  // While the full-page menu is open: Escape closes it, the page behind can't
  // scroll or take focus, and growing past the mobile breakpoint closes it.
  useEffect(() => {
    if (!menuOpen) return;
    const behind = [
      document.getElementById("main"),
      document.querySelector("footer"),
    ];
    const desktop = window.matchMedia("(min-width: 1024px)");
    const close = () => setMenuOpen(false);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const onBreakpoint = () => {
      if (desktop.matches) close();
    };

    document.body.style.overflow = "hidden";
    behind.forEach((node) => node?.setAttribute("inert", ""));
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.body.style.overflow = "";
      behind.forEach((node) => node?.removeAttribute("inert"));
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [menuOpen]);

  // A same-page link (e.g. #components) has to wait for the menu to close and
  // the page to unlock before it can scroll to its section.
  const followMenuLink = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    setMenuOpen(false);
    if (!href.startsWith("#")) return;
    event.preventDefault();
    requestAnimationFrame(() => {
      document.querySelector(href)?.scrollIntoView();
      history.pushState(null, "", href);
    });
  };

  return (
    <>
      <header className="material-bar sticky top-0 z-20 border-b border-border-default">
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
                    {...(isExternal(link.href) ? newTab : {})}
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
      </header>

      {/* Full-page menu on small screens: covers everything under the nav bar,
          rather than pushing a strip open over the page. */}
      {menuOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="menu-in fixed inset-0 z-10 flex flex-col overflow-y-auto bg-background-surface px-layout-page-horizontal pb-10 pt-20 lg:hidden"
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.label} className="border-b border-border-default">
                <a
                  href={link.href}
                  {...(isExternal(link.href) ? newTab : {})}
                  onClick={(event) => followMenuLink(event, link.href)}
                  className="flex items-center justify-between py-5 text-style-display-sm text-text-primary"
                >
                  {link.label}
                  <Icon name="ArrowRight" size="md" color="secondary" />
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-center justify-between border-t border-border-default pt-6">
            <span className="text-style-body-sm text-text-secondary">
              Figma, GitHub and theme
            </span>
            <IconLinks theme={theme} onToggleTheme={toggle} />
          </div>
        </div>
      )}
    </>
  );
}
