import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableToolbar, TableToolbarProps } from './table-toolbar.js';
import { SearchInput } from '../search-input/search-input.js';

interface TableToolbarStoryProps extends Omit<TableToolbarProps, 'search'> {
	theme?: 'light' | 'dark';
	searchPlaceholder?: string;
}

const TableToolbarWithTheme = ({ theme = 'light', searchPlaceholder, ...props }: TableToolbarStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<TableToolbar {...props} search={<SearchInput placeholder={searchPlaceholder} />} />
	</div>
);

const meta = {
	title: 'Components/Table/TableToolbar',
	component: TableToolbarWithTheme,
	tags: ['autodocs'],
	argTypes: {
		layout: {
			control: 'select',
			options: ['search-leading', 'search-trailing'],
		},
		title: {
			control: 'text',
		},
		showTitle: {
			control: 'boolean',
		},
		showSearch: {
			control: 'boolean',
		},
		searchPlaceholder: {
			control: 'text',
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		layout: 'search-trailing',
		title: 'Table title',
		showTitle: true,
		showSearch: true,
		searchPlaceholder: 'Search',
		theme: 'light',
	},
} satisfies Meta<typeof TableToolbarWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
