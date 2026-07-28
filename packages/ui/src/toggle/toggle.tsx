'use client';

import { forwardRef, InputHTMLAttributes, useId } from 'react';
import { nokTailwindTheme } from '@nokgridcore/tokens/tailwind-theme';

type ToggleSize = 'sm' | 'md';
type ToggleState =
	| 'off'
	| 'off-hover'
	| 'on'
	| 'on-hover'
	| 'off-disabled'
	| 'on-disabled';
type LabelPosition = 'leading' | 'trailing';

export interface ToggleProps extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'size' | 'disabled' | 'type' | 'checked'
> {
	size?: ToggleSize;
	state?: ToggleState;
	label?: string;
	labelPosition?: LabelPosition;
	hideLabel?: boolean;
}

const trackDimensions: Record<
	ToggleSize,
	{ width: string; height: string; padding: string }
> = {
	sm: { width: '28px', height: 'var(--nok-size-icon-sm)', padding: '2px' },
	md: { width: '36px', height: 'var(--nok-size-icon-md)', padding: '2px' },
};

const thumbSizeClasses: Record<ToggleSize, string> = {
	sm: 'w-icon-xs h-icon-xs',
	md: 'w-icon-sm h-icon-sm',
};

// track width - (padding * 2) - thumb width, i.e. how far the thumb slides.
const thumbTravel: Record<ToggleSize, string> = {
	sm: '12px',
	md: '16px',
};

const labelStyleKey: Record<ToggleSize, string> = {
	sm: 'body-sm',
	md: 'body-md',
};

const trackBgClass: Record<ToggleState, string> = {
	off: 'bg-background-overlay',
	'off-hover': 'bg-background-sunken',
	on: 'bg-action-primary-default',
	'on-hover': 'bg-action-primary-hover',
	'off-disabled': 'bg-background-overlay',
	'on-disabled': 'bg-action-primary-disabled',
};

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
	(
		{
			size = 'sm',
			state = 'off',
			label,
			labelPosition = 'trailing',
			hideLabel = false,
			id,
			className,
			style,
			...props
		},
		ref,
	) => {
		const generatedId = useId();
		const toggleId = id ?? generatedId;
		const isOn = state === 'on' || state === 'on-hover' || state === 'on-disabled';
		const isDisabled = state === 'off-disabled' || state === 'on-disabled';

		const trackClasses = [
			'flex items-center shrink-0 rounded-full transition-colors duration-200 ease-in-out',
			isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
			!isDisabled &&
				(isOn ? 'hover:bg-action-primary-hover' : 'hover:bg-background-sunken'),
			trackBgClass[state],
			className,
		]
			.filter(Boolean)
			.join(' ');

		const trackStyle = {
			width: trackDimensions[size].width,
			height: trackDimensions[size].height,
			padding: trackDimensions[size].padding,
			...style,
		};

		const thumbClasses = [
			'rounded-full bg-white shrink-0 shadow-sm transition-transform duration-200 ease-in-out',
			thumbSizeClasses[size],
		].join(' ');

		const thumbStyle = {
			transform: isOn ? `translateX(${thumbTravel[size]})` : 'translateX(0)',
		};

		const labelElement = label && (
			<span
				style={nokTailwindTheme.textStyles[labelStyleKey[size]]}
				className={`${hideLabel ? 'sr-only' : ''} ${
					isDisabled ? 'text-text-disabled' : 'text-text-primary'
				}`}>
				{label}
			</span>
		);

		return (
			<label
				htmlFor={toggleId}
				className={`inline-flex items-center gap-component-xs ${
					isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
				}`}>
				{labelPosition === 'leading' && labelElement}
				<span className={trackClasses} style={trackStyle}>
					<input
						ref={ref}
						type='checkbox'
						role='switch'
						id={toggleId}
						checked={isOn}
						disabled={isDisabled}
						className='sr-only'
						{...props}
					/>
					<span className={thumbClasses} style={thumbStyle} />
				</span>
				{labelPosition === 'trailing' && labelElement}
			</label>
		);
	},
);

Toggle.displayName = 'Toggle';
