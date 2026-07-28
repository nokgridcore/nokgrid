'use client';

import { forwardRef, InputHTMLAttributes, useEffect, useId, useRef } from 'react';
import { nokTailwindTheme } from '@nokgridcore/tokens/tailwind-theme';
import { Icon } from '../icons/Icon.js';

type CheckboxSize = 'sm' | 'md';
type CheckboxState = 'default' | 'hovered' | 'disabled' | 'error';

export interface CheckboxProps extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'size' | 'disabled' | 'type' | 'required'
> {
	label?: string;
	helperText?: string;
	size?: CheckboxSize;
	state?: CheckboxState;
	indeterminate?: boolean;
}

const boxSizeClasses: Record<CheckboxSize, string> = {
	sm: 'w-4 h-4',
	md: 'w-5 h-5',
};

const iconSizeForCheckboxSize: Record<CheckboxSize, 'xs' | 'sm'> = {
	sm: 'xs',
	md: 'sm',
};

const labelStyleKey: Record<CheckboxSize, string> = {
	sm: 'body-sm',
	md: 'body-md',
};

const helperStyleKey: Record<CheckboxSize, string> = {
	sm: 'caption-sm',
	md: 'caption-md',
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
	(
		{
			label,
			helperText,
			size = 'sm',
			state = 'default',
			indeterminate = false,
			checked,
			id,
			className,
			style,
			...props
		},
		ref,
	) => {
		const generatedId = useId();
		const checkboxId = id ?? generatedId;
		const internalRef = useRef<HTMLInputElement>(null);
		const isDisabled = state === 'disabled';
		const isError = state === 'error';
		const isChecked = Boolean(checked);

		useEffect(() => {
			if (internalRef.current) {
				internalRef.current.indeterminate = indeterminate;
			}
		}, [indeterminate]);

		const setRefs = (node: HTMLInputElement | null) => {
			internalRef.current = node;
			if (typeof ref === 'function') ref(node);
			else if (ref)
				(ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
		};

		const isFilled = isChecked || indeterminate;

		const boxClasses = [
			'flex items-center justify-center rounded-xs border transition-colors shrink-0',
			boxSizeClasses[size],
			isDisabled
				? isFilled
					? 'bg-action-primary-disabled border-action-primary-disabled'
					: 'bg-transparent border-border-default'
				: isError
					? 'border-border-error bg-transparent'
					: isFilled
						? 'bg-action-primary-default border-action-primary-default hover:bg-action-primary-hover'
						: 'border-border-default bg-transparent hover:border-border-strong',
			className,
		]
			.filter(Boolean)
			.join(' ');

		const forcedStyle =
			state === 'hovered'
				? isFilled
					? { backgroundColor: 'var(--nok-color-action-primary-hover)', ...style }
					: { borderColor: 'var(--nok-color-border-strong)', ...style }
				: style;

		return (
			<div className='inline-flex flex-col gap-1'>
				<label
					htmlFor={checkboxId}
					className={`inline-flex items-center gap-component-xs ${
						isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
					}`}>
					<div className={boxClasses} style={forcedStyle}>
						<input
							ref={setRefs}
							type='checkbox'
							id={checkboxId}
							checked={isChecked}
							disabled={isDisabled}
							className='sr-only'
							{...props}
						/>
						<Icon
							name={indeterminate ? 'Minus' : 'Check'}
							size={iconSizeForCheckboxSize[size]}
							color='white'
							className={`transition-all duration-200 ease-in-out ${
								isFilled && !isError ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
							}`}
						/>
					</div>
					{label && (
						<span
							style={nokTailwindTheme.textStyles[labelStyleKey[size]]}
							className={isDisabled ? 'text-text-disabled' : 'text-text-primary'}>
							{label}
						</span>
					)}
				</label>

				{helperText && (
					<span
						style={nokTailwindTheme.textStyles[helperStyleKey[size]]}
						className={
							isDisabled
								? 'text-text-disabled'
								: isError
									? 'text-text-error'
									: 'text-text-secondary'
						}>
						{helperText}
					</span>
				)}
			</div>
		);
	},
);

Checkbox.displayName = 'Checkbox';
