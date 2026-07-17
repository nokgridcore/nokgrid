'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
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

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ variant = 'primary', size = 'md', className, disabled, ...props }, ref) => {
		const classes = [
			'inline-flex items-center justify-center rounded-md font-medium transition-colors',
			'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nok-color-border-focus)]',
			'disabled:cursor-not-allowed',
			variantClasses[variant],
			sizeClasses[size],
			className,
		]
			.filter(Boolean)
			.join(' ');

		return <button ref={ref} className={classes} disabled={disabled} {...props} />;
	},
);

Button.displayName = 'Button';
