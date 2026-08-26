'use client';

import {
	Children,
	cloneElement,
	forwardRef,
	HTMLAttributes,
	isValidElement,
	MouseEvent as ReactMouseEvent,
	ReactElement,
	ReactNode,
	useState,
} from 'react';
import { MenuItemProps } from './menu-item.js';

export interface MenuProps extends HTMLAttributes<HTMLDivElement> {
	defaultActiveIndex?: number;
	activeIndex?: number;
	onActiveIndexChange?: (index: number | undefined) => void;
	children?: ReactNode;
}

// No token carries this alpha value — literal shadow.
const menuShadowStyle = { boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.06)' };

export const Menu = forwardRef<HTMLDivElement, MenuProps>(
	(
		{ defaultActiveIndex, activeIndex: controlledActiveIndex, onActiveIndexChange, children, className, style, ...props },
		ref,
	) => {
		const [internalActiveIndex, setInternalActiveIndex] = useState(defaultActiveIndex);
		const activeIndex = controlledActiveIndex ?? internalActiveIndex;
		const itemCount = Children.count(children);

		const classes = [
			'inline-flex flex-col rounded-lg border border-border-default bg-background-surface',
			className,
		]
			.filter(Boolean)
			.join(' ');

		return (
			<div ref={ref} role='menu' className={classes} style={{ ...menuShadowStyle, ...style }} {...props}>
				{Children.map(children, (child, index) => {
					if (!isValidElement<MenuItemProps>(child)) return child;

					const isChildDisabled = child.props.state === 'disabled';

					return cloneElement(child, {
						state: isChildDisabled ? 'disabled' : index === activeIndex ? 'active' : 'default',
						style: {
							borderRadius: 0,
							...(index === 0
								? { borderTopLeftRadius: 'var(--nok-spacing-radius-lg)', borderTopRightRadius: 'var(--nok-spacing-radius-lg)' }
								: undefined),
							...(index === itemCount - 1
								? { borderBottomLeftRadius: 'var(--nok-spacing-radius-lg)', borderBottomRightRadius: 'var(--nok-spacing-radius-lg)' }
								: undefined),
							...(index > 0 ? { borderTop: '1px solid var(--nok-color-border-default)' } : undefined),
							...child.props.style,
						},
						onClick: (event: ReactMouseEvent<HTMLDivElement>) => {
							child.props.onClick?.(event);
							if (isChildDisabled) return;
							const nextIndex = index === activeIndex ? undefined : index;
							setInternalActiveIndex(nextIndex);
							onActiveIndexChange?.(nextIndex);
						},
					});
				})}
			</div>
		);
	},
);

Menu.displayName = 'Menu';
