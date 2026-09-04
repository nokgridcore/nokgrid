import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardProps } from './card.js';
import { Button } from '../button/button.js';
import { Icon, IconName } from '../icons/Icon.js';
import * as icons from '../icons/generated/index.js';

const iconNames = Object.keys(icons) as IconName[];

interface CardStoryProps extends Omit<CardProps, 'primaryAction' | 'secondaryAction' | 'icon'> {
	theme?: 'light' | 'dark';
	primaryActionLabel?: string;
	secondaryActionLabel?: string;
	/** Story-only: picks which icon renders in Card's `icon` slot. */
	iconName?: IconName;
}

const CardWithTheme = ({
	theme = 'light',
	primaryActionLabel,
	secondaryActionLabel,
	iconName,
	...props
}: CardStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<Card
			{...props}
			icon={iconName && <Icon name={iconName} color='inverse' />}
			primaryAction={
				<Button variant='primary' size='sm'>
					{primaryActionLabel}
				</Button>
			}
			secondaryAction={
				<Button variant='secondary' size='sm'>
					{secondaryActionLabel}
				</Button>
			}
		/>
	</div>
);

const meta = {
	title: 'Components/Card',
	component: CardWithTheme,
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
		},
		showIcon: {
			control: 'boolean',
		},
		iconName: {
			name: 'icon',
			control: 'select',
			options: [undefined, ...iconNames],
		},
		title: {
			control: 'text',
		},
		description: {
			control: 'text',
		},
		showDescription: {
			control: 'boolean',
		},
		showPrimaryAction: {
			control: 'boolean',
		},
		primaryActionLabel: {
			control: 'text',
		},
		showSecondaryAction: {
			control: 'boolean',
		},
		secondaryActionLabel: {
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
		showIcon: true,
		iconName: 'CircleCheckBig',
		title: 'Card title',
		description: 'Card description text goes here.',
		showDescription: true,
		showPrimaryAction: true,
		primaryActionLabel: 'Primary',
		showSecondaryAction: true,
		secondaryActionLabel: 'Secondary',
		theme: 'light',
	},
} satisfies Meta<typeof CardWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
