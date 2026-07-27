'use client';

import { forwardRef, InputHTMLAttributes, useId } from 'react';
import { nokTailwindTheme } from '@nokgridcore/tokens/tailwind-theme';
import { Icon, IconName } from '../icons/Icon.js';

type InputSize = 'sm' | 'md' | 'lg';
type InputState =
	| 'default'
	| 'hovered'
	| 'focused'
	| 'disabled'
	| 'error'
	| 'readonly';

export interface InputProps extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'size' | 'disabled' | 'readOnly'
> {
	label?: string;
	required?: boolean;
	helperText?: string;
	size?: InputSize;
	/** Storybook preview + real functional states (error/disabled/readonly) */
	state?: InputState;
	startIcon?: IconName;
	endIcon?: IconName;
}

const fieldSizeClasses: Record<InputSize, string> = {
	sm: 'h-control-sm px-layout-sm gap-layout-md',
	md: 'h-control-md px-layout-md gap-layout-lg',
	lg: 'h-control-lg px-layout-lg gap-layout-lg',
};

const iconSizeForInputSize: Record<InputSize, 'sm' | 'md' | 'lg'> = {
	sm: 'sm',
	md: 'md',
	lg: 'lg',
};

const labelStyleKey: Record<InputSize, string> = {
	sm: 'label-sm',
	md: 'label-md',
	lg: 'label-lg',
};

const bodyStyleKey: Record<InputSize, string> = {
	sm: 'body-sm',
	md: 'body-md',
	lg: 'body-lg',
};

// No caption-lg exists — falls back to caption-md (largest available).
const helperStyleKey: Record<InputSize, string> = {
	sm: 'caption-sm',
	md: 'caption-md',
	lg: 'caption-md',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			label,
			required,
			helperText,
			size = 'sm',
			state = 'default',
			startIcon,
			endIcon,
			id,
			className,
			style,
			...props
		},
		ref,
	) => {
		const generatedId = useId();
		const inputId = id ?? generatedId;
		const isDisabled = state === 'disabled';
		const isReadOnly = state === 'readonly';
		const isError = state === 'error';

		const fieldClasses = [
			'flex items-center flex-shrink-0 self-stretch rounded-md border transition-colors',
			'hover:bg-background-overlay focus-within:border-border-focus focus-within:outline-none',
			fieldSizeClasses[size],
			isError
				? 'border-border-error border-2'
				: isDisabled || isReadOnly
					? 'border-border-default bg-background-sunken cursor-not-allowed'
					: 'border-border-default bg-background-surface',
			className,
		]
			.filter(Boolean)
			.join(' ');

		const forcedStyle =
			state === 'hovered'
				? { backgroundColor: 'var(--nok-color-background-overlay)', ...style }
				: state === 'focused'
					? { borderColor: 'var(--nok-color-border-focus)', ...style }
					: style;

		return (
			<div className='inline-flex flex-col gap-1'>
				{label && (
					<label
						htmlFor={inputId}
						style={nokTailwindTheme.textStyles[labelStyleKey[size]]}
						className='text-text-primary'>
						{label}
						{required && <span className='text-text-error ml-1'>*</span>}
					</label>
				)}

				<div className={fieldClasses} style={forcedStyle}>
					{startIcon && <Icon name={startIcon} size={iconSizeForInputSize[size]} />}
					<input
						ref={ref}
						id={inputId}
						disabled={isDisabled}
						readOnly={isReadOnly}
						aria-invalid={isError || undefined}
						style={{
							...nokTailwindTheme.textStyles[bodyStyleKey[size]],
							flex: 1,
							minWidth: 0,
							background: 'transparent',
							border: 'none',
							outline: 'none',
						}}
						className={
							isDisabled || isReadOnly ? 'text-text-disabled' : 'text-text-primary'
						}
						{...props}
					/>
					{endIcon && <Icon name={endIcon} size={iconSizeForInputSize[size]} />}
				</div>

				{helperText && (
					<span
						style={nokTailwindTheme.textStyles[helperStyleKey[size]]}
						className={isError ? 'text-text-error' : 'text-text-primary'}>
						{helperText}
					</span>
				)}
			</div>
		);
	},
);

Input.displayName = 'Input';
