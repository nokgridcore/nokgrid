import type { Meta, StoryObj } from '@storybook/react-vite';
import { Menu, MenuProps } from './menu.js';
import { MenuItem } from './menu-item.js';

interface MenuStoryProps extends MenuProps {
	theme?: 'light' | 'dark';
}

const MenuWithTheme = ({ theme = 'light', ...props }: MenuStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<Menu {...props} />
	</div>
);

const meta = {
	title: 'Components/Navigation/Menu/Menu',
	component: MenuWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `A floating list of actions or options opened from a trigger.` } } },
	argTypes: {
		defaultActiveIndex: {
			control: { type: 'number', min: 0 },
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		defaultActiveIndex: 1,
		theme: 'light',
	},
	render: (args) => (
		<MenuWithTheme {...args}>
			<MenuItem showLeadingIcon icon='CircleCheckBig' showLabel label='Profile' />
			<MenuItem showLeadingIcon icon='Settings' showLabel label='Settings' />
			<MenuItem showLeadingIcon icon='Bell' showLabel label='Notifications' showBadge badgeVariant='primary' badgeLabel='3' />
			<MenuItem showLabel label='Disabled item' state='disabled' />
			<MenuItem showLeadingIcon icon='LogOut' showLabel label='Log out' />
		</MenuWithTheme>
	),
} satisfies Meta<typeof MenuWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
