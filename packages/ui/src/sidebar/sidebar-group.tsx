'use client';

import { Children, CSSProperties, HTMLAttributes, ReactElement, ReactNode, cloneElement, forwardRef, isValidElement } from 'react';
import { MenuItemProps } from '../menu/menu-item.js';

type SidebarGroupState = 'expanded' | 'collapsed';

export interface SidebarGroupProps extends HTMLAttributes<HTMLDivElement> {
	state?: SidebarGroupState;
	showDivider?: boolean;
	label?: string;
	showLabel?: boolean;
	children?: ReactNode;
}

const labelStyle: CSSProperties = {
	color: 'var(--nok-color-text-tertiary, #9E9E9E)',
	fontFamily: 'var(--nok-typography-font-family-body, Roboto)',
	fontSize: 'var(--nok-typography-font-size-12, 12px)',
	fontStyle: 'normal',
	fontWeight: 400,
	lineHeight: 'var(--nok-typography-line-height-16-8, 16.8px)',
	textTransform: 'uppercase',
};

// No container CSS was given yet (padding/gap between items) — just wiring
// up the structural behavior: collapsed hides each MenuItem's label/trailing
// content (icon-only, sidebar-collapse convention), and every item is
// stretched to fill whatever width this group ends up in instead of
// MenuItem's own hardcoded 240px.
export const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
	({ state = 'expanded', showDivider = false, label, showLabel = true, children, className, style, ...props }, ref) => {
		const isCollapsed = state === 'collapsed';
		// Collapsed items are a fixed 40px pill, not a full-width row — center
		// them in the rail instead of stretching to fill it.
		const classes = ['flex flex-col', isCollapsed && 'items-center', className].filter(Boolean).join(' ');
		// Gap between the label and its items wasn't given — using spacing-xs
		// as a placeholder. showDivider marks this group's own bottom edge
		// (separating it from whatever comes after), not its top.
		const groupStyle: CSSProperties = {
			gap: 'var(--nok-spacing-component-xs, 4px)',
			paddingBottom: showDivider ? 'var(--nok-spacing-component-sm, 8px)' : undefined,
			borderBottom: showDivider ? '1px solid var(--nok-color-border-default, #D9D9D9)' : undefined,
			...style,
		};

		const items = Children.map(children, (child) => {
			if (!isValidElement<MenuItemProps>(child)) return child;

			return cloneElement(child as ReactElement<MenuItemProps>, {
				style:
					isCollapsed ?
						{
							width: '40px',
							height: 'var(--nok-size-control-md, 36px)',
							padding: '0 var(--nok-spacing-component-md, 12px)',
							...child.props.style,
						}
					:	{ width: '100%', ...child.props.style },
				...(isCollapsed ?
					{
						showLabel: false,
						showTrailingIcon: false,
						showTrailingLabel: false,
						showBadge: false,
						// With the label gone there's nothing left to push against —
						// center the icon in the collapsed rail instead of it sitting
						// flush left.
						className: ['justify-center', child.props.className].filter(Boolean).join(' '),
					}
				:	undefined),
			});
		});

		return (
			<div ref={ref} className={classes} style={groupStyle} {...props}>
				{showLabel && !isCollapsed && label && (
					<span
						className='truncate'
						style={{
							// menu.header in Figma: 4px vertical, 12px horizontal — lines up with the items' text.
							padding: 'var(--nok-spacing-component-xs, 4px) var(--nok-spacing-component-md, 12px)',
							...labelStyle,
						}}>
						{label}
					</span>
				)}
				{items}
			</div>
		);
	},
);

SidebarGroup.displayName = 'SidebarGroup';
