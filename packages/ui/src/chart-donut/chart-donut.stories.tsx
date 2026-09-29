import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartDonut, ChartDonutProps } from './chart-donut.js';

interface ChartDonutStoryProps extends ChartDonutProps {
	theme?: 'light' | 'dark';
}

const SLICES = [
	{ label: 'Series label', color: 1 as const, value: 34 },
	{ label: 'Series label', color: 2 as const, value: 26 },
	{ label: 'Series label', color: 3 as const, value: 20 },
	{ label: 'Series label', color: 4 as const, value: 12 },
	{ label: 'Series label', color: 5 as const, value: 8 },
];

const ChartDonutWithTheme = ({ theme = 'light', ...props }: ChartDonutStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{ background: 'var(--nok-color-background-surface)', padding: '2rem', display: 'inline-block' }}>
		<ChartDonut {...props} />
	</div>
);

const meta = {
	title: 'Components/Charts/Donut chart/Donut chart',
	component: ChartDonutWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `Shows share of a whole.\n\n> If the parts don't add up to a whole, use a bar chart.` } } },
	argTypes: {
		type: { control: 'select', options: ['donut', 'pie'] },
		showCentreValue: { control: 'boolean' },
		centreValue: { control: 'text' },
		showCentreLabel: { control: 'boolean' },
		centreLabel: { control: 'text' },
		showLegend: { control: 'boolean' },
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		type: 'donut',
		slices: SLICES,
		showCentreValue: true,
		centreValue: '68%',
		showCentreLabel: true,
		centreLabel: 'of target',
		showLegend: true,
		theme: 'light',
	},
	render: (args) => <ChartDonutWithTheme {...args} />,
} satisfies Meta<typeof ChartDonutWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Pie: Story = {
	args: { type: 'pie' },
};
