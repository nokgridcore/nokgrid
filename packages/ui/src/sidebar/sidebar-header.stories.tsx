import type { Meta, StoryObj } from '@storybook/react-vite';
import { SidebarHeader, SidebarHeaderProps } from './sidebar-header.js';

interface SidebarHeaderStoryProps extends SidebarHeaderProps {
	theme?: 'light' | 'dark';
}

const SidebarHeaderWithTheme = ({ theme = 'light', ...props }: SidebarHeaderStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{ background: 'var(--nok-color-background-surface)', display: 'inline-flex', width: '240px' }}>
		<SidebarHeader {...props} />
	</div>
);

const meta = {
	title: 'Components/Navigation/Sidebar/Header',
	component: SidebarHeaderWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `Workspace identity at the top of the sidebar, with the collapse trigger.` } } },
	argTypes: {
		logo: { control: 'select', options: ['LayoutGrid', 'LayoutDashboard', 'LayoutList'] },
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		logo: 'LayoutGrid',
		showLogo: true,
		title: 'My dashboard',
		showTitle: true,
		subtext: 'Enterprise',
		showSubtext: true,
		showChevron: false,
		showTrigger: true,
		showText: true,
		theme: 'light',
	},
} satisfies Meta<typeof SidebarHeaderWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
