import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartLineSeries, ChartLineSeriesProps } from './chart-line-series.js';

interface ChartLineSeriesStoryProps extends ChartLineSeriesProps {
	theme?: 'light' | 'dark';
}

// The series fills whatever box it is given; this stands in for the design frame (640 by 186).
const ChartLineSeriesWithTheme = ({ theme = 'light', ...props }: ChartLineSeriesStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{ background: 'var(--nok-color-background-canvas)', padding: '2rem' }}>
		<div style={{ position: 'relative', width: '640px', height: '186px' }}>
			<ChartLineSeries {...props} />
		</div>
	</div>
);

const meta = {
	title: 'Components/Charts/Line chart/Series',
	component: ChartLineSeriesWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `One series in a line chart.\n\n> Show markers only on the point being read, not on all of them.` } } },
	argTypes: {
		color: { control: 'select', options: [1, 2, 3, 4, 5, 6, 7, 8] },
		curve: { control: 'select', options: ['linear', 'smooth'] },
		showAreaFill: { control: 'boolean' },
		showDots: { control: 'boolean' },
		activeIndex: { control: 'number' },
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		color: 1,
		curve: 'linear',
		showAreaFill: false,
		showDots: false,
		values: [90, 124, 76, 157, 111, 170, 136],
		max: 200,
		theme: 'light',
	},
	render: (args) => <ChartLineSeriesWithTheme {...args} />,
} satisfies Meta<typeof ChartLineSeriesWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
