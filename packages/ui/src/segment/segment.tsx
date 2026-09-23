'use client';

import { HTMLAttributes, forwardRef } from 'react';

export type SegmentState = 'upcoming' | 'active' | 'completed';
export type SegmentColor = 'primary' | 'success' | 'error' | 'info';
export type SegmentSize = 'sm' | 'md';

export interface SegmentProps extends HTMLAttributes<HTMLDivElement> {
	state?: SegmentState;
	color?: SegmentColor;
	size?: SegmentSize;
}

// A lone Segment is always a linear pill — "not used on its own" per Figma's
// own note. Circular stepped progress is one shared ring divided into arcs
// (ProgressStepped's own job), not N separate per-step circles.
const heightClass: Record<SegmentSize, string> = {
	sm: 'h-1',
	md: 'h-2',
};

const colorBgClass: Record<SegmentColor, string> = {
	primary: 'bg-action-primary-default',
	success: 'bg-background-success-strong',
	error: 'bg-background-error-strong',
	info: 'bg-background-info-strong',
};

export const colorStrokeVar: Record<SegmentColor, string> = {
	primary: 'var(--nok-color-action-primary-default)',
	success: 'var(--nok-color-background-success-strong)',
	error: 'var(--nok-color-background-error-strong)',
	info: 'var(--nok-color-background-info-strong)',
};

// "active" = in progress — half the segment fills with color, the other
// half stays the upcoming gray. No exact split was given, 50% is inferred.
export const ACTIVE_FILL_RATIO = 0.5;

export const Segment = forwardRef<HTMLDivElement, SegmentProps>(
	({ state = 'upcoming', color = 'primary', size = 'sm', className, style, ...props }, ref) => {
		const isCompleted = state === 'completed';
		const isActive = state === 'active';

		const classes = ['rounded-full', heightClass[size], isCompleted ? colorBgClass[color] : '', className]
			.filter(Boolean)
			.join(' ');

		return (
			<div
				ref={ref}
				className={classes}
				style={{
					width: '44px',
					flexShrink: 0,
					...(isCompleted
						? undefined
						: isActive
							? {
									background: `linear-gradient(to right, ${colorStrokeVar[color]} ${ACTIVE_FILL_RATIO * 100}%, var(--nok-color-background-overlay) ${ACTIVE_FILL_RATIO * 100}%)`,
								}
							: { background: 'var(--nok-color-background-overlay)' }),
					...style,
				}}
				{...props}
			/>
		);
	},
);

Segment.displayName = 'Segment';
