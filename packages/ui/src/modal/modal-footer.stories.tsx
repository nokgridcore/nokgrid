import type { Meta, StoryObj } from '@storybook/react-vite';
import { ModalFooter, ModalFooterProps } from './modal-footer.js';
import { Button } from '../button/button.js';

interface ModalFooterStoryProps extends ModalFooterProps {
	theme?: 'light' | 'dark';
}

const ModalFooterWithTheme = ({ theme = 'light', ...props }: ModalFooterStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '640px',
			padding: '2rem',
			margin: '0 auto',
		}}>
		<ModalFooter {...props} />
	</div>
);

const meta = {
	title: 'Components/Modal/ModalFooter',
	component: ModalFooterWithTheme,
	tags: ['autodocs'],
	argTypes: {
		layout: {
			control: 'select',
			options: ['standard', 'full-width-single-button'],
		},
		showPrimaryAction: {
			control: 'boolean',
		},
		showSecondaryAction: {
			control: 'boolean',
		},
		showTertiaryAction: {
			control: 'boolean',
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		layout: 'standard',
		showPrimaryAction: true,
		showSecondaryAction: true,
		showTertiaryAction: true,
		theme: 'light',
	},
	render: (args) => (
		<ModalFooterWithTheme
			{...args}
			primaryAction={<Button variant='primary'>Confirm</Button>}
			secondaryAction={<Button variant='secondary'>Cancel</Button>}
			tertiaryAction={<Button variant='tertiary'>Learn more</Button>}
		/>
	),
} satisfies Meta<typeof ModalFooterWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
