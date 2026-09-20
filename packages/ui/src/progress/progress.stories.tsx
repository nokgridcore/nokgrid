import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress, ProgressProps } from './progress.js';

interface ProgressStoryProps extends ProgressProps {
	theme?: 'light' | 'dark';
}

const ProgressWithTheme = ({ theme = 'light', ...props }: ProgressStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<Progress {...props} />
	</div>
);

const meta = {
	title: 'Components/Data display/Progress/Progress',
	component: ProgressWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `Progress through a known quantity.\n\n> For discrete named steps, use stepped progress.` } } },
	argTypes: {
		type: {
			control: 'select',
			options: ['linear', 'circular'],
		},
		state: {
			control: 'select',
			options: ['determinate', 'indeterminate'],
		},
		color: {
			control: 'select',
			options: ['primary', 'success', 'error', 'info'],
		},
		size: {
			control: 'select',
			options: ['sm', 'md'],
		},
		showPercentage: {
			control: 'boolean',
		},
		value: {
			control: { type: 'number', min: 0, max: 100 },
		},
		showLabel: {
			control: 'boolean',
		},
		label: {
			control: 'text',
		},
		showMetadata: {
			control: 'boolean',
		},
		metadata: {
			control: 'text',
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		type: 'linear',
		state: 'determinate',
		color: 'primary',
		size: 'sm',
		showPercentage: false,
		value: 40,
		showLabel: false,
		label: 'Label',
		showMetadata: false,
		metadata: 'Metadata',
		theme: 'light',
	},
} satisfies Meta<typeof ProgressWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
