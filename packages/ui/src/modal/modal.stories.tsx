import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal, ModalProps } from './modal.js';
import { ModalHeader } from './modal-header.js';
import { ModalBody } from './modal-body.js';
import { ModalFooter } from './modal-footer.js';
import { Button } from '../button/button.js';

interface ModalStoryProps extends ModalProps {
	theme?: 'light' | 'dark';
}

const ModalWithTheme = ({ theme = 'light', ...props }: ModalStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			position: 'relative',
			background: 'var(--nok-color-background-canvas)',
			width: '100%',
			height: '600px',
		}}>
		<Modal {...props} />
	</div>
);

const meta = {
	title: 'Components/Surfaces/Modal/Modal',
	component: ModalWithTheme,
	tags: ['autodocs'],
	// Storybook's default 'padded' layout wraps every story in its own
	// canvas padding — Modal's backdrop (fixed/inset-0) reaches past this
	// story's own wrapper into that padding and blends against Storybook's
	// page background there instead of this story's themed canvas, which is
	// the "gray border around the backdrop" seen in the Canvas view. This is
	// the actual cause (not something CSS in the story can reach), and
	// 'fullscreen' is Storybook's own built-in opt-out for exactly this case.
	parameters: { layout: 'fullscreen', docs: { description: { component: `A blocking overlay for a decision or a focused task.\n\n> Use sparingly, and keep the content short.` } } },
	argTypes: {
		position: {
			control: 'select',
			options: ['center', 'bottom', 'start', 'end', 'full-screen'],
		},
		size: {
			control: 'select',
			options: ['small', 'medium', 'large'],
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		position: 'center',
		size: 'medium',
		theme: 'light',
	},
	render: (args) => (
		<ModalWithTheme {...args}>
			<ModalHeader showTitle title='Modal title' />
			<ModalBody>
				<p style={{ color: 'var(--nok-color-text-primary)' }}>
					Modal body content goes here — this is where the actual dialog content is composed.
				</p>
			</ModalBody>
			<ModalFooter
				primaryAction={<Button variant='primary'>Confirm</Button>}
				secondaryAction={<Button variant='secondary'>Cancel</Button>}
			/>
		</ModalWithTheme>
	),
} satisfies Meta<typeof ModalWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
