'use client';

import { SVGAttributes, forwardRef } from 'react';
import { linearPath, smoothPath } from '../chart-line/chart-line-series.js';

export type ChartSparkTrend = 'up' | 'down' | 'flat';
export type ChartSparkSize = 'sm' | 'md';
export type ChartSparkCurve = 'linear' | 'smooth';

export interface ChartSparkProps extends Omit<SVGAttributes<SVGSVGElement>, 'values'> {
	/** Drives both the colour and — when `values` is omitted — the default shape. */
	trend?: ChartSparkTrend;
	size?: ChartSparkSize;
	curve?: ChartSparkCurve;
	/** Data points, left to right. Defaults to the design's shape for `trend`. */
	values?: number[];
}

const INSET_X = 3;

const dimensions: Record<ChartSparkSize, { width: number; height: number }> = {
	sm: { width: 64, height: 20 },
	md: { width: 96, height: 32 },
};

// Custom `values` are scaled into the band the design's line occupies:
// highest value at yTop, lowest at yBottom (literal from the `up` variants).
const band: Record<ChartSparkSize, { yTop: number; yBottom: number }> = {
	sm: { yTop: 4.4, yBottom: 13.92 },
	md: { yTop: 5.6, yBottom: 23.28 },
};

const colourForTrend: Record<ChartSparkTrend, string> = {
	up: 'var(--nok-color-chart-positive, #22A06B)',
	down: 'var(--nok-color-chart-negative, #EF4444)',
	flat: 'var(--nok-color-chart-neutral, #9E9E9E)',
};

// The design's literal y coordinates for each trend, left to right.
const designY: Record<ChartSparkSize, Record<ChartSparkTrend, number[]>> = {
	sm: {
		up: [13.92, 11.68, 12.8, 9.16, 10.28, 6.64, 4.4],
		down: [4.68, 7.2, 6.36, 10, 9.16, 12.52, 15.04],
		flat: [10, 8.88, 10.84, 9.44, 10.56, 9.16, 10],
	},
	md: {
		up: [23.28, 19.12, 21.2, 14.44, 16.52, 9.76, 5.6],
		down: [6.12, 10.8, 9.24, 16, 14.44, 20.68, 25.36],
		flat: [16, 13.92, 17.56, 14.96, 17.04, 14.44, 16],
	},
};

export const ChartSpark = forwardRef<SVGSVGElement, ChartSparkProps>(
	({ trend = 'up', size = 'sm', curve = 'linear', values, style, ...props }, ref) => {
		const { width, height } = dimensions[size];
		const step = (width - INSET_X * 2) / ((values && values.length > 1 ? values.length : designY[size][trend].length) - 1);
		let ys = designY[size][trend];
		if (values && values.length > 1) {
			const { yTop, yBottom } = band[size];
			const min = Math.min(...values);
			const range = Math.max(...values) - min;
			ys = values.map((v) => (range === 0 ? (yTop + yBottom) / 2 : yBottom - ((v - min) / range) * (yBottom - yTop)));
		}
		const pts = ys.map((y, i) => ({ x: INSET_X + i * step, y }));
		const line = curve === 'smooth' ? smoothPath(pts) : linearPath(pts);
		const first = pts[0] ?? { x: INSET_X, y: 0 };
		const last = pts[pts.length - 1] ?? first;
		const colour = colourForTrend[trend];

		return (
			<svg
				ref={ref}
				width={width}
				height={height}
				viewBox={`0 0 ${width} ${height}`}
				fill='none'
				data-size={size}
				style={{ display: 'block', flexShrink: 0, overflow: 'visible', ...style }}
				{...props}>
				<path d={`${line} L${last.x} ${height} L${first.x} ${height} Z`} fill={colour} fillOpacity={0.2} />
				<path d={line} stroke={colour} strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' style={{ strokeWidth: 'var(--nok-size-chart-line, 2px)' }} />
				<circle cx={last.x} cy={last.y} r={2} fill={colour} />
			</svg>
		);
	},
);

ChartSpark.displayName = 'ChartSpark';
