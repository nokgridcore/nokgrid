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
	title: 'Components/Divider',
	component: DividerWithTheme,
	tags: ['autodocs'],
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
