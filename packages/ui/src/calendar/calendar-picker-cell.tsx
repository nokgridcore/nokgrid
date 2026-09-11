'use client';

import { ButtonHTMLAttributes, CSSProperties, forwardRef } from 'react';

type CalendarPickerCellState = 'default' | 'hovered' | 'selected' | 'disabled';

export interface CalendarPickerCellProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
	/**
	 * Storybook/preview only: force a visual state. "default" is live — real
	 * hover/focus apply on their own.
	 */
	state?: CalendarPickerCellState;
	label?: string | number;
}

const labelStyle: CSSProperties = {
	textAlign: 'center',
	fontFamily: 'var(--nok-typography-font-family-body, Roboto)',
	fontSize: 'var(--nok-typography-font-size-13, 13px)',
	fontStyle: 'normal',
	fontWeight: 400,
	lineHeight: 'var(--nok-typography-line-height-19-5, 19.5px)',
};

export const CalendarPickerCell = forwardRef<HTMLButtonElement, CalendarPickerCellProps>(
	({ state = 'default', label, className, style, ...props }, ref) => {
		const isDisabled = state === 'disabled';
		const isForcedHover = state === 'hovered';
		const isSelected = state === 'selected';

		const classes = [
			'inline-flex items-center justify-center rounded-md transition-colors',
			!isDisabled && state === 'default' && 'hover:bg-background-overlay',
			// Not on the design system's focus-ring list, but still keyboard-
			// operable — a plain accessible ring, no preview boolean.
			'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nok-color-border-focus)]',
			isForcedHover && 'bg-background-overlay',
			isSelected && 'bg-action-primary-default',
			className,
		]
			.filter(Boolean)
			.join(' ');

		// Every cell is text-primary; only the selected one goes white. Disabled
		// carries the real disabled attribute but no colour change.
		const labelColor = isSelected ? '#FFF' : 'var(--nok-color-text-primary, #141414)';

		return (
			<button
				ref={ref}
				type='button'
				disabled={isDisabled}
				className={classes}
				style={{
					width: '56px',
					height: '32px',
					padding: '8px var(--nok-spacing-component-md, 12px)',
					...style,
				}}
				{...props}>
				<span style={{ ...labelStyle, color: labelColor }}>{label}</span>
			</button>
		);
	},
);

CalendarPickerCell.displayName = 'CalendarPickerCell';
