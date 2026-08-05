import type { Meta, StoryObj } from '@storybook/react-vite';
import { Option, OptionProps } from './option.js';
import * as icons from '../icons/generated/index.js';

const iconNames = Object.keys(icons);

interface OptionStoryProps extends OptionProps {
	theme?: 'light' | 'dark';
}

const OptionWithTheme = ({ theme = 'light', ...props }: OptionStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<Option {...props} />
	</div>
);

const meta = {
	title: 'Components/Select/Option',
	component: OptionWithTheme,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['outlined', 'underlined'],
		},
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
		},
		leadingContent: {
			control: 'select',
			options: ['none', 'icon', 'checkbox'],
		},
		icon: {
			control: 'select',
			options: [undefined, ...iconNames],
		},
		state: {
			control: 'select',
			options: ['default', 'hovered', 'selected', 'disabled'],
		},
		label: {
			control: 'text',
		},
		showBadge: {
			control: 'boolean',
		},
		badgeVariant: {
			control: 'select',
			options: ['neutral', 'primary', 'success', 'warning', 'error', 'info'],
		},
		badgeLabel: {
			control: 'text',
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		variant: 'outlined',
		size: 'sm',
		leadingContent: 'none',
		state: 'default',
		label: 'Option label',
		showBadge: false,
		badgeVariant: 'neutral',
		badgeLabel: '1',
		theme: 'light',
	},
} satisfies Meta<typeof OptionWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
