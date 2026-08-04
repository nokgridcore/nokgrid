import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, BadgeProps } from './badge.js';
import * as icons from '../icons/generated/index.js';

const iconNames = Object.keys(icons);

interface BadgeStoryProps extends BadgeProps {
	theme?: 'light' | 'dark';
}

const BadgeWithTheme = ({ theme = 'light', ...props }: BadgeStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<Badge {...props} />
	</div>
);

const meta = {
	title: 'Components/Badge/Badge',
	component: BadgeWithTheme,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['neutral', 'primary', 'success', 'warning', 'error', 'info'],
		},
		appearance: {
			control: 'select',
			options: ['filled', 'tinted'],
		},
		size: {
			control: 'select',
			options: ['small', 'medium'],
		},
		label: {
			control: 'text',
		},
		dot: {
			control: 'boolean',
		},
		fullyRounded: {
			control: 'boolean',
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
		variant: 'neutral',
		appearance: 'filled',
		size: 'small',
		label: 'Label',
		dot: false,
		fullyRounded: false,
		theme: 'light',
	},
} satisfies Meta<typeof BadgeWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
