'use client';

import { forwardRef, InputHTMLAttributes, useId } from 'react';
import { nokTailwindTheme } from '@nokgridcore/tokens/tailwind-theme';
import { Icon, IconName } from '../icons/Icon.js';

type InputSize = 'sm' | 'md' | 'lg';
type InputVariant = 'default' | 'underline';
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
	hideLabel?: boolean;
	required?: boolean;
	helperText?: string;
	hideHelperText?: boolean;
	size?: InputSize;
	variant?: InputVariant;
	/** Defaults to true for "underline" variant, false otherwise */
	showBg?: boolean;
	/** Storybook preview + real functional states (error/disabled/readonly) */
	state?: InputState;
	leadingIcon?: IconName;
	trailingIcon?: IconName;
}

const fieldSizeClasses: Record<InputSize, string> = {
	sm: 'h-control-sm px-layout-sm gap-component-sm',
	md: 'h-control-md px-layout-md gap-component-sm',
	lg: 'h-control-lg px-layout-lg gap-component-sm',
};

const iconSizeForInputSize: Record<InputSize, 'sm' | 'md' | 'lg'> = {
	sm: 'sm',
	md: 'md',
	lg: 'lg',
};

const labelStyleKey: Record<InputSize, keyof typeof nokTailwindTheme.textStyles> = {
	sm: 'label-sm',
	md: 'label-md',
	lg: 'label-lg',
};

const bodyStyleKey: Record<InputSize, keyof typeof nokTailwindTheme.textStyles> = {
	sm: 'body-sm',
	md: 'body-md',
	lg: 'body-lg',
};

// No caption-lg exists — falls back to caption-md (largest available).
const helperStyleKey: Record<InputSize, keyof typeof nokTailwindTheme.textStyles> = {
	sm: 'caption-sm',
	md: 'caption-md',
	lg: 'caption-md',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			label,
			hideLabel = false,
			required,
			helperText,
			hideHelperText = false,
			size = 'sm',
			variant = 'default',
			showBg,
			state = 'default',
			leadingIcon,
			trailingIcon,
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
		const resolvedShowBg = showBg ?? variant === 'underline';
		const isUnderline = variant === 'underline';

		const borderClasses = isUnderline
			? isReadOnly
				? 'border-b border-dashed rounded-none'
				: isError
					? 'border-b-2 rounded-none'
					: 'border-b rounded-none'
			: isError
				? 'border-2 rounded-md'
				: 'border rounded-md';

		const borderColorClass =
			isUnderline && isReadOnly
				? 'border-border-strong'
				: isError
					? 'border-border-error'
					: 'border-border-default';

		const backgroundClass =
			isDisabled
				? 'bg-background-overlay cursor-not-allowed'
				: isReadOnly
					? 'bg-background-sunken cursor-not-allowed'
					: isUnderline
						? isError
							? 'bg-background-error'
							: resolvedShowBg
								? 'bg-background-canvas'
								: 'bg-transparent'
						: resolvedShowBg
							? 'bg-background-overlay'
							: 'bg-background-surface';

		const fieldClasses = [
			'flex items-center flex-shrink-0 self-stretch transition-[background-color,border-color,border-width] duration-200 ease-in-out',
			!isReadOnly &&
				!isDisabled &&
				[
					'hover:border-border-strong',
					isUnderline && 'hover:bg-background-overlay',
					isUnderline ? 'focus-within:border-b-2' : 'focus-within:border-2',
					'focus-within:border-border-strong',
					'focus-within:outline-none',
					isUnderline && 'focus-within:bg-background-canvas',
				]
					.filter(Boolean)
					.join(' '),
			fieldSizeClasses[size],
			borderClasses,
			borderColorClass,
			isReadOnly && '[[data-theme=dark]_&]:border-transparent',
			backgroundClass,
			className,
		]
			.filter(Boolean)
			.join(' ');

		const forcedStyle =
			state === 'hovered'
				? {
						borderColor: 'var(--nok-color-border-strong)',
						...(isUnderline
							? { backgroundColor: 'var(--nok-color-background-overlay)' }
							: {}),
						...style,
					}
				: state === 'focused'
					? {
							borderColor: 'var(--nok-color-border-strong)',
							...(isUnderline
								? {
										borderBottomWidth: '2px',
										backgroundColor: 'var(--nok-color-background-canvas)',
									}
								: { borderWidth: '2px' }),
							...style,
						}
					: style;

		return (
			<div className='inline-flex flex-col gap-1 w-full'>
				{label && (
					<label
						htmlFor={inputId}
						style={nokTailwindTheme.textStyles[labelStyleKey[size]]}
						className={`${hideLabel ? 'sr-only' : ''} ${
							isDisabled ? 'text-text-disabled' : 'text-text-primary'
						}`}>
						{label}
						{required && (
							<span
								className={isDisabled ? 'text-text-disabled' : 'text-text-error'}>
								{' '}
								*
							</span>
						)}
					</label>
				)}

				<div className={fieldClasses} style={forcedStyle}>
					{leadingIcon && (
						<Icon
							name={leadingIcon}
							size={iconSizeForInputSize[size]}
							// Field icons sit on icon/secondary so they match the
							// placeholder exactly — the design system's own field-icon fix.
							color={isDisabled ? 'disabled' : 'secondary'}
						/>
					)}
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
							isDisabled || isReadOnly
								? 'text-text-disabled placeholder:text-text-disabled'
								// text-secondary, not -tertiary — matches the design system's
								// own contrast fix (tertiary placeholder text failed 4.5:1).
								: 'text-text-primary placeholder:text-text-secondary'
						}
						{...props}
					/>
					{trailingIcon && (
						<Icon
							name={trailingIcon}
							size={iconSizeForInputSize[size]}
							// Field icons sit on icon/secondary so they match the
							// placeholder exactly — the design system's own field-icon fix.
							color={isDisabled ? 'disabled' : 'secondary'}
						/>
					)}
				</div>

				{helperText && (
					<span
						style={nokTailwindTheme.textStyles[helperStyleKey[size]]}
						className={`${hideHelperText ? 'sr-only' : ''} ${
							isDisabled
								? 'text-text-disabled'
								: isError
									? 'text-text-error'
									: 'text-text-primary'
						}`}>
						{helperText}
					</span>
				)}
			</div>
		);
	},
);

Input.displayName = 'Input';
