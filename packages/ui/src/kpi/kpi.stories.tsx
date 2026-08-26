import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kpi, KpiProps } from './kpi.js';
import * as icons from '../icons/generated/index.js';

const iconNames = Object.keys(icons);

interface KpiStoryProps extends KpiProps {
	theme?: 'light' | 'dark';
}

const KpiWithTheme = ({ theme = 'light', ...props }: KpiStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<Kpi {...props} />
	</div>
);

const meta = {
	title: 'Components/Kpi',
	component: KpiWithTheme,
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
		},
		deltaDirection: {
			control: 'select',
			options: ['positive', 'negative', 'neutral'],
		},
		label: {
			control: 'text',
		},
		value: {
			control: 'number',
		},
		showIcon: {
			control: 'boolean',
		},
		icon: {
			control: 'select',
			options: [undefined, ...iconNames],
		},
		showDelta: {
			control: 'boolean',
		},
		deltaValue: {
			control: 'text',
		},
		showSubtitle: {
			control: 'boolean',
		},
		subtitle: {
			control: 'text',
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		size: 'sm',
		deltaDirection: 'neutral',
		label: 'Revenue',
		value: 12400,
		showIcon: false,
		icon: 'DollarSign',
		showDelta: false,
		deltaValue: '2.4%',
		showSubtitle: false,
		subtitle: 'vs. last month',
		theme: 'light',
	},
} satisfies Meta<typeof KpiWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};