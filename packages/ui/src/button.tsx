'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
type ButtonState = 'default' | 'hovered' | 'pressed' | 'disabled';

export interface ButtonProps extends Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	'disabled'
> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	/**
	 * Storybook/preview only: force a visual state without real interaction.
	 * "disabled" also sets the real disabled attribute.
	 */
	state?: ButtonState;
}

const variantClasses: Record<ButtonVariant, string> = {
	primary:
		'bg-action-primary-default text-action-primary-text hover:bg-action-primary-hover active:bg-action-primary-pressed disabled:bg-action-primary-disabled disabled:text-action-primary-text',
	secondary:
		'bg-action-secondary-default text-action-secondary-text hover:bg-action-secondary-hover active:bg-action-secondary-pressed disabled:bg-action-secondary-disabled disabled:text-action-secondary-disabled-text',
	tertiary:
		'bg-action-tertiary-background border border-action-tertiary-border text-action-tertiary-text hover:bg-action-tertiary-hover active:bg-action-tertiary-pressed disabled:bg-action-tertiary-disabled-background disabled:border-action-tertiary-disabled-border disabled:text-action-tertiary-disabled-text',
	destructive:
		'bg-action-destructive-default text-action-destructive-text hover:bg-action-destructive-hover active:bg-action-destructive-pressed disabled:bg-action-destructive-disabled disabled:text-action-destructive-disabled-text',
};

const sizeClasses: Record<ButtonSize, string> = {
	xs: 'h-control-xs py-component-xs px-component-sm gap-component-xs text-sm',
	sm: 'h-control-sm py-component-sm px-component-md gap-component-sm text-sm',
	md: 'h-control-md py-component-md px-component-lg gap-component-md text-base',
	lg: 'h-control-lg py-component-lg px-component-xl gap-component-lg text-base',
};

// Preview-only overrides for "hovered" / "pressed" states.
// Inline styles guarantee the override wins regardless of Tailwind's
// generated CSS source order.
const stateVars: Record<
	ButtonVariant,
	Partial<Record<'hovered' | 'pressed', { bg: string; text?: string }>>
> = {
	primary: {
		hovered: { bg: 'var(--nok-color-action-primary-hover)' },
		pressed: { bg: 'var(--nok-color-action-primary-pressed)' },
	},
	secondary: {
		hovered: { bg: 'var(--nok-color-action-secondary-hover)' },
		pressed: { bg: 'var(--nok-color-action-secondary-pressed)' },
	},
	tertiary: {
		hovered: { bg: 'var(--nok-color-action-tertiary-hover)' },
		pressed: { bg: 'var(--nok-color-action-tertiary-pressed)' },
	},
	destructive: {
		hovered: { bg: 'var(--nok-color-action-destructive-hover)' },
		pressed: { bg: 'var(--nok-color-action-destructive-pressed)' },
	},
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			variant = 'primary',
			size = 'md',
			state = 'default',
			className,
			style,
			...props
		},
		ref,
	) => {
		const classes = [
			'inline-flex items-center justify-center rounded-md font-body font-medium leading-none transition-colors',
			'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nok-color-border-focus)]',
			'disabled:cursor-not-allowed',
			variantClasses[variant],
			sizeClasses[size],
			className,
		]
			.filter(Boolean)
			.join(' ');

		const forcedVars =
			state === 'hovered' || state === 'pressed'
				? stateVars[variant][state]
				: undefined;

		const forcedStyle = forcedVars
			? {
					backgroundColor: forcedVars.bg,
					...(forcedVars.text ? { color: forcedVars.text } : {}),
					...style,
				}
			: style;

		return (
			<button
				ref={ref}
				className={classes}
				style={forcedStyle}
				disabled={state === 'disabled'}
				{...props}
			/>
		);
	},
);

Button.displayName = 'Button';
