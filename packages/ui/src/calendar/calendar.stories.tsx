import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar, CalendarProps } from './calendar.js';

interface CalendarStoryProps extends CalendarProps {
	theme?: 'light' | 'dark';
}

const CalendarWithTheme = ({ theme = 'light', ...props }: CalendarStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{ background: 'var(--nok-color-background-canvas)', padding: '2rem' }}>
		<Calendar {...props} />
	</div>
);

const meta = {
	title: 'Components/Calendar/Calendar',
	component: CalendarWithTheme,
	tags: ['autodocs'],
	argTypes: {
		selection: { control: 'select', options: ['single', 'range'] },
		firstDay: { control: 'select', options: ['monday', 'sunday'] },
		showMonthSelector: { control: 'boolean' },
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		selection: 'single',
		firstDay: 'monday',
		showMonthSelector: true,
		theme: 'light',
	},
	render: (args) => <CalendarWithTheme {...args} />,
} satisfies Meta<typeof CalendarWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Range: Story = {
	args: { selection: 'range' },
};

export const SundayStart: Story = {
	args: { firstDay: 'sunday' },
};
