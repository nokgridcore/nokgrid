import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartSpark, ChartSparkProps } from './chart-spark.js';

interface ChartSparkStoryProps extends ChartSparkProps {
	theme?: 'light' | 'dark';
}

const ChartSparkWithTheme = ({ theme = 'light', ...props }: ChartSparkStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{ background: 'var(--nok-color-background-surface)', padding: '2rem', display: 'inline-block' }}>
		<ChartSpark {...props} />
	</div>
);

const meta = {
	title: 'Components/Charts/Sparkline',
	component: ChartSparkWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `A trend at a glance, with no axes or labels.\n\n> Pairs with KPI value delta.` } } },
	argTypes: {
		trend: { control: 'select', options: ['up', 'down', 'flat'] },
		size: { control: 'select', options: ['sm', 'md'] },
		curve: { control: 'select', options: ['linear', 'smooth'] },
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: { trend: 'up', size: 'sm', curve: 'linear', theme: 'light' },
	render: (args) => <ChartSparkWithTheme {...args} />,
} satisfies Meta<typeof ChartSparkWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
