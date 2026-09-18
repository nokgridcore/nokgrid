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
	/** Rounds the edge furthest from the baseline — on by default for a
	 * standalone segment. ChartBarStack turns this off on every segment
	 * except the one furthest from the baseline. */
	roundedEdge?: boolean;
}

const GAP = 'var(--nok-spacing-component-sm, 8px)';

// Rounds the edge furthest from the baseline — top corners standing up,
// right corners lying down.
const radiusForOrientation: Record<ChartBarSegmentOrientation, string> = {
	vertical: 'var(--nok-spacing-radius-xs, 2px) var(--nok-spacing-radius-xs, 2px) 0 0',
	// TODO: only the vertical radius was given — mirrored 90° onto the
	// leading (right) edge for horizontal, unconfirmed.
	horizontal: '0 var(--nok-spacing-radius-xs, 2px) var(--nok-spacing-radius-xs, 2px) 0',
};

// TODO: `focused` reuses the solid color (no distinct treatment specced yet
// beyond staying at full opacity while siblings dim).
const opacityForState: Record<ChartBarSegmentState, number> = {
	default: 1,
	focused: 1,
	unfocused: 0.3,
};

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
	({ orientation = 'vertical', state = 'default', color = 1, label, showLabel = true, roundedEdge = true, className, style, ...props }, ref) => {
		const isVertical = orientation === 'vertical';

		return (
			<div
				ref={ref}
				className={['flex', isVertical ? 'flex-col items-center' : 'flex-row items-center', className].filter(Boolean).join(' ')}
				// `flex: 1` (not h-full/w-full) so multiple segments split their
				// shared parent's space when stacked — a single standalone segment
				// still fills its container the same way it did before.
				style={{ flex: 1, gap: GAP, ...style }}
				{...props}>
				<div
					style={{
						flex: 1,
						// Fills whatever cross-axis size the root ends up with — no
						// fixed thickness of its own, so it grows/shrinks with
						// whatever container it's placed in.
						width: isVertical ? '100%' : undefined,
						height: isVertical ? undefined : '100%',
						borderRadius: roundedEdge ? radiusForOrientation[orientation] : 0,
						background: `var(--nok-color-chart-${color})`,
						opacity: opacityForState[state],
						transition: 'opacity 150ms ease',
					}}
				/>
				{showLabel && label && <span style={labelStyle}>{label}</span>}
			</div>
		);
	},
);

ChartBarSegment.displayName = 'ChartBarSegment';
