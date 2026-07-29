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
	hideLabel?: boolean;
	required?: boolean;
	helperText?: string;
	hideHelperText?: boolean;
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
			hideLabel = false,
			required,
			helperText,
			hideHelperText = false,
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
			'flex p-component-sm transition-[background-color,border-color,border-width] duration-200 ease-in-out w-full',
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

		const leadingLabelColor = isDisabled
			? 'text-text-disabled'
			: 'text-text-primary';
		const trailingLabelColor = isDisabled
			? 'text-text-disabled'
			: 'text-text-secondary';

		return (
			<div className='flex flex-col gap-1 w-full'>
				{(leadingLabel || trailingLabel) && (
					<div
						className={`flex items-center justify-between w-full ${
							hideLabel ? 'sr-only' : ''
						}`}>
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
							isDisabled || isReadOnly
								? 'text-text-disabled placeholder:text-text-disabled'
								: 'text-text-primary placeholder:text-text-tertiary'
						}
						{...props}
					/>
				</div>

				{helperText && (
					<span
						style={nokTailwindTheme.textStyles['caption-sm']}
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

TextArea.displayName = 'TextArea';
