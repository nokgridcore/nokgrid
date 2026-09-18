'use client';

import { CSSProperties, HTMLAttributes, ReactNode, forwardRef } from 'react';
import { Icon } from '../icons/Icon.js';
import { Skeleton, SkeletonType } from './skeleton.js';

export type ChartFrameState = 'default' | 'loading' | 'empty' | 'error';
export type ChartFrameDensity = 'comfortable' | 'compact';

export interface ChartFrameProps extends HTMLAttributes<HTMLDivElement> {
	state?: ChartFrameState;
	density?: ChartFrameDensity;
	/** Which Skeleton shape to show while `state` is `loading`. */
	skeletonType?: SkeletonType;
	title?: string;
	subtitle?: string;
	footnote?: string;
	showSubtitle?: boolean;
	showActions?: boolean;
	actions?: ReactNode;
	showFootnote?: boolean;
	/** Message shown under the icon when `state` is `empty`. */
	emptyText?: string;
	/** Message shown under the icon when `state` is `error`. */
	errorText?: string;
	/** Label for the retry action when `state` is `error`. */
	retryText?: string;
	onRetry?: () => void;
	/** The chart itself — shown when `state` is `default` (other states render their own visual). */
	children?: ReactNode;
}

const ErrorIcon = () => (
	<svg width='19' height='18' viewBox='0 0 19 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
		<path
			d='M17.4567 13.5116L10.79 1.84491C10.6446 1.58842 10.4338 1.37507 10.1791 1.22664C9.92437 1.07821 9.63482 1 9.34 1C9.04517 1 8.75563 1.07821 8.50089 1.22664C8.24616 1.37507 8.03536 1.58842 7.89 1.84491L1.22333 13.5116C1.0764 13.766 0.999353 14.0548 1 14.3487C1.00065 14.6425 1.07898 14.931 1.22704 15.1848C1.37509 15.4386 1.58762 15.6487 1.84308 15.7939C2.09853 15.9391 2.38784 16.0142 2.68166 16.0116H16.015C16.3074 16.0113 16.5946 15.9341 16.8477 15.7876C17.1009 15.6412 17.311 15.4308 17.4571 15.1775C17.6032 14.9242 17.68 14.6369 17.68 14.3445C17.6799 14.0521 17.6029 13.7648 17.4567 13.5116Z'
			stroke='var(--nok-color-icon-error, #DC2626)'
			strokeWidth={2}
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
		{/* Exclamation mark wasn't in the given path — proportioned to match
		    AlertTriangle's own stem/dot placement (same stroke style) inside
		    this triangle's bounding box (apex y=1, base y≈16). */}
		<path d='M9.34 6V9.34' stroke='var(--nok-color-icon-error, #DC2626)' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' />
		<path d='M9.34 12.68H9.35' stroke='var(--nok-color-icon-error, #DC2626)' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' />
	</svg>
);

const paddingForDensity: Record<ChartFrameDensity, string> = {
	comfortable: 'var(--nok-spacing-component-xl, 24px)',
	compact: 'var(--nok-spacing-component-lg, 16px)',
};

const gapForDensity: Record<ChartFrameDensity, string> = {
	comfortable: 'var(--nok-spacing-component-md, 12px)',
	compact: 'var(--nok-spacing-component-md, 12px)',
};

const titleStyle: CSSProperties = {
	color: 'var(--nok-color-text-primary, #141414)',
	fontFamily: 'var(--nok-typography-font-family-brand, "Plus Jakarta Sans")',
	fontSize: 'var(--nok-typography-font-size-14, 14px)',
	fontStyle: 'normal',
	fontWeight: 600,
	lineHeight: 'var(--nok-typography-line-height-19-6, 19.6px)',
};

const subtitleStyle: CSSProperties = {
	color: 'var(--nok-color-text-secondary, #5C5C5C)',
	fontFamily: 'var(--nok-typography-font-family-body, Roboto)',
	fontSize: 'var(--nok-typography-font-size-12, 12px)',
	fontStyle: 'normal',
	fontWeight: 400,
	lineHeight: 'var(--nok-typography-line-height-16-8, 16.8px)',
};

const emptyTextStyle: CSSProperties = {
	color: 'var(--nok-color-text-secondary, #5C5C5C)',
	textAlign: 'center',
	fontFamily: 'var(--nok-typography-font-family-body, Roboto)',
	fontSize: 'var(--nok-typography-font-size-12, 12px)',
	fontStyle: 'normal',
	fontWeight: 400,
	lineHeight: 'var(--nok-typography-line-height-16-8, 16.8px)',
};

// Shared by both error-state lines — identical spec for the message and the
// retry label.
const errorTextStyle: CSSProperties = {
	color: 'var(--nok-color-text-primary, #141414)',
	textAlign: 'center',
	fontFamily: 'var(--nok-typography-font-family-body, Roboto)',
	fontSize: 'var(--nok-typography-font-size-12, 12px)',
	fontStyle: 'normal',
	fontWeight: 400,
	lineHeight: 'var(--nok-typography-line-height-16-8, 16.8px)',
};

const footnoteStyle: CSSProperties = {
	color: 'var(--nok-color-text-secondary, #5C5C5C)',
	fontFamily: 'var(--nok-typography-font-family-body, Roboto)',
	fontSize: 'var(--nok-typography-font-size-11, 11px)',
	fontStyle: 'normal',
	fontWeight: 400,
	lineHeight: 'var(--nok-typography-line-height-15-4, 15.4px)',
};

export const ChartFrame = forwardRef<HTMLDivElement, ChartFrameProps>(
	(
		{
			state = 'default',
			density = 'comfortable',
			skeletonType = 'bars',
			title,
			subtitle,
			footnote,
			showSubtitle = true,
			showActions = false,
			actions,
			showFootnote = false,
			emptyText = 'No data for this range',
			errorText = "Couldn't load this chart",
			retryText = 'Try again',
			onRetry,
			children,
			className,
			style,
			...props
		},
		ref,
	) => {
		const body =
			state === 'loading' ? (
				<Skeleton type={skeletonType} />
			) : state === 'empty' ? (
				<div className='flex h-full w-full flex-col items-center justify-center' style={{ gap: 'var(--nok-spacing-component-sm, 8px)' }}>
					<Icon name='BarChart2' color='secondary' />
					<span style={emptyTextStyle}>{emptyText}</span>
				</div>
			) : state === 'error' ? (
				<div className='flex h-full w-full flex-col items-center justify-center' style={{ gap: 'var(--nok-spacing-component-sm, 8px)' }}>
					<ErrorIcon />
					<span style={errorTextStyle}>{errorText}</span>
					<button
						type='button'
						onClick={onRetry}
						className='inline-flex items-center'
						style={{
							gap: 'var(--nok-spacing-component-xs, 4px)',
							background: 'none',
							border: 'none',
							padding: 0,
							cursor: 'pointer',
							// RotateCcw's stroke is currentColor — without this the icon
							// falls back to the browser default (black) instead of
							// following the theme, unlike the text-primary span below it.
							color: 'var(--nok-color-text-primary, #141414)',
						}}>
						<Icon name='RotateCcw' size='sm' />
						<span style={errorTextStyle}>{retryText}</span>
					</button>
				</div>
			) : (
				children
			);

		const titleEl = title && <span style={titleStyle}>{title}</span>;
		const subtitleEl = showSubtitle && subtitle && <span style={subtitleStyle}>{subtitle}</span>;
		const hasHeaderText = Boolean(titleEl || subtitleEl);

		const header = (hasHeaderText || showActions) && (
			<div className='flex w-full items-start justify-between'>
				{hasHeaderText && (
					<div className='flex flex-col' style={{ gap: 'var(--nok-spacing-component-xs, 4px)' }}>
						{titleEl}
						{subtitleEl}
					</div>
				)}
				{showActions && actions}
			</div>
		);

		return (
			<div
				ref={ref}
				className={['flex flex-col items-start', className].filter(Boolean).join(' ')}
				style={{
					width: '400px',
					height: '328px',
					padding: paddingForDensity[density],
					gap: gapForDensity[density],
					borderRadius: 'var(--nok-spacing-radius-lg, 8px)',
					border: '1px solid var(--nok-color-border-default, #D9D9D9)',
					background: 'var(--nok-color-background-surface, #FFF)',
					...style,
				}}
				{...props}>
				{header}

				<div className='w-full flex-1'>{body}</div>

				{showFootnote && footnote && <span style={footnoteStyle}>{footnote}</span>}
			</div>
		);
	},
);

ChartFrame.displayName = 'ChartFrame';
