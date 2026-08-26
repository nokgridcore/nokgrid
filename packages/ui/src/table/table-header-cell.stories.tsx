import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { TableHeaderCell, TableHeaderCellProps } from './table-header-cell.js';

interface TableHeaderCellStoryProps extends TableHeaderCellProps {
	theme?: 'light' | 'dark';
}

const TableHeaderCellWithTheme = ({ theme = 'light', ...props }: TableHeaderCellStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-surface)',
			width: '100%',
			padding: '2rem',
		}}>
		<TableHeaderCell {...props} />
	</div>
);

const meta = {
	title: 'Components/Table/TableHeaderCell',
	component: TableHeaderCellWithTheme,
	tags: ['autodocs'],
	argTypes: {
		columnType: {
			control: 'select',
			options: ['text', 'numeric'],
		},
		sortState: {
			control: 'select',
			options: ['none', 'ascending', 'descending'],
		},
		label: {
			control: 'text',
		},
		sortable: {
			control: 'boolean',
		},
		theme: {
			name: 'Theme',
			control: 'select',
			options: ['light', 'dark'],
		},
	},
	args: {
		columnType: 'text',
		sortState: 'none',
		label: 'Column label',
		sortable: true,
		theme: 'light',
	},
	render: (args) => {
		const [, updateArgs] = useArgs();
		return (
			<TableHeaderCellWithTheme
				{...args}
				onSortStateChange={(sortState) => updateArgs({ sortState })}
			/>
		);
	},
} satisfies Meta<typeof TableHeaderCellWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
