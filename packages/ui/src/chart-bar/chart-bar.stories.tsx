import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartBar, ChartBarProps } from './chart-bar.js';

interface ChartBarStoryProps extends ChartBarProps {
	theme?: 'light' | 'dark';
}

const CATEGORIES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

const STACKED_SERIES = [
	{ label: 'Series label', color: 1 as const, values: [55, 80, 40, 95, 65, 90, 55] },
	{ label: 'Series label', color: 2 as const, values: [35, 45, 25, 60, 40, 50, 30] },
	{ label: 'Series label', color: 3 as const, values: [20, 30, 15, 35, 25, 30, 15] },
];

// ChartBar fills its container by default (no baked-in size) — this wrapper
// stands in for wherever it'll actually live (e.g. a ChartFrame's plot area).
const ChartBarWithTheme = ({ theme = 'light', ...props }: ChartBarStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{ background: 'var(--nok-color-background-canvas)', padding: '2rem', height: '400px', display: 'flex' }}>
		<ChartBar {...props} />
	</div>
);

const meta = {
	title: 'Components/ChartBar/ChartBar',
	component: ChartBarWithTheme,
	tags: ['autodocs'],
	argTypes: {
		orientation: { control: 'select', options: ['vertical', 'horizontal'] },
		layout: { control: 'select', options: ['single', 'stacked'] },
		showGridLines: { control: 'boolean' },
		showAxis: { control: 'boolean' },
		showYAxis: { control: 'boolean' },
		showLegend: { control: 'boolean' },
		showTargetLine: { control: 'boolean' },
		targetValue: { control: 'number' },
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		orientation: 'vertical',
		layout: 'single',
		categories: CATEGORIES,
		// Multi-series by default so toggling `layout` in Controls actually
		// shows a difference — `single` only ever renders series[0], `stacked`
		// sums all of them. A single-series story would look identical either way.
		series: STACKED_SERIES,
		showGridLines: true,
		showAxis: true,
		showYAxis: true,
		showLegend: true,
		showTargetLine: true,
		targetValue: 150,
		theme: 'light',
	},
	render: (args) => <ChartBarWithTheme {...args} />,
} satisfies Meta<typeof ChartBarWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const VerticalStacked: Story = {
	args: { orientation: 'vertical', layout: 'stacked', series: STACKED_SERIES },
};

export const HorizontalSingle: Story = {
	args: {
		orientation: 'horizontal',
		layout: 'single',
		categories: ['Equities', 'Bonds', 'Cash', 'Property', 'Other'],
		series: [{ label: 'Series label', color: 1 as const, values: [95, 60, 130, 35, 70] }],
	},
};

export const HorizontalStacked: Story = {
	args: {
		orientation: 'horizontal',
		layout: 'stacked',
		categories: ['Equities', 'Bonds', 'Cash', 'Property', 'Other'],
		series: [
			{ label: 'Series label', color: 1 as const, values: [55, 30, 60, 15, 35] },
			{ label: 'Series label', color: 2 as const, values: [25, 15, 40, 10, 20] },
			{ label: 'Series label', color: 3 as const, values: [15, 10, 30, 8, 15] },
		],
	},
};
