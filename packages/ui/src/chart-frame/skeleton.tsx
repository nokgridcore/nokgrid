'use client';

import { HTMLAttributes, ReactElement, forwardRef, useId } from 'react';

export type SkeletonType = 'bars' | 'line' | 'pie';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
	type?: SkeletonType;
}

const TRACK = 'var(--nok-color-chart-track, #EDEDED)';
const AXIS = 'var(--nok-color-chart-axis, #BFBFBF)';
// TODO: exact line stroke width not given — using the chart geometry token.
const LINE_STROKE_WIDTH = 'var(--nok-size-chart-line, 2px)';

// Fills sweep left-to-right through a translated gradient band — no CSS
// keyframes needed (keeps it clear of the Tailwind/PostCSS class-drop bug),
// and objectBoundingBox normalizes the sweep per-shape regardless of size.
const ShimmerDefs = ({ id }: { id: string }) => (
	<defs>
		<linearGradient id={id} gradientUnits='objectBoundingBox' x1='-1' y1='0' x2='0' y2='0'>
			<stop offset='0%' stopColor={TRACK} />
			<stop offset='50%' stopColor='var(--nok-color-background-surface, #FFF)' stopOpacity={0.6} />
			<stop offset='100%' stopColor={TRACK} />
			{/* Holds at the start for a 1s pause, sweeps left-to-right over 1s, then
			    jumps back to the held start — never reverses direction. */}
			<animateTransform
				attributeName='gradientTransform'
				type='translate'
				values='-1 0; -1 0; 2 0'
				keyTimes='0; 0.5; 1'
				dur='2s'
				repeatCount='indefinite'
			/>
		</linearGradient>
	</defs>
);

const BarsSkeleton = ({ gradientId }: { gradientId: string }) => (
	<svg viewBox='0 0 512 211' fill='none' preserveAspectRatio='none' style={{ width: '100%', height: '100%', display: 'block' }}>
		<ShimmerDefs id={gradientId} />
		<path
			d='M0 99C0 96.7909 1.79086 95 4 95H71.3333C73.5425 95 75.3333 96.7909 75.3333 99V207C75.3333 209.209 73.5425 211 71.3333 211H4.00001C1.79087 211 0 209.209 0 207V99Z'
			fill={`url(#${gradientId})`}
		/>
		<path
			d='M87.3333 36C87.3333 33.7909 89.1242 32 91.3333 32H158.667C160.876 32 162.667 33.7909 162.667 36V207C162.667 209.209 160.876 211 158.667 211H91.3333C89.1242 211 87.3333 209.209 87.3333 207V36Z'
			fill={`url(#${gradientId})`}
		/>
		<path
			d='M174.667 131C174.667 128.791 176.457 127 178.667 127H246C248.209 127 250 128.791 250 131V207C250 209.209 248.209 211 246 211H178.667C176.457 211 174.667 209.209 174.667 207V131Z'
			fill={`url(#${gradientId})`}
		/>
		<path
			d='M262 67C262 64.7909 263.791 63 266 63H333.333C335.542 63 337.333 64.7909 337.333 67V207C337.333 209.209 335.542 211 333.333 211H266C263.791 211 262 209.209 262 207V67Z'
			fill={`url(#${gradientId})`}
		/>
		<path
			d='M349.333 109C349.333 106.791 351.124 105 353.333 105H420.667C422.876 105 424.667 106.791 424.667 109V207C424.667 209.209 422.876 211 420.667 211H353.333C351.124 211 349.333 209.209 349.333 207V109Z'
			fill={`url(#${gradientId})`}
		/>
		<path
			d='M436.667 50C436.667 47.7909 438.457 46 440.667 46H508C510.209 46 512 47.7909 512 50V207C512 209.209 510.209 211 508 211H440.667C438.457 211 436.667 209.209 436.667 207V50Z'
			fill={`url(#${gradientId})`}
		/>
	</svg>
);

const LineSkeleton = ({ gradientId }: { gradientId: string }) => (
	<svg viewBox='0 0 512 151' fill='none' preserveAspectRatio='none' style={{ width: '100%', height: '100%', maxHeight: '150px', display: 'block' }}>
		<ShimmerDefs id={gradientId} />
		<path d='M0 80L85 40L171 95L256 10L341 55L427 0L512 35V151H0V80Z' fill={`url(#${gradientId})`} />
		<polyline
			points='0,80 85,40 171,95 256,10 341,55 427,0 512,35'
			fill='none'
			stroke={AXIS}
			style={{ strokeWidth: LINE_STROKE_WIDTH }}
			vectorEffect='non-scaling-stroke'
		/>
	</svg>
);

const PieSkeleton = ({ gradientId }: { gradientId: string }) => (
	<svg viewBox='0 0 512 211' fill='none' preserveAspectRatio='xMidYMid meet' style={{ width: '100%', height: '100%', display: 'block' }}>
		<ShimmerDefs id={gradientId} />
		<path
			d='M257.687 30.519C269.235 30.7789 280.567 33.7024 290.799 39.0618C301.031 44.4211 309.887 52.0714 316.676 61.4161C323.466 70.7608 328.005 81.5474 329.94 92.9348C331.875 104.322 331.154 116.003 327.833 127.066L256 105.5L257.687 30.519Z'
			fill={`url(#${gradientId})`}
		/>
		<path
			d='M326.79 130.275C323.499 139.678 318.368 148.33 311.697 155.728C305.025 163.126 296.947 169.121 287.933 173.362C278.92 177.604 269.152 180.007 259.199 180.432C249.246 180.857 239.309 179.295 229.967 175.837L256 105.5L326.79 130.275Z'
			fill={`url(#${gradientId})`}
		/>
		<path
			d='M226.829 174.594C209.791 167.401 196.012 154.167 188.138 137.433C180.264 120.7 178.85 101.647 184.167 83.9344L256 105.5L226.829 174.594Z'
			fill={`url(#${gradientId})`}
		/>
		<path
			d='M185.21 80.7248C190.252 66.3193 199.569 53.7947 211.916 44.8237C224.264 35.8527 239.054 30.8624 254.313 30.519L256 105.5L185.21 80.7248Z'
			fill={`url(#${gradientId})`}
		/>
	</svg>
);

const skeletonForType: Record<SkeletonType, (props: { gradientId: string }) => ReactElement> = {
	bars: BarsSkeleton,
	line: LineSkeleton,
	pie: PieSkeleton,
};

// bars/line sit against the bottom of the plot area (like a real chart's
// baseline); pie stays centered, floating in the middle of the frame.
const alignClassForType: Record<SkeletonType, string> = {
	bars: 'items-end',
	line: 'items-end',
	pie: 'items-center',
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(({ type = 'bars', className, style, ...props }, ref) => {
	const gradientId = `nok-skeleton-shimmer-${useId()}`;
	const SkeletonGraphic = skeletonForType[type];

	return (
		<div
			ref={ref}
			className={['flex w-full justify-center', alignClassForType[type], className].filter(Boolean).join(' ')}
			style={{ height: '100%', ...style }}
			{...props}>
			<SkeletonGraphic gradientId={gradientId} />
		</div>
	);
});

Skeleton.displayName = 'Skeleton';
