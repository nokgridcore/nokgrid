import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { Checkbox, CheckboxProps } from './checkbox.js';

interface CheckboxStoryProps extends CheckboxProps {
	theme?: 'light' | 'dark';
}

const CheckboxWithTheme = ({ theme = 'light', ...props }: CheckboxStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<Checkbox {...props} />
	</div>
);

const meta = {
	title: 'Components/Checkbox',
	component: CheckboxWithTheme,
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: 'select',
			options: ['sm', 'md'],
		},
		state: {
			control: 'select',
			options: ['default', 'hovered', 'disabled', 'error'],
		},
		checked: {
			control: 'boolean',
		},
		indeterminate: {
			control: 'boolean',
		},
		label: {
			control: 'text',
		},
		hideLabel: {
			control: 'boolean',
		},
		helperText: {
			control: 'text',
		},
		hideHelperText: {
			control: 'boolean',
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		size: 'sm',
		state: 'default',
		checked: false,
		indeterminate: false,
		label: 'Label',
		hideLabel: false,
		helperText: 'Helper text',
		hideHelperText: false,
		theme: 'light',
	},
	render: (args) => {
		const [, updateArgs] = useArgs();
		return (
			<CheckboxWithTheme
				{...args}
				onChange={(e) =>
					updateArgs({ checked: e.target.checked, indeterminate: false })
				}
			/>
		);
	},
} satisfies Meta<typeof CheckboxWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
