'use client';

import {
	Children,
	CSSProperties,
	HTMLAttributes,
	ReactElement,
	ReactNode,
	cloneElement,
	forwardRef,
	isValidElement,
	useState,
} from 'react';
import { SidebarHeader, SidebarHeaderProps } from './sidebar-header.js';
import { SidebarContent, SidebarContentProps } from './sidebar-content.js';
import { SidebarFooter, SidebarFooterProps } from './sidebar-footer.js';
import { SidebarGroup, SidebarGroupProps } from './sidebar-group.js';

type SidebarState = 'expanded' | 'expanded-hover' | 'collapsed' | 'collapsed-hover';

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
	/**
	 * Storybook/preview only: force a visual state without real interaction —
	 * bypasses hover tracking and click-to-collapse entirely. Leave unset for
	 * real usage.
	 */
	state?: SidebarState;
	defaultCollapsed?: boolean;
	collapsed?: boolean;
	onCollapsedChange?: (collapsed: boolean) => void;
	showFooter?: boolean;
	showBorder?: boolean;
	children?: ReactNode;
}

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
	(
		{
			state,
			defaultCollapsed = false,
			collapsed: controlledCollapsed,
			onCollapsedChange,
			showFooter = true,
			showBorder = true,
			children,
			className,
			style,
			...props
		},
		ref,
	) => {
		const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
		const [isHovered, setIsHovered] = useState(false);

		const isForced = state !== undefined;
		const isCollapsed = isForced ? state === 'collapsed' || state === 'collapsed-hover' : (controlledCollapsed ?? internalCollapsed);
		const isHover = isForced ? state === 'expanded-hover' || state === 'collapsed-hover' : isHovered;

		const toggleCollapsed = () => {
			const next = !isCollapsed;
			if (controlledCollapsed === undefined) setInternalCollapsed(next);
			onCollapsedChange?.(next);
		};

		const classes = ['flex flex-col items-start', className].filter(Boolean).join(' ');

		const containerStyle: CSSProperties = {
			width: isCollapsed ? 'var(--nok-size-sidebar-collapsed, 64px)' : 'var(--nok-size-sidebar-expanded, 240px)',
			height: '720px',
			background: 'var(--nok-color-background-surface, #FFF)',
			border: showBorder ? '1px solid var(--nok-color-border-default, #D9D9D9)' : undefined,
			transition: 'width 200ms ease',
			...style,
		};

		const groupState: SidebarGroupProps['state'] = isCollapsed ? 'collapsed' : 'expanded';

		const items = Children.map(children, (child) => {
			if (!isValidElement(child)) return child;

			if (child.type === SidebarHeader) {
				return cloneElement(child as ReactElement<SidebarHeaderProps>, {
					showText: !isCollapsed,
					// Expanded always shows the trigger; collapsed hides it until
					// hover. The chevron (workspace switcher hint) only shows up on
					// an expanded header's hover.
					showChevron: !isCollapsed && isHover,
					showTrigger: isCollapsed ? isHover : true,
					onTriggerClick: isForced ? undefined : toggleCollapsed,
				});
			}

			if (child.type === SidebarFooter) {
				if (!showFooter) return null;
				return cloneElement(child as ReactElement<SidebarFooterProps>, {
					showProfileText: !isCollapsed,
				});
			}

			if (child.type === SidebarContent) {
				const content = child as ReactElement<SidebarContentProps>;
				return cloneElement(content, {
					children: Children.map(content.props.children, (groupChild) =>
						isValidElement(groupChild) && groupChild.type === SidebarGroup ?
							cloneElement(groupChild as ReactElement<SidebarGroupProps>, { state: groupState })
						:	groupChild,
					),
				});
			}

			return child;
		});

		return (
			<div
				ref={ref}
				className={classes}
				style={containerStyle}
				onMouseEnter={isForced ? undefined : () => setIsHovered(true)}
				onMouseLeave={isForced ? undefined : () => setIsHovered(false)}
				{...props}>
				{items}
			</div>
		);
	},
);

Sidebar.displayName = 'Sidebar';
