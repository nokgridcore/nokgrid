import type { Meta, StoryObj } from '@storybook/react-vite';
import { TopBar, TopBarProps } from './top-bar.js';
import { Breadcrumb } from '../breadcrumb/breadcrumb.js';
import { BreadcrumbItem } from '../breadcrumb/breadcrumb-item.js';
import { BadgeCount } from '../badge/badge-count.js';
import { Icon, IconName } from '../icons/Icon.js';
import * as icons from '../icons/generated/index.js';

const iconNames = Object.keys(icons) as IconName[];

interface TopBarStoryProps extends TopBarProps {
	theme?: 'light' | 'dark';
}

const iconButton = (name: IconName) => (
	<button
		type='button'
		aria-label={name}
		className='inline-flex items-center justify-center rounded-sm text-icon-default transition-colors hover:bg-background-overlay'
		style={{ width: '28px', height: '28px' }}>
		<Icon name={name} size='sm' color='default' />
	</button>
);

const TopBarWithTheme = ({ theme = 'light', ...props }: TopBarStoryProps) => (
	<div data-theme={theme === 'dark' ? 'dark' : undefined} style={{ background: 'var(--nok-color-background-canvas)', padding: '2rem' }}>
		<TopBar
			{...props}
			leading={
				<Breadcrumb>
					<BreadcrumbItem label='Home' />
					<BreadcrumbItem label='Projects' />
					<BreadcrumbItem label='Settings' />
				</Breadcrumb>
			}
			actions={
				<div className='flex items-center' style={{ gap: 'var(--nok-spacing-component-sm, 8px)' }}>
					{iconButton('HelpCircle')}
					<span className='relative inline-flex'>
						{iconButton('Bell')}
						<span className='absolute' style={{ top: '-4px', right: '-4px' }}>
							<BadgeCount count={3} variant='primary' size='small' />
						</span>
					</span>
					{iconButton('Settings')}
				</div>
			}
		/>
	</div>
);

const meta = {
	title: 'Components/TopBar',
	component: TopBarWithTheme,
	tags: ['autodocs'],
	argTypes: {
		logo: { control: 'select', options: iconNames },
		showSidebarToggle: { control: 'boolean' },
		showLogo: { control: 'boolean' },
		showProductName: { control: 'boolean' },
		productName: { control: 'text' },
		showLeading: { control: 'boolean' },
		showAdditional: { control: 'boolean' },
		showSearch: { control: 'boolean' },
		showActions: { control: 'boolean' },
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		showSidebarToggle: true,
		logo: 'LayoutGrid',
		showLogo: true,
		productName: 'NokGridCore',
		showProductName: true,
		showLeading: true,
		showAdditional: false,
		showSearch: true,
		showActions: true,
		theme: 'light',
	},
	render: (args) => <TopBarWithTheme {...args} />,
} satisfies Meta<typeof TopBarWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
