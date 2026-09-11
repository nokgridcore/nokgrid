import type { Meta, StoryObj } from '@storybook/react-vite';
import { ModalBody, ModalBodyProps } from './modal-body.js';

interface ModalBodyStoryProps extends ModalBodyProps {
	theme?: 'light' | 'dark';
}

const ModalBodyWithTheme = ({ theme = 'light', ...props }: ModalBodyStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '640px',
			padding: '2rem',
		}}>
		<ModalBody {...props} />
	</div>
);

const meta = {
	title: 'Components/Modal/ModalBody',
	component: ModalBodyWithTheme,
	tags: ['autodocs'],
	argTypes: {
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		theme: 'light',
	},
	render: (args) => (
		<ModalBodyWithTheme {...args}>
			<p style={{ color: 'var(--nok-color-text-primary)' }}>
				Modal body content goes here — this component is just a content slot.
			</p>
		</ModalBodyWithTheme>
	),
} satisfies Meta<typeof ModalBodyWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
