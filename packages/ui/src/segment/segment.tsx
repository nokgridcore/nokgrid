'use client';

import { HTMLAttributes, forwardRef } from 'react';

export type SegmentShape = 'linear' | 'circular';
export type SegmentState = 'upcoming' | 'active' | 'completed';
export type SegmentColor = 'primary' | 'success' | 'error' | 'info';
export type SegmentSize = 'sm' | 'md';

export interface SegmentProps extends HTMLAttributes<HTMLDivElement> {
	shape?: SegmentShape;
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

const colorStrokeVar: Record<SegmentColor, string> = {
	primary: 'var(--nok-color-action-primary-default)',
	success: 'var(--nok-color-background-success-strong)',
	error: 'var(--nok-color-background-error-strong)',
	info: 'var(--nok-color-background-info-strong)',
};

// No dedicated circular-segment size tokens exist — matches Progress's own
// circular sizing exactly (56/72px, 4/8px stroke).
const circularDiameterPx: Record<SegmentSize, number> = {
	sm: 56,
	md: 72,
};

const circularStrokeWidth: Record<SegmentSize, number> = {
	sm: 4,
	md: 8,
};

// "active" = in progress — half the segment fills with color, the other
// half stays the upcoming gray. No exact split was given, 50% is inferred.
const ACTIVE_FILL_RATIO = 0.5;

// The circular ring is only a 1/5 arc, not a full closed circle.
const ARC_FRACTION = 1 / 5;

export const Segment = forwardRef<HTMLDivElement, SegmentProps>(
	(
		{
			shape = 'linear',
			state = 'upcoming',
			color = 'primary',
			size = 'sm',
			className,
			style,
			...props
		},
		ref,
	) => {
		if (shape === 'circular') {
			const diameter = circularDiameterPx[size];
			const strokeWidth = circularStrokeWidth[size];
			const radius = (diameter - strokeWidth) / 2;
			const circumference = 2 * Math.PI * radius;
			const arcLength = circumference * ARC_FRACTION;
			const activeLength = arcLength * ACTIVE_FILL_RATIO;

			return (
				<div
					ref={ref}
					className={className}
					style={{ width: diameter, height: diameter, flexShrink: 0, ...style }}
					{...props}>
					<svg
						width={diameter}
						height={diameter}
						viewBox={`0 0 ${diameter} ${diameter}`}
						style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}>
						<circle
							cx={diameter / 2}
							cy={diameter / 2}
							r={radius}
							fill='none'
							strokeWidth={strokeWidth}
							strokeLinecap='round'
							style={{ stroke: 'var(--nok-color-background-overlay)' }}
							strokeDasharray={`${arcLength} ${circumference - arcLength}`}
						/>
						{state !== 'upcoming' && (
							<circle
								cx={diameter / 2}
								cy={diameter / 2}
								r={radius}
								fill='none'
								strokeWidth={strokeWidth}
								strokeLinecap='round'
								style={{ stroke: colorStrokeVar[color] }}
								strokeDasharray={
									state === 'completed'
										? `${arcLength} ${circumference - arcLength}`
										: `${activeLength} ${circumference - activeLength}`
								}
							/>
						)}
					</svg>
				</div>
			);
		}

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
