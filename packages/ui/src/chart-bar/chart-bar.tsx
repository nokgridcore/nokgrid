'use client';

import { CSSProperties, HTMLAttributes, MouseEvent, forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Legend } from '../legend/legend.js';
import { Tooltip } from '../tooltip/tooltip.js';
import { TooltipRow } from '../tooltip/tooltip-row.js';
import { ChartBarSegment, ChartBarSegmentColor, ChartBarSegmentState } from './chart-bar-segment.js';
import { ChartBarStack } from './chart-bar-stack.js';

export type ChartBarOrientation = 'vertical' | 'horizontal';
export type ChartBarLayout = 'single' | 'stacked';

export interface ChartBarSeries {
	label: string;
	color: ChartBarSegmentColor;
	values: number[];
}

// TODO: data shape (categories + series[].values) wasn't given — inferred as
// the standard category/series split so `layout='stacked'` can sum multiple
// series per category.
export interface ChartBarProps extends HTMLAttributes<HTMLDivElement> {
	orientation?: ChartBarOrientation;
	layout?: ChartBarLayout;
	categories: string[];
	series: ChartBarSeries[];
	showGridLines?: boolean;
	/** Solid baseline rule at the zero-value line. Category labels (Jan/Feb…)
	 * always render as part of each bar — there's no separate toggle for them. */
	showAxis?: boolean;
	/** Value axis (the 0/50/100… numbers) — named for its vertical-orientation
	 * position, same as the literal spec given for it. */
	showYAxis?: boolean;
	showLegend?: boolean;
	showTargetLine?: boolean;
	targetValue?: number;
	/** Fixes the plot area's size along the value axis (height when vertical,
	 * width when horizontal) instead of letting it fill the container — the
	 * default. Set this only when the chart isn't placed somewhere with a
	 * real size of its own (e.g. a bare demo). */
	plotSize?: number;
}

const BAR_THICKNESS = 40;
const BAR_GAP_PX = 8;
const BAR_GAP = 'var(--nok-spacing-component-sm, 8px)';
const ROOT_GAP = 'var(--nok-spacing-component-md, 12px)';
// Reserved space for the category-axis label row — literal value given for
// the Y-axis's own padding-bottom, reused here so the two stay in lockstep.
const LABEL_ROW_SIZE = 20.9;
const VALUE_AXIS_THICKNESS = 19;

const valueAxisLabelStyle: CSSProperties = {
	color: 'var(--nok-color-text-tertiary, #9E9E9E)',
	fontFamily: 'var(--nok-typography-font-family-body, Roboto)',
	fontSize: 'var(--nok-typography-font-size-11, 11px)',
	fontStyle: 'normal',
	fontWeight: 400,
	lineHeight: 'var(--nok-typography-line-height-15-4, 15.4px)',
};

const categoryAxisLabelStyle: CSSProperties = {
	color: 'var(--nok-color-text-secondary, #5C5C5C)',
	fontFamily: 'var(--nok-typography-font-family-body, Roboto)',
	fontSize: 'var(--nok-typography-font-size-11, 11px)',
	fontStyle: 'normal',
	fontWeight: 400,
	lineHeight: 'var(--nok-typography-line-height-15-4, 15.4px)',
};

// Target line's own label — same caption/sm typography as the axes, but a
// distinct `chart-label` color token rather than either axis's own color.
const targetLabelStyle: CSSProperties = { ...valueAxisLabelStyle, color: 'var(--nok-color-chart-label, #5C5C5C)' };

const gridLineStyle = (isVertical: boolean): CSSProperties =>
	isVertical ?
		{ borderTop: 'var(--nok-size-chart-grid, 1px) solid var(--nok-color-chart-grid, #EDEDED)', height: 0 }
	:	{ borderLeft: 'var(--nok-size-chart-grid, 1px) solid var(--nok-color-chart-grid, #EDEDED)', width: 0 };

// The target line's dash pattern is a literal 4px-on/4px-off, 1px stroke —
// CSS `border-style: dashed` doesn't reproduce that ratio, so it's built from
// a repeating gradient instead.
const dashedLineStyle = (isVertical: boolean): CSSProperties =>
	isVertical ?
		{ height: '1px', backgroundImage: 'repeating-linear-gradient(to right, var(--nok-color-chart-axis, #BFBFBF) 0 4px, transparent 4px 8px)' }
	:	{ width: '1px', backgroundImage: 'repeating-linear-gradient(to bottom, var(--nok-color-chart-axis, #BFBFBF) 0 4px, transparent 4px 8px)' };

// Rounds the plot's max data value up to a "nice" number so `tickCount + 1`
// evenly-spaced ticks (0..niceMax) land on round values — same 5-tick
// (0/50/100/150/200-style) shape as the mock.
export function computeNiceMax(max: number, tickCount = 4): number {
	if (max <= 0) return tickCount;
	const rough = max / tickCount;
	const magnitude = 10 ** Math.floor(Math.log10(rough));
	const residual = rough / magnitude;
	const niceResidual = residual > 5 ? 10 : residual > 2 ? 5 : residual > 1 ? 2 : 1;
	return niceResidual * magnitude * tickCount;
}

export const ChartBar = forwardRef<HTMLDivElement, ChartBarProps>(
	(
		{
			orientation = 'vertical',
			layout = 'single',
			categories,
			series,
			showGridLines = true,
			showAxis = true,
			showYAxis = true,
			showLegend = true,
			showTargetLine = false,
			targetValue,
			plotSize,
			className,
			style,
			...props
		},
		ref,
	) => {
		const isVertical = orientation === 'vertical';
		const tickCount = 4;
		const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
		const [mousePos, setMousePos] = useState<{ x: number; y: number; flip: boolean } | null>(null);
		const plotRef = useRef<HTMLDivElement>(null);

		// Bars grow from 0 on mount, and again whenever orientation flips (the
		// bars are rebuilt anyway — height swaps for width — so replaying the
		// grow-in reads as one continuous change rather than a jump-cut).
		// On mount, `grown`'s initial `false` value IS the first paint, so one
		// rAF to flip it true is enough. On a later orientation switch, `grown`
		// is already `true` — a single rAF scheduled right after setting it
		// back to `false` can still land before the browser actually paints
		// that intermediate 0% state, coalescing false→true into one frame
		// with nothing to animate from. A second rAF guarantees a real paint
		// happens in between.
		const [grown, setGrown] = useState(false);

		// On a narrow chart the category labels can't all sit side by side (nine
		// "10am"-style labels need ~250px). Measure the widest label against the
		// space each one gets and show every 2nd (or 3rd…) label when they'd
		// collide. The bars stay; hovering one still names its category.
		const labelRowRef = useRef<HTMLDivElement>(null);
		const [labelStep, setLabelStep] = useState(1);
		useLayoutEffect(() => {
			const row = labelRowRef.current;
			if (!row || categories.length === 0) return;
			const update = () => {
				// Measure each label's text, not its box (the box is always the slot width).
				const range = document.createRange();
				const widest = Math.max(
					...Array.from(row.children).map((label) => {
						range.selectNodeContents(label);
						return range.getBoundingClientRect().width;
					}),
				);
				// Centre-to-centre distance between neighbouring labels.
				const spacing = (row.clientWidth + BAR_GAP_PX) / categories.length;
				setLabelStep(spacing > 0 ? Math.max(1, Math.ceil((widest + BAR_GAP_PX) / spacing)) : 1);
			};
			update();
			const observer = new ResizeObserver(update);
			observer.observe(row);
			return () => observer.disconnect();
		}, [categories]);
		useEffect(() => {
			setGrown(false);
			let raf2 = 0;
			const raf1 = requestAnimationFrame(() => {
				raf2 = requestAnimationFrame(() => setGrown(true));
			});
			return () => {
				cancelAnimationFrame(raf1);
				cancelAnimationFrame(raf2);
			};
		}, [orientation]);

		// Tooltip follows the cursor rather than pinning to the bar's own box —
		// one mousemove listener on the plot area (it bubbles from every bar).
		const handlePlotMouseMove = (e: MouseEvent<HTMLDivElement>) => {
			const rect = plotRef.current?.getBoundingClientRect();
			if (!rect) return;
			const x = e.clientX - rect.left;
			// Past the midpoint the tooltip opens to the left, so it never overflows
			// the chart's right edge (which made the last bars jump).
			setMousePos({ x, y: e.clientY - rect.top, flip: x > rect.width / 2 });
		};

		const categoryTotal = (index: number) =>
			layout === 'stacked' ? series.reduce((sum, s) => sum + (s.values[index] ?? 0), 0) : (series[0]?.values[index] ?? 0);

		// The target value can exceed the data's own max — the scale has to
		// stretch to fit it or the line would render off the plot entirely.
		const dataMax = Math.max(0, showTargetLine ? targetValue ?? 0 : 0, ...categories.map((_, i) => categoryTotal(i)));
		const niceMax = computeNiceMax(dataMax, tickCount);
		const ticks = Array.from({ length: tickCount + 1 }, (_, i) => Math.round((niceMax / tickCount) * i));

		const targetPct = showTargetLine && targetValue !== undefined && niceMax > 0 ? (targetValue / niceMax) * 100 : null;
		const targetLineContent = targetPct !== null && (
			<>
				<div
					className='absolute'
					style={
						isVertical ?
							{ left: 0, right: 0, bottom: `${targetPct}%`, ...dashedLineStyle(true), zIndex: 2 }
						:	{ top: 0, bottom: 0, left: `${targetPct}%`, ...dashedLineStyle(false), zIndex: 2 }
					}
				/>
				<span
					className='absolute'
					style={
						isVertical ?
							{ ...targetLabelStyle, right: 0, bottom: `${targetPct}%`, transform: 'translateY(-100%)', whiteSpace: 'nowrap', zIndex: 2 }
						:	{ ...targetLabelStyle, top: 0, left: `${targetPct}%`, transform: 'translateX(8px)', whiteSpace: 'nowrap', zIndex: 2 }
					}>
					Target {targetValue}
				</span>
			</>
		);
		// Vertical's plot box isn't always the tick-usable area on its own —
		// in fixed-plotSize mode it still includes the label row's reserved
		// space, same as gridlines' own box, so this needs the identical
		// conditional padding to land on the same coordinates. Horizontal's
		// plot box IS already exactly the tick-usable area (the grid column
		// itself, no padding trick involved), so it can position directly.
		const targetLine =
			targetLineContent &&
			(isVertical ?
				<div className='absolute' style={{ inset: 0, paddingBottom: plotSize !== undefined ? `${LABEL_ROW_SIZE}px` : undefined }}>
					{targetLineContent}
				</div>
			:	targetLineContent);

		// The cross axis (category count × bar thickness + gaps) is independent
		// of `plotSize`, which only sizes the value axis. Vertical derives its
		// cross axis (width) from bar content automatically; horizontal needs it
		// explicit since it sizes a grid row.
		const crossAxisSize = categories.length * BAR_THICKNESS + Math.max(0, categories.length - 1) * BAR_GAP_PX;

		// Hovering a category dims every other one to 30% and floats a Tooltip
		// off the hovered bar's leading edge (top when vertical, right when
		// horizontal) — positioned purely with CSS relative to each bar's own
		// wrapper, no measurement needed.
		const stateForIndex = (i: number): ChartBarSegmentState =>
			hoveredIndex === null ? 'default'
			: hoveredIndex === i ? 'focused'
			: 'unfocused';

		const bars = categories.map((category, i) => {
			const pct = niceMax > 0 ? (categoryTotal(i) / niceMax) * 100 : 0;
			// Absolutely-positioned gridlines paint above static content regardless
			// of DOM order — position + z-index puts the bars back on top.
			// flex:1 (not 'none') so bars grow to fill the row's available cross-
			// axis space equally — the fixed `gap` on the row is what keeps the
			// 8px between them constant instead of the bars themselves.
			const sizeStyle: CSSProperties = {
				flex: 1,
				// Without this a flex item won't shrink below its content, so on a
				// narrow screen the bars overflow instead of sharing the width.
				minWidth: 0,
				position: 'relative',
				zIndex: 1,
				[isVertical ? 'height' : 'width']: `${grown ? pct : 0}%`,
				transition: `${isVertical ? 'height' : 'width'} 600ms ease`,
			};

			return (
				<div key={category} className='flex' style={sizeStyle} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
					{layout === 'stacked' ?
						<ChartBarStack orientation={orientation} showLabel={false}>
							{series.map((s, si) => (
								<ChartBarSegment
									key={`${s.label}-${si}`}
									orientation={orientation}
									color={s.color}
									state={stateForIndex(i)}
									showLabel={false}
									style={{ flexGrow: s.values[i] ?? 0 }}
								/>
							))}
						</ChartBarStack>
					:	<ChartBarSegment orientation={orientation} color={series[0]?.color ?? 1} state={stateForIndex(i)} showLabel={false} />}
				</div>
			);
		});

		// Offset up-and-right of the pointer so the tooltip never sits directly
		// under it (which would fight the hover target underneath).
		const cursorTooltip = hoveredIndex !== null && mousePos && (
			<Tooltip
				showArrow={false}
				title={categories[hoveredIndex]}
				style={{
					position: 'absolute',
					left: mousePos.flip ? mousePos.x - 12 : mousePos.x + 12,
					top: mousePos.y - 12,
					transform: mousePos.flip ? 'translate(-100%, -100%)' : 'translateY(-100%)',
					zIndex: 20,
					whiteSpace: 'nowrap',
					pointerEvents: 'none',
				}}>
				<div className='flex flex-col' style={{ gap: 'var(--nok-spacing-component-xs, 4px)' }}>
					{(layout === 'stacked' ? series : series.slice(0, 1)).map((s, si) => (
						<TooltipRow key={`${s.label}-${si}`} color={s.color} label={s.label} value={String(s.values[hoveredIndex] ?? 0)} />
					))}
				</div>
			</Tooltip>
		);

		// `single` only ever plots series[0] — the legend should match what's
		// actually on the chart, not list series that aren't rendered.
		const visibleSeries = layout === 'stacked' ? series : series.slice(0, 1);

		const legend = showLegend && (
			<div className='flex flex-wrap' style={{ gap: 'var(--nok-spacing-component-md, 12px)' }}>
				{visibleSeries.map((s, si) => (
					<Legend key={`${s.label}-${si}`} swatchShape='square' color={s.color} label={s.label} />
				))}
			</div>
		);

		if (isVertical) {
			return (
				<div
					ref={ref}
					className={['flex flex-col', className].filter(Boolean).join(' ')}
					style={{ width: '100%', height: '100%', gap: ROOT_GAP, ...style }}
					{...props}>
					{/* flex:1 so this row (and everything under it) fills whatever
					    height the root gets from its own container, unless `plotSize`
					    opts into a fixed height instead. */}
					<div className='flex' style={{ flex: plotSize !== undefined ? 'none' : 1, gap: BAR_GAP }}>
						{showYAxis && (
							<div
								className='flex shrink-0 flex-col'
								style={{
									width: `${VALUE_AXIS_THICKNESS}px`,
									height: plotSize !== undefined ? `${plotSize + LABEL_ROW_SIZE}px` : undefined,
									paddingBottom: `${LABEL_ROW_SIZE}px`,
									justifyContent: 'space-between',
									alignItems: 'flex-end',
								}}>
								{[...ticks].reverse().map((v, i) => (
									<span key={i} style={valueAxisLabelStyle}>
										{v}
									</span>
								))}
							</div>
						)}

						{/* flex:1 so this column fills the row's remaining width instead of
						    shrinking to the bars' own content width. No gap between the
						    plot and the label row below it — LABEL_ROW_SIZE is already the
						    full reserved region; an extra gap here would eat into the
						    plot's own flex:1 height, throwing it out of sync with the
						    Y-axis's tick area (which only reserves LABEL_ROW_SIZE). */}
						<div className='flex flex-1 flex-col' style={{ minWidth: 0 }}>
							<div
								ref={plotRef}
								onMouseMove={handlePlotMouseMove}
								className='relative flex items-end'
								style={{
									flex: plotSize !== undefined ? 'none' : 1,
									height: plotSize !== undefined ? `${plotSize}px` : undefined,
									gap: BAR_GAP,
								}}>
								{showGridLines && (
									<div
										className='absolute flex flex-col'
										style={{
											inset: 0,
											justifyContent: 'space-between',
											// Fixed mode: plotArea is the full plotSize, so this still
											// needs to carve out its own label-row reservation. Fill
											// mode: plotArea's flex:1 height already excludes the
											// label row (a flex sibling) — padding again here would
											// double-subtract it, same bug as the removed column gap.
											paddingBottom: plotSize !== undefined ? `${LABEL_ROW_SIZE}px` : undefined,
										}}>
										{ticks.map((_, i) => (
											<div key={i} style={gridLineStyle(true)} />
										))}
									</div>
								)}
								{showAxis && (
									<div
										className='absolute'
										style={{
											left: 0,
											right: 0,
											bottom: plotSize !== undefined ? `${LABEL_ROW_SIZE}px` : 0,
											height: '1px',
											background: 'var(--nok-color-chart-axis, #BFBFBF)',
										}}
									/>
								)}
								{bars}
								{targetLine}
								{cursorTooltip}
							</div>

							<div ref={labelRowRef} className='flex shrink-0' style={{ gap: BAR_GAP, height: `${LABEL_ROW_SIZE}px` }}>
								{categories.map((category, i) => (
									// minWidth 0 lets the labels share a narrow row with the bars
									// above them; nowrap keeps each label on one centred line.
									<span
										key={category}
										style={{
											...categoryAxisLabelStyle,
											flex: 1,
											minWidth: 0,
											textAlign: 'center',
											whiteSpace: 'nowrap',
											visibility: i % labelStep === 0 ? undefined : 'hidden',
										}}>
							<div className='flex shrink-0' style={{ gap: BAR_GAP, height: `${LABEL_ROW_SIZE}px` }}>
								{categories.map((category) => (
									<span key={category} style={{ ...categoryAxisLabelStyle, flex: 1, textAlign: 'center' }}>
										{category}
									</span>
								))}
							</div>
						</div>
					</div>
					{legend}
				</div>
			);
		}

		// CSS Grid (not nested flex) so the plot column's width stays identical
		// between the bars row and the value-axis row below it — a flex spacer
		// trying to mirror the label column's auto-width was fragile.
		return (
			<div
				ref={ref}
				className={['flex flex-col', className].filter(Boolean).join(' ')}
				style={{ width: '100%', height: plotSize !== undefined ? undefined : '100%', gap: ROOT_GAP, ...style }}
				{...props}>
				<div
					style={{
						display: 'grid',
						// max-content (not auto) so this column shrinks to the label
						// text's own width instead of absorbing the row's leftover space.
						// The plot column is 1fr — it, not the label column, fills
						// whatever's left — unless `plotSize` fixes it in px.
						gridTemplateColumns: `max-content ${plotSize !== undefined ? `${plotSize}px` : '1fr'}`,
						// Same idea on the cross axis — 1fr row lets category rows spread
						// out (via space-between below) to fill the grid's real height.
						gridTemplateRows: `${plotSize !== undefined ? `${crossAxisSize}px` : '1fr'} auto`,
						columnGap: BAR_GAP,
						rowGap: BAR_GAP,
						flex: plotSize !== undefined ? 'none' : 1,
					}}>
					<div style={{ gridColumn: 1, gridRow: 1, display: 'flex', flexDirection: 'column', gap: BAR_GAP }}>
						{categories.map((category) => (
							<span key={category} style={{ ...categoryAxisLabelStyle, flex: 1, display: 'flex', alignItems: 'center' }}>
								{category}
							</span>
						))}
					</div>

					<div
						ref={plotRef}
						onMouseMove={handlePlotMouseMove}
						className='relative flex flex-col'
						style={{ gridColumn: 2, gridRow: 1, gap: BAR_GAP }}>
						{showGridLines && (
							<div className='absolute flex' style={{ inset: 0, justifyContent: 'space-between' }}>
								{ticks.map((_, i) => (
									<div key={i} style={gridLineStyle(false)} />
								))}
							</div>
						)}
						{showAxis && (
							<div
								className='absolute'
								style={{ top: 0, bottom: 0, left: 0, width: '1px', background: 'var(--nok-color-chart-axis, #BFBFBF)' }}
							/>
						)}
						{bars}
						{targetLine}
						{cursorTooltip}
					</div>

					{showYAxis && (
						<div style={{ gridColumn: 2, gridRow: 2, display: 'flex', justifyContent: 'space-between' }}>
							{ticks.map((v, i) => (
								<span key={i} style={valueAxisLabelStyle}>
									{v}
								</span>
							))}
						</div>
					)}
				</div>
				{legend}
			</div>
		);
	},
);

ChartBar.displayName = 'ChartBar';
