'use client';

import { SVGAttributes, forwardRef } from 'react';

export type ChartDonutSegmentState = 'default' | 'focused' | 'unfocused';
export type ChartDonutSegmentColor = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface ChartDonutSegmentProps extends Omit<SVGAttributes<SVGSVGElement>, 'color'> {
	color?: ChartDonutSegmentColor;
	state?: ChartDonutSegmentState;
	/** Arc start, in degrees clockwise from 12 o'clock. */
	startAngle?: number;
	/** Arc end, in degrees clockwise from 12 o'clock. */
	endAngle?: number;
	/** Hole radius in a 100-unit radius — 60 is the design's donut, 0 closes it into a pie. */
	innerRadius?: number;
}

const CENTER = 100;
const OUTER_RADIUS = 100;

const opacityForState = { default: 1, focused: 1, unfocused: 0.3 };

const point = (angleDeg: number, radius: number) => {
	const rad = (angleDeg * Math.PI) / 180;
	return `${CENTER + radius * Math.sin(rad)} ${CENTER - radius * Math.cos(rad)}`;
};

export function arcPath(startAngle: number, endAngle: number, innerRadius: number): string {
	// A full 360° arc has coincident start/end points, which SVG arcs can't draw.
	const end = Math.min(endAngle, startAngle + 359.999);
	const largeArc = end - startAngle > 180 ? 1 : 0;
	const outer = `M${point(startAngle, OUTER_RADIUS)} A${OUTER_RADIUS} ${OUTER_RADIUS} 0 ${largeArc} 1 ${point(end, OUTER_RADIUS)}`;
	if (innerRadius <= 0) return `${outer} L${CENTER} ${CENTER} Z`;
	return `${outer} L${point(end, innerRadius)} A${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${point(startAngle, innerRadius)} Z`;
}

export const ChartDonutSegment = forwardRef<SVGSVGElement, ChartDonutSegmentProps>(
	({ color = 1, state = 'default', startAngle = 0, endAngle = 90, innerRadius = 60, style, ...props }, ref) => (
		<svg
			ref={ref}
			viewBox='0 0 200 200'
			fill='none'
			style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none', ...style }}
			{...props}>
			<path
				d={arcPath(startAngle, endAngle, innerRadius)}
				fill={`var(--nok-color-chart-${color})`}
				stroke='var(--nok-color-background-surface, #FFF)'
				strokeWidth={2}
				strokeLinejoin='round'
				style={{ opacity: opacityForState[state], transition: 'opacity 150ms ease', pointerEvents: 'auto' }}
			/>
		</svg>
	),
);

ChartDonutSegment.displayName = 'ChartDonutSegment';
