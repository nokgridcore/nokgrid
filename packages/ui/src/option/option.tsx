'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { nokTailwindTheme } from '@nokgridcore/tokens/tailwind-theme';
import { Icon, IconName, IconSize } from '../icons/Icon.js';
import { Checkbox, CheckboxSize } from '../checkbox/checkbox.js';
import { Badge, BadgeVariant } from '../badge/badge.js';

type OptionVariant = 'outlined' | 'underlined';
type OptionSize = 'sm' | 'md' | 'lg';
type OptionLeadingContent = 'none' | 'icon' | 'checkbox';
type OptionState = 'default' | 'hovered' | 'selected' | 'disabled';

export interface OptionProps extends Omit<
	HTMLAttributes<HTMLDivElement>,
	'onChange'
> {
	variant?: OptionVariant;
	size?: OptionSize;
	leadingContent?: OptionLeadingContent;
	icon?: IconName;
	state?: OptionState;
	showBadge?: boolean;
	badgeVariant?: BadgeVariant;
	badgeLabel?: string;
	label: string;
}

const fieldSizeClasses: Record<OptionSize, string> = {
	sm: 'h-control-sm px-layout-sm gap-component-sm',
	md: 'h-control-md px-layout-md gap-component-sm',
	lg: 'h-control-lg px-layout-lg gap-component-sm',
};

const iconSizeForOptionSize: Record<OptionSize, IconSize> = {
	sm: 'sm',
	md: 'md',
	lg: 'lg',
};

// Checkbox only ships sm/md — lg falls back to md, the largest available.
const checkboxSizeForOptionSize: Record<OptionSize, CheckboxSize> = {
	sm: 'sm',
	md: 'md',
	lg: 'md',
};

const labelStyleKey: Record<OptionSize, string> = {
	sm: 'body-sm',
	md: 'body-md',
	lg: 'body-lg',
};

const radiusClasses: Record<OptionVariant, string> = {
	outlined: 'rounded-sm',
	underlined: 'rounded-none',
};

// underlined keeps a same-width transparent left border in every state but
// selected, so the accent border doesn't shift the layout when it appears —
// same pattern as Tab/Radio/Chip.
const colorClasses: Record<OptionVariant, Record<OptionState, string>> = {
	outlined: {
		default: '',
		hovered: 'bg-background-overlay',
		selected: 'bg-background-brand-subtle',
		disabled: '',
	},
	underlined: {
		default: 'border-b border-l-2 border-border-default border-l-transparent',
		hovered: 'border-b border-l-2 border-border-default border-l-transparent bg-background-overlay',
		selected: 'border-b border-l-2 border-border-default border-l-action-primary-default bg-background-brand-subtle',
		disabled: 'border-b border-l-2 border-border-default border-l-transparent',
	},
};

// Real :hover, layered alongside the state-forced classes above (which exist
// so the Storybook `state` control can preview hover without a real pointer).
// Only kicks in outside "selected"/"disabled" so it doesn't fight the
// selected background.
const interactiveClasses: Record<OptionVariant, string> = {
	outlined: 'hover:bg-background-overlay',
	underlined: 'hover:bg-background-overlay',
};

export const Option = forwardRef<HTMLDivElement, OptionProps>(
	(
		{
			variant = 'outlined',
			size = 'sm',
			leadingContent = 'none',
			icon,
			state = 'default',
			showBadge = false,
			badgeVariant,
			badgeLabel,
			label,
			className,
			...props
		},
		ref,
	) => {
		const isDisabled = state === 'disabled';
		const isSelected = state === 'selected';
		const iconColor = isDisabled ? 'disabled' : 'default';

		const classes = [
			// Focus ring — the design system's own convention: 2px, bound to
			// border/focus, on the control rather than the label.
			'inline-flex items-center w-full transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nok-color-border-focus)]',
			isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
			fieldSizeClasses[size],
			radiusClasses[variant],
			colorClasses[variant][state],
			!isDisabled && !isSelected && interactiveClasses[variant],
			// text-primary, not -brand, on the selected label — matches the design
			// system's own contrast fix (brand text on the selected row failed
			// 4.5:1 at 3.07:1); the accent border still carries the selection.
			isDisabled ? 'text-text-disabled' : 'text-text-primary',
			className,
		]
			.filter(Boolean)
			.join(' ');

		return (
			<div
				ref={ref}
				role='option'
				aria-selected={isSelected}
				aria-disabled={isDisabled || undefined}
				tabIndex={isDisabled ? -1 : 0}
				className={classes}
				{...props}>
				{leadingContent === 'icon' && icon && (
					<Icon name={icon} size={iconSizeForOptionSize[size]} color={iconColor} />
				)}
				{leadingContent === 'checkbox' && (
					<Checkbox
						size={checkboxSizeForOptionSize[size]}
						state={isDisabled ? 'disabled' : 'default'}
						checked={isSelected}
						onChange={() => {}}
					/>
				)}
				<span
					style={nokTailwindTheme.textStyles[labelStyleKey[size]]}
					className='flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left'>
					{label}
				</span>
				{showBadge && <Badge variant={badgeVariant} label={badgeLabel ?? ''} />}
			</div>
		);
	},
);

Option.displayName = 'Option';
