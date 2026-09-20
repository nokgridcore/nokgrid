import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartLine, ChartLineProps } from './chart-line.js';

interface ChartLineStoryProps extends ChartLineProps {
	theme?: 'light' | 'dark';
}

const CATEGORIES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

const SERIES = [
	{ label: 'Series label', color: 1 as const, values: [90, 124, 76, 157, 111, 170, 136] },
	{ label: 'Series label', color: 2 as const, values: [60, 80, 95, 70, 120, 100, 140] },
];

const ChartLineWithTheme = ({ theme = 'light', ...props }: ChartLineStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{ background: 'var(--nok-color-background-canvas)', padding: '2rem', width: '720px' }}>
		<ChartLine {...props} />
	</div>
);

const meta = {
	title: 'Components/Charts/Line chart/Line chart',
	component: ChartLineWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `Shows a trend over time.\n\n> For comparing discrete categories, use a bar chart.` } } },
	argTypes: {
		grid: { control: 'select', options: ['horizontal', 'both'] },
		curve: { control: 'select', options: ['linear', 'smooth'] },
		showAreaFill: { control: 'boolean' },
		showDots: { control: 'boolean' },
		showAxis: { control: 'boolean' },
		showYAxis: { control: 'boolean' },
		showLegend: { control: 'boolean' },
		showTargetLine: { control: 'boolean' },
		targetValue: { control: 'number' },
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		categories: CATEGORIES,
		series: SERIES,
		grid: 'horizontal',
		curve: 'linear',
		showAreaFill: false,
		showDots: false,
		showAxis: true,
		showYAxis: true,
		showLegend: true,
		showTargetLine: false,
		targetValue: 150,
		theme: 'light',
	},
	render: (args) => <ChartLineWithTheme {...args} />,
} satisfies Meta<typeof ChartLineWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SmoothWithArea: Story = {
	args: { curve: 'smooth', showAreaFill: true, series: SERIES.slice(0, 1) },
};
