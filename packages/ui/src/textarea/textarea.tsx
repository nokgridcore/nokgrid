'use client';

import { forwardRef, TextareaHTMLAttributes, useId } from 'react';
import { nokTailwindTheme } from '@nokgridcore/tokens/tailwind-theme';

type TextAreaVariant = 'default' | 'underline';
type TextAreaState =
	| 'default'
	| 'hovered'
	| 'focused'
	| 'disabled'
	| 'error'
	| 'readonly';

export interface TextAreaProps extends Omit<
	TextareaHTMLAttributes<HTMLTextAreaElement>,
	'disabled' | 'readOnly'
> {
	leadingLabel?: string;
	trailingLabel?: string;
	required?: boolean;
	helperText?: string;
	variant?: TextAreaVariant;
	/** Defaults to true for "underline" variant, false otherwise */
	showBg?: boolean;
	/** Storybook preview + real functional states (error/disabled/readonly) */
	state?: TextAreaState;
}

// Fixed height — not yet tokenized by Manny (no dedicated TextArea size
// tokens exist). Flag: does TextArea need sm/md/lg sizes like Input?
const FIXED_HEIGHT = '84px';

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
	(
		{
			leadingLabel,
			trailingLabel,
			required,
			helperText,
			variant = 'default',
			showBg,
			state = 'default',
			id,
			className,
			style,
			...props
		},
		ref,
	) => {
		const generatedId = useId();
		const fieldId = id ?? generatedId;
		const isDisabled = state === 'disabled';
		const isReadOnly = state === 'readonly';
		const isError = state === 'error';
		const resolvedShowBg = showBg ?? variant === 'underline';

		const borderClasses =
			variant === 'underline' ? 'border-b-2 rounded-none' : 'border rounded-md';

		const borderColorClass = isError
			? 'border-border-error'
			: 'border-border-default';

		const backgroundClass =
			isDisabled || isReadOnly
				? 'bg-background-sunken cursor-not-allowed'
				: variant === 'underline' && isError
					? 'bg-background-error'
					: resolvedShowBg
						? 'bg-background-overlay'
						: variant === 'underline'
							? 'bg-transparent'
							: 'bg-background-surface';

		const fieldClasses = [
			'flex px-layout-sm py-component-xs transition-colors w-full',
			isReadOnly || isDisabled
				? 'hover:bg-background-overlay'
				: 'hover:bg-background-overlay focus-within:border-border-focus focus-within:outline-none',
			borderClasses,
			borderColorClass,
			backgroundClass,
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

		const leadingLabelColor = isDisabled
			? 'text-text-disabled'
			: 'text-text-primary';
		const trailingLabelColor = isDisabled
			? 'text-text-disabled'
			: 'text-text-secondary';

		return (
			<div className='flex flex-col gap-1 w-full'>
				{(leadingLabel || trailingLabel) && (
					<div className='flex items-center justify-between w-full'>
						{leadingLabel && (
							<label
								htmlFor={fieldId}
								style={nokTailwindTheme.textStyles['label-lg']}
								className={leadingLabelColor}>
								{leadingLabel}
								{required && (
									<span
										className={
											isDisabled ? 'text-text-disabled' : 'text-text-error'
										}>
										{' '}
										*
									</span>
								)}
							</label>
						)}
						{trailingLabel && (
							<span
								style={nokTailwindTheme.textStyles['label-lg']}
								className={`${trailingLabelColor} text-right`}>
								{trailingLabel}
							</span>
						)}
					</div>
				)}

				<div className={fieldClasses} style={forcedStyle}>
					<textarea
						ref={ref}
						id={fieldId}
						disabled={isDisabled}
						readOnly={isReadOnly}
						aria-invalid={isError || undefined}
						style={{
							...nokTailwindTheme.textStyles['body-sm'],
							height: FIXED_HEIGHT,
							width: '100%',
							resize: 'none',
							background: 'transparent',
							border: 'none',
							outline: 'none',
						}}
						className={
							(isDisabled || isReadOnly
								? 'text-text-disabled'
								: 'text-text-primary') + ' placeholder:text-text-tertiary'
						}
						{...props}
					/>
				</div>

				{helperText && (
					<span
						style={nokTailwindTheme.textStyles['caption-sm']}
						className={
							isDisabled
								? 'text-text-disabled'
								: isError
									? 'text-text-error'
									: 'text-text-primary'
						}>
						{helperText}
					</span>
				)}
			</div>
		);
	},
);

TextArea.displayName = 'TextArea';
