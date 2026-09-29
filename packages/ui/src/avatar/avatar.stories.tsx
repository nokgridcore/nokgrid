import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarProps } from './avatar.js';
import * as icons from '../icons/generated/index.js';

const iconNames = Object.keys(icons);

interface AvatarStoryProps extends AvatarProps {
	theme?: 'light' | 'dark';
}

const AvatarWithTheme = ({ theme = 'light', ...props }: AvatarStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<Avatar {...props} />
	</div>
);

const meta = {
	title: 'Components/Data display/Avatar',
	component: AvatarWithTheme,
	tags: ['autodocs'],
	parameters: { docs: { description: { component: `Identifies a person or entity.\n\n> Falls back from photo to initials to icon. Never show an empty circle.` } } },
	argTypes: {
		type: {
			control: 'select',
			options: ['image', 'initials', 'icon'],
		},
		shape: {
			control: 'select',
			options: ['circle', 'square'],
		},
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
		},
		initials: {
			control: 'text',
		},
		icon: {
			control: 'select',
			options: [undefined, ...iconNames],
		},
		src: {
			control: 'text',
		},
		alt: {
			control: 'text',
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		type: 'initials',
		shape: 'circle',
		size: 'sm',
		initials: 'AB',
		icon: 'Activity',
		src: 'https://i.pravatar.cc/80',
		alt: 'User avatar',
		theme: 'light',
	},
} satisfies Meta<typeof AvatarWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
