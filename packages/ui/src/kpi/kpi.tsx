'use client';

import { HTMLAttributes, ReactNode, forwardRef } from 'react';
import { Icon, IconName, IconSize } from '../icons/Icon.js';

type KpiSize = 'sm' | 'md' | 'lg';
type KpiDeltaDirection = 'positive' | 'negative' | 'neutral';
type KpiIconPosition = 'leading' | 'corner' | 'top';
type KpiSubtitlePosition = 'below' | 'inline';

export interface KpiProps extends HTMLAttributes<HTMLDivElement> {
	size?: KpiSize;
	deltaDirection?: KpiDeltaDirection;
	label: string;
	value: number;
	showIcon?: boolean;
	/**
	 * A slot, not an icon swap — matches the design system's own fix (icon
	 * swaps get locked to the host's icon box, squashing anything larger like
	 * an icon tile or avatar). Pass a bare `<Icon/>` or any other layer.
	 */
	icon?: ReactNode;
	iconPosition?: KpiIconPosition;
	showDelta?: boolean;
	deltaValue?: string;
	showSubtitle?: boolean;
	subtitle?: string;
	subtitlePosition?: KpiSubtitlePosition;
}

// No dedicated KPI height token exists — hardcoded per size, confirmed with
// design. Width is fixed at 260px across every size.
const heightForSize: Record<KpiSize, string> = {
	sm: '95px',
	md: '138px',
	lg: '165px',
};

const iconSizeForKpiSize: Record<KpiSize, IconSize> = {
	sm: 'sm',
	md: 'md',
	lg: 'lg',
};

const paddingClassForSize: Record<KpiSize, string> = {
	sm: 'p-component-md',
	md: 'p-component-lg',
	lg: 'p-component-xl',
};

const labelFontSizeVar: Record<KpiSize, string> = {
	sm: 'var(--nok-typography-font-size-12)',
	md: 'var(--nok-typography-font-size-13)',
	lg: 'var(--nok-typography-font-size-14)',
};

const valueFontSizeVar: Record<KpiSize, string> = {
	sm: 'var(--nok-typography-font-size-24)',
	md: 'var(--nok-typography-font-size-32)',
	lg: 'var(--nok-typography-font-size-40)',
};

// Only the sm starting point (11px) was given ("grows from 11px") — stepping
// +1px per size to match the label's own 12/13/14 progression.
const subtitleFontSizeVar: Record<KpiSize, string> = {
	sm: 'var(--nok-typography-font-size-11)',
	md: 'var(--nok-typography-font-size-12)',
	lg: 'var(--nok-typography-font-size-13)',
};

const deltaFontSizeVar = subtitleFontSizeVar;

// deltaDirection maps 1:1 onto the chart-positive/negative/neutral tokens —
// only "neutral" was given explicitly, but the naming lines up exactly.
const deltaColorClass: Record<KpiDeltaDirection, string> = {
	positive: 'text-chart-positive',
	negative: 'text-chart-negative',
	neutral: 'text-chart-neutral',
};

const deltaIconForDirection: Record<KpiDeltaDirection, IconName> = {
	positive: 'TrendingUp',
	negative: 'TrendingDown',
	neutral: 'Minus',
};

export const Kpi = forwardRef<HTMLDivElement, KpiProps>(
	(
		{
			size = 'sm',
			deltaDirection = 'neutral',
			label,
			value,
			// Design system default is true — the icon slot is meant to show
			// unless explicitly turned off.
			showIcon = true,
			icon,
			iconPosition = 'leading',
			showDelta = false,
			deltaValue,
			showSubtitle = false,
			subtitle,
			subtitlePosition = 'below',
			className,
			style,
			...props
		},
		ref,
	) => {
		const classes = [
			'flex flex-col items-start gap-component-xs rounded-lg border border-border-default bg-background-surface',
			paddingClassForSize[size],
			className,
		]
			.filter(Boolean)
			.join(' ');

		const showIconSlot = showIcon && icon;

		const deltaRow = showDelta && deltaValue && (
			<span className={`inline-flex items-center gap-component-xs ${deltaColorClass[deltaDirection]}`}>
				<Icon
					name={deltaIconForDirection[deltaDirection]}
					size={iconSizeForKpiSize[size]}
					color={deltaDirection === 'neutral' ? 'inverse' : undefined}
				/>
				<span style={{ fontWeight: 400, fontSize: deltaFontSizeVar[size], fontVariantNumeric: 'tabular-nums' }}>
					{deltaValue}
				</span>
			</span>
		);

		const subtitleEl = showSubtitle && subtitle && (
			<span className='text-text-tertiary' style={{ fontWeight: 400, fontSize: subtitleFontSizeVar[size] }}>
				{subtitle}
			</span>
		);

		return (
			<div
				ref={ref}
				className={classes}
				style={{
					width: '260px',
					minHeight: heightForSize[size],
					position: iconPosition === 'corner' ? 'relative' : undefined,
					...style,
				}}
				{...props}>
				{showIconSlot && iconPosition === 'corner' && (
					<span
						className='absolute'
						style={{ top: 'var(--nok-spacing-component-md, 12px)', right: 'var(--nok-spacing-component-md, 12px)' }}>
						{icon}
					</span>
				)}

				{showIconSlot && iconPosition === 'top' && <span className='inline-flex'>{icon}</span>}

				<span className='inline-flex items-center gap-component-xs'>
					{showIconSlot && iconPosition === 'leading' && icon}
					<span className='text-text-secondary' style={{ fontWeight: 500, fontSize: labelFontSizeVar[size] }}>
						{label}
					</span>
				</span>

				{/* Tabular figures so KPI values don't jitter/misalign as digits
				change — known gap noted in the design system's own changelog. */}
				<span
					className='text-text-primary'
					style={{ fontWeight: 700, fontSize: valueFontSizeVar[size], fontVariantNumeric: 'tabular-nums' }}>
					{value}
				</span>

				{subtitlePosition === 'inline' ?
					(deltaRow || subtitleEl) && (
						<span className='inline-flex items-center' style={{ gap: 'var(--nok-spacing-component-xs, 4px)' }}>
							{deltaRow}
							{subtitleEl}
						</span>
					)
				:	<>
						{deltaRow}
						{subtitleEl}
					</>
				}
			</div>
		);
	},
);

Kpi.displayName = 'Kpi';
