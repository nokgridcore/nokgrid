'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { nokTailwindTheme } from '@nokgridcore/tokens/tailwind-theme';
import { Icon, IconName } from '../icons/Icon.js';

type PaginationButtonState = 'default' | 'hovered' | 'pressed' | 'active' | 'disabled';

export interface PaginationButtonProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
	state?: PaginationButtonState;
	label?: string;
	/** Renders in place of the label — used for the prev/next caret buttons. */
	icon?: IconName;
}

// disabled pending — only default/hovered/pressed/active given so far.
const colorClasses: Record<PaginationButtonState, string> = {
	default: '',
	hovered: 'bg-background-overlay',
	pressed: 'bg-background-sunken',
	active: 'bg-background-brand-subtle',
	disabled: '',
};

export const PaginationButton = forwardRef<HTMLButtonElement, PaginationButtonProps>(
	({ state = 'default', label, icon, className, ...props }, ref) => {
		const isDisabled = state === 'disabled';
		const isActive = state === 'active';

		const classes = [
			'inline-flex w-control-sm h-control-sm items-center justify-center rounded-sm transition-colors duration-200 ease-in-out',
			isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
			!isDisabled && !isActive && 'hover:bg-background-overlay active:bg-background-sunken',
			isDisabled ? 'text-text-disabled' : isActive ? 'text-text-brand' : 'text-text-primary',
			colorClasses[state],
			className,
		]
			.filter(Boolean)
			.join(' ');

		return (
			<button
				ref={ref}
				type='button'
				disabled={isDisabled}
				className={classes}
				style={{ ...nokTailwindTheme.textStyles['label-md'], textAlign: 'center' }}
				{...props}>
				{icon ? (
					<Icon name={icon} size='sm' color={isDisabled ? 'disabled' : isActive ? 'brand' : 'default'} />
				) : (
					label
				)}
			</button>
		);
	},
);

PaginationButton.displayName = 'PaginationButton';
