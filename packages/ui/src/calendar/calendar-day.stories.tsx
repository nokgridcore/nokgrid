import type { Meta, StoryObj } from '@storybook/react-vite';
import { CalendarDay, CalendarDayProps } from './calendar-day.js';

interface CalendarDayStoryProps extends CalendarDayProps {
	theme?: 'light' | 'dark';
}

const CalendarDayWithTheme = ({ theme = 'light', ...props }: CalendarDayStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{ background: 'var(--nok-color-background-canvas)', padding: '2rem' }}>
		<CalendarDay {...props} />
	</div>
);

const meta = {
	title: 'Components/Calendar/CalendarDay',
	component: CalendarDayWithTheme,
	tags: ['autodocs'],
	argTypes: {
		state: {
			control: 'select',
			options: ['default', 'hovered', 'selected', 'today', 'disabled', 'outside-month', 'range-middle'],
		},
		rangeStart: { control: 'boolean' },
		rangeEnd: { control: 'boolean' },
		showFocusRing: { control: 'boolean' },
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		state: 'default',
		label: 14,
		rangeStart: false,
		rangeEnd: false,
		showFocusRing: false,
		theme: 'light',
	},
	render: (args) => <CalendarDayWithTheme {...args} />,
} satisfies Meta<typeof CalendarDayWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllStates: Story = {
	render: (args) => (
		<div
			data-theme={args.theme === 'dark' ? 'dark' : undefined}
			style={{ background: 'var(--nok-color-background-canvas)', padding: '2rem', display: 'flex', gap: '8px' }}>
			{(['default', 'hovered', 'selected', 'today', 'disabled', 'outside-month', 'range-middle'] as const).map((s, i) => (
				<CalendarDay key={s} state={s} label={i + 1} />
			))}
		</div>
	),
};

export const Range: Story = {
	render: (args) => (
		<div
			data-theme={args.theme === 'dark' ? 'dark' : undefined}
			style={{ background: 'var(--nok-color-background-canvas)', padding: '2rem', display: 'flex' }}>
			<CalendarDay state='selected' rangeStart label={10} />
			<CalendarDay state='range-middle' label={11} />
			<CalendarDay state='range-middle' label={12} />
			<CalendarDay state='selected' rangeEnd label={13} />
		</div>
	),
};
