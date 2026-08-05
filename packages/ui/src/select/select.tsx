'use client';

import {
	ButtonHTMLAttributes,
	Children,
	cloneElement,
	forwardRef,
	isValidElement,
	MouseEvent as ReactMouseEvent,
	ReactElement,
	ReactNode,
	useEffect,
	useId,
	useRef,
	useState,
} from 'react';
import { nokTailwindTheme } from '@nokgridcore/tokens/tailwind-theme';
import { Icon, IconName, IconSize } from '../icons/Icon.js';
import { OptionProps } from '../option/option.js';

type SelectSize = 'sm' | 'md' | 'lg';
type SelectVariant = 'outlined' | 'underlined';
type SelectState = 'default' | 'focused' | 'active';
type SelectBelowSlot = 'none' | 'helperText' | 'error';

export interface SelectProps extends Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	'disabled'
> {
	label?: string;
	showLabel?: boolean;
	required?: boolean;
	size?: SelectSize;
	variant?: SelectVariant;
	/** Storybook preview state — "active" previews the open-dropdown look */
	state?: SelectState;
	belowSlot?: SelectBelowSlot;
	helperText?: string;
	errorText?: string;
	placeholder?: string;
	showPlaceholder?: boolean;
	icon?: IconName;
	disabled?: boolean;
	defaultSelectedIndex?: number;
	selectedIndex?: number;
	onSelectedIndexChange?: (index: number) => void;
	children?: ReactNode;
}

const fieldSizeClasses: Record<SelectSize, string> = {
	sm: 'h-control-sm px-layout-sm gap-component-sm',
	md: 'h-control-md px-layout-md gap-component-sm',
	lg: 'h-control-lg px-layout-lg gap-component-sm',
};

const iconSizeForSelectSize: Record<SelectSize, IconSize> = {
	sm: 'sm',
	md: 'md',
	lg: 'lg',
};

const labelStyleKey: Record<SelectSize, string> = {
	sm: 'label-sm',
	md: 'label-md',
	lg: 'label-lg',
};

// No caption-lg exists — falls back to caption-md (largest available).
const helperStyleKey: Record<SelectSize, string> = {
	sm: 'caption-sm',
	md: 'caption-md',
	lg: 'caption-md',
};

// underlined: no radius, no side padding/gap — options sit edge-to-edge so
// each option's own left border (when selected) lands flush against the
// menu's own left border, with just the option's own height/padding.
const menuAppearanceClasses: Record<SelectVariant, string> = {
	outlined: 'rounded-md gap-0.5 p-1',
	underlined: 'rounded-none gap-0 p-0',
};

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
	(
		{
			label,
			showLabel = true,
			required,
			size = 'sm',
			variant = 'outlined',
			state = 'default',
			belowSlot = 'none',
			helperText,
			errorText,
			placeholder,
			showPlaceholder = true,
			icon,
			disabled = false,
			defaultSelectedIndex,
			selectedIndex: controlledSelectedIndex,
			onSelectedIndexChange,
			children,
			id,
			className,
			style,
			onClick,
			...props
		},
		ref,
	) => {
		const generatedId = useId();
		const selectId = id ?? generatedId;
		const isError = belowSlot === 'error';
		const isUnderline = variant === 'underlined';
		const [isOpen, setIsOpen] = useState(state === 'active');
		const [internalSelectedIndex, setInternalSelectedIndex] = useState(defaultSelectedIndex);
		const selectedIndex = controlledSelectedIndex ?? internalSelectedIndex;
		// "active"/open previews the field open, same visual weight as focused.
		const isEmphasized = state === 'focused' || state === 'active' || isOpen;

		const containerRef = useRef<HTMLDivElement>(null);

		useEffect(() => {
			if (!isOpen) return;

			const handleOutsideClick = (event: MouseEvent) => {
				if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
					setIsOpen(false);
				}
			};

			document.addEventListener('mousedown', handleOutsideClick);
			return () => document.removeEventListener('mousedown', handleOutsideClick);
		}, [isOpen]);

		const childrenArray = Children.toArray(children) as ReactElement<OptionProps>[];
		const selectedOption =
			selectedIndex !== undefined ? childrenArray[selectedIndex] : undefined;
		const selectedLabel = selectedOption?.props.label;

		const handleTriggerClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
			if (!disabled) setIsOpen((previous) => !previous);
			onClick?.(event);
		};

		const borderClasses = isUnderline
			? isError || isEmphasized
				? 'border-b-2 rounded-none'
				: 'border-b rounded-none'
			: isError || isEmphasized
				? 'border-2 rounded-md'
				: 'border rounded-md';

		const borderColorClass = isError ? 'border-border-error' : 'border-border-default';

		const backgroundClass = disabled
			? 'bg-background-overlay cursor-not-allowed'
			: isUnderline
				? 'bg-transparent'
				: 'bg-background-surface';

		const fieldClasses = [
			'flex items-center justify-between w-full flex-shrink-0 transition-[background-color,border-color,border-width] duration-200 ease-in-out',
			!disabled &&
				[
					'hover:border-border-strong',
					isUnderline ? 'focus:border-b-2' : 'focus:border-2',
					'focus:border-border-strong',
					'focus:outline-none',
					'cursor-pointer',
				].join(' '),
			fieldSizeClasses[size],
			borderClasses,
			borderColorClass,
			backgroundClass,
			className,
		]
			.filter(Boolean)
			.join(' ');

		const forcedStyle = isEmphasized
			? {
					borderColor: 'var(--nok-color-border-strong)',
					...(isUnderline ? { borderBottomWidth: '2px' } : { borderWidth: '2px' }),
					...style,
				}
			: style;

		const iconColor = disabled ? 'disabled' : isError ? 'secondary' : 'default';

		return (
			<div ref={containerRef} className='inline-flex flex-col gap-1 w-full'>
				{label && (
					<label
						htmlFor={selectId}
						style={nokTailwindTheme.textStyles[labelStyleKey[size]]}
						className={`${!showLabel ? 'sr-only' : ''} ${
							disabled ? 'text-text-disabled' : 'text-text-primary'
						}`}>
						{label}
						{required && (
							<span className={disabled ? 'text-text-disabled' : 'text-text-error'}>
								{' '}
								*
							</span>
						)}
					</label>
				)}

				<div className='relative w-full'>
					<button
						ref={ref}
						type='button'
						id={selectId}
						disabled={disabled}
						aria-invalid={isError || undefined}
						aria-expanded={isOpen}
						aria-haspopup='listbox'
						className={fieldClasses}
						style={forcedStyle}
						onClick={handleTriggerClick}
						{...props}>
						<span className='inline-flex items-center gap-component-sm overflow-hidden'>
							{icon && <Icon name={icon} size={iconSizeForSelectSize[size]} color={iconColor} />}
							{selectedLabel ? (
								<span
									className='text-left'
									style={{
										overflow: 'hidden',
										color: disabled ? 'var(--nok-color-text-disabled)' : 'var(--nok-color-text-primary)',
										fontSize: 'var(--nok-typography-font-size-14)',
										fontStyle: 'normal',
										fontWeight: 400,
									}}>
									{selectedLabel}
								</span>
							) : (
								showPlaceholder &&
								placeholder && (
									<span
										className='text-left'
										style={{
											overflow: 'hidden',
											color: 'var(--nok-color-text-tertiary)',
											fontSize: 'var(--nok-typography-font-size-14)',
											fontStyle: 'normal',
											fontWeight: 400,
										}}>
										{placeholder}
									</span>
								)
							)}
						</span>
						<Icon
							name='ChevronsUpDown'
							size={iconSizeForSelectSize[size]}
							color={iconColor}
							className='shrink-0'
						/>
					</button>

					<div
						role='listbox'
						className={`absolute left-0 right-0 top-full z-10 mt-1 flex origin-top flex-col border border-border-default bg-background-surface shadow-md transition-[opacity,transform] duration-200 ease-in-out ${menuAppearanceClasses[variant]} ${
							isOpen
								? 'pointer-events-auto scale-100 opacity-100'
								: 'pointer-events-none scale-95 opacity-0'
						}`}>
						{Children.map(children, (child, index) => {
							if (!isValidElement<OptionProps>(child)) return child;

							const isChildDisabled = child.props.state === 'disabled';

							return cloneElement(child, {
								variant,
								state: isChildDisabled
									? 'disabled'
									: index === selectedIndex
										? 'selected'
										: 'default',
								onClick: (event: ReactMouseEvent<HTMLDivElement>) => {
									child.props.onClick?.(event);
									if (isChildDisabled) return;
									setInternalSelectedIndex(index);
									onSelectedIndexChange?.(index);
									setIsOpen(false);
								},
							});
						})}
					</div>
				</div>

				{belowSlot === 'helperText' && helperText && (
					<span
						style={nokTailwindTheme.textStyles[helperStyleKey[size]]}
						className='text-text-primary'>
						{helperText}
					</span>
				)}

				{belowSlot === 'error' && errorText && (
					<span
						style={nokTailwindTheme.textStyles[helperStyleKey[size]]}
						className='text-text-error'>
						{errorText}
					</span>
				)}
			</div>
		);
	},
);

Select.displayName = 'Select';
