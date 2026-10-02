'use client';

import { forwardRef, HTMLAttributes, MouseEvent as ReactMouseEvent } from 'react';
import { nokTailwindTheme } from '@nokgridcore/tokens/tailwind-theme';
import { Icon, IconName, IconSize } from '../icons/Icon.js';
import { Checkbox, CheckboxSize } from '../checkbox/checkbox.js';
import { Badge, BadgeVariant } from '../badge/badge.js';

type MenuItemState = 'default' | 'hovered' | 'focused' | 'active' | 'disabled';
type MenuItemSize = 'sm' | 'md';

export interface MenuItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
	state?: MenuItemState;
	size?: MenuItemSize;
	showLeadingIcon?: boolean;
	icon?: IconName;
	showTrailingIcon?: boolean;
	trailingIcon?: IconName;
	showLabel?: boolean;
	label?: string;
	showTrailingLabel?: boolean;
	trailingLabel?: string;
	showBadge?: boolean;
	badgeVariant?: BadgeVariant;
	badgeLabel?: string;
	showCheckbox?: boolean;
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
}

const MENU_ITEM_WIDTH = '240px';

const fieldSizeClasses: Record<MenuItemSize, string> = {
	sm: 'h-control-sm px-component-md gap-component-sm',
	md: 'h-control-md px-component-md gap-component-sm',
};

// disabled pending — only default/hovered/focused/active given so far.
const colorClasses: Record<MenuItemState, string> = {
	default: '',
	hovered: 'bg-background-overlay',
	focused: 'bg-background-surface',
	active: 'bg-background-brand-subtle',
	disabled: '',
};

// rgba(240, 93, 35, 0.35) is action-primary-default (#F05D23) at 35% alpha —
// no token carries that alpha, so it's the one literal value.
const focusShadowStyle = { boxShadow: '0 0 0 3px rgba(240, 93, 35, 0.35)' };

const iconSizeForMenuItemSize: Record<MenuItemSize, IconSize> = {
	sm: 'sm',
	md: 'md',
};

const checkboxSizeForMenuItemSize: Record<MenuItemSize, CheckboxSize> = {
	sm: 'sm',
	md: 'md',
};

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
	(
		{
			state = 'default',
			size = 'sm',
			showLeadingIcon = false,
			icon,
			showTrailingIcon = false,
			trailingIcon,
			showLabel = false,
			label,
			showTrailingLabel = false,
			trailingLabel,
			showBadge = false,
			badgeVariant,
			badgeLabel,
			showCheckbox = false,
			checked = false,
			onCheckedChange,
			className,
			style,
			onClick,
			...props
		},
		ref,
	) => {
		const isDisabled = state === 'disabled';
		const isActive = state === 'active';
		const iconColor = isDisabled ? 'disabled' : isActive ? 'brand' : 'default';

		const handleClick = (event: ReactMouseEvent<HTMLDivElement>) => {
			onClick?.(event);
			if (isDisabled) return;
			if (showCheckbox) onCheckedChange?.(!checked);
		};

		const classes = [
			// Real focus ring — the design system's own convention: 2px, bound to
			// border/focus, orthogonal to hover/active/disabled (its own notes
			// call out that focus shouldn't be modeled as a value on the state
			// axis, which is what the pre-existing state="focused" box-shadow
			// below does — left in place for now as a legacy preview option, but
			// this is the real mechanism).
			'inline-flex items-center rounded-sm transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nok-color-border-focus)]',
			isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
			!isDisabled && !isActive && 'hover:bg-background-overlay',
			isDisabled ? 'text-text-disabled' : isActive ? 'text-text-brand' : 'text-text-primary',
			fieldSizeClasses[size],
			colorClasses[state],
			className,
		]
			.filter(Boolean)
			.join(' ');

		return (
			<div
				ref={ref}
				role='menuitem'
				aria-disabled={isDisabled || undefined}
				tabIndex={isDisabled ? -1 : 0}
				className={classes}
				style={{ width: MENU_ITEM_WIDTH, ...(state === 'focused' ? focusShadowStyle : undefined), ...style }}
				onClick={handleClick}
				{...props}>
				{showCheckbox && (
					<Checkbox
						size={checkboxSizeForMenuItemSize[size]}
						state={isDisabled ? 'disabled' : 'default'}
						checked={checked}
						onChange={() => {}}
					/>
				)}

				{showLeadingIcon && icon && (
					<Icon name={icon} size={iconSizeForMenuItemSize[size]} color={iconColor} />
				)}

				{showLabel && label && (
					<span
						style={nokTailwindTheme.textStyles['body-sm']}
						className='flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left'>
						{label}
					</span>
				)}

				{showBadge && <Badge variant={badgeVariant} label={badgeLabel ?? ''} fullyRounded />}

				{showTrailingLabel && trailingLabel && (
					<span style={nokTailwindTheme.textStyles['caption-md']} className='text-text-tertiary'>
						{trailingLabel}
					</span>
				)}

				{showTrailingIcon && trailingIcon && (
					<Icon name={trailingIcon} size={iconSizeForMenuItemSize[size]} color={iconColor} />
				)}
			</div>
		);
	},
);

MenuItem.displayName = 'MenuItem';
