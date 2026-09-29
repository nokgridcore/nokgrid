"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { Button } from "@nokgridcore/ui/button";
import { IconSwap } from "./icon-swap";
import { INSTALL_PACKAGE, LINKS } from "./links";
import { useCopy } from "./use-copy";

const MANAGERS = [
  { name: "pnpm", command: `pnpm add ${INSTALL_PACKAGE}` },
  { name: "npm", command: `npm i ${INSTALL_PACKAGE}` },
  { name: "yarn", command: `yarn add ${INSTALL_PACKAGE}` },
] as const;

function InstallTerminal() {
  const [active, setActive] = useState(0);
  const { copied, copy } = useCopy();
  const { command } = MANAGERS[active]!;

  // One underline that slides to the chosen manager, rather than three that blink.
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState<{
    x: number;
    width: number;
  } | null>(null);
  useLayoutEffect(() => {
    const button = buttonRefs.current[active];
    if (button)
      setIndicator({ x: button.offsetLeft, width: button.offsetWidth });
  }, [active]);

  return (
    <div className="w-full max-w-lg overflow-hidden rounded-lg border border-border-code bg-background-code">
      <div className="flex items-center justify-between border-b border-border-code bg-background-code-raised px-4 pt-2.5">
        {/* A choice of command, not a tab widget: toggle buttons need no arrow-key contract. */}
        <div
          role="group"
          aria-label="Package manager"
          className="relative flex gap-4"
        >
          {MANAGERS.map((manager, index) => {
            const selected = index === active;
            return (
              <button
                key={manager.name}
                ref={(node) => {
                  buttonRefs.current[index] = node;
                }}
                type="button"
                aria-pressed={selected}
                onClick={() => setActive(index)}
                className={`pb-2.5 text-style-mono-sm motion-safe:transition-colors motion-safe:duration-slide ${
                  selected
                    ? "text-text-code"
                    : "text-text-code-muted hover:text-text-code"
                }`}
              >
                {manager.name}
              </button>
            );
          })}
          {indicator && (
            <span
              aria-hidden
              className="absolute bottom-0 left-0 h-0.5 bg-background-brand motion-safe:transition-[transform,width] motion-safe:duration-slide motion-safe:ease-in-out"
              style={{
                width: indicator.width,
                transform: `translateX(${indicator.x}px)`,
              }}
            />
          )}
        </div>
        <Image src="/landing/window-dots.svg" alt="" width={36} height={18} />
      </div>

      <div className="flex items-center justify-between gap-3 py-3 pl-4 pr-3">
        <code className="flex gap-2 overflow-hidden whitespace-nowrap text-style-mono-md">
          <span className="text-text-code-muted" aria-hidden>
            $
          </span>
          {/* Keyed by manager, so each new command rises in from below. */}
          <span key={command} className="rise-in-quick text-text-code">
            {command}
          </span>
        </code>
        <button
          type="button"
          onClick={() => copy(command)}
          aria-label={copied ? "Copied" : "Copy install command"}
          className="flex shrink-0 rounded-sm border border-border-code bg-background-code-raised p-1.5 text-text-code"
        >
          <IconSwap
            active={copied}
            activeIcon="Check"
            inactiveIcon="Copy"
            size="sm"
          />
        </button>
      </div>
    </div>
  );
}

export function FinalCta() {
  return (
    <section
      aria-labelledby="cta-title"
      className="flex flex-col items-center gap-6 bg-background-brand-subtle px-layout-page-horizontal py-16 text-center lg:py-24"
    >
      <div className="flex flex-col items-center gap-2.5">
        <h2 id="cta-title" className="text-style-display-md text-text-primary">
          Start building
        </h2>
        <p className="text-style-body-lg text-text-secondary">
          Install the package or open the Figma library.
        </p>
      </div>

      <InstallTerminal />

      <div className="flex flex-wrap justify-center gap-3">
        <Button
          variant="primary"
          size="md"
          onClick={() => window.open(LINKS.install, "_blank", "noopener")}
        >
          Get started
        </Button>
        <Button
          variant="tertiary"
          size="md"
          icon="ArrowRight"
          iconPosition="right"
          onClick={() => window.open(LINKS.figmaLibrary, "_blank", "noopener")}
        >
          Open in Figma
        </Button>
      </div>
    </section>
  );
}
