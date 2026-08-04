import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabGroup, TabGroupProps } from './tab-group.js';
import { Tab } from './tab.js';

interface TabGroupStoryProps extends Omit<TabGroupProps, 'children'> {
	theme?: 'light' | 'dark';
}

const TabGroupWithTheme = ({ theme = 'light', ...props }: TabGroupStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<TabGroup {...props}>
			<Tab label='Label one' direction={props.direction} appearance={mapAppearance(props.appearance)} />
			<Tab label='Label two' direction={props.direction} appearance={mapAppearance(props.appearance)} />
			<Tab label='Label three' direction={props.direction} appearance={mapAppearance(props.appearance)} />
		</TabGroup>
	</div>
);

function mapAppearance(appearance?: TabGroupProps['appearance']): 'border' | 'filled' | 'elevated' {
	return appearance ?? 'border';
}

const meta = {
	title: 'Components/Tab/Group',
	component: TabGroupWithTheme,
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
		width: {
			control: 'select',
			options: ['fixed', 'intrinsic'],
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
		width: 'intrinsic',
		theme: 'light',
	},
} satisfies Meta<typeof TabGroupWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
