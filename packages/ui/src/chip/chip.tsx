'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { nokTailwindTheme } from '@nokgridcore/tokens/tailwind-theme';
import { Icon, IconName, IconSize } from '../icons/Icon.js';

type ChipAppearance = 'outline' | 'selected';
type ChipState = 'default' | 'hover' | 'pressed' | 'disabled';
type ChipSize = 'small' | 'medium';

export interface ChipProps extends Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	'disabled'
> {
	appearance?: ChipAppearance;
	state?: ChipState;
	size?: ChipSize;
	label: string;
	leadingIcon?: IconName;
	removable?: boolean;
	onRemove?: () => void;
}

const sizeClasses: Record<ChipSize, string> = {
	small: 'h-control-xs px-component-sm gap-component-xs',
	medium: 'h-control-sm px-component-md gap-component-xs',
};

const labelStyleKey: Record<ChipSize, string> = {
	small: 'label-md',
	medium: 'label-lg',
};

const iconSizeForChipSize: Record<ChipSize, IconSize> = {
	small: 'xs',
	medium: 'sm',
};

// Real :hover/:active interaction, layered alongside the state-forced
// classes below (which exist so the Storybook `state` control can preview
// hover/pressed without needing an actual pointer).
const interactiveClasses: Record<ChipAppearance, string> = {
	outline: 'hover:border-border-strong active:border-border-strong active:bg-background-overlay',
	selected: 'hover:bg-action-primary-hover active:bg-action-primary-pressed',
};

const colorClasses: Record<ChipAppearance, Record<ChipState, string>> = {
	outline: {
		default: 'border border-border-default text-text-primary',
		hover: 'border border-border-strong text-text-primary',
		pressed: 'border border-border-strong bg-background-overlay text-text-primary',
		disabled: 'border border-border-default text-text-disabled',
	},
	selected: {
		default: 'border border-transparent bg-action-primary-default text-text-white',
		hover: 'border border-transparent bg-action-primary-hover text-text-white',
		pressed: 'border border-transparent bg-action-primary-pressed text-text-white',
		disabled: 'border border-transparent bg-action-primary-disabled text-text-white',
	},
};

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
	(
		{
			appearance = 'outline',
			state = 'default',
			size = 'small',
			label,
			leadingIcon,
			removable = false,
			onRemove,
			className,
			...props
		},
		ref,
	) => {
		const isDisabled = state === 'disabled';

		const classes = [
			'inline-flex items-center rounded-full transition-colors duration-200 ease-in-out',
			isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
			sizeClasses[size],
			colorClasses[appearance][state],
			!isDisabled && interactiveClasses[appearance],
			className,
		]
			.filter(Boolean)
			.join(' ');

		return (
			<button ref={ref} type='button' disabled={isDisabled} className={classes} {...props}>
				{leadingIcon && <Icon name={leadingIcon} size={iconSizeForChipSize[size]} />}
				<span
					style={nokTailwindTheme.textStyles[labelStyleKey[size]]}
					className='overflow-hidden text-ellipsis whitespace-nowrap'>
					{label}
				</span>
				{removable && (
					<Icon
						name='X'
						size={iconSizeForChipSize[size]}
						className='[&_path]:stroke-[2px]'
						onClick={(e) => {
							if (isDisabled) return;
							e.stopPropagation();
							onRemove?.();
						}}
					/>
				)}
			</button>
		);
	},
);

Chip.displayName = 'Chip';
