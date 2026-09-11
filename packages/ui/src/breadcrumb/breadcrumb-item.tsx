'use client';

import { CSSProperties, HTMLAttributes, forwardRef } from 'react';
import { Icon, IconName } from '../icons/Icon.js';

type BreadcrumbItemState = 'default' | 'hover' | 'current' | 'collapsed';
type BreadcrumbItemSeparator = 'chevron' | 'slash';

export interface BreadcrumbItemProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
	/**
	 * Storybook/preview only: force a visual state without real interaction.
	 * "default" is live — real hovering/focus applies on its own.
	 */
	state?: BreadcrumbItemState;
	separator?: BreadcrumbItemSeparator;
	label?: string;
	showIcon?: boolean;
	icon?: IconName;
	showSeparator?: boolean;
	/** Storybook/preview only: forces the focus ring on without real focus. */
	showFocusRing?: boolean;
	onClick?: () => void;
}

const labelStyle: CSSProperties = {
	fontFamily: 'var(--nok-typography-font-family-body, Roboto)',
	fontSize: 'var(--nok-typography-font-size-13, 13px)',
	fontStyle: 'normal',
	fontWeight: 400,
	lineHeight: 'var(--nok-typography-line-height-19-5, 19.5px)',
	textDecorationLine: 'underline',
	textDecorationStyle: 'solid',
	textDecorationSkipInk: 'auto',
	textDecorationThickness: 'auto',
	textUnderlineOffset: 'auto',
	textUnderlinePosition: 'from-font',
	// Color lives on the trigger (button/span) below, not here — the label
	// inherits currentColor so real `hover:` classes on the trigger work.
};

export const BreadcrumbItem = forwardRef<HTMLDivElement, BreadcrumbItemProps>(
	(
		{
			state = 'default',
			separator = 'chevron',
			label,
			showIcon = false,
			icon,
			showSeparator = true,
			showFocusRing = false,
			onClick,
			className,
			style,
			...props
		},
		ref,
	) => {
		const isCurrent = state === 'current';
		const isCollapsed = state === 'collapsed';
		const isForcedHover = state === 'hover';

		// default (unforced) gets a real hover:; current/forced-hover are fixed
		// to text-primary; collapsed reads the same as default.
		const colorClass =
			isCurrent || isForcedHover ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary';

		// Ring lives on the outer wrapper (via `has-[:focus-visible]:`, same
		// bubbling trick Checkbox/Radio/Toggle use) so it draws around the
		// separator too, not just the trigger — the trigger itself suppresses
		// its own native focus outline.
		const wrapperClasses = [
			'inline-flex items-center rounded-sm has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--nok-color-border-focus)]',
			showFocusRing && 'outline outline-2 outline-offset-2 outline-[var(--nok-color-border-focus)]',
			className,
		]
			.filter(Boolean)
			.join(' ');

		const classes = [
			'inline-flex items-center transition-colors focus-visible:outline-none',
			!isCurrent && 'cursor-pointer',
			colorClass,
		]
			.filter(Boolean)
			.join(' ');

		// TODO: chevron/slash separator visuals not given yet — ChevronRight/"/"
		// are placeholders pending the literal CSS.
		const separatorEl = showSeparator && (
			<span className='shrink-0 text-text-secondary' aria-hidden='true'>
				{separator === 'chevron' ?
					<Icon name='ChevronRight' size='sm' color='secondary' />
				:	<span style={{ ...labelStyle, textDecorationLine: 'none' }}>/</span>
				}
			</span>
		);

		const triggerContent = (
			<>
				{showIcon && icon && <Icon name={icon} size='sm' color='secondary' />}
				<span style={isCollapsed ? { ...labelStyle, textDecorationLine: 'none' } : labelStyle}>
					{isCollapsed ? '...' : label}
				</span>
			</>
		);

		// Inline `outline: none` — the ring lives on the wrapper (above), so the
		// trigger's own native focus outline needs a hard override, not just
		// the `focus-visible:outline-none` class (Tailwind's utility ordering
		// isn't reliable enough to guarantee it wins here).
		const triggerStyle = { gap: 'var(--nok-spacing-component-xs, 4px)', outline: 'none' };

		const trigger =
			isCurrent ?
				<span className={classes} style={triggerStyle} aria-current='page'>
					{triggerContent}
				</span>
			:	<button type='button' className={classes} style={triggerStyle} onClick={onClick}>
					{triggerContent}
				</button>;

		// Separator leads the label ("> label" / "/ label") for both kinds —
		// each item carries the separator that introduces it.
		return (
			<div ref={ref} className={wrapperClasses} style={{ gap: 'var(--nok-spacing-component-xs, 4px)', ...style }} {...props}>
				{separatorEl}
				{trigger}
			</div>
		);
	},
);

BreadcrumbItem.displayName = 'BreadcrumbItem';
