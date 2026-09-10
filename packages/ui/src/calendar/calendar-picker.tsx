'use client';

import { CSSProperties, HTMLAttributes, forwardRef, useEffect, useState } from 'react';
import { nokTailwindTheme } from '@nokgridcore/tokens/tailwind-theme';
import { Button } from '../button/button.js';
import { Icon } from '../icons/Icon.js';
import { Tab } from '../tab/tab.js';
import { TabGroup } from '../tab/tab-group.js';
import { CalendarPickerCell } from './calendar-picker-cell.js';

type CalendarPickerView = 'month' | 'year';

const YEARS_PER_PAGE = 20;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Omit the native `onSelect` (a text-selection event) — it collides with the
// value-selection callback below.
export interface CalendarPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
	/** Which grid shows. Also seeds the active tab; tabs switch it live. */
	view?: CalendarPickerView;
	showTabs?: boolean;
	showFooter?: boolean;
	/** Header text, e.g. "2007 – 2026". Its first year seeds the range; the
	 * arrows step it 20 years at a time and the label follows. */
	rangeLabel?: string;
	/**
	 * Not in the original prop list — added so the grid can show a selection
	 * (the mock has one). A month name ("Aug"), a year ("2026"), or an array
	 * of both so a month and a year can be marked at once (used when Calendar
	 * drives the picker). Clicking a cell updates it.
	 */
	selected?: string | number | (string | number)[];
	onSelect?: (value: string | number) => void;
	onPrev?: () => void;
	onNext?: () => void;
	onClear?: () => void;
	onDone?: () => void;
}

// TODO: header typography not given — label/md + text/primary, matching the
// mock's weight.
const rangeLabelStyle: CSSProperties = {
	...nokTailwindTheme.textStyles['label-md'],
	color: 'var(--nok-color-text-primary, #141414)',
};

export const CalendarPicker = forwardRef<HTMLDivElement, CalendarPickerProps>(
	(
		{
			view = 'month',
			showTabs = true,
			showFooter = true,
			rangeLabel = '2007 – 2026',
			selected,
			onSelect,
			onPrev,
			onNext,
			onClear,
			onDone,
			className,
			style,
			...props
		},
		ref,
	) => {
		const [currentView, setCurrentView] = useState<CalendarPickerView>(view);
		useEffect(() => setCurrentView(view), [view]);

		const [rangeStart, setRangeStart] = useState(() => Number((rangeLabel.match(/\d{4}/) ?? ['2007'])[0]));
		useEffect(() => setRangeStart(Number((rangeLabel.match(/\d{4}/) ?? ['2007'])[0])), [rangeLabel]);

		const [selectedValue, setSelectedValue] = useState<CalendarPickerProps['selected']>(selected);
		useEffect(() => setSelectedValue(selected), [selected]);

		const selectedList =
			Array.isArray(selectedValue) ? selectedValue
			: selectedValue != null ? [selectedValue]
			: [];
		const isCellSelected = (c: string | number) => selectedList.some((s) => String(s) === String(c));

		const displayLabel = `${rangeStart} – ${rangeStart + YEARS_PER_PAGE - 1}`;

		const step = (delta: number) => {
			setRangeStart((s) => s + delta * YEARS_PER_PAGE);
			(delta < 0 ? onPrev : onNext)?.();
		};

		const handleSelect = (value: string | number) => {
			setSelectedValue(value);
			onSelect?.(value);
		};

		const cells: (string | number)[] =
			currentView === 'month' ? MONTHS : Array.from({ length: YEARS_PER_PAGE }, (_, i) => rangeStart + i);

		const handleClear = () => {
			setSelectedValue(undefined);
			onClear?.();
		};

		const navButton = (dir: 'prev' | 'next') => (
			<button
				type='button'
				aria-label={dir === 'prev' ? 'Previous' : 'Next'}
				onClick={() => step(dir === 'prev' ? -1 : 1)}
				className='inline-flex items-center justify-center rounded-sm text-icon-default transition-colors hover:bg-background-overlay focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nok-color-border-focus)]'
				style={{ width: '28px', height: '28px' }}>
				<Icon name={dir === 'prev' ? 'ChevronLeft' : 'ChevronRight'} size='sm' color='default' />
			</button>
		);

		return (
			<div
				ref={ref}
				className={['inline-flex flex-col items-start', className].filter(Boolean).join(' ')}
				style={{
					width: '280px',
					padding: 'var(--nok-spacing-component-lg, 16px)',
					gap: 'var(--nok-spacing-component-md, 12px)',
					borderRadius: 'var(--nok-spacing-radius-lg, 8px)',
					border: '1px solid var(--nok-color-border-default, #D9D9D9)',
					background: 'var(--nok-color-background-surface, #FFF)',
					...style,
				}}
				{...props}>
				<div className='flex items-center justify-between self-stretch'>
					<span style={rangeLabelStyle}>{displayLabel}</span>
					<div className='flex items-center' style={{ gap: 'var(--nok-spacing-component-xs, 4px)' }}>
						{navButton('prev')}
						{navButton('next')}
					</div>
				</div>

				{showTabs && (
					<TabGroup
						appearance='border'
						width='fixed'
						className='self-stretch'
						activeIndex={currentView === 'month' ? 0 : 1}
						onActiveIndexChange={(i) => setCurrentView(i === 0 ? 'month' : 'year')}>
						<Tab label='Month' />
						<Tab label='Year' />
					</TabGroup>
				)}

				<div
					className='self-stretch'
					style={{
						display: 'grid',
						// Fixed 56px cells, free space spread between them — fits a
						// 280px picker and a narrower embedded one (e.g. inside Calendar).
						gridTemplateColumns: 'repeat(4, 56px)',
						justifyContent: 'space-between',
						rowGap: 'var(--nok-spacing-component-sm, 8px)',
					}}>
					{cells.map((c) => (
						<CalendarPickerCell
							key={c}
							label={c}
							state={isCellSelected(c) ? 'selected' : 'default'}
							onClick={() => handleSelect(c)}
						/>
					))}
				</div>

				{showFooter && (
					<>
						<div className='self-stretch' style={{ height: '1px', background: 'var(--nok-color-border-default, #D9D9D9)' }} />
						<div className='flex items-center justify-between self-stretch'>
							<Button variant='tertiary' size='sm' style={{ border: 'none', background: 'transparent' }} onClick={handleClear}>
								Clear
							</Button>
							<Button variant='primary' size='sm' onClick={onDone}>
								Done
							</Button>
						</div>
					</>
				)}
			</div>
		);
	},
);

CalendarPicker.displayName = 'CalendarPicker';
