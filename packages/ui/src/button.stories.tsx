import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button.js';
import * as icons from './icons/generated/index.js';

const iconNames = Object.keys(icons);

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
		icon: {
			control: 'select',
			options: [undefined, ...iconNames],
		},
		iconPosition: {
			control: 'select',
			options: ['left', 'right', 'only'],
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
		children: 'Button',
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
