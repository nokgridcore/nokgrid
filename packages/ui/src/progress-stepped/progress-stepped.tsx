'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { Segment, SegmentColor, SegmentSize } from '../segment/segment.js';

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

		return (
			<div
				ref={ref}
				className={['inline-flex flex-col items-start gap-1', className].filter(Boolean).join(' ')}
				{...props}>
				{showLabel && label && <span style={labelStyle}>{label}</span>}

				<div className='flex items-center gap-component-sm'>
					{Array.from({ length: totalSteps }, (_, index) => {
						const stepNumber = index + 1;
						const state =
							stepNumber < clampedCurrentStep
								? 'completed'
								: stepNumber === clampedCurrentStep
									? 'active'
									: 'upcoming';

						return <Segment key={index} shape={shape} size={size} color={color} state={state} />;
					})}
				</div>

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
