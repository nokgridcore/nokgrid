import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextArea, TextAreaProps } from './textarea.js';

interface TextAreaStoryProps extends TextAreaProps {
	theme?: 'light' | 'dark';
}

const TextAreaWithTheme = ({ theme = 'light', ...props }: TextAreaStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<TextArea {...props} />
	</div>
);

const meta = {
	title: 'Components/Input/TextArea',
	component: TextAreaWithTheme,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'underline'],
		},
		state: {
			control: 'select',
			options: ['default', 'hovered', 'focused', 'disabled', 'error', 'readonly'],
		},
		showBg: {
			control: 'boolean',
		},
		leadingLabel: {
			control: 'text',
		},
		trailingLabel: {
			control: 'text',
		},
		required: {
			control: 'boolean',
		},
		placeholder: {
			control: 'text',
		},
		helperText: {
			control: 'text',
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		variant: 'default',
		state: 'default',
		leadingLabel: 'Label',
		trailingLabel: '120/200',
		required: false,
		placeholder: 'Placeholder text',
		helperText: 'Helper text',
		theme: 'light',
	},
} satisfies Meta<typeof TextAreaWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
