'use client';

import { CSSProperties, HTMLAttributes, forwardRef } from 'react';

export type ChartBarSegmentOrientation = 'vertical' | 'horizontal';
export type ChartBarSegmentState = 'default' | 'focused' | 'unfocused';
export type ChartBarSegmentColor = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface ChartBarSegmentProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
	orientation?: ChartBarSegmentOrientation;
	state?: ChartBarSegmentState;
	color?: ChartBarSegmentColor;
	label?: string;
	showLabel?: boolean;
}

const THICKNESS = '40px';
const GAP = 'var(--nok-spacing-component-sm, 8px)';

// Rounds the edge furthest from the baseline — top corners standing up,
// right corners lying down.
const radiusForOrientation: Record<ChartBarSegmentOrientation, string> = {
	vertical: 'var(--nok-spacing-radius-xs, 2px) var(--nok-spacing-radius-xs, 2px) 0 0',
	// TODO: only the vertical radius was given — mirrored 90° onto the
	// leading (right) edge for horizontal, unconfirmed.
	horizontal: '0 var(--nok-spacing-radius-xs, 2px) var(--nok-spacing-radius-xs, 2px) 0',
};

// TODO: only the base fill color was given — `focused` reuses the solid
// color (no distinct treatment specced yet); `unfocused` reuses the existing
// chart-fill-N (20%-alpha) token, matching its established de-emphasis
// purpose elsewhere in the chart token set. Both unconfirmed.
const backgroundForState = (color: ChartBarSegmentColor, state: ChartBarSegmentState) =>
	state === 'unfocused' ? `var(--nok-color-chart-fill-${color})` : `var(--nok-color-chart-${color})`;

const labelStyle: CSSProperties = {
	color: 'var(--nok-color-text-secondary, #5C5C5C)',
	textAlign: 'center',
	fontFamily: 'var(--nok-typography-font-family-body, Roboto)',
	fontSize: 'var(--nok-typography-font-size-11, 11px)',
	fontStyle: 'normal',
	fontWeight: 400,
	lineHeight: 'var(--nok-typography-line-height-15-4, 15.4px)',
};

export const ChartBarSegment = forwardRef<HTMLDivElement, ChartBarSegmentProps>(
	({ orientation = 'vertical', state = 'default', color = 1, label, showLabel = true, className, style, ...props }, ref) => {
		const isVertical = orientation === 'vertical';

		return (
			<div
				ref={ref}
				className={['flex', isVertical ? 'h-full flex-col items-center' : 'w-full flex-row items-center', className]
					.filter(Boolean)
					.join(' ')}
				style={{ gap: GAP, ...style }}
				{...props}>
				<div
					style={{
						flex: 1,
						width: isVertical ? THICKNESS : undefined,
						height: isVertical ? undefined : THICKNESS,
						borderRadius: radiusForOrientation[orientation],
						background: backgroundForState(color, state),
					}}
				/>
				{showLabel && label && <span style={labelStyle}>{label}</span>}
			</div>
		);
	},
);

ChartBarSegment.displayName = 'ChartBarSegment';
