import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table, TableProps } from './table.js';
import { TableToolbar } from './table-toolbar.js';
import { TableHeaderCell, TableHeaderCellProps } from './table-header-cell.js';
import { TableRow } from './table-row.js';
import { TableCell } from './table-cell.js';
import { SearchInput } from '../search-input/search-input.js';
import { Checkbox } from '../checkbox/checkbox.js';
import { BadgeVariant } from '../badge/badge.js';

interface Employee {
	id: string;
	name: string;
	avatarSrc: string;
	department: string;
	location: string;
	badgeVariant: BadgeVariant;
	badgeLabel: string;
}

const employees: Employee[] = [
	{
		id: 'jordan',
		name: 'Jordan Doe',
		avatarSrc: 'https://i.pravatar.cc/150?img=12',
		department: 'Engineering',
		location: 'Remote',
		badgeVariant: 'success',
		badgeLabel: 'Active',
	},
	{
		id: 'alex',
		name: 'Alex Kim',
		avatarSrc: 'https://i.pravatar.cc/150?img=32',
		department: 'Design',
		location: 'New York',
		badgeVariant: 'warning',
		badgeLabel: 'Away',
	},
	{
		id: 'sam',
		name: 'Sam Lee',
		avatarSrc: 'https://i.pravatar.cc/150?img=45',
		department: 'Marketing',
		location: 'San Francisco',
		badgeVariant: 'neutral',
		badgeLabel: 'Inactive',
	},
	{
		id: 'taylor',
		name: 'Taylor Brooks',
		avatarSrc: 'https://i.pravatar.cc/150?img=68',
		department: 'Product',
		location: 'Austin',
		badgeVariant: 'info',
		badgeLabel: 'On Leave',
	},
];

interface TableStoryProps extends TableProps {
	theme?: 'light' | 'dark';
}

const TableWithTheme = ({ theme = 'light', ...props }: TableStoryProps) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{
			background: 'var(--nok-color-background-canvas)',
			width: '100%',
			padding: '2rem',
		}}>
		<Table {...props} />
	</div>
);

const meta = {
	title: 'Components/Table/Table',
	component: TableWithTheme,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['dividers', 'banding'],
		},
		density: {
			control: 'select',
			options: ['spacious', 'comfortable', 'compact'],
		},
		stickyHeader: {
			control: 'boolean',
		},
		showToolbar: {
			control: 'boolean',
		},
		showPagination: {
			control: 'boolean',
		},
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
		variant: 'dividers',
		density: 'comfortable',
		stickyHeader: false,
		showToolbar: true,
		showPagination: true,
		type: 'numbered',
		showPageControls: true,
		totalPages: 4,
		defaultCurrentPage: 1,
		itemsPerPageLabel: 'Rows per page',
		showItemsPerPage: false,
		defaultItemsPerPage: 10,
		showItemsInfo: false,
		itemsInfoText: '1-10 of 40 items',
		theme: 'light',
	},
	render: (args) => {
		const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
		const [nameSortState, setNameSortState] = useState<NonNullable<TableHeaderCellProps['sortState']>>('none');

		const sortedEmployees = useMemo(() => {
			if (nameSortState === 'none') return employees;
			const sorted = [...employees].sort((a, b) => a.name.localeCompare(b.name));
			return nameSortState === 'descending' ? sorted.reverse() : sorted;
		}, [nameSortState]);

		const allSelected = selectedIds.size === employees.length;
		const someSelected = selectedIds.size > 0 && !allSelected;

		const toggleAll = () => {
			setSelectedIds(allSelected ? new Set() : new Set(employees.map((employee) => employee.id)));
		};

		const toggleOne = (id: string) => {
			setSelectedIds((previous) => {
				const next = new Set(previous);
				if (next.has(id)) next.delete(id);
				else next.add(id);
				return next;
			});
		};

		return (
			<TableWithTheme
				{...args}
				toolbar={<TableToolbar showTitle title='Employees' showSearch search={<SearchInput placeholder='Search' />} />}
				header={
					<div className='flex items-center'>
						<span
							style={{
								paddingLeft: 'var(--nok-spacing-component-lg)',
								marginRight: 'var(--nok-spacing-component-sm)',
							}}>
							<Checkbox size='sm' checked={allSelected} indeterminate={someSelected} onChange={toggleAll} aria-label='Select all rows' />
						</span>
						<TableHeaderCell label='Name' sortable sortState={nameSortState} onSortStateChange={setNameSortState} />
						<TableHeaderCell label='Department' />
						<TableHeaderCell label='Location' />
						<TableHeaderCell label='Status' />
					</div>
				}>
				{sortedEmployees.map((employee) => (
					<TableRow
						key={employee.id}
						showCheckbox
						checked={selectedIds.has(employee.id)}
						onCheckedChange={() => toggleOne(employee.id)}>
						<TableCell columnType='person' value={employee.name} avatarType='image' avatarSrc={employee.avatarSrc} />
						<TableCell columnType='text' value={employee.department} />
						<TableCell columnType='text' value={employee.location} />
						<TableCell columnType='status' badgeVariant={employee.badgeVariant} badgeAppearance='filled' badgeLabel={employee.badgeLabel} />
					</TableRow>
				))}
			</TableWithTheme>
		);
	},
} satisfies Meta<typeof TableWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
