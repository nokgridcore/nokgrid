'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { ACTIVE_FILL_RATIO, Segment, SegmentColor, SegmentSize, colorStrokeVar } from '../segment/segment.js';

type ProgressSteppedShape = 'linear' | 'circular';

export interface ProgressSteppedProps extends HTMLAttributes<HTMLDivElement> {
	shape?: ProgressSteppedShape;
	size?: SegmentSize;
	color?: SegmentColor;
	totalSteps?: number;
	/** 1-indexed — steps before this are completed, this one is active (partially filled), the rest are upcoming. */
	currentStep?: number;
	showLabel?: boolean;
	label?: string;
	showPercentage?: boolean;
	value?: number;
	showMetadata?: boolean;
	metadata?: string;
}

const labelStyle = {
	color: 'var(--nok-color-text-primary)',
	fontWeight: 500,
	fontSize: 'var(--nok-typography-font-size-13)',
};

const valueRowStyle = {
	color: 'var(--nok-color-text-secondary)',
	fontSize: 'var(--nok-typography-font-size-12)',
};

// Matches Progress's own circular sizing exactly — no dedicated stepped-ring
// tokens exist.
const circularDiameterPx: Record<SegmentSize, number> = { sm: 56, md: 72 };
const circularStrokeWidth: Record<SegmentSize, number> = { sm: 4, md: 8 };

const point = (cx: number, cy: number, r: number, angleDeg: number) => {
	const rad = (angleDeg * Math.PI) / 180;
	return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
};

// A single stroke arc (0deg = 12 o'clock, clockwise) — not closed to center,
// unlike a pie-chart wedge, since this draws a ring segment.
function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
	const largeArc = endDeg - startDeg > 180 ? 1 : 0;
	const p1 = point(cx, cy, r, startDeg);
	const p2 = point(cx, cy, r, endDeg);
	return `M${p1.x} ${p1.y} A${r} ${r} 0 ${largeArc} 1 ${p2.x} ${p2.y}`;
}

export const ProgressStepped = forwardRef<HTMLDivElement, ProgressSteppedProps>(
	(
		{
			shape = 'linear',
			size = 'sm',
			color = 'primary',
			totalSteps = 5,
			currentStep = 1,
			showLabel = false,
			label,
			showPercentage = false,
			value = 0,
			showMetadata = false,
			metadata,
			className,
			...props
		},
		ref,
	) => {
		const clampedCurrentStep = Math.min(totalSteps, Math.max(1, currentStep));
		const clampedValue = Math.min(100, Math.max(0, value));
		const isCircular = shape === 'circular';

		const circularSteps = isCircular && (() => {
			const diameter = circularDiameterPx[size];
			const strokeWidth = circularStrokeWidth[size];
			const radius = (diameter - strokeWidth) / 2;
			const cx = diameter / 2;
			const cy = diameter / 2;
			const circumference = 2 * Math.PI * radius;

			// A round-capped stroke paints strokeWidth/2 past each arc endpoint, so
			// two same-colored neighboring slices (e.g. two "upcoming" ones) need a
			// gap wider than one strokeWidth or their caps visually touch and the
			// whole ring reads as one continuous arc instead of totalSteps distinct
			// ones — sized in px off the stroke, then converted to degrees for this
			// specific radius, so it stays a real gap at every size/totalSteps.
			const gapDeg = totalSteps > 1 ? ((strokeWidth * 2) / circumference) * 360 : 0;
			const sliceSpan = Math.max(0, (360 - totalSteps * gapDeg) / totalSteps);

			return (
				<svg width={diameter} height={diameter} viewBox={`0 0 ${diameter} ${diameter}`} fill='none' style={{ flexShrink: 0 }}>
					{Array.from({ length: totalSteps }, (_, index) => {
						const stepNumber = index + 1;
						const state = stepNumber < clampedCurrentStep ? 'completed' : stepNumber === clampedCurrentStep ? 'active' : 'upcoming';
						const start = index * (sliceSpan + gapDeg);
						const end = start + sliceSpan;
						const filledEnd = state === 'active' ? start + sliceSpan * ACTIVE_FILL_RATIO : end;

						return (
							<g key={index}>
								<path
									d={arcPath(cx, cy, radius, start, end)}
									stroke='var(--nok-color-background-overlay)'
									strokeWidth={strokeWidth}
									strokeLinecap='round'
								/>
								{state !== 'upcoming' && (
									<path d={arcPath(cx, cy, radius, start, filledEnd)} stroke={colorStrokeVar[color]} strokeWidth={strokeWidth} strokeLinecap='round' />
								)}
							</g>
						);
					})}
				</svg>
			);
		})();

		return (
			<div
				ref={ref}
				className={['inline-flex flex-col items-start gap-1', className].filter(Boolean).join(' ')}
				{...props}>
				{!isCircular && showLabel && label && <span style={labelStyle}>{label}</span>}

				{isCircular ?
					circularSteps
				:	<div className='flex items-center gap-component-sm'>
						{Array.from({ length: totalSteps }, (_, index) => {
							const stepNumber = index + 1;
							const state =
								stepNumber < clampedCurrentStep ? 'completed'
								: stepNumber === clampedCurrentStep ? 'active'
								: 'upcoming';

							return <Segment key={index} size={size} color={color} state={state} />;
						})}
					</div>
				}

				{(showPercentage || (showMetadata && metadata)) && (
					<div className='flex w-full items-center justify-between' style={valueRowStyle}>
						{showMetadata && metadata && <span>{metadata}</span>}
						{showPercentage && <span>{clampedValue}%</span>}
					</div>
				)}
			</div>
		);
	},
);

ProgressStepped.displayName = 'ProgressStepped';
