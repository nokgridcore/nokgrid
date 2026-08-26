import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressStepped, ProgressSteppedProps } from './progress-stepped.js';

interface ProgressSteppedStoryProps extends ProgressSteppedProps {
	theme?: 'light' | 'dark';
}

const ProgressSteppedWithTheme = ({ theme = 'light', ...props }: ProgressSteppedStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<ProgressStepped {...props} />
	</div>
);

const meta = {
	title: 'Components/Progress/ProgressStepped',
	component: ProgressSteppedWithTheme,
	tags: ['autodocs'],
	argTypes: {
		shape: {
			control: 'select',
			options: ['linear', 'circular'],
		},
		size: {
			control: 'select',
			options: ['sm', 'md'],
		},
		color: {
			control: 'select',
			options: ['primary', 'success', 'error', 'info'],
		},
		totalSteps: {
			control: { type: 'number', min: 1 },
		},
		currentStep: {
			control: { type: 'number', min: 1 },
		},
		showLabel: {
			control: 'boolean',
		},
		label: {
			control: 'text',
		},
		showPercentage: {
			control: 'boolean',
		},
		value: {
			control: { type: 'number', min: 0, max: 100 },
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
		shape: 'linear',
		size: 'sm',
		color: 'primary',
		totalSteps: 5,
		currentStep: 2,
		showLabel: false,
		label: 'Label',
		showPercentage: false,
		value: 40,
		showMetadata: false,
		metadata: 'Metadata',
		theme: 'light',
	},
} satisfies Meta<typeof ProgressSteppedWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
