'use client';

import { HTMLAttributes, ReactNode, forwardRef } from 'react';
import { Icon, IconName, IconSize } from '../icons/Icon.js';

type CardSize = 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
	size?: CardSize;
	showIcon?: boolean;
	icon?: IconName;
	title: string;
	description?: string;
	showDescription?: boolean;
	showPrimaryAction?: boolean;
	/** Slot for a `<Button variant="primary">` — Card doesn't build the button itself. */
	primaryAction?: ReactNode;
	showSecondaryAction?: boolean;
	/** Slot for a `<Button variant="secondary">` — Card doesn't build the button itself. */
	secondaryAction?: ReactNode;
}

const iconSizeForCardSize: Record<CardSize, IconSize> = {
	sm: 'sm',
	md: 'md',
	lg: 'lg',
};

const paddingClassForSize: Record<CardSize, string> = {
	sm: 'p-component-md',
	md: 'p-component-lg',
	lg: 'p-component-xl',
};

// gap: 4px / 8px / 12px — the "lg" spec's literal fallback (12px) matches
// spacing-component-md, not -sm as the given var name typo'd.
const gapClassForSize: Record<CardSize, string> = {
	sm: 'gap-component-xs',
	md: 'gap-component-sm',
	lg: 'gap-component-md',
};

const titleFontSizeVar: Record<CardSize, string> = {
	sm: 'var(--nok-typography-font-size-14)',
	md: 'var(--nok-typography-font-size-16)',
	lg: 'var(--nok-typography-font-size-18)',
};

const descriptionFontSizeVar: Record<CardSize, string> = {
	sm: 'var(--nok-typography-font-size-13)',
	md: 'var(--nok-typography-font-size-14)',
	lg: 'var(--nok-typography-font-size-16)',
};

// No "heading" bundle exists in nokTailwindTheme.textStyles (only
// body/label/caption groups are generated) — literal inline styles.
const titleStyle = {
	color: 'var(--nok-color-text-primary)',
	fontFamily: 'var(--nok-typography-font-family-brand)',
	fontStyle: 'normal',
	fontWeight: 600,
	lineHeight: 'var(--nok-typography-line-height-19-6)',
} as const;

const descriptionStyle = {
	color: 'var(--nok-color-text-secondary)',
	fontFamily: 'var(--nok-typography-font-family-body)',
	fontStyle: 'normal',
	fontWeight: 400,
	lineHeight: 'var(--nok-typography-line-height-19-5)',
} as const;

export const Card = forwardRef<HTMLDivElement, CardProps>(
	(
		{
			size = 'sm',
			showIcon = false,
			icon,
			title,
			description,
			showDescription = false,
			showPrimaryAction = false,
			primaryAction,
			showSecondaryAction = false,
			secondaryAction,
			className,
			style,
			...props
		},
		ref,
	) => {
		const classes = [
			'flex flex-col items-start rounded-lg border border-border-default bg-background-surface',
			paddingClassForSize[size],
			gapClassForSize[size],
			className,
		]
			.filter(Boolean)
			.join(' ');

		return (
			<div ref={ref} className={classes} style={{ width: '320px', ...style }} {...props}>
				{showIcon && icon && <Icon name={icon} size={iconSizeForCardSize[size]} color='inverse' />}

				<div className='flex flex-col items-start gap-component-xs'>
					<span style={{ ...titleStyle, fontSize: titleFontSizeVar[size] }}>{title}</span>
					{showDescription && description && (
						<span style={{ ...descriptionStyle, fontSize: descriptionFontSizeVar[size] }}>
							{description}
						</span>
					)}
				</div>

				{(showPrimaryAction || showSecondaryAction) && (
					<div className='inline-flex items-center gap-component-sm'>
						{showPrimaryAction && primaryAction}
						{showSecondaryAction && secondaryAction}
					</div>
				)}
			</div>
		);
	},
);

Card.displayName = 'Card';
