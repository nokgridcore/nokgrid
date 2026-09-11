'use client';

import { HTMLAttributes, ReactNode, forwardRef, useState } from 'react';
import { Checkbox } from '../checkbox/checkbox.js';

type TableRowState = 'default' | 'hover' | 'selected' | 'selected-hover' | 'disabled';

export interface TableRowProps extends HTMLAttributes<HTMLDivElement> {
	state?: TableRowState;
	showCheckbox?: boolean;
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	showHoverActions?: boolean;
	/** Slot for the row's hover actions (e.g. a `Button` group) — shown when showHoverActions is true. */
	hoverActions?: ReactNode;
	/** Table's banding style sets this — gives "default" state the banding background instead of transparent. Yields to hover/selected/disabled. */
	striped?: boolean;
	children?: ReactNode;
}

export const TableRow = forwardRef<HTMLDivElement, TableRowProps>(
	(
		{
			state = 'default',
			showCheckbox = false,
			checked = false,
			onCheckedChange,
			showHoverActions = false,
			hoverActions,
			striped = false,
			children,
			className,
			style,
			onMouseEnter,
			onMouseLeave,
			...props
		},
		ref,
	) => {
		const isDisabled = state === 'disabled';
		// checked drives selection directly — state can still force
		// selected/selected-hover for a Storybook preview without a real pointer.
		const isSelectedBase = checked || state === 'selected' || state === 'selected-hover';
		const isForcedHover = state === 'hover' || state === 'selected-hover';

		// Same real `hover:` class Option/MenuItem/PaginationButton use — this
		// covers plain (non-selected) hover.
		// No horizontal padding and no gap here — each TableCell already
		// carries its own px-component-lg and py, and cells must sit flush
		// edge-to-edge (fixed 200px width each) to line up with the header row
		// (a plain `flex items-center` with no gap of its own). A row-level
		// gap would otherwise drift each subsequent column right of its header
		// by gap * column-index. Checkbox/hoverActions get their own margin
		// below instead of relying on a row-level gap.
		const classes = [
			// Focus ring — the design system's own convention: 2px, bound to
			// border/focus. Needs tabIndex below to actually be reachable — the
			// row wasn't focusable at all before, matching MenuItem/Option's
			// existing always-focusable convention in this codebase.
			'flex items-center transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--nok-color-border-focus)]',
			isDisabled ? 'cursor-not-allowed' : '',
			!isDisabled && !isSelectedBase && 'hover:bg-background-overlay',
			className,
		]
			.filter(Boolean)
			.join(' ');

		// Selected+hover is a compound gradient, which needs either a
		// group-hover child or an arbitrary-value hover: class — neither
		// compiles into this project's live dev bundle (verified: both work in
		// an isolated `tailwindcss` CLI build but silently drop from the
		// served CSS, the same failure hit earlier with border-t/justify-end/
		// h-px). So only this one compound case falls back to real mouse
		// tracking; everything else above uses a real hover: class.
		const [isMouseOverSelected, setIsMouseOverSelected] = useState(false);
		const isSelectedHovering = isForcedHover || (isSelectedBase && isMouseOverSelected);

		const baseBackground = isDisabled
			? undefined
			: isSelectedBase
				? isSelectedHovering
					? 'linear-gradient(0deg, rgba(0, 0, 0, 0.06) 0%, rgba(0, 0, 0, 0.06) 100%), var(--nok-color-background-brand-subtle)'
					: 'var(--nok-color-background-brand-subtle)'
				: isForcedHover || striped
					? 'var(--nok-color-background-overlay)'
					: undefined;

		return (
			<div
				ref={ref}
				tabIndex={isDisabled ? -1 : 0}
				className={classes}
				style={{ background: baseBackground, ...style }}
				onMouseEnter={(event) => {
					onMouseEnter?.(event);
					if (!isDisabled && isSelectedBase) setIsMouseOverSelected(true);
				}}
				onMouseLeave={(event) => {
					onMouseLeave?.(event);
					if (!isDisabled && isSelectedBase) setIsMouseOverSelected(false);
				}}
				{...props}>
				{showCheckbox && (
					<span
						style={{
							paddingLeft: 'var(--nok-spacing-component-lg)',
							marginRight: 'var(--nok-spacing-component-sm)',
						}}>
						<Checkbox
							size='sm'
							state={isDisabled ? 'disabled' : 'default'}
							checked={checked}
							onChange={() => onCheckedChange?.(!checked)}
						/>
					</span>
				)}

				{children}

				{showHoverActions && (
					<span
						className='inline-flex items-center gap-component-sm'
						style={{
							marginLeft: 'var(--nok-spacing-component-sm)',
							paddingRight: 'var(--nok-spacing-component-lg)',
						}}>
						{hoverActions}
					</span>
				)}
			</div>
		);
	},
);

TableRow.displayName = 'TableRow';
