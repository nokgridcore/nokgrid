import { HTMLAttributes } from 'react';
import { nokTailwindTheme } from '@nokgridcore/tokens/tailwind-theme';
import { Icon, IconName } from '../icons/Icon.js';
import { BadgeVariant, BadgeAppearance, badgeColorClasses } from './badge-colors.js';
import { StatusDot } from './status-dot.js';

export type { BadgeVariant, BadgeAppearance };

type BadgeSize = 'small' | 'medium';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	variant?: BadgeVariant;
	appearance?: BadgeAppearance;
	size?: BadgeSize;
	label: string;
	dot?: boolean;
	leadingIcon?: IconName;
	trailingIcon?: IconName;
	fullyRounded?: boolean;
}

// height: 20px/24px match size-icon-md/size-icon-lg exactly.
// paddingInline: 8px (medium) matches spacing-component-sm; 6px (small) has
// no matching token, so it's the one literal value left.
const sizeStyle: Record<BadgeSize, { height: string; paddingInline: string }> = {
	small: { height: 'var(--nok-size-icon-md)', paddingInline: '6px' },
	medium: {
		height: 'var(--nok-size-icon-lg)',
		paddingInline: 'var(--nok-spacing-component-sm)',
	},
};

const labelStyleKey: Record<BadgeSize, string> = {
	small: 'caption-sm',
	medium: 'caption-md',
};

const iconSizeForBadgeSize: Record<BadgeSize, 'xs' | 'sm'> = {
	small: 'xs',
	medium: 'sm',
};

export const Badge = ({
	variant = 'neutral',
	appearance = 'filled',
	size = 'small',
	label,
	dot = false,
	leadingIcon,
	trailingIcon,
	fullyRounded = false,
	className,
	style,
	...props
}: BadgeProps) => {
	const classes = [
		'inline-flex items-center gap-component-xs',
		fullyRounded ? 'rounded-full' : 'rounded-sm',
		badgeColorClasses[variant][appearance],
		className,
	]
		.filter(Boolean)
		.join(' ');

	const badgeStyle = {
		height: sizeStyle[size].height,
		paddingInline: sizeStyle[size].paddingInline,
		...style,
	};

	return (
		<span className={classes} style={badgeStyle} {...props}>
			{/* StatusDot's own variant colour can match the badge's own fill
			(e.g. filled+neutral is background-sunken on both), making it
			disappear — `currentColor` instead inherits the badge's own content
			colour, which already contrasts correctly in every appearance. */}
			{dot && <StatusDot color={variant} size={size} style={{ background: 'currentColor' }} />}
			{leadingIcon && (
				<Icon name={leadingIcon} size={iconSizeForBadgeSize[size]} />
			)}
			<span style={nokTailwindTheme.textStyles[labelStyleKey[size]]}>
				{label}
			</span>
			{trailingIcon && (
				<Icon name={trailingIcon} size={iconSizeForBadgeSize[size]} />
			)}
		</span>
	);
};
