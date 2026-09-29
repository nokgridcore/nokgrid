"use client";

import { useState } from "react";
import { Icon } from "@nokgridcore/ui/icon";
import { Section, SectionHeader } from "./section";

// Only the first answer is written in the design; the rest are drafts to review.
const QUESTIONS = [
  {
    question: "Is NokGridCore free?",
    answer:
      "Yes. The components, tokens and Figma library are MIT licensed. Use them in commercial products without attribution.",
  },
  {
    question: "What’s included?",
    answer:
      "Sixty-nine React components, 400+ design tokens shipped as CSS variables, JavaScript and a Tailwind theme, and the Figma library they are built from.",
  },
  {
    question: "Which versions of React and Tailwind does it support?",
    answer:
      "React 19 and Tailwind CSS 3.4. The tokens are plain CSS variables too, so you can use them without Tailwind.",
  },
  {
    question: "Does it support light and dark mode?",
    answer:
      'Yes. Every semantic token has a light and a dark value. Set data-theme="dark" on any element to switch everything inside it.',
  },
  {
    question: "Can I use the tokens without the components?",
    answer:
      "Yes. @nokgridcore/tokens is its own package, with CSS variables, JavaScript constants and a Tailwind theme.",
  },
  {
    question: "How do the Figma library and the code stay in sync?",
    answer:
      "Tokens live in Figma Variables, are exported with Tokens Studio and built with Style Dictionary, so the library and the code read from the same source.",
  },
  {
    question: "Can I use my own brand colours?",
    answer:
      "Yes. Point the brand tokens at your own palette and rebuild. Components only read semantic tokens, so nothing else has to change.",
  },
  {
    question: "Why is it built for dashboards?",
    answer:
      "Dense screens need tight spacing, readable small type and charts that share one colour system. The components are sized for that from the start rather than adapted later.",
  },
  {
    question: "Is it ready for production?",
    answer:
      "The components are typed, themed and documented in Storybook. Pin your version and check the changelog before upgrading.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section aria-labelledby="faq-title">
      <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
        <SectionHeader
          id="faq-title"
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Short answers to the things people ask before they install."
          className="lg:w-1/3 lg:shrink-0"
        />

        <dl className="flex flex-1 flex-col border-t border-border-default">
          {QUESTIONS.map((item, index) => {
            const isOpen = index === openIndex;
            const answerId = `faq-answer-${index}`;

            return (
              <div
                key={item.question}
                className="flex flex-col border-b border-border-default py-5"
              >
                <dt>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center gap-4 text-left"
                  >
                    <span className="flex-1 text-style-heading-sm text-text-primary">
                      {item.question}
                    </span>
                    <Icon
                      name="Plus"
                      size="md"
                      color="default"
                      className={`shrink-0 motion-safe:transition-transform motion-safe:duration-reveal motion-safe:ease-out ${isOpen ? "rotate-45" : ""}`}
                    />
                  </button>
                </dt>
                {/* Always mounted so the answer can animate open; `inert` keeps a
                    closed answer out of the tab order and the accessibility tree. */}
                <dd
                  id={answerId}
                  className="reveal"
                  data-open={isOpen}
                  inert={!isOpen}
                >
                  <div>
                    <p className="text-pretty pt-3 text-style-body-md text-text-secondary">
                      {item.answer}
                    </p>
                  </div>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </Section>
  );
}
