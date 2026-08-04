import { HTMLAttributes } from 'react';
import { nokTailwindTheme } from '@nokgridcore/tokens/tailwind-theme';
import { BadgeVariant, badgeColorClasses } from './badge-colors.js';

type BadgeCountSize = 'small' | 'medium';

export interface BadgeCountProps extends HTMLAttributes<HTMLSpanElement> {
	variant?: BadgeVariant;
	size?: BadgeCountSize;
	count: number;
}

// Same bg/text treatment as Badge's "filled" appearance — BadgeCount has no
// appearance prop of its own.
// 16px/20px match size-icon-sm/size-icon-md; 4px matches spacing-component-xs.
const sizeStyle: Record<
	BadgeCountSize,
	{ height: string; minWidth: string; paddingInline: string }
> = {
	small: {
		height: 'var(--nok-size-icon-sm)',
		minWidth: 'var(--nok-size-icon-sm)',
		paddingInline: 'var(--nok-spacing-component-xs)',
	},
	medium: {
		height: 'var(--nok-size-icon-md)',
		minWidth: 'var(--nok-size-icon-md)',
		paddingInline: 'var(--nok-spacing-component-xs)',
	},
};

const labelStyleKey: Record<BadgeCountSize, string> = {
	small: 'caption-sm',
	medium: 'caption-md',
};

export const BadgeCount = ({
	variant = 'neutral',
	size = 'small',
	count,
	className,
	style,
	...props
}: BadgeCountProps) => {
	const classes = [
		'inline-flex items-center justify-center rounded-full',
		badgeColorClasses[variant].filled,
		className,
	]
		.filter(Boolean)
		.join(' ');

	const countStyle = {
		height: sizeStyle[size].height,
		minWidth: sizeStyle[size].minWidth,
		paddingInline: sizeStyle[size].paddingInline,
		...style,
	};

	return (
		<span className={classes} style={countStyle} {...props}>
			<span style={nokTailwindTheme.textStyles[labelStyleKey[size]]}>
				{count}
			</span>
		</span>
	);
};
