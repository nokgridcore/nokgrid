import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover, PopoverProps } from './popover.js';
import { Button } from '../button/button.js';

interface PopoverStoryProps extends PopoverProps {
	theme?: 'light' | 'dark';
	bodyText?: string;
}

const PopoverWithTheme = ({ theme = 'light', bodyText, ...props }: PopoverStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{ background: 'var(--nok-color-background-canvas)', padding: '2rem' }}>
		<Popover {...props}>
			<span style={{ font: '400 13px/1.5 Roboto, sans-serif', color: 'var(--nok-color-text-primary)' }}>
				{bodyText}
			</span>
		</Popover>
	</div>
);

const meta = {
	title: 'Components/Surfaces/Popover',
	component: PopoverWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `A floating panel anchored to a trigger, holding rich or interactive content.\n\n> For a short, non-interactive label, use tooltip.` } } },
	argTypes: {
		trigger: { control: 'select', options: ['click', 'hover'] },
		width: { control: 'select', options: ['small', 'medium', 'large'] },
		bodyText: { control: 'text' },
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		trigger: 'click',
		width: 'small',
		bodyText: 'Popover content goes here — put whatever you need in the slot.',
		theme: 'light',
	},
	render: (args) => <PopoverWithTheme {...args} />,
} satisfies Meta<typeof PopoverWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithActions: Story = {
	render: (args) => (
		<div
			data-theme={args.theme === 'dark' ? 'dark' : undefined}
			style={{ background: 'var(--nok-color-background-canvas)', padding: '2rem' }}>
			<Popover {...args}>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nok-spacing-component-md, 12px)' }}>
					<span style={{ font: '500 13px/1.4 Roboto, sans-serif', color: 'var(--nok-color-text-primary)' }}>
						Delete this route?
					</span>
					<span style={{ font: '400 13px/1.5 Roboto, sans-serif', color: 'var(--nok-color-text-secondary)' }}>
						This can’t be undone.
					</span>
					<div style={{ display: 'flex', gap: 'var(--nok-spacing-component-sm, 8px)' }}>
						<Button variant='tertiary' size='xs'>
							Cancel
						</Button>
						<Button variant='destructive' size='xs'>
							Delete
						</Button>
					</div>
				</div>
			</Popover>
		</div>
	),
};
