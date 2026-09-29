import type { Meta, StoryObj } from '@storybook/react-vite';
import { Segment, SegmentProps } from './segment.js';

interface SegmentStoryProps extends SegmentProps {
	theme?: 'light' | 'dark';
}

const SegmentWithTheme = ({ theme = 'light', ...props }: SegmentStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<Segment {...props} />
	</div>
);

const meta = {
	title: 'Components/Data display/Progress/Segment',
	component: SegmentWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `One filled segment inside progress.` } } },
	argTypes: {
		state: {
			control: 'select',
			options: ['upcoming', 'active', 'completed'],
		},
		color: {
			control: 'select',
			options: ['primary', 'success', 'error', 'info'],
		},
		size: {
			control: 'select',
			options: ['sm', 'md'],
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		state: 'upcoming',
		color: 'primary',
		size: 'sm',
		theme: 'light',
	},
} satisfies Meta<typeof SegmentWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
