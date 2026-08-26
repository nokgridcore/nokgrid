import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableCell, TableCellProps } from './table-cell.js';
import * as icons from '../icons/generated/index.js';

const iconNames = Object.keys(icons);

// Placeholder value for the avatarSrc control — edit it in Storybook as needed.
const DEFAULT_AVATAR_SRC = 'https://i.pravatar.cc/150?img=12';

interface TableCellStoryProps extends TableCellProps {
	theme?: 'light' | 'dark';
}

const TableCellWithTheme = ({ theme = 'light', ...props }: TableCellStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<TableCell {...props} />
	</div>
);

const meta = {
	title: 'Components/Table/TableCell',
	component: TableCellWithTheme,
	tags: ['autodocs'],
	argTypes: {
		columnType: {
			control: 'select',
			options: ['text', 'numeric', 'status', 'person', 'icon'],
		},
		value: {
			control: 'text',
		},
		subText: {
			control: 'text',
		},
		showSubText: {
			control: 'boolean',
		},
		badgeVariant: {
			control: 'select',
			options: ['neutral', 'primary', 'success', 'warning', 'error', 'info'],
		},
		badgeAppearance: {
			control: 'select',
			options: ['filled', 'subtle'],
		},
		badgeLabel: {
			control: 'text',
		},
		badgeDot: {
			control: 'boolean',
		},
		avatarType: {
			control: 'select',
			options: ['image', 'initials', 'icon'],
		},
		avatarShape: {
			control: 'select',
			options: ['circle', 'square'],
		},
		avatarSize: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
		},
		avatarInitials: {
			control: 'text',
		},
		avatarIcon: {
			control: 'select',
			options: [undefined, ...iconNames],
		},
		avatarSrc: {
			control: 'text',
		},
		icon: {
			control: 'select',
			options: [undefined, ...iconNames],
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		columnType: 'text',
		value: 'Cell value',
		subText: 'Secondary text',
		showSubText: true,
		badgeVariant: 'success',
		badgeAppearance: 'filled',
		badgeLabel: 'Active',
		badgeDot: false,
		avatarType: 'initials',
		avatarShape: 'circle',
		avatarSize: 'sm',
		avatarInitials: 'JD',
		avatarSrc: DEFAULT_AVATAR_SRC,
		icon: 'CircleCheckBig',
		theme: 'light',
	},
} satisfies Meta<typeof TableCellWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
