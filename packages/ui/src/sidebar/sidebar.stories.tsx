import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sidebar, SidebarProps } from './sidebar.js';
import { SidebarHeader } from './sidebar-header.js';
import { SidebarContent } from './sidebar-content.js';
import { SidebarGroup } from './sidebar-group.js';
import { SidebarFooter } from './sidebar-footer.js';
import { MenuItem } from '../menu/menu-item.js';

interface SidebarStoryProps extends SidebarProps {
	theme?: 'light' | 'dark';
}

const SidebarWithTheme = ({ theme = 'light', ...props }: SidebarStoryProps) => (
	<div data-theme={theme === 'dark' ? 'dark' : undefined} style={{ background: 'var(--nok-color-background-canvas)' }}>
		<Sidebar {...props} />
	</div>
);

const meta = {
	title: 'Components/Navigation/Sidebar/Sidebar',
	component: SidebarWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `The primary navigation rail.` } } },
	argTypes: {
		state: {
			control: 'select',
			options: ['expanded', 'expanded-hover', 'collapsed', 'collapsed-hover'],
			description: 'Unset by default — the real thing, interact with it (hover, click the trigger). Pick one here only to force a fixed visual for design QA.',
		},
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		state: undefined,
		showFooter: true,
		showBorder: true,
		theme: 'light',
	},
	render: (args) => (
		<SidebarWithTheme {...args}>
			<SidebarHeader logo='LayoutGrid' title='My dashboard' subtext='Enterprise' />
			<SidebarContent>
				<SidebarGroup label='Section' showDivider>
					<MenuItem
						state='active'
						showLeadingIcon
						icon='LayoutGrid'
						showLabel
						label='Playground'
						showTrailingIcon
						trailingIcon='ChevronRight'
					/>
					<MenuItem showLeadingIcon icon='Users' showLabel label='Models' showTrailingIcon trailingIcon='ChevronRight' />
					<MenuItem
						showLeadingIcon
						icon='Settings'
						showLabel
						label='Documentation'
						showTrailingIcon
						trailingIcon='ChevronRight'
					/>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter profileImage='https://i.pravatar.cc/64?img=47' profileName='Maryann Thony' profileEmail='m@example.com' />
		</SidebarWithTheme>
	),
} satisfies Meta<typeof SidebarWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
