'use client';

import { ButtonHTMLAttributes, forwardRef, useEffect } from 'react';
import { Icon, IconName, IconSize } from '../icons/Icon.js';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
type ButtonState = 'default' | 'hovered' | 'pressed' | 'disabled';
type IconPosition = 'left' | 'right' | 'only';

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
	icon?: IconName;
	iconPosition?: IconPosition;
	/** Turns off the press scale where the motion would distract. */
	static?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
	primary:
		'bg-action-primary-default text-white hover:bg-action-primary-hover active:bg-action-primary-pressed disabled:bg-action-primary-disabled disabled:text-white',
	secondary:
		'bg-action-secondary-default text-action-secondary-text hover:bg-action-secondary-hover active:bg-action-secondary-pressed disabled:bg-action-secondary-disabled disabled:text-text-disabled',
	// The border brightens on hover and press too: in dark mode the hover fill
	// alone (#080708 → #141414) is too close to the resting fill to see.
	tertiary:
		'bg-action-tertiary-background border border-action-tertiary-border text-action-tertiary-text hover:bg-action-tertiary-hover hover:border-border-strong active:bg-action-tertiary-pressed active:border-border-strong disabled:bg-action-tertiary-disabled-background disabled:border-action-tertiary-disabled-border disabled:text-action-tertiary-disabled-text',
	destructive:
		'bg-action-destructive-default text-action-destructive-text hover:bg-action-destructive-hover active:bg-action-destructive-pressed disabled:bg-action-destructive-disabled disabled:text-action-destructive-disabled-text',
};

// Text-button padding: asymmetric (wider horizontally).
const sizeClasses: Record<ButtonSize, string> = {
	xs: 'h-control-xs py-component-xs px-component-sm gap-component-xs text-sm',
	sm: 'h-control-sm py-component-sm px-component-md gap-component-sm text-sm',
	md: 'h-control-md py-component-md px-component-lg gap-component-md text-base',
	lg: 'h-control-lg py-component-lg px-component-xl gap-component-lg text-base',
};

// Icon-only padding: equal on all sides for a square-ish shape.
// NOTE: inferred, not confirmed by Manny/Figma yet.
const iconOnlySizeClasses: Record<ButtonSize, string> = {
	xs: 'h-control-xs w-control-xs p-component-xs',
	sm: 'h-control-sm w-control-sm p-component-sm',
	md: 'h-control-md w-control-md p-component-md',
	lg: 'h-control-lg w-control-lg p-component-lg',
};

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
			icon,
			iconPosition = 'left',
			static: isStatic = false,
			className,
			style,
			children,
			'aria-label': ariaLabel,
			...props
		},
		ref,
	) => {
		const isIconOnly = Boolean(icon) && iconPosition === 'only';

		useEffect(() => {
			if (isIconOnly && !ariaLabel && process.env.NODE_ENV !== 'production') {
				console.warn(
					'Button: icon-only buttons need an `aria-label` for accessibility.',
				);
			}
		}, [isIconOnly, ariaLabel]);

		const classes = [
			'inline-flex items-center justify-center font-body font-medium leading-none',
			// Colours change on hover; the press scales the whole button so the label
			// and icon come with it. Motion-gated so reduced motion keeps the colour cue only.
			'transition-colors motion-safe:transition-[color,background-color,border-color,transform] motion-safe:duration-150 motion-safe:ease-out',
			!isStatic && 'motion-safe:enabled:active:scale-press',
			isIconOnly ? 'rounded-full' : 'rounded-md',
			'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nok-color-border-focus)]',
			'disabled:cursor-not-allowed',
			variantClasses[variant],
			isIconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
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

		const iconElement = icon ? <Icon name={icon} size={size as IconSize} /> : null;

		return (
			<button
				ref={ref}
				className={classes}
				style={forcedStyle}
				disabled={state === 'disabled'}
				aria-label={ariaLabel}
				{...props}>
				{isIconOnly ? (
					iconElement
				) : (
					<>
						{icon && iconPosition === 'left' && iconElement}
						{children}
						{icon && iconPosition === 'right' && iconElement}
					</>
				)}
			</button>
		);
	},
);

Button.displayName = 'Button';
