'use client';

import {
	Children,
	cloneElement,
	forwardRef,
	HTMLAttributes,
	isValidElement,
	MouseEvent,
	ReactNode,
	useState,
} from 'react';
import { TabProps } from './tab.js';

type TabGroupDirection = 'horizontal' | 'vertical';
export type TabGroupAppearance = 'border' | 'filled' | 'elevated';
export type TabGroupWidth = 'fixed' | 'intrinsic';

export interface TabGroupProps extends HTMLAttributes<HTMLDivElement> {
	direction?: TabGroupDirection;
	appearance?: TabGroupAppearance;
	width?: TabGroupWidth;
	defaultActiveIndex?: number;
	activeIndex?: number;
	onActiveIndexChange?: (index: number) => void;
	children: ReactNode;
}

// border-bottom/border-right side follows the same direction flip used by
// Tab itself. Drawn as an inset box-shadow rather than a real border: a real
// border consumes 1px of the container's own content box, so a full-width
// stretched tab's own edge (and its active border) lands 1px short of it.
// An inset shadow doesn't consume any box space, so it sits exactly where
// the tabs' own edges already are — no separate alignment hack needed.
// filled has no container styling at all, elevated is a self-contained
// rounded/overlay surface regardless of direction — matches the design
// system's own fix (elevated moved off sunken, which is unchanged for
// filled's hover).
const appearanceClasses: Record<TabGroupAppearance, Record<TabGroupDirection, string>> = {
	border: {
		horizontal: 'shadow-[inset_0_-1px_0_0_var(--nok-color-border-default)]',
		vertical: 'shadow-[inset_-1px_0_0_0_var(--nok-color-border-default)]',
	},
	filled: {
		horizontal: '',
		vertical: '',
	},
	elevated: {
		horizontal: 'rounded-md bg-background-overlay p-component-xs',
		vertical: 'rounded-md bg-background-overlay p-component-xs',
	},
};

export const TabGroup = forwardRef<HTMLDivElement, TabGroupProps>(
	(
		{
			direction = 'horizontal',
			appearance = 'border',
			width = 'intrinsic',
			defaultActiveIndex = 0,
			activeIndex,
			onActiveIndexChange,
			children,
			className,
			...props
		},
		ref,
	) => {
		const [internalActiveIndex, setInternalActiveIndex] = useState(defaultActiveIndex);
		const activeTabIndex = activeIndex ?? internalActiveIndex;

		// width only applies to horizontal groups — vertical always stays
		// full-width, like the fixed variant, regardless of the prop.
		const classes = [
			direction === 'vertical' || width === 'fixed' ? 'flex' : 'inline-flex',
			direction === 'vertical' ? 'flex-col' : 'flex-row',
			direction === 'horizontal' && width === 'fixed' && '[&>*]:flex-1',
			appearanceClasses[appearance][direction],
			className,
		]
			.filter(Boolean)
			.join(' ');

		return (
			<div ref={ref} className={classes} {...props}>
				{Children.map(children, (child, index) => {
					if (!isValidElement<TabProps>(child)) return child;

					const isDisabled = child.props.state === 'disabled';

					return cloneElement(child, {
						state: isDisabled ? 'disabled' : index === activeTabIndex ? 'active' : 'default',
						onClick: (event: MouseEvent<HTMLButtonElement>) => {
							child.props.onClick?.(event);
							if (isDisabled) return;
							setInternalActiveIndex(index);
							onActiveIndexChange?.(index);
						},
					});
				})}
			</div>
		);
	},
);

TabGroup.displayName = 'TabGroup';
