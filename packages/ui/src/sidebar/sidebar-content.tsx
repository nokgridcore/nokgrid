'use client';

import { HTMLAttributes, ReactNode, forwardRef } from 'react';

export interface SidebarContentProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
}

// Just a stacking/scroll region for one or more SidebarGroups between the
// header and footer — no container CSS given yet.
export const SidebarContent = forwardRef<HTMLDivElement, SidebarContentProps>(
	({ children, className, style, ...props }, ref) => {
		// self-stretch: Sidebar's own container uses align-items: flex-start, so
		// without this SidebarContent shrink-wraps to its widest child's natural
		// width instead of the full sidebar width — which then makes every
		// MenuItem's own width: 100% resolve against that shrunk width instead
		// of the real one, leaving shorter-labeled items short of the edge.
		const classes = ['flex flex-1 flex-col self-stretch overflow-y-auto', className].filter(Boolean).join(' ');

		return (
			<div
				ref={ref}
				className={classes}
				// Figma sidebar content: 8px above the first group, 16px between groups.
				style={{
					paddingTop: 'var(--nok-spacing-component-sm, 8px)',
					gap: 'var(--nok-spacing-component-lg, 16px)',
					...style,
				}}
				{...props}>
				{children}
			</div>
		);
	},
);

SidebarContent.displayName = 'SidebarContent';
