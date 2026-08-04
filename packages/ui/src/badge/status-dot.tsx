import { HTMLAttributes } from 'react';
import { BadgeVariant, badgeColorClasses } from './badge-colors.js';

type StatusDotSize = 'small' | 'medium';

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
	color?: BadgeVariant;
	size?: StatusDotSize;
}

// 8px (medium) matches spacing-component-sm; 6px (small) has no matching
// token, so it's left literal.
const sizeStyle: Record<StatusDotSize, { size: string }> = {
	small: { size: '6px' },
	medium: { size: 'var(--nok-spacing-component-sm)' },
};

export const StatusDot = ({
	color = 'neutral',
	size = 'small',
	className,
	style,
	...props
}: StatusDotProps) => {
	const classes = [
		'inline-block rounded-full shrink-0',
		badgeColorClasses[color].filled,
		className,
	]
		.filter(Boolean)
		.join(' ');

	const dotStyle = {
		width: sizeStyle[size].size,
		height: sizeStyle[size].size,
		...style,
	};

	return <span className={classes} style={dotStyle} {...props} />;
};
