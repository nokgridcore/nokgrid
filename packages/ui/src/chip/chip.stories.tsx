import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip, ChipProps } from './chip.js';
import * as icons from '../icons/generated/index.js';

const iconNames = Object.keys(icons);

interface ChipStoryProps extends ChipProps {
	theme?: 'light' | 'dark';
}

const ChipWithTheme = ({ theme = 'light', ...props }: ChipStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<Chip {...props} />
	</div>
);

const meta = {
	title: 'Components/Chip',
	component: ChipWithTheme,
	tags: ['autodocs'],
	argTypes: {
		appearance: {
			control: 'select',
			options: ['outline', 'selected'],
		},
		state: {
			control: 'select',
			options: ['default', 'hover', 'pressed', 'disabled'],
		},
		size: {
			control: 'select',
			options: ['small', 'medium'],
		},
		label: {
			control: 'text',
		},
		leadingIcon: {
			control: 'select',
			options: [undefined, ...iconNames],
		},
		removable: {
			control: 'boolean',
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		appearance: 'outline',
		state: 'default',
		size: 'small',
		label: 'Label',
		removable: false,
		theme: 'light',
	},
} satisfies Meta<typeof ChipWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
