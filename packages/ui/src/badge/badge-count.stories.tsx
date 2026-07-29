import type { Meta, StoryObj } from '@storybook/react-vite';
import { BadgeCount, BadgeCountProps } from './badge-count.js';

interface BadgeCountStoryProps extends BadgeCountProps {
	theme?: 'light' | 'dark';
}

const BadgeCountWithTheme = ({ theme = 'light', ...props }: BadgeCountStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<BadgeCount {...props} />
	</div>
);

const meta = {
	title: 'Components/Badge/Count',
	component: BadgeCountWithTheme,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['neutral', 'primary', 'success', 'warning', 'error', 'info'],
		},
		size: {
			control: 'select',
			options: ['small', 'medium'],
		},
		count: {
			control: 'number',
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		variant: 'neutral',
		size: 'small',
		count: 1,
		theme: 'light',
	},
} satisfies Meta<typeof BadgeCountWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
