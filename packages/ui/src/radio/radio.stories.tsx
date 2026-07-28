import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { Radio, RadioProps } from './radio.js';

interface RadioStoryProps extends RadioProps {
	theme?: 'light' | 'dark';
}

const RadioWithTheme = ({ theme = 'light', ...props }: RadioStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-canvas)',
			width: '100%',
			padding: '2rem',
		}}>
		<Radio {...props} />
	</div>
);

const meta = {
	title: 'Components/Radio',
	component: RadioWithTheme,
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
		label: {
			control: 'text',
		},
		helperText: {
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
		state: 'default',
		checked: false,
		label: 'Label',
		helperText: 'Helper text',
		theme: 'light',
	},
	render: (args) => {
		const [, updateArgs] = useArgs();
		return (
			<RadioWithTheme
				{...args}
				onChange={(e) => updateArgs({ checked: e.target.checked })}
				onClick={() => {
					// Native radios don't fire a change event when clicking one
					// that's already checked, so toggling off needs its own handler.
					if (args.checked) updateArgs({ checked: false });
				}}
			/>
		);
	},
} satisfies Meta<typeof RadioWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const RadioGroupDemo = ({
	size,
	state,
	theme,
}: Pick<RadioStoryProps, 'size' | 'state' | 'theme'>) => {
	const [selected, setSelected] = useState('One');
	const options = ['One', 'Two', 'Three'];

	return (
		<div
			data-theme={theme === 'dark' ? 'dark' : undefined}
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '0.75rem',
				background: 'var(--nok-color-background-canvas)',
				padding: '2rem',
			}}>
			{options.map((option) => (
				<Radio
					key={option}
					name='radio-group'
					label={option}
					size={size}
					state={state}
					checked={selected === option}
					onChange={() => setSelected(option)}
				/>
			))}
		</div>
	);
};

export const Group: Story = {
	args: { label: undefined, helperText: undefined },
	render: (args) => (
		<RadioGroupDemo size={args.size} state={args.state} theme={args.theme} />
	),
};
