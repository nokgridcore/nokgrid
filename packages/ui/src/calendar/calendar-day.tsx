'use client';

import { ButtonHTMLAttributes, CSSProperties, forwardRef } from 'react';

type CalendarDayState =
	| 'default'
	| 'hovered'
	| 'selected'
	| 'today'
	| 'disabled'
	| 'outside-month'
	| 'range-middle';

export interface CalendarDayProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
	/**
	 * Storybook/preview only: force a visual state. "default" is live — real
	 * hover/focus apply on their own.
	 */
	state?: CalendarDayState;
	label?: string | number;
	/** Endpoint of a selected range — pairs with state="selected". */
	rangeStart?: boolean;
	/** Endpoint of a selected range — pairs with state="selected". */
	rangeEnd?: boolean;
	/** Storybook/preview only: forces the focus ring on without real focus. */
	showFocusRing?: boolean;
}

const labelStyle: CSSProperties = {
	textAlign: 'center',
	fontFamily: 'var(--nok-typography-font-family-body, Roboto)',
	fontSize: 'var(--nok-typography-font-size-13, 13px)',
	fontStyle: 'normal',
	fontWeight: 400,
	lineHeight: 'var(--nok-typography-line-height-19-5, 19.5px)',
};

const labelColorForState: Record<CalendarDayState, string> = {
	default: 'var(--nok-color-text-primary, #141414)',
	hovered: 'var(--nok-color-text-primary, #141414)',
	selected: '#FFF',
	today: 'var(--nok-color-text-primary, #141414)',
	disabled: 'var(--nok-color-text-disabled, #BFBFBF)',
	'outside-month': 'var(--nok-color-text-tertiary, #9E9E9E)',
	'range-middle': 'var(--nok-color-text-brand, #F05D23)',
};

export const CalendarDay = forwardRef<HTMLButtonElement, CalendarDayProps>(
	(
		{ state = 'default', label, rangeStart = false, rangeEnd = false, showFocusRing = false, className, style, ...props },
		ref,
	) => {
		// A range endpoint is a selected day by definition — setting rangeStart
		// or rangeEnd gives you the filled circle + white label without also
		// having to pass state="selected".
		const isEndpoint = rangeStart || rangeEnd;
		const isDisabled = state === 'disabled';
		const isForcedHover = state === 'hovered';
		const isSelected = state === 'selected' || isEndpoint;
		const isRangeMiddle = state === 'range-middle';
		const isToday = state === 'today';

		// A selected endpoint keeps the range band behind its circle as a
		// D-shape: a semicircle on the outer edge, flat where it meets the
		// range-middle days, so the band stays one continuous strip.
		const RANGE_RADIUS = 'var(--nok-spacing-radius-full, 9999px)';
		const showRangeBand = isEndpoint;
		const rangeBandStyle: CSSProperties | undefined = showRangeBand
			? {
					position: 'absolute',
					inset: 0,
					background: 'var(--nok-color-background-brand-subtle, #FFF3ED)',
					borderRadius:
						rangeStart && rangeEnd ? RANGE_RADIUS
						: rangeStart ? `${RANGE_RADIUS} 0 0 ${RANGE_RADIUS}`
						: `0 ${RANGE_RADIUS} ${RANGE_RADIUS} 0`,
				}
			: undefined;

		const buttonClasses = [
			'relative inline-flex items-center justify-center flex-shrink-0 rounded-full transition-colors',
			!isDisabled && state === 'default' && 'hover:bg-background-overlay',
			'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nok-color-border-focus)]',
			showFocusRing && 'outline outline-2 outline-offset-2 outline-[var(--nok-color-border-focus)]',
			className,
		]
			.filter(Boolean)
			.join(' ');

		// Fill layer — a circle for hover/selected/today, a full square for
		// range-middle so adjacent days form one continuous band.
		const fillClasses = [
			'absolute inset-0',
			isRangeMiddle ? '' : 'rounded-full',
			isForcedHover ? 'bg-background-overlay' : '',
			isSelected ? 'bg-action-primary-default' : '',
			isRangeMiddle ? 'bg-background-brand-subtle' : '',
			isToday ? 'border border-border-focus' : '',
		]
			.filter(Boolean)
			.join(' ');

		const hasFill = isForcedHover || isSelected || isRangeMiddle || isToday;

		return (
			<button
				ref={ref}
				type='button'
				disabled={isDisabled}
				className={buttonClasses}
				style={{
					width: 'var(--nok-size-control-sm, 32px)',
					height: 'var(--nok-size-control-sm, 32px)',
					...style,
				}}
				{...props}>
				{showRangeBand && <span aria-hidden='true' style={rangeBandStyle} />}
				{hasFill && <span aria-hidden='true' className={fillClasses} />}
				<span
					className='relative'
					style={{ ...labelStyle, color: isSelected ? '#FFF' : labelColorForState[state] }}>
					{label}
				</span>
			</button>
		);
	},
);

CalendarDay.displayName = 'CalendarDay';
