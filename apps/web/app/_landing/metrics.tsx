"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useInView } from "./use-in-view";

const METRICS = [
  {
    value: 69,
    suffix: "",
    label: "components",
    description:
      "Navigation, forms, tables and charts — every variant named like its React prop.",
  },
  {
    value: 400,
    suffix: "+",
    label: "tokens",
    description:
      "Colour, type, space and radius, aliased through primitives for Token Studio.",
  },
  {
    value: 5,
    suffix: "",
    label: "full chart set",
    description:
      "Line, bar, donut, spark and skeleton, with axes, legends and tooltips as real parts.",
  },
  {
    value: 2,
    suffix: "",
    label: "Light and dark",
    description:
      "One semantic layer, two modes. A new theme is a mode, not a stylesheet.",
  },
];

/** Counts from 0 to `to` once `run` turns true; lands straight on `to` under reduced motion. */
function useCountUp(to: number, run: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }
    const duration = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--motion-duration-count",
      ),
    );
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      // Ease-out cubic: fast start, gentle landing on the final number.
      setValue(Math.round(to * (1 - (1 - t) ** 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [to, run]);

  return value;
}

function Metric({
  metric,
  index,
  inView,
}: {
  metric: (typeof METRICS)[number];
  index: number;
  inView: boolean;
}) {
  const count = useCountUp(metric.value, inView);

  return (
    <div
      className={`flex flex-col gap-2 motion-safe:transition-[opacity,transform] motion-safe:duration-rise motion-safe:ease-out ${
        inView ? "opacity-100" : "opacity-0 motion-safe:translate-y-3"
      }`}
      // Each metric follows the one before it.
      style={
        {
          transitionDelay: `calc(var(--motion-stagger) * ${index})`,
        } as CSSProperties
      }
    >
      <dt className="flex flex-col gap-2">
        {/* Tabular figures so the count doesn't wobble; the final value is what's announced. */}
        <span className="text-style-display-md tabular-nums text-text-brand">
          <span aria-hidden>
            {count}
            {metric.suffix}
          </span>
          <span className="sr-only">
            {metric.value}
            {metric.suffix}
          </span>
        </span>
        <span className="text-style-label-md text-text-primary">
          {metric.label}
        </span>
      </dt>
      <dd className="text-pretty text-style-body-md text-text-secondary">
        {metric.description}
      </dd>
    </div>
  );
}

export function Metrics() {
  const { ref, inView } = useInView<HTMLDListElement>();

  return (
    <section
      aria-label="NokGridCore in numbers"
      className="border-y border-border-default bg-background-canvas px-layout-page-horizontal py-9 lg:px-32"
    >
      <dl
        ref={ref}
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
      >
        {METRICS.map((metric, index) => (
          <Metric
            key={metric.label}
            metric={metric}
            index={index}
            inView={inView}
          />
        ))}
      </dl>
    </section>
  );
}
