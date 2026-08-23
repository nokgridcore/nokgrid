'use client';

import { HTMLAttributes, forwardRef } from 'react';

type ProgressType = 'linear' | 'circular';
type ProgressState = 'determinate' | 'indeterminate';
type ProgressColor = 'primary' | 'success' | 'error' | 'info';
type ProgressSize = 'sm' | 'md';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
	type?: ProgressType;
	state?: ProgressState;
	color?: ProgressColor;
	size?: ProgressSize;
	showPercentage?: boolean;
	value?: number;
	showLabel?: boolean;
	label?: string;
	showMetadata?: boolean;
	metadata?: string;
}

const LINEAR_TRACK_WIDTH = 240;
const LINEAR_BAR_WIDTH = 84;

// No dedicated circular size tokens exist — hardcoded, confirmed with
// design. Stroke width mirrors the linear bar's own sm/md thickness (4/8px)
// for the same visual weight across both types — not explicitly given.
const circularSizePx: Record<ProgressSize, number> = {
	sm: 56,
	md: 72,
};

const circularStrokeWidth: Record<ProgressSize, number> = {
	sm: 4,
	md: 8,
};

const linearHeightClass: Record<ProgressSize, string> = {
	sm: 'h-1',
	md: 'h-2',
};

const colorBgClass: Record<ProgressColor, string> = {
	primary: 'bg-action-primary-default',
	success: 'bg-background-success-strong',
	error: 'bg-background-error-strong',
	info: 'bg-background-info-strong',
};

const colorStrokeVar: Record<ProgressColor, string> = {
	primary: 'var(--nok-color-action-primary-default)',
	success: 'var(--nok-color-background-success-strong)',
	error: 'var(--nok-color-background-error-strong)',
	info: 'var(--nok-color-background-info-strong)',
};

const linearValueStyle = {
	color: 'var(--nok-color-text-secondary)',
	fontSize: 'var(--nok-typography-font-size-12)',
};

const labelStyle = {
	color: 'var(--nok-color-text-primary)',
	fontWeight: 500,
	fontSize: 'var(--nok-typography-font-size-13)',
};

const circularValueFontSize: Record<ProgressSize, string> = {
	sm: 'var(--nok-typography-font-size-12)',
	md: 'var(--nok-typography-font-size-13)',
};

// Inlined rather than living in globals.css so the animation ships with the
// component itself, regardless of which stylesheet pipeline renders it.
const INDETERMINATE_KEYFRAMES = `
@keyframes nok-progress-linear-indeterminate {
	0% { transform: translateX(-${LINEAR_BAR_WIDTH}px); }
	100% { transform: translateX(${LINEAR_TRACK_WIDTH}px); }
}
@keyframes nok-progress-circular-spin {
	to { transform: rotate(360deg); }
}
`;

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
	(
		{
			type = 'linear',
			state = 'determinate',
			color = 'primary',
			size = 'sm',
			showPercentage = false,
			value = 0,
			showLabel = false,
			label,
			showMetadata = false,
			metadata,
			className,
			...props
		},
		ref,
	) => {
		const isDeterminate = state === 'determinate';
		const clampedValue = Math.min(100, Math.max(0, value));
		const showValueLabel = isDeterminate && showPercentage;

		if (type === 'circular') {
			const diameter = circularSizePx[size];
			const strokeWidth = circularStrokeWidth[size];
			const radius = (diameter - strokeWidth) / 2;
			const circumference = 2 * Math.PI * radius;
			const dashOffset = circumference * (1 - clampedValue / 100);

			return (
				<div
					ref={ref}
					className={['relative inline-flex items-center justify-center', className]
						.filter(Boolean)
						.join(' ')}
					style={{ width: diameter, height: diameter }}
					{...props}>
					<style>{INDETERMINATE_KEYFRAMES}</style>
					<svg
						width={diameter}
						height={diameter}
						viewBox={`0 0 ${diameter} ${diameter}`}
						style={
							isDeterminate
								? { transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }
								: {
										transformOrigin: '50% 50%',
										animation: 'nok-progress-circular-spin 1s linear infinite',
									}
						}>
						<circle
							cx={diameter / 2}
							cy={diameter / 2}
							r={radius}
							fill='none'
							strokeWidth={strokeWidth}
							strokeLinecap='round'
							style={{ stroke: colorStrokeVar[color] }}
							strokeDasharray={isDeterminate ? circumference : circumference * 0.75}
							strokeDashoffset={isDeterminate ? dashOffset : 0}
						/>
					</svg>
					{showValueLabel && (
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
				<style>{INDETERMINATE_KEYFRAMES}</style>
				{showLabel && label && <span style={labelStyle}>{label}</span>}
				<div
					className={`relative overflow-hidden rounded-full bg-background-overlay ${linearHeightClass[size]}`}
					style={{ width: LINEAR_TRACK_WIDTH }}>
					{isDeterminate ? (
						<div
							className={`h-full rounded-full ${colorBgClass[color]}`}
							style={{ width: `${clampedValue}%` }}
						/>
					) : (
						<div
							className={`absolute h-full rounded-full ${colorBgClass[color]}`}
							style={{
								width: LINEAR_BAR_WIDTH,
								animation: 'nok-progress-linear-indeterminate 1.2s linear infinite',
							}}
						/>
					)}
				</div>
				{(showValueLabel || (showMetadata && metadata)) && (
					<div
						className='flex items-center justify-between'
						style={{ width: LINEAR_TRACK_WIDTH, ...linearValueStyle }}>
						{showMetadata && metadata && <span>{metadata}</span>}
						{showValueLabel && <span>{clampedValue}%</span>}
					</div>
				)}
			</div>
		);
	},
);

Progress.displayName = 'Progress';
