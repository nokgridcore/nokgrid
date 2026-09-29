'use client';

import { CSSProperties, HTMLAttributes, MouseEvent, forwardRef, useRef, useState } from 'react';
import { Legend } from '../legend/legend.js';
import { Tooltip } from '../tooltip/tooltip.js';
import { TooltipRow } from '../tooltip/tooltip-row.js';
import { ChartDonutSegment, ChartDonutSegmentColor, ChartDonutSegmentState } from './chart-donut-segment.js';

export type ChartDonutType = 'donut' | 'pie';

export interface ChartDonutSlice {
	label: string;
	color: ChartDonutSegmentColor;
	value: number;
}

// TODO: data shape wasn't given — inferred as one slice per segment, arcs
// computed from each value's share of the total.
export interface ChartDonutProps extends HTMLAttributes<HTMLDivElement> {
	/** `pie` closes the hole. */
	type?: ChartDonutType;
	slices: ChartDonutSlice[];
	showCentreValue?: boolean;
	centreValue?: string;
	showCentreLabel?: boolean;
	centreLabel?: string;
	showLegend?: boolean;
}

const DONUT_SIZE = 200;
const DONUT_INNER_RADIUS = 60;

const centreValueStyle: CSSProperties = {
	margin: 0,
	width: '100%',
	color: 'var(--nok-color-text-primary, #141414)',
	fontFamily: 'var(--nok-typography-font-family-brand, "Plus Jakarta Sans")',
	fontSize: 'var(--nok-typography-font-size-16, 16px)',
	fontStyle: 'normal',
	fontWeight: 600,
	lineHeight: 'var(--nok-typography-line-height-22-4, 22.4px)',
};

const centreLabelStyle: CSSProperties = {
	margin: 0,
	width: '100%',
	color: 'var(--nok-color-chart-label, #5C5C5C)',
	fontFamily: 'var(--nok-typography-font-family-body, Roboto)',
	fontSize: 'var(--nok-typography-font-size-11, 11px)',
	fontStyle: 'normal',
	fontWeight: 400,
	lineHeight: 'var(--nok-typography-line-height-15-4, 15.4px)',
};

export const ChartDonut = forwardRef<HTMLDivElement, ChartDonutProps>(
	(
		{
			type = 'donut',
			slices,
			showCentreValue = false,
			centreValue = '68%',
			showCentreLabel = false,
			centreLabel = 'of target',
			showLegend = true,
			className,
			style,
			...props
		},
		ref,
	) => {
		const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
		const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
		const donutRef = useRef<HTMLDivElement>(null);

		const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
			const rect = donutRef.current?.getBoundingClientRect();
			if (!rect) return;
			setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
		};

		const total = slices.reduce((sum, s) => sum + Math.max(0, s.value), 0);
		let cursor = 0;
		const arcs = slices.map((s) => {
			const sweep = total > 0 ? (Math.max(0, s.value) / total) * 360 : 0;
			const arc = { startAngle: cursor, endAngle: cursor + sweep };
			cursor += sweep;
			return arc;
		});

		const stateForIndex = (i: number): ChartDonutSegmentState =>
			hoveredIndex === null ? 'default'
			: hoveredIndex === i ? 'focused'
			: 'unfocused';

		const hovered = hoveredIndex !== null ? slices[hoveredIndex] : undefined;
		const hasCentre = type === 'donut' && ((showCentreValue && centreValue) || (showCentreLabel && centreLabel));

		return (
			<div
				ref={ref}
				className={className}
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 'var(--nok-spacing-component-md, 12px)',
					...style,
				}}
				{...props}>
				<div
					ref={donutRef}
					onMouseMove={handleMouseMove}
					style={{ position: 'relative', flexShrink: 0, width: `${DONUT_SIZE}px`, height: `${DONUT_SIZE}px` }}>
					{slices.map((s, i) => (
						<ChartDonutSegment
							key={`${s.label}-${i}`}
							color={s.color}
							state={stateForIndex(i)}
							startAngle={arcs[i]?.startAngle ?? 0}
							endAngle={arcs[i]?.endAngle ?? 0}
							innerRadius={type === 'pie' ? 0 : DONUT_INNER_RADIUS}
							onMouseEnter={() => setHoveredIndex(i)}
							onMouseLeave={() => setHoveredIndex(null)}
						/>
					))}

					{hasCentre && (
						<div
							style={{
								position: 'absolute',
								left: '50%',
								top: '50%',
								transform: 'translate(-50%, -50%)',
								width: '120px',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 'var(--nok-spacing-component-2xs, 2px)',
								textAlign: 'center',
								wordBreak: 'break-word',
								pointerEvents: 'none',
							}}>
							{showCentreValue && <p style={centreValueStyle}>{centreValue}</p>}
							{showCentreLabel && <p style={centreLabelStyle}>{centreLabel}</p>}
						</div>
					)}

					{hovered && mousePos && (
						<Tooltip
							showArrow={false}
							title={hovered.label}
							style={{
								position: 'absolute',
								left: mousePos.x + 12,
								top: mousePos.y - 12,
								transform: 'translateY(-100%)',
								zIndex: 20,
								whiteSpace: 'nowrap',
								pointerEvents: 'none',
							}}>
							<TooltipRow color={hovered.color} label={hovered.label} value={String(hovered.value)} />
						</Tooltip>
					)}
				</div>

				{showLegend && (
					<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--nok-spacing-component-md, 12px)' }}>
						{slices.map((s, i) => (
							<Legend key={`${s.label}-${i}`} swatchShape='square' color={s.color} label={s.label} />
						))}
					</div>
				)}
			</div>
		);
	},
);

ChartDonut.displayName = 'ChartDonut';
