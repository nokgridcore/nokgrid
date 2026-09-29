import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kpi, KpiProps } from './kpi.js';
import { Icon, IconName } from '../icons/Icon.js';
import * as icons from '../icons/generated/index.js';

const iconNames = Object.keys(icons) as IconName[];

interface KpiStoryProps extends Omit<KpiProps, 'icon'> {
	theme?: 'light' | 'dark';
	/** Story-only: picks which icon renders in Kpi's `icon` slot. */
	iconName?: IconName;
}

const KpiWithTheme = ({ theme = 'light', iconName, ...props }: KpiStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<Kpi {...props} icon={iconName && <Icon name={iconName} size='sm' color='secondary' />} />
	</div>
);

const meta = {
	title: 'Components/Data display/KPI value delta',
	component: KpiWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `A single metric with its change against the previous period.\n\n> Pair it with a sparkline to show the trend.` } } },
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
		iconName: {
			name: 'icon',
			control: 'select',
			options: [undefined, ...iconNames],
		},
		iconPosition: {
			control: 'select',
			options: ['leading', 'corner', 'top'],
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
		subtitlePosition: {
			control: 'select',
			options: ['below', 'inline'],
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
		showIcon: true,
		iconName: 'DollarSign',
		iconPosition: 'leading',
		showDelta: false,
		deltaValue: '2.4%',
		showSubtitle: false,
		subtitle: 'vs. last month',
		subtitlePosition: 'below',
		theme: 'light',
	},
} satisfies Meta<typeof KpiWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
