import type { Meta, StoryObj } from '@storybook/react-vite';
import { SidebarGroup, SidebarGroupProps } from './sidebar-group.js';
import { MenuItem } from '../menu/menu-item.js';

interface SidebarGroupStoryProps extends SidebarGroupProps {
	theme?: 'light' | 'dark';
}

const SidebarGroupWithTheme = ({ theme = 'light', ...props }: SidebarGroupStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{ background: 'var(--nok-color-background-surface)', display: 'inline-flex', width: '240px', padding: '8px' }}>
		<SidebarGroup {...props} />
	</div>
);

const meta = {
	title: 'Components/Navigation/Sidebar/Group',
	component: SidebarGroupWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `A labelled section of navigation items.` } } },
	argTypes: {
		state: { control: 'select', options: ['expanded', 'collapsed'] },
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		state: 'expanded',
		showDivider: false,
		theme: 'light',
	},
	render: (args) => (
		<SidebarGroupWithTheme {...args}>
			<MenuItem showLeadingIcon icon='LayoutDashboard' showLabel label='Dashboard' />
			<MenuItem showLeadingIcon icon='Table' showLabel label='Tables' />
			<MenuItem showLeadingIcon icon='Settings' showLabel label='Settings' />
		</SidebarGroupWithTheme>
	),
} satisfies Meta<typeof SidebarGroupWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
