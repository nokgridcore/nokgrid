import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip, TooltipProps } from './tooltip.js';
import { TooltipRow } from './tooltip-row.js';

interface TooltipStoryProps extends TooltipProps {
	theme?: 'light' | 'dark';
}

const TooltipWithTheme = ({ theme = 'light', ...props }: TooltipStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{ background: 'var(--nok-color-background-canvas)', padding: '3rem' }}>
		<Tooltip {...props} />
	</div>
);

const meta = {
	title: 'Components/Feedback & status/Tooltip/Tooltip',
	component: TooltipWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `A short label shown on hover or focus that explains a control.\n\n> Never put anything interactive inside. Use popover instead.` } } },
	argTypes: {
		placement: { control: 'select', options: ['top', 'left', 'bottom', 'right'] },
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		placement: 'top',
		showArrow: true,
		title: 'Tooltip title',
		showTitle: true,
		theme: 'light',
	},
	render: (args) => (
		<TooltipWithTheme {...args}>
			<TooltipRow color={1} label='Series label' value='42%' />
		</TooltipWithTheme>
	),
} satisfies Meta<typeof TooltipWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
