import type { Meta, StoryObj } from '@storybook/react-vite';
import { CalendarPicker, CalendarPickerProps } from './calendar-picker.js';

interface CalendarPickerStoryProps extends CalendarPickerProps {
	theme?: 'light' | 'dark';
}

const CalendarPickerWithTheme = ({ theme = 'light', ...props }: CalendarPickerStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{ background: 'var(--nok-color-background-canvas)', padding: '2rem' }}>
		<CalendarPicker {...props} />
	</div>
);

const meta = {
	title: 'Components/Calendar/CalendarPicker',
	component: CalendarPickerWithTheme,
	tags: ['autodocs'],
	argTypes: {
		view: { control: 'select', options: ['month', 'year'] },
		showTabs: { control: 'boolean' },
		showFooter: { control: 'boolean' },
		rangeLabel: { control: 'text' },
		selected: { control: 'text' },
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		view: 'month',
		showTabs: true,
		showFooter: true,
		rangeLabel: '2007 – 2026',
		selected: 'Aug',
		theme: 'light',
	},
	render: (args) => <CalendarPickerWithTheme {...args} />,
} satisfies Meta<typeof CalendarPickerWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const YearView: Story = {
	args: { view: 'year', selected: 2026 },
};
