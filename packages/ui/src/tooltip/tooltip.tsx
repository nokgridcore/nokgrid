'use client';

import { CSSProperties, HTMLAttributes, ReactNode, forwardRef } from 'react';

type TooltipPlacement = 'top' | 'left' | 'bottom' | 'right';

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
	placement?: TooltipPlacement;
	showArrow?: boolean;
	title?: string;
	showTitle?: boolean;
	children?: ReactNode;
}

const titleStyle: CSSProperties = {
	color: 'var(--nok-color-text-primary, #141414)',
	fontFamily: 'var(--nok-typography-font-family-body, Roboto)',
	fontSize: 'var(--nok-typography-font-size-13, 13px)',
	fontStyle: 'normal',
	fontWeight: 500,
	lineHeight: 'var(--nok-typography-line-height-18-2, 18.2px)',
};

// Arrow sits off the edge facing the trigger — opposite the side named by
// `placement` (a "top" tooltip sits above its trigger, so its arrow points
// down from its own bottom edge, etc). The SVG's default orientation points
// down, so top needs no rotation; the rest rotate around the same shape.
// Offset = arrow size (6px) + a small gap (4px) so it doesn't sit flush on
// the border — exact gap wasn't given, using spacing-xs as a placeholder.
const ARROW_OFFSET = 'calc(-1 * (6px + var(--nok-spacing-component-xs, 4px)))';
const arrowPositionStyle: Record<TooltipPlacement, CSSProperties> = {
	top: { bottom: ARROW_OFFSET, left: '50%', transform: 'translateX(-50%)' },
	bottom: { top: ARROW_OFFSET, left: '50%', transform: 'translateX(-50%) rotate(180deg)' },
	left: { right: ARROW_OFFSET, top: '50%', transform: 'translateY(-50%) rotate(-90deg)' },
	right: { left: ARROW_OFFSET, top: '50%', transform: 'translateY(-50%) rotate(90deg)' },
};

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
	(
		{ placement = 'top', showArrow = true, title, showTitle = true, children, className, style, ...props },
		ref,
	) => {
		const classes = ['inline-flex flex-col items-start', className].filter(Boolean).join(' ');

		return (
			<div
				ref={ref}
				className={classes}
				style={{
					position: 'relative',
					padding: 'var(--nok-spacing-component-sm, 8px)',
					gap: 'var(--nok-spacing-component-xs, 4px)',
					borderRadius: 'var(--nok-spacing-radius-lg, 8px)',
					border: '1px solid var(--nok-color-border-default, #D9D9D9)',
					background: 'var(--nok-color-background-surface, #FFF)',
					boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.06)',
					...style,
				}}
				{...props}>
				{showTitle && title && <span style={titleStyle}>{title}</span>}
				{children}

				{showArrow && (
					<svg
						aria-hidden
						className='absolute'
						width='6'
						height='6'
						viewBox='0 0 6 5'
						fill='none'
						style={arrowPositionStyle[placement]}>
						<path
							d='M0.865662 0.5L4.33051 0.5L2.59808 3.50098L0.865662 0.5Z'
							fill='var(--nok-color-background-surface, #FFF)'
							stroke='var(--nok-color-border-default, #D9D9D9)'
						/>
					</svg>
				)}
			</div>
		);
	},
);

Tooltip.displayName = 'Tooltip';
