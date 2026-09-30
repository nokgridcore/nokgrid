'use client';

import { forwardRef, InputHTMLAttributes, useId } from 'react';
import { nokTailwindTheme } from '@nokgridcore/tokens/tailwind-theme';
import { Icon, IconSize } from '../icons/Icon.js';

type SearchInputSize = 'sm' | 'md' | 'lg';
type SearchInputVariant = 'default' | 'underline';
type SearchInputState = 'default' | 'hovered' | 'focused' | 'disabled';

export interface SearchInputProps extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'size' | 'disabled'
> {
	size?: SearchInputSize;
	variant?: SearchInputVariant;
	/** Defaults to true for "underline" variant, false otherwise */
	showBg?: boolean;
	/** Storybook preview + real functional disabled state */
	state?: SearchInputState;
	showClear?: boolean;
	onClear?: () => void;
}

const fieldSizeClasses: Record<SearchInputSize, string> = {
	sm: 'h-control-sm px-layout-sm gap-component-sm',
	md: 'h-control-md px-layout-md gap-component-sm',
	lg: 'h-control-lg px-layout-lg gap-component-sm',
};

// search icon: sm for small, md for medium and large
const searchIconSizeForInputSize: Record<SearchInputSize, IconSize> = {
	sm: 'sm',
	md: 'md',
	lg: 'md',
};

const bodyStyleKey: Record<SearchInputSize, keyof typeof nokTailwindTheme.textStyles> = {
	sm: 'body-sm',
	md: 'body-md',
	lg: 'body-lg',
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
	(
		{
			size = 'sm',
			variant = 'default',
			showBg,
			state = 'default',
			showClear = false,
			onClear,
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
		const resolvedShowBg = showBg ?? variant === 'underline';
		const isUnderline = variant === 'underline';

		const borderClasses = isUnderline ? 'border-b rounded-none' : 'border rounded-md';

		const backgroundClass = isDisabled
			? 'bg-background-overlay cursor-not-allowed'
			: isUnderline
				? resolvedShowBg
					? 'bg-background-canvas'
					: 'bg-transparent'
				: resolvedShowBg
					? 'bg-background-overlay'
					: 'bg-background-surface';

		const fieldClasses = [
			'flex items-center flex-shrink-0 self-stretch transition-[background-color,border-color,border-width] duration-200 ease-in-out',
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
			'border-border-default',
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

		// Field icons sit on icon/secondary so they match the placeholder
		// exactly — the design system's own field-icon fix.
		const iconColor = isDisabled ? 'disabled' : 'secondary';

		return (
			<div className={fieldClasses} style={forcedStyle}>
				<Icon name='Search' size={searchIconSizeForInputSize[size]} color={iconColor} />
				<input
					ref={ref}
					id={inputId}
					type='text'
					disabled={isDisabled}
					style={{
						...nokTailwindTheme.textStyles[bodyStyleKey[size]],
						flex: 1,
						minWidth: 0,
						background: 'transparent',
						border: 'none',
						outline: 'none',
					}}
					className={
						isDisabled ?
							'text-text-disabled placeholder:text-text-disabled'
							// text-secondary, not -tertiary — matches the design system's
							// own contrast fix (tertiary placeholder text failed 4.5:1).
						:	'text-text-primary placeholder:text-text-secondary'
					}
					{...props}
				/>
				{showClear && (
					<button
						type='button'
						onClick={onClear}
						disabled={isDisabled}
						aria-label='Clear search'
						className='inline-flex shrink-0 disabled:cursor-not-allowed'>
						<Icon name='X' size={searchIconSizeForInputSize[size]} color={iconColor} />
					</button>
				)}
			</div>
		);
	},
);

SearchInput.displayName = 'SearchInput';
