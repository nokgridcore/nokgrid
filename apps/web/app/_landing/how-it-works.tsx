"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@nokgridcore/ui/icon";
import { LINKS } from "./links";
import { Section, SectionHeader } from "./section";

interface Step {
  title: string;
  body: string;
  linkLabel: string;
  href: string;
  image: { src: string; width: number; height: number; alt: string };
}

const STEPS: Step[] = [
  {
    title: "Design tokens",
    body: "Colour, type, spacing and radius defined once in Figma Variables and synced to code through Token Studio and Style Dictionary.",
    linkLabel: "Explore tokens",
    href: LINKS.tokensDocs,
    image: {
      src: "/landing/step-tokens-studio.png",
      width: 397,
      height: 637,
      alt: "Tokens Studio for Figma showing the brand colour tokens as JSON",
    },
  },
  {
    title: "Figma library",
    body: "Every component with the same names, properties and states as the code, in light and dark.",
    linkLabel: "Open in Figma",
    href: LINKS.figmaLibrary,
    image: {
      src: "/landing/step-figma.png",
      width: 717,
      height: 951,
      alt: "The NokGridCore Figma library with a table component selected",
    },
  },
  {
    title: "React library",
    body: "Typed React components that read the tokens. No hardcoded values.",
    linkLabel: "View documentation",
    href: LINKS.docs,
    image: {
      src: "/landing/step-react.png",
      width: 1246,
      height: 1076,
      alt: "The React component source files in the code editor",
    },
  },
  {
    title: "Documentation",
    body: "Every component, variant and state documented in Storybook.",
    linkLabel: "Open in docs",
    href: LINKS.docs,
    image: {
      src: "/landing/step-docs.png",
      width: 876,
      height: 957,
      alt: "The NokGridCore Storybook documentation",
    },
  },
];

/**
 * The screenshot panel. Every step's image stays mounted and the active one
 * cross-fades in, so switching steps never flashes an empty panel.
 */
function Preview({
  steps,
  activeIndex,
  className,
}: {
  steps: Step[];
  activeIndex: number;
  className?: string;
}) {
  return (
    <div
      className={[
        "relative aspect-square overflow-hidden rounded-lg bg-background-brand-subtle lg:aspect-[9/8]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {steps.map((step, index) => (
        // Top-anchored and cropped by the panel's bottom edge, as in the design.
        <div
          key={step.image.src}
          aria-hidden={index !== activeIndex}
          // The incoming screenshot rises into place as it fades in.
          className={`image-outline absolute bottom-0 left-1/2 top-12 w-3/4 -translate-x-1/2 overflow-hidden rounded-t-lg motion-safe:transition-[opacity,transform] motion-safe:duration-rise motion-safe:ease-out lg:top-16 lg:w-2/3 ${
            index === activeIndex
              ? "opacity-100"
              : "opacity-0 motion-safe:translate-y-6"
          }`}
        >
          <Image
            src={step.image.src}
            alt={step.image.alt}
            width={step.image.width}
            height={step.image.height}
            // Screenshots of UI text: serve the original pixels, not a re-encoded copy.
            unoptimized
            className="h-full w-full object-cover object-left-top"
          />
        </div>
      ))}
    </div>
  );
}

export function HowItWorks() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Section aria-labelledby="how-title" className="flex flex-col gap-12">
      <SectionHeader
        id="how-title"
        eyebrow="How it works"
        title="One system, from design to code"
        description="Decisions are made once in Figma Variables and flow straight into the components you ship."
      />

      <div className="flex items-start gap-16">
        <ol className="flex w-full flex-col gap-1 lg:w-5/12 lg:shrink-0">
          {STEPS.map((step, index) => {
            const isOpen = index === openIndex;
            const number = String(index + 1).padStart(2, "0");
            const panelId = `how-step-${index}`;

            return (
              <li key={step.title} className="flex flex-col gap-3">
                {/* Every step has a full 1px border so opening one only changes
                    colours and padding, which animate, instead of swapping borders.
                    As in Figma: closed steps above the open one show their rule on
                    top, closed steps below it on the bottom. */}
                <div
                  className={`flex flex-col rounded-sm border motion-safe:transition-[border-color,background-color,padding] motion-safe:duration-reveal motion-safe:ease-out ${
                    isOpen
                      ? "border-border-default bg-background-surface p-5"
                      : `border-transparent px-5 py-4 ${
                          index < openIndex
                            ? "border-t-border-default"
                            : "border-b-border-default"
                        }`
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      // One step is always open, since the preview always shows a
                      // screenshot. Closing the open step moves on to the next one
                      // (wrapping round), so its image comes up in its place.
                      onClick={() =>
                        setOpenIndex(
                          isOpen ? (index + 1) % STEPS.length : index,
                        )
                      }
                      className="flex w-full items-center text-left"
                    >
                      <span
                        className={`w-8 shrink-0 text-style-label-sm motion-safe:transition-colors motion-safe:duration-reveal ${isOpen ? "text-text-brand" : "text-text-tertiary"}`}
                      >
                        {number}
                      </span>
                      <span
                        className={`flex-1 text-style-heading-sm motion-safe:transition-colors motion-safe:duration-reveal ${isOpen ? "text-text-primary" : "text-text-secondary"}`}
                      >
                        {step.title}
                      </span>
                      <Icon
                        name="ChevronDown"
                        size="sm"
                        color="default"
                        className={`motion-safe:transition-transform motion-safe:duration-reveal motion-safe:ease-out ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </h3>

                  {/* Always mounted so aria-controls resolves; `inert` takes a
                      closed panel out of the tab order and the accessibility tree. */}
                  <div
                    id={panelId}
                    className="reveal"
                    data-open={isOpen}
                    inert={!isOpen}
                  >
                    <div>
                      <div className="flex flex-col gap-2.5 pl-8 pt-3">
                        <p className="text-pretty text-style-body-md text-text-secondary">
                          {step.body}
                        </p>
                        <a
                          href={step.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 self-start text-style-label-md text-text-brand hover:underline"
                        >
                          {step.linkLabel}
                          <span className="sr-only"> (opens in a new tab)</span>
                          <Icon name="ArrowRight" size="sm" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* On small screens the preview follows the open step inline. */}
                {isOpen && (
                  <Preview
                    steps={[step]}
                    activeIndex={0}
                    className="rise-in lg:hidden"
                  />
                )}
              </li>
            );
          })}
        </ol>

        <Preview
          steps={STEPS}
          activeIndex={openIndex}
          className="hidden flex-1 lg:block"
        />
      </div>
    </Section>
  );
}
