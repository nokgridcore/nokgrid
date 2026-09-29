import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, AlertProps } from './alert.js';

interface AlertStoryProps extends AlertProps {
	theme?: 'light' | 'dark';
}

const AlertWithTheme = ({ theme = 'light', ...props }: AlertStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			maxWidth: '480px',
			padding: '2rem',
		}}>
		<Alert {...props} />
	</div>
);

const meta = {
	title: 'Components/Feedback & status/Alert',
	component: AlertWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `A persistent message tied to a place on the page. It stays until resolved.\n\n> If it only confirms something happened, use toast.` } } },
	argTypes: {
		variant: {
			control: 'select',
			options: ['success', 'warning', 'error', 'info'],
		},
		appearance: {
			control: 'select',
			options: ['subtle', 'strong'],
		},
		inline: {
			control: 'boolean',
		},
		bleed: {
			control: 'boolean',
		},
		title: {
			control: 'text',
		},
		showTitle: {
			control: 'boolean',
		},
		description: {
			control: 'text',
		},
		dismissible: {
			control: 'boolean',
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		variant: 'success',
		appearance: 'subtle',
		inline: false,
		bleed: false,
		title: 'Title',
		showTitle: true,
		description: 'This is a description of the alert.',
		dismissible: false,
		theme: 'light',
	},
} satisfies Meta<typeof AlertWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

// The Playground's own wrapper padding would hide bleed's whole point (its
// left/right edges reaching the container) — this one sits flush instead, so
// bleed's edge-to-edge, top/bottom-only border is actually visible. Also
// wires up a real dismiss (Alert takes `onDismiss` but doesn't remove itself —
// that's the consumer's job) so the interaction is actually visible, not just
// a static render of the dismiss button.
export const Bleed: Story = {
	args: { bleed: true, dismissible: true },
	render: function Render(args) {
		const [visible, setVisible] = useState(true);
		return (
			<div
				data-theme={args.theme === 'dark' ? 'dark' : undefined}
				style={{ background: 'var(--nok-color-background-surface)', width: '100%', maxWidth: '480px' }}>
				{visible ?
					<Alert {...args} onDismiss={() => setVisible(false)} />
				:	<button
						type='button'
						onClick={() => setVisible(true)}
						style={{ margin: '1rem', color: 'var(--nok-color-text-brand)', fontSize: '13px' }}>
						Show alert again
					</button>
				}
			</div>
		);
	},
};
