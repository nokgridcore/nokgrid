import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination, PaginationProps } from './pagination.js';

interface PaginationStoryProps extends PaginationProps {
	theme?: 'light' | 'dark';
}

const PaginationWithTheme = ({ theme = 'light', ...props }: PaginationStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<Pagination {...props} />
	</div>
);

const meta = {
	title: 'Components/Pagination',
	component: PaginationWithTheme,
	tags: ['autodocs'],
	argTypes: {
		type: {
			control: 'select',
			options: ['numbered', 'overflow'],
		},
		showPageControls: {
			control: 'boolean',
		},
		totalPages: {
			control: { type: 'number', min: 1 },
		},
		defaultCurrentPage: {
			control: { type: 'number', min: 1 },
		},
		itemsPerPageLabel: {
			control: 'text',
		},
		showItemsPerPage: {
			control: 'boolean',
		},
		defaultItemsPerPage: {
			control: { type: 'number', min: 1 },
		},
		showItemsInfo: {
			control: 'boolean',
		},
		itemsInfoText: {
			control: 'text',
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		type: 'numbered',
		showPageControls: true,
		totalPages: 12,
		defaultCurrentPage: 5,
		itemsPerPageLabel: 'Rows per page',
		showItemsPerPage: true,
		defaultItemsPerPage: 10,
		showItemsInfo: false,
		itemsInfoText: '1-10 of 120 items',
		theme: 'light',
	},
} satisfies Meta<typeof PaginationWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Overflow: Story = {
	args: {
		type: 'overflow',
	},
};
