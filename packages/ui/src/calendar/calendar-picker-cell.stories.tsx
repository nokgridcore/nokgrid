import type { Meta, StoryObj } from '@storybook/react-vite';
import { CalendarPickerCell, CalendarPickerCellProps } from './calendar-picker-cell.js';

interface CalendarPickerCellStoryProps extends CalendarPickerCellProps {
	theme?: 'light' | 'dark';
}

const CalendarPickerCellWithTheme = ({ theme = 'light', ...props }: CalendarPickerCellStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{ background: 'var(--nok-color-background-canvas)', padding: '2rem' }}>
		<CalendarPickerCell {...props} />
	</div>
);

const meta = {
	title: 'Components/Input & control/Calendar/Picker cell',
	component: CalendarPickerCellWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `One month or year option inside the picker.` } } },
	argTypes: {
		state: { control: 'select', options: ['default', 'hovered', 'selected', 'disabled'] },
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		state: 'default',
		label: 'Jan',
		theme: 'light',
	},
	render: (args) => <CalendarPickerCellWithTheme {...args} />,
} satisfies Meta<typeof CalendarPickerCellWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllStates: Story = {
	render: (args) => (
		<div
			data-theme={args.theme === 'dark' ? 'dark' : undefined}
			style={{ background: 'var(--nok-color-background-canvas)', padding: '2rem', display: 'flex', gap: '4px' }}>
			<CalendarPickerCell state='default' label='Jan' />
			<CalendarPickerCell state='hovered' label='Feb' />
			<CalendarPickerCell state='selected' label='Mar' />
			<CalendarPickerCell state='disabled' label='Apr' />
		</div>
	),
};

export const YearGrid: Story = {
	render: (args) => (
		<div
			data-theme={args.theme === 'dark' ? 'dark' : undefined}
			style={{
				background: 'var(--nok-color-background-canvas)',
				padding: '2rem',
				display: 'grid',
				gridTemplateColumns: 'repeat(4, 56px)',
				gap: '4px',
			}}>
			{Array.from({ length: 12 }, (_, i) => 2019 + i).map((y) => (
				<CalendarPickerCell key={y} state={y === 2025 ? 'selected' : 'default'} label={y} />
			))}
		</div>
	),
};
