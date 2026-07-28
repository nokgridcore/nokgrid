import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, ButtonProps } from './button.js';
import * as icons from '../icons/generated/index.js';

const iconNames = Object.keys(icons);

interface ButtonStoryProps extends ButtonProps {
	theme?: 'light' | 'dark';
}

const ButtonWithTheme = ({ theme = 'light', ...props }: ButtonStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<Button {...props} />
	</div>
);

const meta = {
	title: 'Components/Button',
	component: ButtonWithTheme,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['primary', 'secondary', 'tertiary', 'destructive'],
		},
		size: {
			control: 'select',
			options: ['xs', 'sm', 'md', 'lg'],
		},
		state: {
			control: 'select',
			options: ['default', 'hovered', 'pressed', 'disabled'],
		},
		icon: {
			control: 'select',
			options: [undefined, ...iconNames],
		},
		iconPosition: {
			control: 'select',
			options: ['left', 'right', 'only'],
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
		children: {
			name: 'Label',
			control: 'text',
		},
	},
	args: {
		variant: 'primary',
		size: 'md',
		state: 'default',
		iconPosition: 'left',
		theme: 'light',
		children: 'Button',
	},
} satisfies Meta<typeof ButtonWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
