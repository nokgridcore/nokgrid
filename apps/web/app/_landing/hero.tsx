"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { Button } from "@nokgridcore/ui/button";
import { ScaledDashboard } from "./dashboard-preview";
import { IconSwap } from "./icon-swap";
import { INSTALL_PACKAGE, LINKS } from "./links";
import { useCopy } from "./use-copy";

const INSTALL_COMMAND = `npm i ${INSTALL_PACKAGE}`;

function InstallCommand() {
  const { copied, copy } = useCopy();

  return (
    <div className="flex w-full items-center justify-center gap-4 rounded-md border border-border-default bg-background-surface py-2 pl-5 pr-3 sm:w-auto">
      <code className="text-style-mono-md text-text-primary">
        {INSTALL_COMMAND}
      </code>
      <button
        type="button"
        onClick={() => copy(INSTALL_COMMAND)}
        aria-label={copied ? "Copied" : "Copy install command"}
        className="-m-2.5 flex p-2.5 text-icon-default motion-safe:transition-colors motion-safe:duration-press hover:text-icon-brand"
      >
        <IconSwap active={copied} activeIcon="Check" inactiveIcon="Copy" />
      </button>
    </div>
  );
}

/**
 * Scroll parallax for the hero dashboard: it rises a little faster than the
 * page scrolls, so it reads as a layer floating in front of the copy. Transform
 * only, set on the element directly, one write per frame, off under reduced motion.
 */
function useParallax<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const factor = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--motion-parallax",
      ),
    );
    let frame = 0;

    const update = () => {
      frame = 0;
      if (reduce.matches) {
        node.style.transform = "";
        return;
      }
      // Stop once the hero has scrolled away; nothing to see past that.
      const offset = Math.min(window.scrollY, window.innerHeight);
      node.style.transform = `translate3d(0, ${-offset * factor}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    reduce.addEventListener("change", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      reduce.removeEventListener("change", update);
      cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}

export function Hero() {
  const parallaxRef = useParallax<HTMLDivElement>();

  return (
    <section
      aria-labelledby="hero-title"
      className="overflow-hidden bg-background-surface px-layout-page-horizontal py-12 lg:py-24 lg:pr-0"
    >
      <div className="flex items-center gap-12">
        {/* Arrives once on load, in reading order (see .enter-stagger in globals.css). */}
        <div className="enter-stagger flex w-full flex-col items-center gap-6 text-center lg:w-1/2 xl:w-2/5 lg:shrink-0 lg:items-start lg:text-left">
          <h1
            id="hero-title"
            className="text-style-display-xl !font-extrabold !leading-normal tracking-tight text-text-primary sm:text-style-display-2xl"
          >
            {/* Line breaks as in the design: "for / dense, data-heavy / dashboards." */}
            The design system for
            <br />
            dense,{" "}
            <span className="highlight-box inline-block rounded-sm bg-background-brand px-2 text-text-white">
              <span className="highlight-text">data-heavy</span>
            </span>
            <br />
            dashboards.
          </h1>

          <p className="flex flex-wrap items-center justify-center gap-2 text-style-body-lg text-text-secondary lg:justify-start">
            Accessible
            <span
              className="logo"
              style={{ "--logo-index": 0 } as CSSProperties}
            >
              <Image
                src="/landing/figma-logo.svg"
                alt=""
                width={18}
                height={18}
              />
            </span>
            <span className="text-text-primary">Figma,</span>
            <span
              className="logo logo-spin"
              style={{ "--logo-index": 1 } as CSSProperties}
            >
              <Image
                src="/landing/react-logo.svg"
                alt=""
                width={21}
                height={19}
              />
            </span>
            <span className="text-text-primary">React and</span>
            <span
              className="logo"
              style={{ "--logo-index": 2 } as CSSProperties}
            >
              <Image
                src="/landing/tailwind-logo.svg"
                alt=""
                width={23}
                height={14}
              />
            </span>
            <span className="text-text-primary">Tailwind</span>
            components
          </p>

          <p className="text-style-body-lg text-text-secondary">
            Ship the same tokens, the same component names and the same
            behaviour in Figma and in code.
          </p>

          <div className="flex w-full flex-col items-stretch gap-3 pt-2 sm:w-auto sm:flex-row sm:items-center">
            <InstallCommand />
            <Button
              variant="primary"
              size="md"
              icon="ArrowRight"
              iconPosition="right"
              onClick={() => window.open(LINKS.docs, "_blank", "noopener")}
            >
              Browse components
            </Button>
          </div>
        </div>

        {/* A live dashboard built from the components, bleeding past the
            right edge of the viewport as in the design. */}
        <div className="enter-late hidden min-w-0 flex-1 lg:-mr-32 lg:block">
          <div ref={parallaxRef} className="will-change-transform">
            <ScaledDashboard />
          </div>
        </div>
      </div>
    </section>
  );
}
