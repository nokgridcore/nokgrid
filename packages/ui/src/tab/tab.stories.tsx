import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tab, TabProps } from './tab.js';
import * as icons from '../icons/generated/index.js';

const iconNames = Object.keys(icons);

interface TabStoryProps extends TabProps {
	theme?: 'light' | 'dark';
}

const TabWithTheme = ({ theme = 'light', ...props }: TabStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<Tab {...props} />
	</div>
);

const meta = {
	title: 'Components/Tab/Tab',
	component: TabWithTheme,
	tags: ['autodocs'],
	argTypes: {
		direction: {
			control: 'select',
			options: ['horizontal', 'vertical'],
		},
		appearance: {
			control: 'select',
			options: ['border', 'filled', 'elevated'],
		},
		size: {
			control: 'select',
			options: ['small', 'medium'],
		},
		state: {
			control: 'select',
			options: ['default', 'hover', 'active', 'disabled'],
		},
		label: {
			control: 'text',
		},
		leadingIcon: {
			control: 'select',
			options: [undefined, ...iconNames],
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
		showFocusRing: {
			control: 'boolean',
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		direction: 'horizontal',
		appearance: 'border',
		size: 'small',
		state: 'default',
		label: 'Label',
		showBadge: false,
		badgeVariant: 'neutral',
		badgeLabel: '1',
		showFocusRing: false,
		theme: 'light',
	},
} satisfies Meta<typeof TabWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
