import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartBarSegment, ChartBarSegmentProps } from './chart-bar-segment.js';

interface ChartBarSegmentStoryProps extends ChartBarSegmentProps {
	theme?: 'light' | 'dark';
}

const ChartBarSegmentWithTheme = ({ theme = 'light', ...props }: ChartBarSegmentStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{ background: 'var(--nok-color-background-canvas)', padding: '2rem', height: '200px', display: 'flex' }}>
		<ChartBarSegment {...props} />
	</div>
);

const meta = {
	title: 'Components/ChartBarSegment',
	component: ChartBarSegmentWithTheme,
	tags: ['autodocs'],
	argTypes: {
		orientation: { control: 'select', options: ['vertical', 'horizontal'] },
		state: { control: 'select', options: ['default', 'focused', 'unfocused'] },
		color: { control: 'select', options: [1, 2, 3, 4, 5, 6, 7, 8] },
		label: { control: 'text' },
		showLabel: { control: 'boolean' },
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		orientation: 'vertical',
		state: 'default',
		color: 1,
		label: 'Mon',
		showLabel: true,
		theme: 'light',
	},
	render: (args) => <ChartBarSegmentWithTheme {...args} />,
} satisfies Meta<typeof ChartBarSegmentWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
