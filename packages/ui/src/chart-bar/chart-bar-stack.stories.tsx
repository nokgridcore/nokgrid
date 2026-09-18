import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartBarStack, ChartBarStackProps } from './chart-bar-stack.js';
import { ChartBarSegment } from './chart-bar-segment.js';

interface ChartBarStackStoryProps extends ChartBarStackProps {
	theme?: 'light' | 'dark';
}

// The stack (and its segments) have no fixed thickness of their own anymore —
// they fill whatever box they're given, so this wrapper stands in for that
// (40px, matching the old default) for a standalone demo.
const ChartBarStackWithTheme = ({ theme = 'light', ...props }: ChartBarStackStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{ background: 'var(--nok-color-background-canvas)', padding: '2rem', height: '200px', width: '40px', display: 'flex' }}>
		<ChartBarStack {...props}>
			<ChartBarSegment orientation={props.orientation} color={1} showLabel={false} style={{ flexGrow: 2 }} />
			<ChartBarSegment orientation={props.orientation} color={4} showLabel={false} style={{ flexGrow: 1 }} />
			<ChartBarSegment orientation={props.orientation} color={8} showLabel={false} style={{ flexGrow: 3 }} />
		</ChartBarStack>
	</div>
);

const meta = {
	title: 'Components/ChartBar/ChartBarStack',
	component: ChartBarStackWithTheme,
	tags: ['autodocs'],
	argTypes: {
		orientation: { control: 'select', options: ['vertical', 'horizontal'] },
		label: { control: 'text' },
		showLabel: { control: 'boolean' },
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		orientation: 'vertical',
		label: 'Mon',
		showLabel: true,
		theme: 'light',
	},
	render: (args) => <ChartBarStackWithTheme {...args} />,
} satisfies Meta<typeof ChartBarStackWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
