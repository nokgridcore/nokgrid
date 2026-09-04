'use client';

import { forwardRef, InputHTMLAttributes, useId } from 'react';
import { nokTailwindTheme } from '@nokgridcore/tokens/tailwind-theme';

type RadioSize = 'sm' | 'md';
type RadioState = 'default' | 'hovered' | 'disabled' | 'error';

export interface RadioProps extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'size' | 'disabled' | 'type' | 'required'
> {
	label?: string;
	hideLabel?: boolean;
	helperText?: string;
	hideHelperText?: boolean;
	size?: RadioSize;
	state?: RadioState;
}

const boxSizeClasses: Record<RadioSize, string> = {
	sm: 'w-4 h-4',
	md: 'w-5 h-5',
};

const checkedBorderWidth: Record<RadioSize, string> = {
	sm: '5px',
	md: '6px',
};

const labelStyleKey: Record<RadioSize, string> = {
	sm: 'body-sm',
	md: 'body-md',
};

const helperStyleKey: Record<RadioSize, string> = {
	sm: 'caption-sm',
	md: 'caption-md',
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
	(
		{
			label,
			hideLabel = false,
			helperText,
			hideHelperText = false,
			size = 'sm',
			state = 'default',
			checked,
			id,
			className,
			style,
			...props
		},
		ref,
	) => {
		const generatedId = useId();
		const radioId = id ?? generatedId;
		const isDisabled = state === 'disabled';
		const isError = state === 'error';
		const isChecked = Boolean(checked);

		const boxClasses = [
			// Focus ring — the design system's own convention: 2px, bound to
			// border/focus, on the control rather than the label. The native
			// input is visually hidden (sr-only) inside this box, so `has-` reads
			// its :focus-visible state onto the box that's actually visible.
			'flex items-center justify-center rounded-full bg-background-surface transition-[border-color,border-width] duration-200 ease-in-out shrink-0 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--nok-color-border-focus)]',
			boxSizeClasses[size],
			!isChecked && 'border',
			isDisabled
				? isChecked
					? 'border-action-primary-disabled'
					: 'border-border-default'
				: isError
					? 'border-border-error'
					: isChecked
						? 'border-action-primary-default hover:border-action-primary-hover'
						: 'border-border-default hover:border-border-strong',
			className,
		]
			.filter(Boolean)
			.join(' ');

		const forcedStyle = {
			...(isChecked ? { borderWidth: checkedBorderWidth[size] } : {}),
			...(state === 'hovered'
				? isChecked
					? { borderColor: 'var(--nok-color-action-primary-hover)' }
					: { borderColor: 'var(--nok-color-border-strong)' }
				: {}),
			...style,
		};

		return (
			<div className='inline-flex flex-col gap-1'>
				<label
					htmlFor={radioId}
					className={`inline-flex items-center gap-component-xs ${
						isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
					}`}>
					<div className={boxClasses} style={forcedStyle}>
						<input
							ref={ref}
							type='radio'
							id={radioId}
							checked={isChecked}
							disabled={isDisabled}
							className='sr-only'
							{...props}
						/>
					</div>
					{label && (
						<span
							style={nokTailwindTheme.textStyles[labelStyleKey[size]]}
							className={`${hideLabel ? 'sr-only' : ''} ${
								isDisabled ? 'text-text-disabled' : 'text-text-primary'
							}`}>
							{label}
						</span>
					)}
				</label>

				{helperText && (
					<span
						style={nokTailwindTheme.textStyles[helperStyleKey[size]]}
						className={`${hideHelperText ? 'sr-only' : ''} ${
							isDisabled
								? 'text-text-disabled'
								: isError
									? 'text-text-error'
									: 'text-text-secondary'
						}`}>
						{helperText}
					</span>
				)}
			</div>
		);
	},
);

Radio.displayName = 'Radio';
