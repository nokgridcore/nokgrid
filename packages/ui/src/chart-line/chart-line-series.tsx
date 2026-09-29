'use client';

import { HTMLAttributes, forwardRef } from 'react';

export type ChartLineCurve = 'linear' | 'smooth';
export type ChartLineSeriesColor = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface ChartLineSeriesProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
	color?: ChartLineSeriesColor;
	/** `smooth` is clamped (monotone) so it never invents a value above or below a real point. */
	curve?: ChartLineCurve;
	showAreaFill?: boolean;
	showDots?: boolean;
	values: number[];
	/** Value mapped to the top of the series box (0 is the bottom). */
	max: number;
	/** Index whose marker is drawn enlarged with a ring — the point being read. */
	activeIndex?: number | null;
	/** Draws the line in left-to-right instead of showing it fully drawn —
	 * `ChartLine` owns the mount-triggered timing, same split as
	 * `ChartBarSegment` (dumb, externally driven) vs `ChartBar` (owns `grown`). */
	grown?: boolean;
}

const PLOT_INSET = 'var(--nok-size-chart-plot-inset, 12px)';

// Points live in a 0-100 box stretched over the element (preserveAspectRatio
// none) so no size measurement is needed; strokes use non-scaling-stroke.
function toPoints(values: number[], max: number) {
	const last = Math.max(values.length - 1, 1);
	return values.map((v, i) => ({ x: (i / last) * 100, y: max > 0 ? 100 - (v / max) * 100 : 100 }));
}

export function linearPath(pts: { x: number; y: number }[]) {
	return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ');
}

// Fritsch–Carlson monotone cubic — the clamp the design asks for.
export function smoothPath(pts: { x: number; y: number }[]) {
	const n = pts.length;
	if (n < 3) return linearPath(pts);
	const X = (i: number) => pts[i]!.x;
	const Y = (i: number) => pts[i]!.y;
	const dx = Array.from({ length: n - 1 }, (_, i) => X(i + 1) - X(i));
	const slope = Array.from({ length: n - 1 }, (_, i) => (Y(i + 1) - Y(i)) / dx[i]!);
	const m = [slope[0]!];
	for (let i = 1; i < n - 1; i++) m.push(slope[i - 1]! * slope[i]! <= 0 ? 0 : (slope[i - 1]! + slope[i]!) / 2);
	m.push(slope[n - 2]!);
	for (let i = 0; i < n - 1; i++) {
		if (slope[i] === 0) {
			m[i] = 0;
			m[i + 1] = 0;
			continue;
		}
		const a = m[i]! / slope[i]!;
		const b = m[i + 1]! / slope[i]!;
		const s = a * a + b * b;
		if (s > 9) {
			const t = 3 / Math.sqrt(s);
			m[i] = t * a * slope[i]!;
			m[i + 1] = t * b * slope[i]!;
		}
	}
	let d = `M${X(0)} ${Y(0)}`;
	for (let i = 0; i < n - 1; i++) {
		const h = dx[i]! / 3;
		d += ` C${X(i) + h} ${Y(i) + m[i]! * h} ${X(i + 1) - h} ${Y(i + 1) - m[i + 1]! * h} ${X(i + 1)} ${Y(i + 1)}`;
	}
	return d;
}

export const ChartLineSeries = forwardRef<HTMLDivElement, ChartLineSeriesProps>(
	({ color = 1, curve = 'linear', showAreaFill = false, showDots = false, values, max, activeIndex = null, grown = true, style, ...props }, ref) => {
		const pts = toPoints(values, max);
		const linePath = curve === 'smooth' ? smoothPath(pts) : linearPath(pts);
		const stroke = `var(--nok-color-chart-${color})`;

		return (
			<div
				ref={ref}
				style={{
					position: 'absolute',
					inset: 0,
					pointerEvents: 'none',
					// Reveals left-to-right on mount, same grow-in spirit as ChartBar — a
					// clip-path wipe rather than a stroke-dasharray/pathLength trick,
					// since the latter produces visible seams at this line's sharp
					// vertices under the SVG's non-uniform (preserveAspectRatio: none)
					// scaling. Clips area, line and dots together as one unit.
					clipPath: grown ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
					transition: 'clip-path 700ms ease',
					...style,
				}}
				{...props}>
				<svg
					viewBox='0 0 100 100'
					preserveAspectRatio='none'
					fill='none'
					style={{ position: 'absolute', top: 0, bottom: 0, left: PLOT_INSET, right: PLOT_INSET, width: `calc(100% - 2 * ${PLOT_INSET})`, height: '100%', overflow: 'visible' }}>
					{showAreaFill && pts.length > 1 && <path d={`${linePath} L100 100 L0 100 Z`} fill={stroke} opacity={0.15} />}
					<path
						d={linePath}
						stroke={stroke}
						strokeWidth={2}
						strokeLinecap='round'
						strokeLinejoin='round'
						vectorEffect='non-scaling-stroke'
						style={{ strokeWidth: 'var(--nok-size-chart-line, 2px)' }}
					/>
				</svg>

				{(showDots || activeIndex !== null) &&
					pts.map((p, i) => {
						const active = i === activeIndex;
						if (!showDots && !active) return null;
						const size = active ? 'var(--nok-size-chart-marker-active, 10px)' : 'var(--nok-size-chart-marker, 6px)';
						return (
							<div
								key={i}
								style={{
									position: 'absolute',
									left: `calc(${PLOT_INSET} + (100% - 2 * ${PLOT_INSET}) * ${p.x / 100})`,
									top: `${p.y}%`,
									width: size,
									height: size,
									transform: 'translate(-50%, -50%)',
									borderRadius: '50%',
									boxSizing: 'border-box',
									background: stroke,
									border: active ? '2px solid var(--nok-color-chart-marker-ring, #FFF)' : undefined,
								}}
							/>
						);
					})}
			</div>
		);
	},
);

ChartLineSeries.displayName = 'ChartLineSeries';
