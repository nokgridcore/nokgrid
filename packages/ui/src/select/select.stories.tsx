import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select, SelectProps } from './select.js';
import { Option } from '../option/option.js';
import * as icons from '../icons/generated/index.js';

const iconNames = Object.keys(icons);

interface SelectStoryProps extends SelectProps {
	theme?: 'light' | 'dark';
}

const SelectWithTheme = ({ theme = 'light', ...props }: SelectStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<Select {...props}>
			<Option label='Option one' />
			<Option label='Option two' />
			<Option label='Option three' />
		</Select>
	</div>
);

const meta = {
	title: 'Components/Select',
	component: SelectWithTheme,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['outlined', 'underlined'],
		},
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
		},
		state: {
			control: 'select',
			options: ['default', 'focused', 'active'],
		},
		belowSlot: {
			control: 'select',
			options: ['none', 'helperText', 'error'],
		},
		helperText: {
			control: 'text',
		},
		errorText: {
			control: 'text',
		},
		label: {
			control: 'text',
		},
		showLabel: {
			control: 'boolean',
		},
		required: {
			control: 'boolean',
		},
		placeholder: {
			control: 'text',
		},
		showPlaceholder: {
			control: 'boolean',
		},
		icon: {
			control: 'select',
			options: [undefined, ...iconNames],
		},
		disabled: {
			control: 'boolean',
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		variant: 'outlined',
		size: 'sm',
		state: 'default',
		belowSlot: 'none',
		helperText: 'Helper text',
		errorText: 'Error text',
		label: 'Label',
		showLabel: true,
		required: false,
		placeholder: 'Placeholder text',
		showPlaceholder: true,
		disabled: false,
		theme: 'light',
	},
} satisfies Meta<typeof SelectWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
