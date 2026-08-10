'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { Icon, IconName } from '../icons/Icon.js';

type AlertVariant = 'success' | 'warning' | 'error' | 'info';
type AlertAppearance = 'subtle' | 'strong';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
	variant?: AlertVariant;
	appearance?: AlertAppearance;
	inline?: boolean;
	bleed?: boolean;
	title?: string;
	showTitle?: boolean;
	description?: string;
	dismissible?: boolean;
	onDismiss?: () => void;
}

const variantIcon: Record<AlertVariant, IconName> = {
	success: 'CircleCheckBig',
	warning: 'AlertTriangle',
	error: 'AlertCircle',
	info: 'Info',
};

// only "success" was given explicitly — warning/error/info follow the same
// {variant}/{variant}-strong token pairing, confirmed to exist for all four.
// Border width is handled separately (subtle only, none for strong) so it
// doesn't fight the bleed variant's own border-y class.
const colorClasses: Record<AlertVariant, Record<AlertAppearance, string>> = {
	success: {
		subtle: 'border-border-success bg-background-success',
		strong: 'bg-background-success-strong',
	},
	warning: {
		subtle: 'border-border-warning bg-background-warning',
		strong: 'bg-background-warning-strong',
	},
	error: {
		subtle: 'border-border-error bg-background-error',
		strong: 'bg-background-error-strong',
	},
	info: {
		subtle: 'border-border-info bg-background-info',
		strong: 'bg-background-info-strong',
	},
};

// warning/strong is the one exception — banana-600 is too light for white
// text, so it uses inverse (near-black) instead, same call already made for
// Badge's filled+warning label.
const contentColorClass: Record<AlertVariant, Record<AlertAppearance, string>> = {
	success: { subtle: 'text-text-success', strong: 'text-white' },
	warning: { subtle: 'text-text-warning', strong: 'text-text-inverse' },
	error: { subtle: 'text-text-error', strong: 'text-white' },
	info: { subtle: 'text-text-info', strong: 'text-white' },
};

const iconColorForState: Record<AlertVariant, Record<AlertAppearance, 'success' | 'warning' | 'error' | 'info' | 'white' | 'inverse'>> = {
	success: { subtle: 'success', strong: 'white' },
	warning: { subtle: 'warning', strong: 'inverse' },
	error: { subtle: 'error', strong: 'white' },
	info: { subtle: 'info', strong: 'white' },
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
	(
		{
			variant = 'info',
			appearance = 'subtle',
			inline = false,
			bleed = false,
			title,
			showTitle = true,
			description,
			dismissible = false,
			onDismiss,
			className,
			style,
			...props
		},
		ref,
	) => {
		const classes = [
			'flex items-start gap-component-sm p-component-lg',
			bleed ? 'rounded-none' : 'rounded-lg',
			appearance === 'subtle' && (bleed ? 'border-y' : 'border'),
			colorClasses[variant][appearance],
			contentColorClass[variant][appearance],
			className,
		]
			.filter(Boolean)
			.join(' ');

		return (
			<div
				ref={ref}
				className={classes}
				style={{ width: '100%', maxWidth: bleed ? undefined : '400px', ...style }}
				{...props}>
				<Icon
					name={variantIcon[variant]}
					color={iconColorForState[variant][appearance]}
					className='shrink-0'
				/>

				<div className={inline ? 'flex flex-1 items-start gap-component-sm' : 'flex flex-1 flex-col gap-component-xs'}>
					{showTitle && title && (
						<span className='font-medium' style={{ fontSize: 'var(--nok-typography-font-size-14)' }}>
							{title}
						</span>
					)}
					{description && (
						<span style={{ fontSize: 'var(--nok-typography-font-size-14)' }}>{description}</span>
					)}
				</div>

				{dismissible && (
					<button type='button' onClick={onDismiss} aria-label='Dismiss' className='shrink-0'>
						<Icon name='X' color={iconColorForState[variant][appearance]} />
					</button>
				)}
			</div>
		);
	},
);

Alert.displayName = 'Alert';
