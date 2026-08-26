'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { nokTailwindTheme } from '@nokgridcore/tokens/tailwind-theme';
import { Icon, IconName } from '../icons/Icon.js';
import { Badge, BadgeVariant } from '../badge/badge.js';

type TabDirection = 'horizontal' | 'vertical';
type TabAppearance = 'border' | 'filled' | 'elevated';
type TabSize = 'small' | 'medium';
type TabState = 'default' | 'hover' | 'active' | 'disabled';

export interface TabProps extends Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	'disabled'
> {
	direction?: TabDirection;
	appearance?: TabAppearance;
	size?: TabSize;
	state?: TabState;
	label: string;
	leadingIcon?: IconName;
	showBadge?: boolean;
	badgeVariant?: BadgeVariant;
	badgeLabel?: string;
	showFocusRing?: boolean;
}

const sizeClasses: Record<TabSize, string> = {
	small: 'h-control-sm px-component-md gap-component-sm',
	medium: 'h-control-md px-component-lg gap-component-sm',
};

const labelStyleKey: Record<TabSize, string> = {
	small: 'label-md',
	medium: 'label-lg',
};

const iconSizeForTabSize: Record<TabSize, 'xs' | 'sm'> = {
	small: 'xs',
	medium: 'sm',
};

// border appearance: only "active" ever shows a border — the other states
// keep a same-width transparent border so the height/layout doesn't shift
// when switching between them (matching the border-2px pattern used
// elsewhere, e.g. Radio/Chip). The border sits on the bottom for horizontal
// tabs and the right for vertical ones (see borderSideClass below).
//
// default/hover (inactive) labels use text-secondary; active uses
// text-primary/text-brand per appearance. disabled is confirmed
// backgroundless (just text-disabled) across every appearance.
const colorClasses: Record<TabAppearance, Record<TabState, string>> = {
	border: {
		default: 'rounded-sm text-text-secondary border-transparent',
		hover: 'rounded-sm text-text-secondary border-transparent',
		active: 'text-text-primary rounded-none border-action-primary-default',
		disabled: 'rounded-sm text-text-disabled border-transparent',
	},
	filled: {
		default: 'rounded-sm text-text-secondary',
		hover: 'rounded-sm bg-background-sunken text-text-secondary',
		active: 'rounded-sm bg-background-brand-subtle text-text-brand',
		disabled: 'rounded-sm text-text-disabled',
	},
	elevated: {
		default: 'rounded-sm text-text-secondary',
		hover: 'rounded-sm bg-background-overlay shadow-[0_1px_2px_0_rgba(0,0,0,0.06)] text-text-secondary',
		active: 'rounded-sm shadow-sm bg-background-surface text-text-primary',
		disabled: 'rounded-sm text-text-disabled',
	},
};

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
	(
		{
			direction = 'horizontal',
			appearance = 'border',
			size = 'small',
			state = 'default',
			label,
			leadingIcon,
			showBadge = false,
			badgeVariant,
			badgeLabel,
			showFocusRing = false,
			className,
			...props
		},
		ref,
	) => {
		const isDisabled = state === 'disabled';

		const classes = [
			'inline-flex justify-center transition-colors duration-200 ease-in-out',
			direction === 'vertical' ? 'flex-col items-start' : 'flex-row items-center',
			isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
			sizeClasses[size],
			appearance === 'border' &&
				(direction === 'vertical' ? 'border-r-2' : 'border-b-2'),
			colorClasses[appearance][state],
			'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nok-color-border-focus)]',
			showFocusRing &&
				'outline outline-2 outline-offset-2 outline-[var(--nok-color-border-focus)]',
			className,
		]
			.filter(Boolean)
			.join(' ');

		return (
			<button ref={ref} type='button' disabled={isDisabled} className={classes} {...props}>
				{leadingIcon && <Icon name={leadingIcon} size={iconSizeForTabSize[size]} />}
				<span className='inline-flex items-center gap-component-sm'>
					<span style={nokTailwindTheme.textStyles[labelStyleKey[size]]}>{label}</span>
					{showBadge && (
						<Badge
							variant={state === 'active' ? 'primary' : badgeVariant}
							label={badgeLabel ?? ''}
							fullyRounded
						/>
					)}
				</span>
			</button>
		);
	},
);

Tab.displayName = 'Tab';
