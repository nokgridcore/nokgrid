import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider, DividerProps } from './divider.js';

interface DividerStoryProps extends DividerProps {
	theme?: 'light' | 'dark';
}

const DividerWithTheme = ({ theme = 'light', ...props }: DividerStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			padding: '2rem',
		}}>
		<Divider {...props} />
	</div>
);

const meta = {
	title: 'Components/Data display/Divider',
	component: DividerWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `A rule separating content.\n\n> Try spacing first. Use a divider when proximity alone isn't enough.` } } },
	argTypes: {
		orientation: {
			control: 'select',
			options: ['horizontal', 'vertical'],
		},
		showLabel: {
			control: 'boolean',
		},
		label: {
			control: 'text',
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		orientation: 'horizontal',
		showLabel: false,
		label: 'OR',
		theme: 'light',
	},
} satisfies Meta<typeof DividerWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
