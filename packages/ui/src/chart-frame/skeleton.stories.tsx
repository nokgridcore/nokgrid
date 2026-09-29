import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton, SkeletonProps } from './skeleton.js';

interface SkeletonStoryProps extends SkeletonProps {
	theme?: 'light' | 'dark';
}

const SkeletonWithTheme = ({ theme = 'light', ...props }: SkeletonStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{ background: 'var(--nok-color-background-canvas)', padding: '2rem', width: '400px', height: '160px' }}>
		<Skeleton {...props} />
	</div>
);

const meta = {
	title: 'Components/Charts/Chart skeleton',
	component: SkeletonWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `The placeholder a chart loads into.\n\n> Match its type to the chart it stands in for.` } } },
	argTypes: {
		type: { control: 'select', options: ['bars', 'line', 'pie'] },
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		type: 'bars',
		theme: 'light',
	},
	render: (args) => <SkeletonWithTheme {...args} />,
} satisfies Meta<typeof SkeletonWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
