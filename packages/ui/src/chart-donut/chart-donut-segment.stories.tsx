import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartDonutSegment, ChartDonutSegmentProps } from './chart-donut-segment.js';

interface ChartDonutSegmentStoryProps extends ChartDonutSegmentProps {
	theme?: 'light' | 'dark';
}

// The segment fills whatever box it's given — this stands in for the donut's 200px box.
const ChartDonutSegmentWithTheme = ({ theme = 'light', ...props }: ChartDonutSegmentStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{ background: 'var(--nok-color-background-surface)', padding: '2rem' }}>
		<div style={{ position: 'relative', width: '200px', height: '200px' }}>
			<ChartDonutSegment {...props} />
		</div>
	</div>
);

const meta = {
	title: 'Components/ChartDonut/ChartDonutSegment',
	component: ChartDonutSegmentWithTheme,
	tags: ['autodocs'],
	argTypes: {
		state: { control: 'select', options: ['default', 'focused', 'unfocused'] },
		color: { control: 'select', options: [1, 2, 3, 4, 5, 6, 7, 8] },
		startAngle: { control: { type: 'range', min: 0, max: 360, step: 1 } },
		endAngle: { control: { type: 'range', min: 0, max: 360, step: 1 } },
		innerRadius: { control: { type: 'range', min: 0, max: 100, step: 1 } },
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		state: 'default',
		color: 1,
		startAngle: 0,
		endAngle: 90,
		innerRadius: 60,
		theme: 'light',
	},
	render: (args) => <ChartDonutSegmentWithTheme {...args} />,
} satisfies Meta<typeof ChartDonutSegmentWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
