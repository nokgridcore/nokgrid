import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardProps } from './card.js';
import { Button } from '../button/button.js';
import { Icon, IconName } from '../icons/Icon.js';
import * as icons from '../icons/generated/index.js';

const iconNames = Object.keys(icons) as IconName[];

interface CardStoryProps extends Omit<CardProps, 'actions' | 'icon' | 'media'> {
	theme?: 'light' | 'dark';
	actionLabel?: string;
	/** Story-only: picks which icon renders in Card's `icon` slot. */
	iconName?: IconName;
}

const CardWithTheme = ({ theme = 'light', actionLabel, iconName, ...props }: CardStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-canvas)',
			width: '100%',
			padding: '2rem',
		}}>
		<Card
			{...props}
			icon={iconName && <Icon name={iconName} />}
			actions={
				<Button variant='primary' size={props.size ?? 'sm'}>
					{actionLabel}
				</Button>
			}
		/>
	</div>
);

const meta = {
	title: 'Components/Surfaces/Card',
	component: CardWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `A surface that groups related content into one object.` } } },
	argTypes: {
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		orientation: { control: 'select', options: ['vertical', 'horizontal'] },
		mediaType: { control: 'select', options: ['inset', 'bleed'] },
		showMedia: { control: 'boolean' },
		leadingIcon: { control: 'boolean' },
		iconName: { name: 'icon', control: 'select', options: [undefined, ...iconNames] },
		title: { control: 'text' },
		description: { control: 'text' },
		showDescription: { control: 'boolean' },
		showActions: { control: 'boolean' },
		actionLabel: { control: 'text' },
		theme: { name: 'Theme', control: 'select', options: ['light', 'dark'] },
	},
	args: {
		size: 'sm',
		orientation: 'vertical',
		mediaType: 'inset',
		showMedia: true,
		leadingIcon: false,
		iconName: 'CircleCheckBig',
		title: 'Card title',
		description: 'Card description',
		showDescription: true,
		showActions: true,
		actionLabel: 'Button',
		theme: 'light',
	},
} satisfies Meta<typeof CardWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const HorizontalBleed: Story = {
	args: { orientation: 'horizontal', mediaType: 'bleed' },
};
