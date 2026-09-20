import type { Meta, StoryObj } from '@storybook/react-vite';
import { SidebarFooter, SidebarFooterProps } from './sidebar-footer.js';

interface SidebarFooterStoryProps extends SidebarFooterProps {
	theme?: 'light' | 'dark';
}

const SidebarFooterWithTheme = ({ theme = 'light', ...props }: SidebarFooterStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{ background: 'var(--nok-color-background-surface)', display: 'inline-flex', width: '240px' }}>
		<SidebarFooter {...props} />
	</div>
);

const meta = {
	title: 'Components/Navigation/Sidebar/Footer',
	component: SidebarFooterWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `The bottom of the sidebar, holding the profile and other content.` } } },
	argTypes: {
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		showContent: false,
		showProfile: true,
		profileImage: 'https://i.pravatar.cc/64?img=47',
		profileName: 'Maryann Thony',
		profileEmail: 'm@example.com',
		showProfileText: true,
		showAttribution: false,
		theme: 'light',
	},
} satisfies Meta<typeof SidebarFooterWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
