"use client";

import type { CSSProperties } from "react";
import { Button } from "@nokgridcore/ui/button";
import { ChartBar } from "@nokgridcore/ui/chart-bar";
import { ChartFrame } from "@nokgridcore/ui/chart-frame";
import { Progress } from "@nokgridcore/ui/progress";

// Shared by the hero dashboard and the component gallery, which shows the
// same widgets on their own.

export const HOURS = [
  "8am",
  "9am",
  "10am",
  "11am",
  "12pm",
  "1pm",
  "2pm",
  "3pm",
  "4pm",
];

// Frames fill their container; the component's own default width is a fixed 400px.
export const FILL_WIDTH: CSSProperties = { width: "100%" };

// Chart frames pad 16px on phones and the design's 24px from lg up, so a narrow
// screen isn't spent on nested padding. `!` wins over the frame's inline padding.
export const FRAME_PADDING = "!p-component-lg lg:!p-component-xl";

export interface OrdersByHour {
  inProgress: number[];
  delivered: number[];
}

export const ORDERS_TODAY: OrdersByHour = {
  inProgress: [60, 45, 90, 70, 25, 15, 45, 45, 45],
  delivered: [115, 45, 85, 80, 160, 100, 105, 35, 150],
};

export interface Region {
  label: string;
  orders: string;
  value: number;
  color: "primary" | "success" | "error";
}

export const REGIONS_TODAY: Region[] = [
  { label: "North", orders: "2,108 orders", value: 94, color: "success" },
  { label: "Central", orders: "1,923 orders", value: 88, color: "primary" },
  { label: "East", orders: "1,203 orders", value: 76, color: "primary" },
  { label: "West", orders: "2,847 orders", value: 60, color: "error" },
];

/** Tertiary with its fills cleared — the design system's stand-in for a ghost button. */
export function ViewAllButton() {
  return (
    <Button
      variant="tertiary"
      size="xs"
      icon="ChevronRight"
      iconPosition="right"
      className="shrink-0 border-transparent bg-transparent"
    >
      View all
    </Button>
  );
}

export function OrdersByHourFrame({
  data = ORDERS_TODAY,
  visible = true,
  style,
}: {
  data?: OrdersByHour;
  /** Mount the chart only once it's on screen, so its bars grow in view. */
  visible?: boolean;
  style?: CSSProperties;
}) {
  return (
    <ChartFrame
      title="Orders by hour"
      subtitle="Delivered vs. In-progress"
      className={FRAME_PADDING}
      style={{ ...FILL_WIDTH, ...style }}
    >
      <div className="h-full">
        {visible && (
          <ChartBar
            layout="stacked"
            categories={HOURS}
            series={[
              { label: "In-progress", color: 8, values: data.inProgress },
              { label: "Delivered", color: 4, values: data.delivered },
            ]}
          />
        )}
      </div>
    </ChartFrame>
  );
}

export function FulfilmentFrame({
  regions = REGIONS_TODAY,
  visible = true,
  style,
}: {
  regions?: Region[];
  /** Bars start empty and fill to their values once on screen. */
  visible?: boolean;
  style?: CSSProperties;
}) {
  return (
    <ChartFrame
      title="Fulfilment by region"
      showActions
      actions={<ViewAllButton />}
      className={FRAME_PADDING}
      style={{ ...FILL_WIDTH, ...style }}
    >
      <div className="flex flex-col gap-component-lg">
        {regions.map((region) => (
          <Progress
            key={region.label}
            fullWidth
            showLabel
            label={region.label}
            showMetadata
            metadata={region.orders}
            showPercentage
            value={visible ? region.value : 0}
            color={region.color}
          />
        ))}
      </div>
    </ChartFrame>
  );
}
