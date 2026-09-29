import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb } from './breadcrumb.js';
import { BreadcrumbItem } from './breadcrumb-item.js';

interface BreadcrumbStoryProps {
	separator?: 'chevron' | 'slash';
	theme?: 'light' | 'dark';
}

// No dedicated Figma frame for the trail itself — Breadcrumb only auto-wires
// the boring per-item edges (first item's leading separator, last item as
// current); everything visual still comes from BreadcrumbItem.
const BreadcrumbWithTheme = ({ separator = 'chevron', theme = 'light' }: BreadcrumbStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{ background: 'var(--nok-color-background-canvas)', padding: '2rem' }}>
		<Breadcrumb>
			<BreadcrumbItem separator={separator} icon='Home' showIcon label='Home' />
			<BreadcrumbItem separator={separator} label='Settings' />
			<BreadcrumbItem separator={separator} label='Profile' />
		</Breadcrumb>
	</div>
);

const meta = {
	title: 'Components/Navigation/Breadcrumb/Breadcrumb',
	component: BreadcrumbWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `Shows where the current page sits in the hierarchy.\n\n> The last item is the current page and isn't a link.` } } },
	argTypes: {
		separator: { control: 'select', options: ['chevron', 'slash'] },
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		separator: 'chevron',
		theme: 'light',
	},
	render: (args) => <BreadcrumbWithTheme {...args} />,
} satisfies Meta<typeof BreadcrumbWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Collapsed: Story = {
	render: (args) => (
		<div
			data-theme={args.theme === 'dark' ? 'dark' : undefined}
			style={{ background: 'var(--nok-color-background-canvas)', padding: '2rem' }}>
			<Breadcrumb>
				<BreadcrumbItem separator={args.separator} icon='Home' showIcon label='Home' />
				<BreadcrumbItem separator={args.separator} state='collapsed' />
				<BreadcrumbItem separator={args.separator} label='Profile' />
			</Breadcrumb>
		</div>
	),
};
