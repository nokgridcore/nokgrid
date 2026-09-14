import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartFrame, ChartFrameProps } from './chart-frame.js';

interface ChartFrameStoryProps extends ChartFrameProps {
	theme?: 'light' | 'dark';
}

const ChartFrameWithTheme = ({ theme = 'light', ...props }: ChartFrameStoryProps) => (
	<div data-theme={theme === 'dark' ? 'dark' : undefined} style={{ background: 'var(--nok-color-background-canvas)', padding: '2rem' }}>
		<ChartFrame {...props} />
	</div>
);

const meta = {
	title: 'Components/ChartFrame',
	component: ChartFrameWithTheme,
	tags: ['autodocs'],
	argTypes: {
		state: { control: 'select', options: ['default', 'loading', 'empty', 'error'] },
		density: { control: 'select', options: ['comfortable', 'compact'] },
		skeletonType: { control: 'select', options: ['bars', 'line', 'pie'] },
		title: { control: 'text' },
		subtitle: { control: 'text' },
		footnote: { control: 'text' },
		emptyText: { control: 'text' },
		errorText: { control: 'text' },
		retryText: { control: 'text' },
		showSubtitle: { control: 'boolean' },
		showActions: { control: 'boolean' },
		showFootnote: { control: 'boolean' },
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		state: 'default',
		density: 'comfortable',
		skeletonType: 'bars',
		title: 'Bookings over time',
		subtitle: 'Last 30 days',
		footnote: 'Updated 2 minutes ago',
		emptyText: 'No data for this range',
		errorText: "Couldn't load this chart",
		retryText: 'Try again',
		showSubtitle: true,
		showActions: false,
		showFootnote: false,
		theme: 'light',
	},
	render: (args) => <ChartFrameWithTheme {...args} />,
} satisfies Meta<typeof ChartFrameWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
