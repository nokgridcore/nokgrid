'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { Segment, SegmentColor, SegmentSize } from '../segment/segment.js';

type ProgressSteppedShape = 'linear' | 'circular';

export interface ProgressSteppedProps extends HTMLAttributes<HTMLDivElement> {
	shape?: ProgressSteppedShape;
	size?: SegmentSize;
	color?: SegmentColor;
	totalSteps?: number;
	currentStep?: number;
	showLabel?: boolean;
	label?: string;
	showPercentage?: boolean;
	value?: number;
	showMetadata?: boolean;
	metadata?: string;
}

const TRACK_WIDTH = 240;
const CIRCULAR_GAP_PX = 10;

// Mirrors Progress's own circular sizing (no dedicated size tokens exist).
const circularDiameterPx: Record<SegmentSize, number> = {
	sm: 56,
	md: 72,
};

const circularStrokeWidth: Record<SegmentSize, number> = {
	sm: 4,
	md: 8,
};

const colorStrokeVar: Record<SegmentColor, string> = {
	primary: 'var(--nok-color-action-primary-default)',
	success: 'var(--nok-color-background-success-strong)',
	error: 'var(--nok-color-background-error-strong)',
	info: 'var(--nok-color-background-info-strong)',
};

const labelStyle = {
	color: 'var(--nok-color-text-primary)',
	fontWeight: 500,
	fontSize: 'var(--nok-typography-font-size-13)',
};

const linearValueStyle = {
	color: 'var(--nok-color-text-secondary)',
	fontSize: 'var(--nok-typography-font-size-12)',
};

const circularValueFontSize: Record<SegmentSize, string> = {
	sm: 'var(--nok-typography-font-size-12)',
	md: 'var(--nok-typography-font-size-13)',
};

export const ProgressStepped = forwardRef<HTMLDivElement, ProgressSteppedProps>(
	(
		{
			shape = 'linear',
			size = 'sm',
			color = 'primary',
			totalSteps = 5,
			currentStep = 0,
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
		const clampedCurrentStep = Math.min(totalSteps, Math.max(0, currentStep));
		const clampedValue = Math.min(100, Math.max(0, value));

		if (shape === 'circular') {
			const diameter = circularDiameterPx[size];
			const strokeWidth = circularStrokeWidth[size];
			const radius = (diameter - strokeWidth) / 2;
			const circumference = 2 * Math.PI * radius;
			const stepLength = circumference / totalSteps;
			const segmentLength = Math.max(stepLength - CIRCULAR_GAP_PX, 0);

			return (
				<div
					ref={ref}
					className={['relative inline-flex items-center justify-center', className]
						.filter(Boolean)
						.join(' ')}
					style={{ width: diameter, height: diameter }}
					{...props}>
					<svg
						width={diameter}
						height={diameter}
						viewBox={`0 0 ${diameter} ${diameter}`}
						style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}>
						{Array.from({ length: totalSteps }, (_, index) => (
							<circle
								key={index}
								cx={diameter / 2}
								cy={diameter / 2}
								r={radius}
								fill='none'
								strokeWidth={strokeWidth}
								strokeLinecap='round'
								style={{
									stroke:
										index < clampedCurrentStep
											? colorStrokeVar[color]
											: 'var(--nok-color-background-overlay)',
								}}
								strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
								strokeDashoffset={-index * stepLength}
							/>
						))}
					</svg>
					{showPercentage && (
						<span
							className='absolute inset-0 flex items-center justify-center'
							style={{
								color: 'var(--nok-color-text-primary)',
								fontWeight: 500,
								fontSize: circularValueFontSize[size],
							}}>
							{clampedValue}%
						</span>
					)}
				</div>
			);
		}

		return (
			<div
				ref={ref}
				className={['inline-flex flex-col items-start gap-1', className].filter(Boolean).join(' ')}
				{...props}>
				{showLabel && label && <span style={labelStyle}>{label}</span>}
				<div className='flex items-center gap-component-sm' style={{ width: TRACK_WIDTH }}>
					{Array.from({ length: totalSteps }, (_, index) => (
						<Segment
							key={index}
							size={size}
							color={color}
							state={index < clampedCurrentStep ? 'filled' : 'default'}
						/>
					))}
				</div>
				{(showPercentage || (showMetadata && metadata)) && (
					<div
						className='flex items-center justify-between'
						style={{ width: TRACK_WIDTH, ...linearValueStyle }}>
						{showMetadata && metadata && <span>{metadata}</span>}
						{showPercentage && <span>{clampedValue}%</span>}
					</div>
				)}
			</div>
		);
	},
);

ProgressStepped.displayName = 'ProgressStepped';
