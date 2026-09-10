'use client';

import { CSSProperties, HTMLAttributes, forwardRef, useMemo, useState } from 'react';
import { nokTailwindTheme } from '@nokgridcore/tokens/tailwind-theme';
import { Icon } from '../icons/Icon.js';
import { CalendarDay } from './calendar-day.js';
import { CalendarPicker } from './calendar-picker.js';

type CalendarSelection = 'single' | 'range';
type CalendarFirstDay = 'monday' | 'sunday';

export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
	selection?: CalendarSelection;
	firstDay?: CalendarFirstDay;
	/** Shows the chevron on the month label and makes it a button. */
	showMonthSelector?: boolean;
	onSelect?: (date: Date) => void;
	onRangeSelect?: (range: [Date, Date | null]) => void;
	onMonthSelectorClick?: () => void;
}

const MONTH_NAMES = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS_MON = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEKDAYS_SUN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const isSameDay = (a: Date, b: Date) =>
	a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// TODO: header + weekday typography not given. Header = label/md text/primary;
// weekday row = caption/sm text/tertiary, matching the mock's weight.
const monthLabelStyle: CSSProperties = {
	...nokTailwindTheme.textStyles['label-md'],
	color: 'var(--nok-color-text-primary, #141414)',
};
const weekdayStyle: CSSProperties = {
	...nokTailwindTheme.textStyles['caption-sm'],
	color: 'var(--nok-color-text-tertiary, #9E9E9E)',
	textAlign: 'center',
};

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
	(
		{
			selection = 'single',
			firstDay = 'monday',
			showMonthSelector = true,
			onSelect,
			onRangeSelect,
			onMonthSelectorClick,
			className,
			style,
			...props
		},
		ref,
	) => {
		const today = useMemo(() => startOfDay(new Date()), []);
		const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
		// Today is the default selection; range mode starts empty.
		const [selectedDate, setSelectedDate] = useState<Date | null>(today);
		const [rangeStart, setRangeStart] = useState<Date | null>(null);
		const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

		// The month label opens the month/year picker over the grid. Month and
		// year are held pending inside the picker and only applied on Done —
		// so you can pick a month, switch to the Year tab, pick a year, then Done.
		const [pickerOpen, setPickerOpen] = useState(false);
		const [pendingMonth, setPendingMonth] = useState(viewDate.getMonth());
		const [pendingYear, setPendingYear] = useState(viewDate.getFullYear());

		const openPicker = () => {
			setPendingMonth(viewDate.getMonth());
			setPendingYear(viewDate.getFullYear());
			setPickerOpen(true);
		};
		const closePicker = () => setPickerOpen(false);
		const handlePickerSelect = (value: string | number) => {
			if (typeof value === 'number') {
				setPendingYear(value);
			} else {
				const idx = MONTH_NAMES.findIndex((m) => m.slice(0, 3) === value);
				if (idx >= 0) setPendingMonth(idx);
			}
		};
		const applyPicker = () => {
			setViewDate(new Date(pendingYear, pendingMonth, 1));
			closePicker();
		};

		const weekdays = firstDay === 'monday' ? WEEKDAYS_MON : WEEKDAYS_SUN;

		const cells = useMemo(() => {
			const year = viewDate.getFullYear();
			const month = viewDate.getMonth();
			const firstWeekday = new Date(year, month, 1).getDay(); // 0 = Sunday
			const offset = firstDay === 'monday' ? (firstWeekday + 6) % 7 : firstWeekday;
			const gridStart = new Date(year, month, 1 - offset);
			return Array.from({ length: 42 }, (_, i) => {
				const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
				return { date, outside: date.getMonth() !== month };
			});
		}, [viewDate, firstDay]);

		const stepMonth = (delta: number) =>
			setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1));

		const handleDayClick = (date: Date) => {
			const day = startOfDay(date);
			if (selection === 'single') {
				setSelectedDate(day);
				onSelect?.(day);
				return;
			}
			if (!rangeStart || rangeEnd) {
				setRangeStart(day);
				setRangeEnd(null);
				onRangeSelect?.([day, null]);
			} else if (day < rangeStart) {
				setRangeStart(day);
				setRangeEnd(rangeStart);
				onRangeSelect?.([day, rangeStart]);
			} else {
				setRangeEnd(day);
				onRangeSelect?.([rangeStart, day]);
			}
		};

		const dayProps = (cell: { date: Date; outside: boolean }) => {
			if (cell.outside) return { state: 'outside-month' as const };

			if (selection === 'range' && rangeStart) {
				const isStart = isSameDay(cell.date, rangeStart);
				const isEnd = rangeEnd && isSameDay(cell.date, rangeEnd);
				const inMiddle = rangeEnd && cell.date > rangeStart && cell.date < rangeEnd;
				if (isStart) return { state: 'selected' as const, rangeStart: Boolean(rangeEnd) };
				if (isEnd) return { state: 'selected' as const, rangeEnd: true };
				if (inMiddle) return { state: 'range-middle' as const };
			}

			if (selection === 'single' && selectedDate && isSameDay(cell.date, selectedDate)) {
				return { state: 'selected' as const };
			}
			if (isSameDay(cell.date, today)) return { state: 'today' as const };
			return { state: 'default' as const };
		};

		return (
			<div
				ref={ref}
				className={['inline-flex flex-col items-start', className].filter(Boolean).join(' ')}
				style={{
					width: '256px',
					padding: 'var(--nok-spacing-component-lg, 16px)',
					gap: 'var(--nok-spacing-component-md, 12px)',
					borderRadius: 'var(--nok-spacing-radius-lg, 8px)',
					border: '1px solid var(--nok-color-border-default, #D9D9D9)',
					background: 'var(--nok-color-background-surface, #FFF)',
					...style,
				}}
				{...props}>
				{pickerOpen ?
					<CalendarPicker
						className='self-stretch'
						style={{ width: '100%', border: 'none', padding: 0, background: 'transparent' }}
						view='month'
						selected={[MONTH_NAMES[pendingMonth]!.slice(0, 3), pendingYear]}
						rangeLabel={String(pendingYear - 10)}
						onSelect={handlePickerSelect}
						onDone={applyPicker}
						onClear={closePicker}
					/>
				:	<>
						<div className='flex items-center justify-between self-stretch'>
							{showMonthSelector ?
								<button
									type='button'
									onClick={() => {
										openPicker();
										onMonthSelectorClick?.();
									}}
									className='inline-flex items-center rounded-sm transition-colors hover:bg-background-overlay focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nok-color-border-focus)]'
									style={{ gap: 'var(--nok-spacing-component-xs, 4px)' }}>
									<span style={monthLabelStyle}>
										{MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
									</span>
									<Icon name='ChevronDown' size='sm' color='default' />
								</button>
							:	<span style={monthLabelStyle}>
									{MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
								</span>
							}
							<div className='flex items-center' style={{ gap: 'var(--nok-spacing-component-xs, 4px)' }}>
								<button
									type='button'
									aria-label='Previous month'
									onClick={() => stepMonth(-1)}
									className='inline-flex items-center justify-center rounded-sm text-icon-default transition-colors hover:bg-background-overlay focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nok-color-border-focus)]'
									style={{ width: '28px', height: '28px' }}>
									<Icon name='ChevronLeft' size='sm' color='default' />
								</button>
								<button
									type='button'
									aria-label='Next month'
									onClick={() => stepMonth(1)}
									className='inline-flex items-center justify-center rounded-sm text-icon-default transition-colors hover:bg-background-overlay focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nok-color-border-focus)]'
									style={{ width: '28px', height: '28px' }}>
									<Icon name='ChevronRight' size='sm' color='default' />
								</button>
							</div>
						</div>

						<div className='self-stretch' style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
							{weekdays.map((w) => (
								<span key={w} style={weekdayStyle}>
									{w}
								</span>
							))}
						</div>

						<div
							className='self-stretch'
							style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', placeItems: 'center' }}>
							{cells.map((cell) => (
								<CalendarDay
									key={cell.date.toISOString()}
									label={cell.date.getDate()}
									onClick={() => handleDayClick(cell.date)}
									{...dayProps(cell)}
								/>
							))}
						</div>
					</>
				}
			</div>
		);
	},
);

Calendar.displayName = 'Calendar';
