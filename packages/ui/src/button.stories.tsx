import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button.js';

const meta = {
	title: 'Components/Button',
	component: Button,
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
		children: {
			control: 'text',
		},
	},
	args: {
		variant: 'primary',
		size: 'md',
		state: 'default',
		children: 'Button',
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
