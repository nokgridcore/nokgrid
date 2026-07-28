import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { Toggle, ToggleProps } from './toggle.js';

interface ToggleStoryProps extends ToggleProps {
	theme?: 'light' | 'dark';
}

const ToggleWithTheme = ({ theme = 'light', ...props }: ToggleStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<Toggle {...props} />
	</div>
);

const meta = {
	title: 'Components/Toggle',
	component: ToggleWithTheme,
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: 'select',
			options: ['sm', 'md'],
		},
		state: {
			control: 'select',
			options: ['off', 'off-hover', 'on', 'on-hover', 'off-disabled', 'on-disabled'],
		},
		labelPosition: {
			control: 'select',
			options: ['leading', 'trailing'],
		},
		hideLabel: {
			control: 'boolean',
		},
		label: {
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
		state: 'off',
		label: 'Label',
		labelPosition: 'trailing',
		hideLabel: false,
		theme: 'light',
	},
	render: (args) => {
		const [, updateArgs] = useArgs();
		return (
			<ToggleWithTheme
				{...args}
				onChange={(e) => {
					const currentState = args.state ?? 'off';
					const suffix = currentState.endsWith('-hover')
						? '-hover'
						: currentState.endsWith('-disabled')
							? '-disabled'
							: '';
					updateArgs({ state: `${e.target.checked ? 'on' : 'off'}${suffix}` });
				}}
			/>
		);
	},
} satisfies Meta<typeof ToggleWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
