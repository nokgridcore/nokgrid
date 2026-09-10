'use client';

import { CSSProperties, HTMLAttributes, ReactNode, forwardRef } from 'react';

type PopoverTrigger = 'click' | 'hover';
type PopoverWidth = 'small' | 'medium' | 'large';

export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
	/**
	 * How the popover is meant to be opened. Presentational only — it sets the
	 * shadow (click = shadow/md, hover = shadow/sm, so the two read differently,
	 * per the design system's own note) — showing/positioning is the consumer's.
	 */
	trigger?: PopoverTrigger;
	width?: PopoverWidth;
	/** The panel's contents — anything. Falls back to `children`. */
	content?: ReactNode;
	children?: ReactNode;
}

const widthForSize: Record<PopoverWidth, string> = {
	small: '200px',
	medium: '300px',
	large: '500px',
};

// shadow/sm and shadow/md — same literals the rest of the system uses (no
// token carries the alpha).
const shadowForTrigger: Record<PopoverTrigger, string> = {
	hover: '0 1px 2px 0 rgba(0, 0, 0, 0.06)',
	click: '0 2px 8px 0 rgba(0, 0, 0, 0.10)',
};

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
	({ trigger = 'click', width = 'small', content, children, className, style, ...props }, ref) => {
		const panelStyle: CSSProperties = {
			width: widthForSize[width],
			padding: 'var(--nok-spacing-component-lg, 16px)',
			borderRadius: 'var(--nok-spacing-radius-lg, 8px)',
			border: '1px solid var(--nok-color-border-default, #D9D9D9)',
			background: 'var(--nok-color-background-surface, #FFF)',
			boxShadow: shadowForTrigger[trigger],
			...style,
		};

		return (
			<div ref={ref} className={['flex flex-col items-start', className].filter(Boolean).join(' ')} style={panelStyle} {...props}>
				{content ?? children}
			</div>
		);
	},
);

Popover.displayName = 'Popover';
