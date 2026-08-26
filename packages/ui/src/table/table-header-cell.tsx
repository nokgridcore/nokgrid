'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { Icon, IconName } from '../icons/Icon.js';

type TableHeaderCellColumnType = 'text' | 'numeric';
type TableHeaderCellSortState = 'none' | 'ascending' | 'descending';

export interface TableHeaderCellProps extends HTMLAttributes<HTMLDivElement> {
	columnType?: TableHeaderCellColumnType;
	sortState?: TableHeaderCellSortState;
	label: string;
	sortable?: boolean;
	onSortStateChange?: (sortState: TableHeaderCellSortState) => void;
}

const nextSortState: Record<TableHeaderCellSortState, TableHeaderCellSortState> = {
	none: 'ascending',
	ascending: 'descending',
	descending: 'none',
};

// No "heading" bundle exists in nokTailwindTheme.textStyles (only
// body/label/caption groups are generated) — literal inline styles.
const labelStyle = {
	color: 'var(--nok-color-text-primary)',
	fontFamily: 'var(--nok-typography-font-family-brand)',
	fontSize: 'var(--nok-typography-font-size-14)',
	fontStyle: 'normal',
	fontWeight: 600,
	lineHeight: 'var(--nok-typography-line-height-19_6)',
} as const;

const sortIconName: Record<TableHeaderCellSortState, IconName> = {
	none: 'ChevronsUpDown',
	ascending: 'ChevronUp',
	descending: 'ChevronDown',
};

export const TableHeaderCell = forwardRef<HTMLDivElement, TableHeaderCellProps>(
	(
		{
			columnType = 'text',
			sortState = 'none',
			label,
			sortable = false,
			onSortStateChange,
			className,
			style,
			onClick,
			...props
		},
		ref,
	) => {
		const isNumeric = columnType === 'numeric';
		const isSorted = sortState !== 'none';

		const classes = ['flex items-center gap-component-xs py-component-sm px-component-lg', className]
			.filter(Boolean)
			.join(' ');

		const handleClick: HTMLAttributes<HTMLDivElement>['onClick'] = (event) => {
			onClick?.(event);
			if (sortable) onSortStateChange?.(nextSortState[sortState]);
		};

		return (
			<div
				ref={ref}
				role={sortable ? 'button' : undefined}
				tabIndex={sortable ? 0 : undefined}
				onClick={handleClick}
				className={classes}
				style={{
					width: '200px',
					justifyContent: isNumeric ? 'flex-end' : 'flex-start',
					cursor: sortable ? 'pointer' : undefined,
					...style,
				}}
				{...props}>
				<span style={labelStyle}>{label}</span>
				{sortable &&
					(isSorted ? (
						<span className='text-text-primary'>
							<Icon name={sortIconName[sortState]} size='sm' />
						</span>
					) : (
						<Icon name={sortIconName[sortState]} size='sm' color='secondary' />
					))}
			</div>
		);
	},
);

TableHeaderCell.displayName = 'TableHeaderCell';
