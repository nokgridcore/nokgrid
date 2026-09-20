'use client';

import { CSSProperties, HTMLAttributes, MouseEvent, forwardRef, useRef, useState } from 'react';
import { Legend } from '../legend/legend.js';
import { Tooltip } from '../tooltip/tooltip.js';
import { TooltipRow } from '../tooltip/tooltip-row.js';
import { computeNiceMax } from '../chart-bar/chart-bar.js';
import { ChartLineCurve, ChartLineSeries, ChartLineSeriesColor } from './chart-line-series.js';

export type ChartLineGrid = 'horizontal' | 'both';

export interface ChartLineSeriesData {
	label: string;
	color: ChartLineSeriesColor;
	values: number[];
}

// TODO: data shape (categories + series[].values) wasn't given — inferred to
// match ChartBar's, so the two chart types take interchangeable data.
export interface ChartLineProps extends HTMLAttributes<HTMLDivElement> {
	categories: string[];
	series: ChartLineSeriesData[];
	/** Design only shows `horizontal`; `both` adds a vertical gridline at each point (inferred name). */
	grid?: ChartLineGrid;
	curve?: ChartLineCurve;
	showAreaFill?: boolean;
	showDots?: boolean;
	showAxis?: boolean;
	showYAxis?: boolean;
	showLegend?: boolean;
	showTargetLine?: boolean;
	targetValue?: number;
}

const INSET = 12;
const TOP_PAD = 4.1;
const AXIS_HEIGHT = 25;
const LINES_BOTTOM = 26;

const yAxisLabelStyle: CSSProperties = {
	color: 'var(--nok-color-text-tertiary, #9E9E9E)',
	fontFamily: 'var(--nok-typography-font-family-body, Roboto)',
	fontSize: 'var(--nok-typography-font-size-11, 11px)',
	fontStyle: 'normal',
	fontWeight: 400,
	lineHeight: 'var(--nok-typography-line-height-15-4, 15.4px)',
};

const tickLabelStyle: CSSProperties = { ...yAxisLabelStyle, color: 'var(--nok-color-text-secondary, #5C5C5C)', textAlign: 'center' };
const targetLabelStyle: CSSProperties = { ...yAxisLabelStyle, color: 'var(--nok-color-chart-label, #5C5C5C)' };

const dashedH: CSSProperties = {
	height: '1px',
	backgroundImage: 'repeating-linear-gradient(to right, var(--nok-color-chart-axis, #BFBFBF) 0 4px, transparent 4px 8px)',
};

export const ChartLine = forwardRef<HTMLDivElement, ChartLineProps>(
	(
		{
			categories,
			series,
			grid = 'horizontal',
			curve = 'linear',
			showAreaFill = false,
			showDots = false,
			showAxis = true,
			showYAxis = true,
			showLegend = true,
			showTargetLine = false,
			targetValue,
			className,
			style,
			...props
		},
		ref,
	) => {
		const tickCount = 4;
		const plotRef = useRef<HTMLDivElement>(null);
		const [hoverIndex, setHoverIndex] = useState<number | null>(null);
		const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

		const dataMax = Math.max(0, showTargetLine ? (targetValue ?? 0) : 0, ...series.flatMap((s) => s.values));
		const niceMax = computeNiceMax(dataMax, tickCount);
		const ticks = Array.from({ length: tickCount + 1 }, (_, i) => Math.round((niceMax / tickCount) * i));
		const targetPct = showTargetLine && targetValue !== undefined && niceMax > 0 ? (targetValue / niceMax) * 100 : null;

		const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
			const rect = plotRef.current?.getBoundingClientRect();
			if (!rect || categories.length === 0) return;
			const x = e.clientX - rect.left;
			const span = rect.width - INSET * 2;
			const ratio = span > 0 ? (x - INSET) / span : 0;
			setHoverIndex(Math.min(categories.length - 1, Math.max(0, Math.round(ratio * Math.max(categories.length - 1, 1)))));
			setMousePos({ x, y: e.clientY - rect.top });
		};

		const pointX = (i: number) => `calc(${INSET}px + (100% - ${INSET * 2}px) * ${categories.length > 1 ? i / (categories.length - 1) : 0})`;
		const showVerticalGrid = grid === 'both';

		return (
			<div
				ref={ref}
				className={className}
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 'var(--nok-spacing-component-md, 12px)',
					width: '100%',
					height: '240px',
					...style,
				}}
				{...props}>
				<div style={{ display: 'flex', flex: 1, minHeight: 0, gap: 'var(--nok-spacing-component-sm, 8px)' }}>
					{showYAxis && (
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								flexShrink: 0,
								width: '19px',
								height: '100%',
								paddingBottom: '21.9px',
								justifyContent: 'space-between',
								alignItems: 'flex-end',
							}}>
							{[...ticks].reverse().map((v, i) => (
								<span key={i} style={yAxisLabelStyle}>
									{v}
								</span>
							))}
						</div>
					)}

					<div
						ref={plotRef}
						onMouseMove={handleMouseMove}
						onMouseLeave={() => setHoverIndex(null)}
						style={{ position: 'relative', flex: 1, minWidth: 0, height: '100%', overflow: 'clip' }}>
						<div
							style={{
								position: 'absolute',
								inset: `0 0 ${AXIS_HEIGHT}px 0`,
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between',
								paddingTop: `${TOP_PAD}px`,
							}}>
							{ticks.map((_, i) => (
								<div key={i} style={{ height: '1px', width: '100%', flexShrink: 0, background: 'var(--nok-color-chart-grid, #EDEDED)' }} />
							))}
						</div>

						{showVerticalGrid &&
							categories.map((_, i) => (
								<div
									key={i}
									style={{
										position: 'absolute',
										top: 0,
										bottom: `${AXIS_HEIGHT}px`,
										left: pointX(i),
										width: '1px',
										background: 'var(--nok-color-chart-grid, #EDEDED)',
									}}
								/>
							))}

						<div style={{ position: 'absolute', inset: `${TOP_PAD}px 0 ${LINES_BOTTOM}px 0`, zIndex: 1 }}>
							{series.map((s, i) => (
								<ChartLineSeries
									key={`${s.label}-${i}`}
									color={s.color}
									curve={curve}
									showAreaFill={showAreaFill}
									showDots={showDots}
									values={s.values}
									max={niceMax}
									activeIndex={hoverIndex}
								/>
							))}

							{targetPct !== null && (
								<>
									<div style={{ position: 'absolute', left: 0, right: 0, bottom: `${targetPct}%`, zIndex: 2, ...dashedH }} />
									<span
										style={{
											...targetLabelStyle,
											position: 'absolute',
											right: 0,
											bottom: `${targetPct}%`,
											transform: 'translateY(-100%)',
											whiteSpace: 'nowrap',
											zIndex: 2,
										}}>
										Target {targetValue}
									</span>
								</>
							)}
						</div>

						{hoverIndex !== null && (
							<div
								style={{
									position: 'absolute',
									top: 0,
									bottom: `${AXIS_HEIGHT}px`,
									left: pointX(hoverIndex),
									width: '1px',
									background: 'var(--nok-color-chart-crosshair, #BFBFBF)',
									pointerEvents: 'none',
								}}
							/>
						)}

						{showAxis && (
							<div
								style={{
									position: 'absolute',
									bottom: '1px',
									left: 0,
									right: 0,
									height: `${AXIS_HEIGHT}px`,
									display: 'flex',
									flexDirection: 'column',
									gap: 'var(--nok-spacing-component-sm, 8px)',
									overflow: 'clip',
								}}>
								<div style={{ height: '1px', width: '100%', flexShrink: 0, background: 'var(--nok-color-chart-axis, #BFBFBF)' }} />
								<div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
									{categories.map((c) => (
										<span key={c} style={{ ...tickLabelStyle, width: '24px', display: 'flex', justifyContent: 'center' }}>
											{c}
										</span>
									))}
								</div>
							</div>
						)}

						{hoverIndex !== null && mousePos && (
							<Tooltip
								showArrow={false}
								title={categories[hoverIndex]}
								style={{
									position: 'absolute',
									left: mousePos.x + 12,
									top: mousePos.y - 12,
									transform: 'translateY(-100%)',
									zIndex: 20,
									whiteSpace: 'nowrap',
									pointerEvents: 'none',
								}}>
								<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nok-spacing-component-xs, 4px)' }}>
									{series.map((s, i) => (
										<TooltipRow key={`${s.label}-${i}`} color={s.color} label={s.label} value={String(s.values[hoverIndex] ?? 0)} />
									))}
								</div>
							</Tooltip>
						)}
					</div>
				</div>

				{showLegend && (
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--nok-spacing-component-md, 12px)' }}>
						{series.map((s, i) => (
							<Legend key={`${s.label}-${i}`} swatchShape='square' color={s.color} label={s.label} />
						))}
					</div>
				)}
			</div>
		);
	},
);

ChartLine.displayName = 'ChartLine';
