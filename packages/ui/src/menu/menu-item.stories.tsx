import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { MenuItem, MenuItemProps } from './menu-item.js';
import * as icons from '../icons/generated/index.js';

const iconNames = Object.keys(icons);

interface MenuItemStoryProps extends MenuItemProps {
	theme?: 'light' | 'dark';
}

const MenuItemWithTheme = ({ theme = 'light', ...props }: MenuItemStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			maxWidth: '280px',
			padding: '2rem',
		}}>
		<MenuItem {...props} />
	</div>
);

const meta = {
	title: 'Components/Menu/MenuItem',
	component: MenuItemWithTheme,
	tags: ['autodocs'],
	argTypes: {
		state: {
			control: 'select',
			options: ['default', 'hovered', 'focused', 'active', 'disabled'],
		},
		size: {
			control: 'select',
			options: ['sm', 'md'],
		},
		showLeadingIcon: {
			control: 'boolean',
		},
		icon: {
			control: 'select',
			options: [undefined, ...iconNames],
		},
		showTrailingIcon: {
			control: 'boolean',
		},
		trailingIcon: {
			control: 'select',
			options: [undefined, ...iconNames],
		},
		showLabel: {
			control: 'boolean',
		},
		label: {
			control: 'text',
		},
		showTrailingLabel: {
			control: 'boolean',
		},
		trailingLabel: {
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
		showCheckbox: {
			control: 'boolean',
		},
		checked: {
			control: 'boolean',
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		state: 'default',
		size: 'sm',
		showLeadingIcon: false,
		icon: undefined,
		showTrailingIcon: false,
		trailingIcon: undefined,
		showLabel: true,
		label: 'Menu item',
		showTrailingLabel: false,
		trailingLabel: '⌘K',
		showBadge: false,
		badgeVariant: 'neutral',
		badgeLabel: '1',
		showCheckbox: false,
		checked: false,
		theme: 'light',
	},
	render: (args) => {
		const [, updateArgs] = useArgs();
		return (
			<MenuItemWithTheme
				{...args}
				onClick={() => {
					if (args.state === 'disabled') return;
					updateArgs({ state: args.state === 'active' ? 'default' : 'active' });
				}}
				onCheckedChange={(checked) => updateArgs({ checked })}
			/>
		);
	},
} satisfies Meta<typeof MenuItemWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
