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
	title: 'Components/Data display/Badge/Count',
	component: BadgeCountWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `A number pinned to an icon, for unread or pending counts.\n\n> Use only where the count is actionable.` } } },
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
