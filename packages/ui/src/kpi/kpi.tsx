'use client';

import { HTMLAttributes, ReactNode, forwardRef } from 'react';
import { Icon, IconName } from '../icons/Icon.js';

type KpiSize = 'sm' | 'md' | 'lg';
type KpiDeltaDirection = 'positive' | 'negative' | 'neutral';
type KpiIconPosition = 'leading' | 'corner' | 'top';
type KpiSubtitlePosition = 'below' | 'inline';

export interface KpiProps extends HTMLAttributes<HTMLDivElement> {
	size?: KpiSize;
	deltaDirection?: KpiDeltaDirection;
	label: string;
	/** A number, or a pre-formatted string such as "96.4%" or "$48,210". */
	value: number | string;
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
		// Structure (design system's own spec): head = label + value 4px apart,
		// 16px (component/lg) down to the delta stack, and inside that the arrow
		// and its value are 2px apart with 4px to the subtitle.
		const classes = [
			'flex flex-col items-start rounded-lg border border-border-default bg-background-surface',
			paddingClassForSize[size],
			className,
		]
			.filter(Boolean)
			.join(' ');

		const showIconSlot = showIcon && icon;

		// The delta arrow is 16×16 at every size — not scaled to the KPI size.
		const deltaFrame = showDelta && deltaValue && (
			<span className={`inline-flex items-center ${deltaColorClass[deltaDirection]}`} style={{ gap: '2px' }}>
				<Icon
					name={deltaIconForDirection[deltaDirection]}
					size='sm'
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

		const deltaStack = (deltaFrame || subtitleEl) && (
			<div className='flex flex-col items-start' style={{ gap: 'var(--nok-spacing-component-xs, 4px)' }}>
				{subtitlePosition === 'inline' ?
					// Inline wraps the arrow + value in their own frame so the 2px
					// (arrow↔value) and 4px (delta↔subtitle) gaps stay independent.
					<span className='inline-flex' style={{ alignItems: 'center', gap: 'var(--nok-spacing-component-xs, 4px)' }}>
						{deltaFrame}
						{subtitleEl}
					</span>
				:	<>
						{deltaFrame}
						{subtitleEl}
					</>
				}
			</div>
		);

		return (
			<div
				ref={ref}
				className={classes}
				style={{
					width: '260px',
					// The fixed height reserves room for the delta/subtitle row —
					// without it, keeping that height would leave a dead gap at the
					// bottom instead of the card shrinking to fit its content.
					minHeight: deltaStack ? heightForSize[size] : undefined,
					position: iconPosition === 'corner' ? 'relative' : undefined,
					gap: 'var(--nok-spacing-component-lg, 16px)',
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

				<div className='flex flex-col items-start' style={{ gap: 'var(--nok-spacing-component-xs, 4px)' }}>
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
				</div>

				{deltaStack}
			</div>
		);
	},
);

Kpi.displayName = 'Kpi';
