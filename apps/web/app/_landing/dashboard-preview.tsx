"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Avatar } from "@nokgridcore/ui/avatar";
import { Badge, type BadgeVariant } from "@nokgridcore/ui/badge";
import { BadgeCount } from "@nokgridcore/ui/badge-count";
import { Divider } from "@nokgridcore/ui/divider";
import { Icon, type IconName } from "@nokgridcore/ui/icon";
import { Kpi } from "@nokgridcore/ui/kpi";
import { MenuItem } from "@nokgridcore/ui/menu-item";
import { Option } from "@nokgridcore/ui/option";
import { SearchInput } from "@nokgridcore/ui/search-input";
import { Select } from "@nokgridcore/ui/select";
import { Sidebar } from "@nokgridcore/ui/sidebar";
import { SidebarContent } from "@nokgridcore/ui/sidebar-content";
import { SidebarFooter } from "@nokgridcore/ui/sidebar-footer";
import { SidebarGroup } from "@nokgridcore/ui/sidebar-group";
import { SidebarHeader } from "@nokgridcore/ui/sidebar-header";
import { Tab } from "@nokgridcore/ui/tab";
import { TabGroup } from "@nokgridcore/ui/tab-group";
import { Table } from "@nokgridcore/ui/table";
import { TableCell } from "@nokgridcore/ui/table-cell";
import { TableHeaderCell } from "@nokgridcore/ui/table-header-cell";
import { TableRow } from "@nokgridcore/ui/table-row";
import { TableToolbar } from "@nokgridcore/ui/table-toolbar";
import { TopBar } from "@nokgridcore/ui/top-bar";
import {
  FulfilmentFrame,
  ORDERS_TODAY,
  OrdersByHourFrame,
  REGIONS_TODAY,
  ViewAllButton,
  type OrdersByHour,
  type Region,
} from "./dashboard-widgets";

/*
 * The "Dashboard for landing page" frame from Figma, built from the real
 * components. It renders at the frame's own width and is scaled down to fit
 * the hero, so every part of it stays clickable.
 */
const DESIGN_WIDTH = 1400;
// The dashboard's rendered height at DESIGN_WIDTH. Only used to reserve the
// right shape before the first measurement; the live height replaces it.
const DESIGN_HEIGHT = 1059;

// ─── Navigation ─────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  icon: IconName;
  badge?: string;
  shortcut?: string;
}

const NAV_GROUPS: { label?: string; items: NavItem[] }[] = [
  { items: [{ label: "Dashboard", icon: "LayoutGrid" }] },
  {
    label: "Orders",
    items: [
      { label: "Live orders", icon: "Package", badge: "24" },
      { label: "Need attention", icon: "AlertCircle", badge: "12" },
      { label: "Returns", icon: "Undo2", badge: "3" },
    ],
  },
  {
    label: "Fulfilment",
    items: [
      { label: "Deliveries", icon: "Map" },
      { label: "Drivers", icon: "Truck" },
      { label: "Stores", icon: "Store" },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Reports", icon: "LineChart" },
      { label: "Performance", icon: "TrendingUp" },
    ],
  },
  {
    label: "Workspace",
    items: [
      { label: "Task", icon: "Layers", shortcut: "⌘K" },
      { label: "Team", icon: "Users" },
    ],
  },
];

// ─── Data per period ────────────────────────────────────────────────────────

const PERIODS = ["Today", "7d", "30d"] as const;

interface KpiData {
  label: string;
  value: string;
  delta: string;
  direction: "positive" | "negative" | "neutral";
}

interface PeriodData {
  kpis: KpiData[];
  orders: OrdersByHour;
  regions: Region[];
}

const DATA: PeriodData[] = [
  {
    kpis: [
      {
        label: "Orders today",
        value: "1,284",
        delta: "+8%",
        direction: "positive",
      },
      {
        label: "Fulfilment rate",
        value: "96.4%",
        delta: "+1.2%",
        direction: "positive",
      },
      {
        label: "On-time delivery",
        value: "91.8%",
        delta: "−2.1%",
        direction: "negative",
      },
      {
        label: "Revenue",
        value: "$48,210",
        delta: "0.0%",
        direction: "neutral",
      },
    ],
    orders: ORDERS_TODAY,
    regions: REGIONS_TODAY,
  },
  {
    kpis: [
      {
        label: "Orders this week",
        value: "8,912",
        delta: "+5.4%",
        direction: "positive",
      },
      {
        label: "Fulfilment rate",
        value: "95.1%",
        delta: "−0.6%",
        direction: "negative",
      },
      {
        label: "On-time delivery",
        value: "93.2%",
        delta: "+1.4%",
        direction: "positive",
      },
      {
        label: "Revenue",
        value: "$331,480",
        delta: "+3.9%",
        direction: "positive",
      },
    ],
    orders: {
      inProgress: [40, 55, 70, 65, 50, 35, 40, 55, 30],
      delivered: [120, 95, 110, 105, 140, 120, 115, 90, 130],
    },
    regions: [
      { label: "North", orders: "14,640 orders", value: 91, color: "success" },
      {
        label: "Central",
        orders: "13,020 orders",
        value: 85,
        color: "primary",
      },
      { label: "East", orders: "8,410 orders", value: 72, color: "primary" },
      { label: "West", orders: "19,880 orders", value: 64, color: "error" },
    ],
  },
  {
    kpis: [
      {
        label: "Orders this month",
        value: "37,406",
        delta: "+12%",
        direction: "positive",
      },
      {
        label: "Fulfilment rate",
        value: "94.8%",
        delta: "0.0%",
        direction: "neutral",
      },
      {
        label: "On-time delivery",
        value: "92.5%",
        delta: "+0.8%",
        direction: "positive",
      },
      {
        label: "Revenue",
        value: "$1.42M",
        delta: "+9.1%",
        direction: "positive",
      },
    ],
    orders: {
      inProgress: [35, 40, 45, 50, 45, 40, 35, 40, 30],
      delivered: [130, 120, 125, 135, 150, 140, 130, 120, 145],
    },
    regions: [
      { label: "North", orders: "62,300 orders", value: 89, color: "success" },
      {
        label: "Central",
        orders: "55,870 orders",
        value: 83,
        color: "primary",
      },
      { label: "East", orders: "36,120 orders", value: 70, color: "primary" },
      { label: "West", orders: "84,900 orders", value: 66, color: "primary" },
    ],
  },
];

const STORES = ["All stores", "Downtown", "Airport", "Harbour"];

const ORDERS: {
  id: string;
  time: string;
  initials: string;
  customer: string;
  status: string;
  statusVariant: BadgeVariant;
  items: string;
  total: string;
}[] = [
  {
    id: "#10482",
    time: "2:14 PM",
    initials: "DP",
    customer: "Daniel Park",
    status: "Delivered",
    statusVariant: "success",
    items: "3",
    total: "$86.40",
  },
  {
    id: "#10481",
    time: "2:09 PM",
    initials: "MS",
    customer: "Maria Santos",
    status: "In transit",
    statusVariant: "info",
    items: "1",
    total: "$24.00",
  },
  {
    id: "#10480",
    time: "1:57 PM",
    initials: "AB",
    customer: "Aisha Bello",
    status: "Late",
    statusVariant: "error",
    items: "5",
    total: "$142.75",
  },
  {
    id: "#10479",
    time: "1:42 PM",
    initials: "TB",
    customer: "Tom Bradley",
    status: "Processing",
    statusVariant: "neutral",
    items: "2",
    total: "$58.20",
  },
  {
    id: "#10478",
    time: "1:30 PM",
    initials: "LC",
    customer: "Lisa Chen",
    status: "Cancelled",
    statusVariant: "warning",
    items: "4",
    total: "$97.10",
  },
];

// Column proportions from the Figma table (102 / 186 / 89.5 × 4 of 646px).
// Number columns are right-aligned with their headers so digits and decimal
// points line up; status badges and the action menu are centred.
type Justify = "flex-start" | "center" | "flex-end";
const COLUMNS: {
  label: string;
  flex: number;
  header: Justify;
  cell: Justify;
}[] = [
  { label: "Orders", flex: 8, header: "flex-start", cell: "flex-start" },
  { label: "Customers", flex: 15, header: "flex-start", cell: "flex-start" },
  { label: "Status", flex: 7, header: "flex-start", cell: "center" },
  { label: "Items", flex: 7, header: "flex-end", cell: "flex-end" },
  { label: "Total", flex: 7, header: "flex-end", cell: "flex-end" },
  { label: "Action", flex: 7, header: "flex-end", cell: "center" },
];
const columnStyle = (index: number, part: "header" | "cell") => {
  const column = COLUMNS[index]!;
  return {
    width: "auto",
    flex: `${column.flex} 1 0`,
    minWidth: 0,
    justifyContent: column[part],
  };
};
// Counts and money use the mono face, as in Figma.
const MONO = "[&_span]:!font-mono";

const ATTENTION: {
  initials: string;
  name: string;
  time: string;
  label: string;
  variant: BadgeVariant;
}[] = [
  {
    initials: "MJ",
    name: "Marcus Johnson",
    time: "2:14 PM",
    label: "Payment failed",
    variant: "error",
  },
  {
    initials: "RK",
    name: "Robert Kim",
    time: "1:23 PM",
    label: "Late by 30 mins",
    variant: "warning",
  },
  {
    initials: "EN",
    name: "Emily Nguyen",
    time: "12:58 PM",
    label: "Address missing",
    variant: "warning",
  },
  {
    initials: "CH",
    name: "Chris Peterson",
    time: "12:34 PM",
    label: "Refund requested",
    variant: "info",
  },
  {
    initials: "JW",
    name: "Jennifer Walsh",
    time: "11:47 AM",
    label: "On hold",
    variant: "neutral",
  },
];

// ─── Pieces ─────────────────────────────────────────────────────────────────

// Sidebar rows in Figma are 36px tall with the small (16px) icon.
const MENU_ROW = { height: "var(--nok-size-control-md)" };

function Navigation() {
  const [active, setActive] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sidebar
      collapsed={collapsed}
      onCollapsedChange={setCollapsed}
      style={{ height: "auto", alignSelf: "stretch" }}
    >
      <SidebarHeader
        logo="LayoutGrid"
        title="My dashboard"
        subtext="Store operations"
      />
      <SidebarContent>
        {NAV_GROUPS.map((group, index) => (
          <SidebarGroup
            key={group.label ?? index}
            label={group.label}
            showLabel={Boolean(group.label)}
          >
            {group.items.map((item) => (
              <MenuItem
                key={item.label}
                state={item.label === active ? "active" : "default"}
                onClick={() => setActive(item.label)}
                showLeadingIcon
                icon={item.icon}
                showLabel
                label={item.label}
                showBadge={Boolean(item.badge)}
                badgeVariant="neutral"
                badgeLabel={item.badge}
                showTrailingLabel={Boolean(item.shortcut)}
                trailingLabel={item.shortcut}
                style={MENU_ROW}
              />
            ))}
          </SidebarGroup>
        ))}
        <SidebarGroup
          showLabel={false}
          className="mt-auto border-t border-border-default"
        >
          <MenuItem
            state={active === "Settings" ? "active" : "default"}
            onClick={() => setActive("Settings")}
            showLeadingIcon
            icon="Settings"
            showLabel
            label="Settings"
            className="rounded-none"
            style={MENU_ROW}
          />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter
        showProfile={false}
        showContent
        content={
          // Collapsed rail: avatar only, centred like the icons above it.
          <div
            className={`flex items-center self-stretch gap-component-sm ${collapsed ? "justify-center" : ""}`}
          >
            <Avatar type="initials" size="sm" initials="SC" />
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-style-label-md text-text-primary">
                  Sam Carter
                </span>
                <span className="text-style-caption-md text-text-secondary">
                  Online
                </span>
              </div>
            )}
          </div>
        }
      />
    </Sidebar>
  );
}

function Header({
  store,
  onStoreChange,
}: {
  store: number | undefined;
  onStoreChange: (index: number) => void;
}) {
  return (
    <TopBar
      showSidebarToggle={false}
      showLogo={false}
      showProductName={false}
      showSearch={false}
      leading={
        <SearchInput
          size="sm"
          placeholder="Search…"
          className="w-screen max-w-md"
        />
      }
      showAdditional
      additional={
        <div className="flex items-center gap-component-sm">
          <Badge
            variant="warning"
            appearance="tinted"
            dot
            label="12 need attention"
            className="shrink-0 whitespace-nowrap"
          />
          <div className="w-32">
            <Select
              size="sm"
              selectedIndex={store}
              onSelectedIndexChange={onStoreChange}
              placeholder="All stores"
            >
              {STORES.map((name) => (
                <Option key={name} label={name} />
              ))}
            </Select>
          </div>
        </div>
      }
      actions={
        <div className="flex items-center gap-component-sm">
          <button
            type="button"
            aria-label="Notifications, 3 unread"
            className="relative flex size-control-sm items-center justify-center rounded-full text-icon-default hover:bg-action-tertiary-hover"
          >
            <Icon name="Bell" size="sm" />
            <BadgeCount
              count={3}
              variant="primary"
              className="absolute right-0 top-0"
            />
          </button>
          <Avatar type="initials" size="sm" initials="SC" />
        </div>
      }
    />
  );
}

function RecentOrders() {
  return (
    <Table
      style={{ width: "100%" }}
      showToolbar
      toolbar={
        <TableToolbar
          showTitle
          title="Recent orders"
          showSearch
          search={
            <span className="text-style-body-sm text-text-tertiary">Today</span>
          }
        />
      }
      header={
        <div className="flex w-full items-center">
          {COLUMNS.map((column, index) => (
            <TableHeaderCell
              key={column.label}
              label={column.label}
              style={columnStyle(index, "header")}
            />
          ))}
        </div>
      }
    >
      {ORDERS.map((order) => (
        <TableRow key={order.id}>
          <TableCell
            value={order.id}
            showSubText
            subText={order.time}
            style={columnStyle(0, "cell")}
          />
          <TableCell
            columnType="person"
            value={order.customer}
            avatarType="initials"
            avatarInitials={order.initials}
            style={columnStyle(1, "cell")}
          />
          <TableCell
            columnType="status"
            badgeVariant={order.statusVariant}
            badgeAppearance="tinted"
            badgeLabel={order.status}
            className="[&_span]:whitespace-nowrap"
            style={columnStyle(2, "cell")}
          />
          <TableCell
            columnType="numeric"
            value={order.items}
            className={MONO}
            style={columnStyle(3, "cell")}
          />
          <TableCell
            columnType="numeric"
            value={order.total}
            className={MONO}
            style={columnStyle(4, "cell")}
          />
          <TableCell
            columnType="icon"
            icon="MoreHorizontal"
            style={columnStyle(5, "cell")}
          />
        </TableRow>
      ))}
    </Table>
  );
}

function NeedsAttention() {
  return (
    <section className="flex flex-col gap-component-lg rounded-lg border border-border-default bg-background-surface py-component-lg">
      <div className="flex flex-col gap-layout-md">
        <div className="flex items-center justify-between px-component-xl">
          <p className="text-style-heading-sm text-text-primary">
            Needs attention
          </p>
          <ViewAllButton />
        </div>
        <Divider style={{ width: "100%" }} />
      </div>
      <ul className="flex flex-col gap-layout-sm">
        {ATTENTION.map((item) => (
          <li key={item.name} className="flex flex-col gap-layout-sm">
            <div className="flex items-center justify-between gap-component-sm px-component-xl">
              <div className="flex min-w-0 items-center gap-component-sm">
                <Avatar type="initials" size="md" initials={item.initials} />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-style-label-md text-text-primary">
                    {item.name}
                  </span>
                  <span className="text-style-caption-md text-text-secondary">
                    {item.time}
                  </span>
                </div>
              </div>
              <Badge
                variant={item.variant}
                appearance="tinted"
                label={item.label}
                className="shrink-0"
              />
            </div>
            <Divider style={{ width: "100%" }} />
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── Dashboard ──────────────────────────────────────────────────────────────

export function DashboardPreview() {
  const [period, setPeriod] = useState(0);
  const [store, setStore] = useState<number | undefined>(undefined);
  const data = DATA[period]!;

  return (
    <div className="flex bg-background-surface" style={{ width: DESIGN_WIDTH }}>
      <Navigation />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header store={store} onStoreChange={setStore} />

        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-style-heading-md text-text-primary">
                Good morning, Sam
              </p>
              <p className="text-style-body-sm text-text-secondary">
                {STORES[store ?? 0]} • 12 orders need attention
              </p>
            </div>
            <TabGroup
              appearance="elevated"
              activeIndex={period}
              onActiveIndexChange={setPeriod}
            >
              {PERIODS.map((label) => (
                <Tab key={label} appearance="elevated" label={label} />
              ))}
            </TabGroup>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {data.kpis.map((kpi) => (
              <Kpi
                key={kpi.label}
                size="sm"
                label={kpi.label}
                value={kpi.value}
                showDelta
                deltaValue={kpi.delta}
                deltaDirection={kpi.direction}
                style={{ width: "auto" }}
              />
            ))}
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-7">
              <OrdersByHourFrame
                data={data.orders}
                style={{ height: "100%" }}
              />
            </div>
            <div className="col-span-5">
              <FulfilmentFrame
                regions={data.regions}
                style={{ height: "100%" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-7">
              <RecentOrders />
            </div>
            <div className="col-span-5">
              <NeedsAttention />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Scales the full-size dashboard down to the width of its container.
 *
 * The frame holds the dashboard's proportions from the first paint (before any
 * script runs), and the full-size dashboard sits on top of it rather than in
 * the flow. So the hero never lays out around a 1400px-tall block and then
 * snaps to the scaled size — which read as the hero copy jumping up.
 */
export function ScaledDashboard({ className }: { className?: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const [contentHeight, setContentHeight] = useState(DESIGN_HEIGHT);

  // Layout effect: the measured scale lands before the browser paints.
  useLayoutEffect(() => {
    const frame = frameRef.current;
    const content = contentRef.current;
    if (!frame || !content) return;
    const update = () => {
      setScale(frame.clientWidth / DESIGN_WIDTH);
      setContentHeight(content.offsetHeight);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={frameRef}
      // One labelled region for the demo, so its own headings and landmarks
      // don't leak into the page outline.
      role="region"
      aria-label="Interactive dashboard preview built with NokGridCore components"
      className={[
        "relative overflow-hidden rounded-lg border border-border-default bg-background-surface",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ aspectRatio: `${DESIGN_WIDTH} / ${contentHeight}` }}
    >
      <div
        ref={contentRef}
        className="absolute left-0 top-0 origin-top-left"
        style={{
          transform: scale ? `scale(${scale})` : undefined,
          visibility: scale ? "visible" : "hidden",
        }}
      >
        <DashboardPreview />
      </div>
    </div>
  );
}
