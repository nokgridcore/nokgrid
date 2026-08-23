'use client';

import { HTMLAttributes, forwardRef } from 'react';

export type SegmentState = 'default' | 'filled';
export type SegmentColor = 'primary' | 'success' | 'error' | 'info';
export type SegmentSize = 'sm' | 'md';

export interface SegmentProps extends HTMLAttributes<HTMLDivElement> {
	state?: SegmentState;
	color?: SegmentColor;
	size?: SegmentSize;
}

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

export const Segment = forwardRef<HTMLDivElement, SegmentProps>(
	({ state = 'default', color = 'primary', size = 'sm', className, style, ...props }, ref) => {
		const isFilled = state === 'filled';

		const classes = [
			'flex-1 rounded-full',
			heightClass[size],
			isFilled ? colorBgClass[color] : '',
			className,
		]
			.filter(Boolean)
			.join(' ');

		return (
			<div
				ref={ref}
				className={classes}
				style={{
					...(isFilled ? undefined : { background: 'var(--nok-color-background-overlay)' }),
					...style,
				}}
				{...props}
			/>
		);
	},
);

Segment.displayName = 'Segment';
