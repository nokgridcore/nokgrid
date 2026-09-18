'use client';

import { Children, CSSProperties, HTMLAttributes, ReactElement, ReactNode, cloneElement, forwardRef, isValidElement } from 'react';
import { ChartBarSegmentProps } from './chart-bar-segment.js';

export type ChartBarStackOrientation = 'vertical' | 'horizontal';

export interface ChartBarStackProps extends HTMLAttributes<HTMLDivElement> {
	orientation?: ChartBarStackOrientation;
	label?: string;
	showLabel?: boolean;
	/** ChartBarSegment children, stacked flush against each other — set each
	 * segment's own `showLabel` to false and use this stack's label instead. */
	children?: ReactNode;
}

const GAP = 'var(--nok-spacing-component-sm, 8px)';

const labelStyle: CSSProperties = {
	color: 'var(--nok-color-text-secondary, #5C5C5C)',
	textAlign: 'center',
	fontFamily: 'var(--nok-typography-font-family-body, Roboto)',
	fontSize: 'var(--nok-typography-font-size-11, 11px)',
	fontStyle: 'normal',
	fontWeight: 400,
	lineHeight: 'var(--nok-typography-line-height-15-4, 15.4px)',
};

export const ChartBarStack = forwardRef<HTMLDivElement, ChartBarStackProps>(
	({ orientation = 'vertical', label, showLabel = true, children, className, style, ...props }, ref) => {
		const isVertical = orientation === 'vertical';
		const segmentCount = Children.count(children);

		// Only the segment furthest from the baseline (last in JSX order —
		// topmost when vertical, trailing/rightmost when horizontal) keeps its
		// rounded edge; every other segment goes square so the stack reads as
		// one continuous bar. Skipped when a child already sets its own.
		const roundedChildren = Children.map(children, (child, index) => {
			if (!isValidElement<ChartBarSegmentProps>(child)) return child;
			const typedChild = child as ReactElement<ChartBarSegmentProps>;
			return cloneElement(typedChild, {
				roundedEdge: typedChild.props.roundedEdge ?? index === segmentCount - 1,
			});
		});

		return (
			<div
				ref={ref}
				className={['flex', isVertical ? 'flex-col items-center' : 'flex-row items-center', className].filter(Boolean).join(' ')}
				style={{ flex: 1, gap: GAP, ...style }}
				{...props}>
				{/* Label trails the bar when vertical (below); leads it when
				    horizontal (to the left) — same rotation as the segments'
				    own rounded-edge placement. */}
				{!isVertical && showLabel && label && <span style={labelStyle}>{label}</span>}

				{/* Segments stack flush (no gap) — first child sits at the baseline:
				    bottom when vertical, left when horizontal. No `items-center` here —
				    each segment's own width/height is 'auto', so shrink-to-fit sizing
				    would size this by content while the segment's inner bar wants
				    100% of THAT — a circular reference that resolves to 0. Default
				    stretch instead gives each segment a real size to fill 100% of. */}
				<div
					className={['flex', isVertical ? 'flex-col-reverse' : 'flex-row'].join(' ')}
					// Fills the root's cross-axis size — no fixed thickness of its own.
					style={{ flex: 1, width: isVertical ? '100%' : undefined, height: isVertical ? undefined : '100%' }}>
					{roundedChildren}
				</div>

				{isVertical && showLabel && label && <span style={labelStyle}>{label}</span>}
			</div>
		);
	},
);

ChartBarStack.displayName = 'ChartBarStack';
