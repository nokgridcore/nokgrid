import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusDot, StatusDotProps } from './status-dot.js';

interface StatusDotStoryProps extends StatusDotProps {
	theme?: 'light' | 'dark';
}

const StatusDotWithTheme = ({ theme = 'light', ...props }: StatusDotStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<StatusDot {...props} />
	</div>
);

const meta = {
	title: 'Components/Data display/Status dot',
	component: StatusDotWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `The smallest possible status indicator.\n\n> Use only where a label would crowd the row and the colour's meaning is clear from elsewhere.` } } },
	argTypes: {
		color: {
			control: 'select',
			options: ['neutral', 'primary', 'success', 'warning', 'error', 'info'],
		},
		size: {
			control: 'select',
			options: ['small', 'medium'],
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		color: 'neutral',
		size: 'small',
		theme: 'light',
	},
} satisfies Meta<typeof StatusDotWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
