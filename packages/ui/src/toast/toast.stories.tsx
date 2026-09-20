import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast, ToastProps } from './toast.js';
import { Button } from '../button/button.js';

interface ToastStoryProps extends ToastProps {
	theme?: 'light' | 'dark';
}

const ToastWithTheme = ({ theme = 'light', ...props }: ToastStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{ background: 'var(--nok-color-background-canvas)', padding: '2rem' }}>
		<Toast {...props} />
	</div>
);

const meta = {
	title: 'Components/Feedback & status/Toast',
	component: ToastWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `A short message that floats above the page and dismisses itself.\n\n> If the message must stay until resolved, use alert. A persistent toast must keep its close button.` } } },
	argTypes: {
		color: { control: 'select', options: ['neutral', 'primary', 'success', 'warning', 'error'] },
		orientation: { control: 'select', options: ['horizontal', 'vertical'] },
		position: { control: 'select', options: ['top', 'bottom'] },
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		color: 'neutral',
		orientation: 'horizontal',
		position: 'top',
		showStartSlot: true,
		title: 'Toast title',
		showTitle: true,
		text: 'Details go here',
		showText: true,
		showPrimaryAction: true,
		showSecondaryAction: true,
		showClose: true,
		theme: 'light',
	},
	render: (args) => (
		<ToastWithTheme
			{...args}
			// Primary action is white/borderless (tertiary, border stripped) on
			// the neutral toast; on every other (saturated) color it drops the
			// primary variant's solid background entirely — just text. Warning
			// keeps that text dark (text-primary), same as its title/body text;
			// primary/success/error keep it white.
			primaryAction={
				args.color === 'neutral' ?
					<Button variant='tertiary' size='xs' style={{ border: 'none' }}>
						Button
					</Button>
				: args.color === 'warning' ?
					<Button
						variant='primary'
						size='xs'
						style={{ background: 'transparent', color: 'var(--nok-color-text-primary, #141414)' }}>
						Button
					</Button>
				:	<Button variant='primary' size='xs' style={{ background: 'transparent' }}>
						Button
					</Button>
			}
			// Secondary action stays the default dark `secondary` look on the
			// neutral (light) toast, but on the saturated colors it switches to
			// the same white background as the primary action — kept
			// distinguishable from it by tertiary's border.
			secondaryAction={
				<Button variant={args.color === 'neutral' ? 'secondary' : 'tertiary'} size='xs'>
					Button
				</Button>
			}
		/>
	),
} satisfies Meta<typeof ToastWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
