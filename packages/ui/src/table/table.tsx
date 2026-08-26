'use client';

import {
	Children,
	cloneElement,
	forwardRef,
	HTMLAttributes,
	isValidElement,
	ReactElement,
	ReactNode,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import { TableRowProps } from './table-row.js';
import { TableCellProps } from './table-cell.js';
import { TableHeaderCellProps } from './table-header-cell.js';
import { Pagination, PaginationProps } from '../pagination/pagination.js';

type TableStyle = 'dividers' | 'banding';
type TableDensity = 'spacious' | 'comfortable' | 'compact';

// density is a Table-level concept only — TableRow/TableCell/TableHeaderCell
// don't know about it, Table just overrides their vertical padding directly
// via inline style (which always wins over their own py-component-sm class)
// when it clones them below.
const densityPadding: Record<TableDensity, string> = {
	compact: 'var(--nok-spacing-component-xs)',
	comfortable: 'var(--nok-spacing-component-sm)',
	spacious: 'var(--nok-spacing-component-lg)',
};

export interface TableProps
	extends HTMLAttributes<HTMLDivElement>,
		Omit<PaginationProps, 'className' | 'style' | 'totalPages'> {
	/** "style" collides with the native HTML style attribute — named variant instead. */
	variant?: TableStyle;
	density?: TableDensity;
	stickyHeader?: boolean;
	showToolbar?: boolean;
	/** Slot for a `<TableToolbar />` — Table doesn't build it itself. */
	toolbar?: ReactNode;
	showPagination?: boolean;
	/** Pagination's own required prop — only needed when showPagination is true. */
	totalPages?: number;
	/** Slot for the header row (e.g. a row of `<TableHeaderCell />`). */
	header?: ReactNode;
	/** The body rows — `<TableRow />` elements. */
	children?: ReactNode;
}

export const Table = forwardRef<HTMLDivElement, TableProps>(
	(
		{
			variant: tableStyle = 'dividers',
			density = 'comfortable',
			stickyHeader = false,
			showToolbar = false,
			toolbar,
			showPagination = false,
			type: paginationType,
			showPageControls,
			totalPages = 1,
			defaultCurrentPage,
			currentPage,
			onCurrentPageChange,
			itemsPerPageLabel,
			showItemsPerPage,
			itemsPerPageOptions,
			defaultItemsPerPage,
			itemsPerPage,
			onItemsPerPageChange,
			showItemsInfo,
			itemsInfoText,
			header,
			children,
			className,
			style,
			...props
		},
		ref,
	) => {
		const rowCount = Children.count(children);
		const cellPadding = densityPadding[density];

		// Numbered pagination centers under the columns' own span (measured
		// here), not the table's full width — a table's columns rarely fill
		// the whole row, and centering against the empty leftover width reads
		// as pushed off to one side rather than actually centered.
		const headerContentRef = useRef<HTMLDivElement>(null);
		const [headerContentWidth, setHeaderContentWidth] = useState<number | null>(null);

		useLayoutEffect(() => {
			const node = headerContentRef.current;
			if (!node) {
				setHeaderContentWidth(null);
				return;
			}

			const updateWidth = () => setHeaderContentWidth(node.getBoundingClientRect().width);
			updateWidth();

			const observer = new ResizeObserver(updateWidth);
			observer.observe(node);
			return () => observer.disconnect();
		}, [header]);

		// `header` is a single wrapper element (e.g. `<div>{headerCells}</div>`)
		// around TableHeaderCell elements — override each one's own padding
		// directly via style the same way rows/cells get it below.
		const headerWithDensity =
			isValidElement<{ children?: ReactNode }>(header) ?
				cloneElement(header, {
					children: Children.map(header.props.children, (cell) =>
						isValidElement<TableHeaderCellProps>(cell) ?
							cloneElement(cell, {
								style: { paddingTop: cellPadding, paddingBottom: cellPadding, ...cell.props.style },
							})
						:	cell,
					),
				})
			:	header;

		const classes = [
			'flex flex-col overflow-hidden rounded-lg border border-border-default bg-background-surface',
			className,
		]
			.filter(Boolean)
			.join(' ');

		return (
			<div ref={ref} className={classes} style={style} {...props}>
				{showToolbar && toolbar}

				{header && (
					<div
						style={{
							borderBottom: '1px solid var(--nok-color-border-default)',
							...(stickyHeader
								? { position: 'sticky', top: 0, zIndex: 1, background: 'var(--nok-color-background-surface)' }
								: undefined),
						}}>
						<div ref={headerContentRef} style={{ display: 'inline-block' }}>
							{headerWithDensity}
						</div>
					</div>
				)}

				<div className='flex flex-col'>
					{Children.map(children, (child, index) => {
						if (!isValidElement<TableRowProps>(child)) return child;

						const isLastRow = index === rowCount - 1;

						return cloneElement(child, {
							striped: tableStyle === 'banding' && index % 2 === 1,
							style: {
								...(tableStyle === 'dividers' && !isLastRow
									? { borderBottom: '1px solid var(--nok-color-border-default)' }
									: undefined),
								...(child as ReactElement<TableRowProps>).props.style,
							},
							children: Children.map(child.props.children, (cell) =>
								isValidElement<TableCellProps>(cell) ?
									cloneElement(cell, {
										style: { paddingTop: cellPadding, paddingBottom: cellPadding, ...cell.props.style },
									})
								:	cell,
							),
						});
					})}
				</div>

				{showPagination &&
					(() => {
						const isCenteredNumbered = paginationType === 'numbered' && headerContentWidth != null;

						const pagination = (
							<Pagination
								type={paginationType}
								showPageControls={showPageControls}
								totalPages={totalPages}
								defaultCurrentPage={defaultCurrentPage}
								currentPage={currentPage}
								onCurrentPageChange={onCurrentPageChange}
								itemsPerPageLabel={itemsPerPageLabel}
								showItemsPerPage={showItemsPerPage}
								itemsPerPageOptions={itemsPerPageOptions}
								defaultItemsPerPage={defaultItemsPerPage}
								itemsPerPage={itemsPerPage}
								onItemsPerPageChange={onItemsPerPageChange}
								showItemsInfo={showItemsInfo}
								itemsInfoText={itemsInfoText}
								style={{ borderTop: 'none', paddingTop: 0 }}
							/>
						);

						return (
							<div
								className={`flex py-component-sm ${isCenteredNumbered ? '' : 'px-component-lg'}`}
								style={{
									borderTop: '1px solid var(--nok-color-border-default)',
									justifyContent: !isCenteredNumbered && paginationType === 'numbered' ? 'center' : undefined,
								}}>
								{/* Pagination's own border-top/padding-top only span its
								content width (inline-flex) — this wrapper owns the
								full-width border/padding instead, so cancel Pagination's. */}
								{isCenteredNumbered ?
									// Flush against the wrapper's own edge (no px-component-lg
									// here) so this width-constrained track starts at the exact
									// same x as the header's own flush-left content — then
									// centers the pagination buttons within just that span.
									<div style={{ width: headerContentWidth ?? undefined, display: 'flex', justifyContent: 'center' }}>
										{pagination}
									</div>
								:	pagination}
							</div>
						);
					})()}
			</div>
		);
	},
);

Table.displayName = 'Table';
