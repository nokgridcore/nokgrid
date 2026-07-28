import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input, InputProps } from './input.js';
import * as icons from '../icons/generated/index.js';

const iconNames = Object.keys(icons);

interface InputStoryProps extends InputProps {
	theme?: 'light' | 'dark';
}

const InputWithTheme = ({ theme = 'light', ...props }: InputStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-canvas)',
			width: '100%',
			padding: '2rem',
		}}>
		<Input {...props} />
	</div>
);

const meta = {
	title: 'Components/Input/Text',
	component: InputWithTheme,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'underline'],
		},
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
		},
		state: {
			control: 'select',
			options: ['default', 'hovered', 'focused', 'disabled', 'error', 'readonly'],
		},
		showBg: {
			control: 'boolean',
		},
		label: {
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
		leadingIcon: {
			control: 'select',
			options: [undefined, ...iconNames],
		},
		trailingIcon: {
			control: 'select',
			options: [undefined, ...iconNames],
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		variant: 'default',
		size: 'sm',
		state: 'default',
		label: 'Label',
		required: false,
		placeholder: 'Placeholder text',
		helperText: 'Helper text',
		theme: 'light',
	},
} satisfies Meta<typeof InputWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
