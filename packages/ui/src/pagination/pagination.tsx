'use client';

import { HTMLAttributes, forwardRef, useState } from 'react';
import { nokTailwindTheme } from '@nokgridcore/tokens/tailwind-theme';
import { PaginationButton } from './pagination-button.js';
import { Select } from '../select/select.js';
import { Option } from '../option/option.js';

type PaginationType = 'numbered' | 'overflow';

export interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
	type?: PaginationType;
	/**
	 * numbered — shows/hides the page-number buttons between the carets.
	 * overflow — shows/hides the page-jump select between the carets.
	 */
	showPageControls?: boolean;
	totalPages: number;
	defaultCurrentPage?: number;
	currentPage?: number;
	onCurrentPageChange?: (page: number) => void;

	// overflow type — left side
	itemsPerPageLabel?: string;
	showItemsPerPage?: boolean;
	itemsPerPageOptions?: number[];
	defaultItemsPerPage?: number;
	itemsPerPage?: number;
	onItemsPerPageChange?: (itemsPerPage: number) => void;
	showItemsInfo?: boolean;
	itemsInfoText?: string;
}

// A fixed-size sliding window of consecutive pages, e.g. 1,2,3,4,5…10.
// While currentPage sits within the first window it stays pinned at 1; once
// currentPage moves past it the window slides to keep currentPage inside it
// (so the leading number becomes 2, 3, …). The "…" only ever appears once,
// immediately before the last page, never on the left.
const WINDOW_SIZE = 5;

function getPaginationRange(totalPages: number, currentPage: number): (number | 'ellipsis')[] {
	if (totalPages <= WINDOW_SIZE + 1) {
		return Array.from({ length: totalPages }, (_, index) => index + 1);
	}

	const windowStart = Math.max(1, Math.min(currentPage - 2, totalPages - WINDOW_SIZE));
	const windowEnd = windowStart + WINDOW_SIZE - 1;
	const windowRange = Array.from({ length: WINDOW_SIZE }, (_, index) => windowStart + index);

	// Window already reaches (or is one page short of) the end — just run the
	// numbers straight through rather than ellipsis-ing a single saved page.
	if (windowEnd >= totalPages) return windowRange;
	if (windowEnd === totalPages - 1) return [...windowRange, totalPages];

	return [...windowRange, 'ellipsis', totalPages];
}

const DEFAULT_ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
	(
		{
			type = 'numbered',
			showPageControls = true,
			totalPages,
			defaultCurrentPage = 1,
			currentPage: controlledCurrentPage,
			onCurrentPageChange,
			itemsPerPageLabel,
			showItemsPerPage = false,
			itemsPerPageOptions = DEFAULT_ITEMS_PER_PAGE_OPTIONS,
			defaultItemsPerPage = itemsPerPageOptions[0] ?? 10,
			itemsPerPage: controlledItemsPerPage,
			onItemsPerPageChange,
			showItemsInfo = false,
			itemsInfoText,
			className,
			style,
			...props
		},
		ref,
	) => {
		const [internalCurrentPage, setInternalCurrentPage] = useState(defaultCurrentPage);
		const currentPage = controlledCurrentPage ?? internalCurrentPage;

		const [internalItemsPerPage, setInternalItemsPerPage] = useState(defaultItemsPerPage);
		const itemsPerPage = controlledItemsPerPage ?? internalItemsPerPage;

		const goToPage = (page: number) => {
			setInternalCurrentPage(page);
			onCurrentPageChange?.(page);
		};

		const changeItemsPerPage = (value: number) => {
			setInternalItemsPerPage(value);
			onItemsPerPageChange?.(value);
		};

		const rootStyle = {
			borderTop: '1px solid var(--nok-color-border-default)',
			paddingTop: 'var(--nok-spacing-component-xs)',
			...style,
		};

		const prevCaret = (
			<PaginationButton
				icon='ChevronLeft'
				state={currentPage <= 1 ? 'disabled' : 'default'}
				onClick={() => goToPage(currentPage - 1)}
				aria-label='Previous page'
			/>
		);

		const nextCaret = (
			<PaginationButton
				icon='ChevronRight'
				state={currentPage >= totalPages ? 'disabled' : 'default'}
				onClick={() => goToPage(currentPage + 1)}
				aria-label='Next page'
			/>
		);

		if (type === 'overflow') {
			const classes = [
				'inline-flex w-full items-center justify-between gap-component-sm',
				className,
			]
				.filter(Boolean)
				.join(' ');

			return (
				<div ref={ref} className={classes} style={rootStyle} {...props}>
					<div className='inline-flex items-center gap-component-sm'>
						{showItemsPerPage && (
							<>
								{itemsPerPageLabel && (
									<span
										style={nokTailwindTheme.textStyles['label-md']}
										className='text-text-secondary'>
										{itemsPerPageLabel}
									</span>
								)}
								<div style={{ width: 'max-content' }}>
									<Select
										size='sm'
										showLabel={false}
										selectedIndex={itemsPerPageOptions.indexOf(itemsPerPage)}
										onSelectedIndexChange={(index) => changeItemsPerPage(itemsPerPageOptions[index] ?? itemsPerPage)}>
										{itemsPerPageOptions.map((option) => (
											<Option key={option} label={String(option)} />
										))}
									</Select>
								</div>
							</>
						)}

						{showItemsInfo && itemsInfoText && (
							<span style={nokTailwindTheme.textStyles['caption-md']} className='text-text-secondary'>
								{itemsInfoText}
							</span>
						)}
					</div>

					<div className='inline-flex items-center gap-component-xs'>
						{prevCaret}

						{showPageControls && (
							<span className='inline-flex items-center gap-component-xs'>
								<div style={{ width: 'max-content' }}>
									<Select
										size='sm'
										showLabel={false}
										selectedIndex={currentPage - 1}
										onSelectedIndexChange={(index) => goToPage(index + 1)}>
										{Array.from({ length: totalPages }, (_, index) => (
											<Option key={index} label={String(index + 1)} />
										))}
									</Select>
								</div>
								<span className='inline-flex items-center gap-component-sm'>
									<span
										style={nokTailwindTheme.textStyles['caption-md']}
										className='text-text-secondary'>
										of
									</span>
									<span
										style={nokTailwindTheme.textStyles['label-md']}
										className='text-text-primary'>
										{totalPages}
									</span>
								</span>
							</span>
						)}

						{nextCaret}
					</div>
				</div>
			);
		}

		const classes = ['inline-flex items-center gap-component-xs', className].filter(Boolean).join(' ');

		return (
			<div ref={ref} className={classes} style={rootStyle} {...props}>
				{prevCaret}

				{showPageControls &&
					getPaginationRange(totalPages, currentPage).map((page, index) =>
						page === 'ellipsis' ? (
							<PaginationButton key={`ellipsis-${index}`} label='…' state='disabled' />
						) : (
							<PaginationButton
								key={page}
								label={String(page)}
								state={page === currentPage ? 'active' : 'default'}
								onClick={() => goToPage(page)}
								aria-current={page === currentPage ? 'page' : undefined}
							/>
						),
					)}

				{nextCaret}
			</div>
		);
	},
);

Pagination.displayName = 'Pagination';
