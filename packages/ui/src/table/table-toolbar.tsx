'use client';

import { HTMLAttributes, ReactNode, forwardRef } from 'react';

type TableToolbarLayout = 'search-leading' | 'search-trailing';

export interface TableToolbarProps extends HTMLAttributes<HTMLDivElement> {
	layout?: TableToolbarLayout;
	title?: string;
	showTitle?: boolean;
	showSearch?: boolean;
	/** Slot for a `<SearchInput />` — TableToolbar doesn't build it itself. */
	search?: ReactNode;
}

// No "heading" bundle exists in nokTailwindTheme.textStyles (only
// body/label/caption groups are generated) — literal inline styles.
const titleStyle = {
	color: 'var(--nok-color-text-primary)',
	fontFamily: 'var(--nok-typography-font-family-brand)',
	fontSize: 'var(--nok-typography-font-size-14)',
	fontStyle: 'normal',
	fontWeight: 600,
	lineHeight: 'var(--nok-typography-line-height-19_6)',
} as const;

export const TableToolbar = forwardRef<HTMLDivElement, TableToolbarProps>(
	(
		{
			layout = 'search-trailing',
			title,
			showTitle = false,
			showSearch = false,
			search,
			className,
			style,
			...props
		},
		ref,
	) => {
		const titleElement = showTitle && title && <span style={titleStyle}>{title}</span>;
		// justify-end only pushes the search itself to the end when it's
		// trailing — title stays put at the start, they don't move as a group.
		const searchElement = showSearch && search && (
			<span style={{ marginLeft: layout === 'search-trailing' ? 'auto' : undefined }}>{search}</span>
		);

		const classes = ['flex items-center gap-component-sm py-component-sm px-component-lg', className]
			.filter(Boolean)
			.join(' ');

		return (
			<div
				ref={ref}
				className={classes}
				style={{
					flex: '1 0 0',
					alignSelf: 'stretch',
					borderBottom: '1px solid var(--nok-color-border-default)',
					...style,
				}}
				{...props}>
				{titleElement}
				{searchElement}
			</div>
		);
	},
);

TableToolbar.displayName = 'TableToolbar';
