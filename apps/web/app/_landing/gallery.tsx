"use client";

import type { ReactNode } from "react";
import { Button } from "@nokgridcore/ui/button";
import { ChartBar } from "@nokgridcore/ui/chart-bar";
import { ChartDonut } from "@nokgridcore/ui/chart-donut";
import { ChartFrame } from "@nokgridcore/ui/chart-frame";
import { ChartLine } from "@nokgridcore/ui/chart-line";
import {
  FILL_WIDTH,
  FRAME_PADDING,
  FulfilmentFrame,
  OrdersByHourFrame,
} from "./dashboard-widgets";
import { LINKS } from "./links";
import { useInView } from "./use-in-view";
import { Section, SectionHeader } from "./section";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

// Frames whose content sets its own height (a wrapping legend, a footnote).
const FILL_WIDTH_AUTO_HEIGHT = { width: "100%", height: "auto" };

function FilterAction() {
  return (
    <Button
      variant="tertiary"
      size="xs"
      icon="ListFilter"
      className="shrink-0 whitespace-nowrap"
    >
      Filter by date
    </Button>
  );
}

interface CellProps {
  name: string;
  description: string;
  className?: string;
  /** Gets `true` once the cell scrolls into view, so its chart draws in then. */
  children: (inView: boolean) => ReactNode;
}

function Cell({ name, description, className, children }: CellProps) {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <figure
      ref={ref}
      className={[
        "flex flex-col gap-6 border-border-default px-4 pb-6 pt-8 lg:px-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-1 items-center justify-center">
        {children(inView)}
      </div>
      <figcaption className="flex flex-col gap-0.5">
        <span className="text-style-heading-sm text-text-primary">{name}</span>
        <span className="text-style-caption-md text-text-secondary">
          {description}
        </span>
      </figcaption>
    </figure>
  );
}

export function Gallery() {
  return (
    <Section
      id="components"
      aria-labelledby="gallery-title"
      className="flex flex-col gap-12"
    >
      <SectionHeader
        id="gallery-title"
        eyebrow="Components"
        title="Everything a dashboard needs"
        description="Inputs, charts, tables, navigation and feedback, designed for data-heavy screens rather than adapted to them."
      />

      <div className="grid w-full grid-cols-1 overflow-hidden rounded-lg border border-border-default bg-background-surface lg:grid-cols-12">
        <Cell
          name="chart.bar"
          description="Stacked bars with axes, gridlines and a legend as real parts."
          className="border-b lg:col-span-7 lg:border-r"
        >
          {(inView) => <OrdersByHourFrame visible={inView} />}
        </Cell>

        <Cell
          name="progress"
          description="Labelled rows carrying a count and a percentage."
          className="border-b lg:col-span-5"
        >
          {(inView) => <FulfilmentFrame visible={inView} />}
        </Cell>

        <Cell
          name="chart.donut"
          description="Ring segments with a legend, and a filter action in the frame header."
          className="border-b lg:col-span-5 lg:border-r"
        >
          {(inView) => (
            <ChartFrame
              className={FRAME_PADDING}
              title="Share by route"
              subtitle="Last 7 months"
              showActions
              actions={<FilterAction />}
              style={FILL_WIDTH_AUTO_HEIGHT}
            >
              <div className="sweep-in" data-visible={inView}>
                <ChartDonut
                  slices={[
                    { label: "Series label", color: 5, value: 50 },
                    { label: "Series label", color: 3, value: 22 },
                    { label: "Series label", color: 2, value: 28 },
                  ]}
                />
              </div>
            </ChartFrame>
          )}
        </Cell>

        <Cell
          name="chart.line"
          description="A smoothed series with an area fill, titled and footnoted by chart.frame."
          className="border-b lg:col-span-7"
        >
          {(inView) => (
            <ChartFrame
              className={FRAME_PADDING}
              title="Bookings over time"
              subtitle="Last 7 months"
              showActions
              actions={<FilterAction />}
              showFootnote
              footnote="Excludes cancelled bookings"
              style={FILL_WIDTH_AUTO_HEIGHT}
            >
              <div className="h-60">
                {inView && (
                  <ChartLine
                    curve="smooth"
                    showAreaFill
                    showLegend={false}
                    categories={MONTHS}
                    series={[
                      {
                        label: "Bookings",
                        color: 2,
                        values: [110, 80, 75, 150, 95, 140, 110],
                      },
                    ]}
                  />
                )}
              </div>
            </ChartFrame>
          )}
        </Cell>

        <Cell
          name="chart.bar"
          description="Grouped bars across a seven-month axis."
          className="lg:col-span-7 lg:border-r"
        >
          {(inView) => (
            <ChartFrame
              className={FRAME_PADDING}
              title="Bookings by month"
              subtitle="Last 7 months"
              showActions
              actions={<FilterAction />}
              style={FILL_WIDTH}
            >
              <div className="h-full">
                {inView && (
                  <ChartBar
                    layout="stacked"
                    categories={MONTHS}
                    series={[
                      {
                        label: "Series label",
                        color: 3,
                        values: [30, 40, 20, 50, 30, 40, 25],
                      },
                      {
                        label: "Series label",
                        color: 2,
                        values: [30, 50, 20, 60, 45, 55, 30],
                      },
                      {
                        label: "Series label",
                        color: 1,
                        values: [35, 70, 30, 70, 45, 80, 45],
                      },
                    ]}
                  />
                )}
              </div>
            </ChartFrame>
          )}
        </Cell>

        <div className="flex flex-col items-center justify-center gap-3 border-t border-border-default px-6 pb-6 pt-8 text-center lg:col-span-5 lg:border-t-0">
          <p className="text-style-heading-sm text-text-primary">
            Want to see more?
          </p>
          <p className="max-w-xs text-style-body-md text-text-secondary">
            Sixty-nine components cover navigation, forms, tables, charts and
            overlays.
          </p>
          <Button
            variant="tertiary"
            size="sm"
            icon="ArrowRight"
            iconPosition="right"
            onClick={() => window.open(LINKS.docs, "_blank", "noopener")}
          >
            Browse all 69 components
          </Button>
        </div>
      </div>
    </Section>
  );
}
