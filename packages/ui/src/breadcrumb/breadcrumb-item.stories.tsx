import type { Meta, StoryObj } from '@storybook/react-vite';
import { BreadcrumbItem, BreadcrumbItemProps } from './breadcrumb-item.js';
import { IconName } from '../icons/Icon.js';
import * as icons from '../icons/generated/index.js';

const iconNames = Object.keys(icons) as IconName[];

interface BreadcrumbItemStoryProps extends BreadcrumbItemProps {
	theme?: 'light' | 'dark';
}

const BreadcrumbItemWithTheme = ({ theme = 'light', ...props }: BreadcrumbItemStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{ background: 'var(--nok-color-background-canvas)', padding: '2rem' }}>
		<BreadcrumbItem {...props} />
	</div>
);

const meta = {
	title: 'Components/Breadcrumb/BreadcrumbItem',
	component: BreadcrumbItemWithTheme,
	tags: ['autodocs'],
	argTypes: {
		state: { control: 'select', options: ['default', 'hover', 'current', 'collapsed'] },
		separator: { control: 'select', options: ['chevron', 'slash'] },
		icon: { control: 'select', options: [undefined, ...iconNames] },
		showFocusRing: { control: 'boolean' },
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		state: 'default',
		separator: 'chevron',
		label: 'Breadcrumb label',
		showIcon: false,
		icon: 'Home',
		showSeparator: true,
		showFocusRing: false,
		theme: 'light',
	},
	render: (args) => <BreadcrumbItemWithTheme {...args} />,
} satisfies Meta<typeof BreadcrumbItemWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
