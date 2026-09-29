import type { Meta, StoryObj } from '@storybook/react-vite';
import { TooltipRow, TooltipRowProps } from './tooltip-row.js';

interface TooltipRowStoryProps extends TooltipRowProps {
	theme?: 'light' | 'dark';
}

const TooltipRowWithTheme = ({ theme = 'light', ...props }: TooltipRowStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{ background: 'var(--nok-color-background-surface)', padding: '1rem' }}>
		<TooltipRow {...props} />
	</div>
);

const meta = {
	title: 'Components/Feedback & status/Tooltip/Row',
	component: TooltipRowWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `One label-and-value row inside a tooltip, for chart readouts.` } } },
	argTypes: {
		color: { control: 'select', options: [1, 2, 3, 4, 5, 6, 7, 8] },
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		color: 1,
		showSwatch: true,
		label: 'Series label',
		value: '42%',
		theme: 'light',
	},
} satisfies Meta<typeof TooltipRowWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllColors: Story = {
	render: () => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '8px',
				background: 'var(--nok-color-background-surface)',
				padding: '1rem',
			}}>
			{[1, 2, 3, 4, 5, 6, 7, 8].map((c) => (
				<TooltipRow key={c} color={c as TooltipRowProps['color']} label='Series label' value='42%' />
			))}
		</div>
	),
};
