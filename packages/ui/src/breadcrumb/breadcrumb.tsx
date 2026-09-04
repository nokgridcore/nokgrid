'use client';

import { Children, HTMLAttributes, ReactElement, ReactNode, cloneElement, forwardRef, isValidElement } from 'react';
import { BreadcrumbItemProps } from './breadcrumb-item.js';

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
	children?: ReactNode;
}

// No Figma frame of its own — this is just the boring composition logic
// (first item gets no leading separator, last item is the current page)
// pulled out so consumers don't have to wire it by hand per item. Only
// applied when the child hasn't already set that prop itself.
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(({ children, className, style, ...props }, ref) => {
	const itemCount = Children.count(children);

	return (
		<nav ref={ref} aria-label='breadcrumb' className={className} style={style} {...props}>
			<ol
				className='m-0 flex list-none flex-wrap items-center p-0'
				style={{ gap: 'var(--nok-spacing-component-xs, 4px)' }}>
				{Children.map(children, (child, index) => {
					if (!isValidElement<BreadcrumbItemProps>(child)) return child;

					const isLast = index === itemCount - 1;
					const typedChild = child as ReactElement<BreadcrumbItemProps>;

					return (
						<li key={typedChild.key ?? index} className='flex items-center'>
							{cloneElement(typedChild, {
								showSeparator: typedChild.props.showSeparator ?? index > 0,
								state: typedChild.props.state ?? (isLast ? 'current' : 'default'),
							})}
						</li>
					);
				})}
			</ol>
		</nav>
	);
});

Breadcrumb.displayName = 'Breadcrumb';
