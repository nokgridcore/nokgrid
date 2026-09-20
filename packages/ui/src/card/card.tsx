'use client';

import { CSSProperties, HTMLAttributes, ReactNode, forwardRef } from 'react';

type CardSize = 'sm' | 'md' | 'lg';
export type CardOrientation = 'vertical' | 'horizontal';
export type CardMediaType = 'inset' | 'bleed';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	size?: CardSize;
	orientation?: CardOrientation;
	/** `bleed` runs the media to the card edge; `inset` keeps the card padding around it. */
	mediaType?: CardMediaType;
	showMedia?: boolean;
	/** Slot — a photo or chart. Falls back to a `background-sunken` placeholder. */
	media?: ReactNode;
	leadingIcon?: boolean;
	/**
	 * A slot, not an icon swap — matches the design system's own fix (icon
	 * swaps get locked to the host's icon box, squashing anything larger like
	 * an icon tile or avatar). Pass a bare `<Icon/>` or any other layer.
	 */
	icon?: ReactNode;
	title: string;
	description?: string;
	showDescription?: boolean;
	showActions?: boolean;
	/** Slot for any button set — Card doesn't build the buttons itself. */
	actions?: ReactNode;
}

const SPACE_MD = 'var(--nok-spacing-component-md, 12px)';

const paddingForSize: Record<CardSize, string> = {
	sm: 'var(--nok-spacing-component-md, 12px)',
	md: 'var(--nok-spacing-component-lg, 16px)',
	lg: 'var(--nok-spacing-component-xl, 24px)',
};

const verticalWidth: Record<CardSize, number> = { sm: 280, md: 320, lg: 360 };
const horizontalWidth: Record<CardSize, number> = { sm: 420, md: 480, lg: 560 };
const horizontalMinHeight: Record<CardSize, number> = { sm: 72, md: 90, lg: 108 };
const verticalMediaHeight: Record<CardSize, number> = { sm: 120, md: 140, lg: 160 };
const horizontalMediaWidth: Record<'inset' | 'bleed', Record<CardSize, number>> = {
	inset: { sm: 48, md: 58, lg: 60 },
	bleed: { sm: 72, md: 90, lg: 108 },
};

const titleFontSize: Record<CardSize, string> = {
	sm: 'var(--nok-typography-font-size-14, 14px)',
	md: 'var(--nok-typography-font-size-16, 16px)',
	lg: 'var(--nok-typography-font-size-18, 18px)',
};
const titleLineHeight: Record<CardSize, string> = {
	sm: 'var(--nok-typography-line-height-19-6, 19.6px)',
	md: 'var(--nok-typography-line-height-22-4, 22.4px)',
	lg: 'var(--nok-typography-line-height-25-2, 25.2px)',
};
const descriptionFontSize: Record<CardSize, string> = {
	sm: 'var(--nok-typography-font-size-13, 13px)',
	md: 'var(--nok-typography-font-size-14, 14px)',
	lg: 'var(--nok-typography-font-size-16, 16px)',
};
const descriptionLineHeight: Record<CardSize, string> = {
	sm: 'var(--nok-typography-line-height-19-5, 19.5px)',
	md: 'var(--nok-typography-line-height-22-4, 22.4px)',
	lg: 'var(--nok-typography-line-height-26, 26px)',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
	(
		{
			size = 'sm',
			orientation = 'vertical',
			mediaType = 'inset',
			showMedia = true,
			media,
			leadingIcon = false,
			icon,
			title,
			description,
			showDescription = true,
			showActions = true,
			actions,
			className,
			style,
			...props
		},
		ref,
	) => {
		const isVertical = orientation === 'vertical';
		const isBleed = mediaType === 'bleed';

		const rootStyle: CSSProperties = {
			display: 'flex',
			flexDirection: isVertical ? 'column' : 'row',
			alignItems: isVertical ? 'flex-start' : 'center',
			width: `${isVertical ? verticalWidth[size] : horizontalWidth[size]}px`,
			minHeight: isVertical ? undefined : `${horizontalMinHeight[size]}px`,
			gap: isBleed ? undefined : SPACE_MD,
			padding: isBleed ? undefined : paddingForSize[size],
			overflow: isBleed ? 'clip' : undefined,
			borderRadius: 'var(--nok-spacing-radius-lg, 8px)',
			border: '1px solid var(--nok-color-border-default, #D9D9D9)',
			background: 'var(--nok-color-background-surface, #FFF)',
			...style,
		};

		const mediaFill = media ?? <div style={{ flex: 1, minHeight: 0, minWidth: 0, background: 'var(--nok-color-background-sunken, #D9D9D9)' }} />;

		const mediaArea = showMedia && (
			<div
				style={{
					display: 'flex',
					flexDirection: isVertical ? 'column' : 'row',
					flexShrink: 0,
					alignSelf: 'stretch',
					...(isVertical ? { height: `${verticalMediaHeight[size]}px` } : { width: `${horizontalMediaWidth[mediaType][size]}px` }),
				}}>
				<div
					style={{
						display: 'flex',
						flexDirection: isVertical ? 'column' : 'row',
						flex: 1,
						minHeight: 0,
						minWidth: 0,
						overflow: 'clip',
						borderRadius: isBleed ? undefined : 'var(--nok-spacing-radius-md, 6px)',
					}}>
					{mediaFill}
				</div>
			</div>
		);

		const iconEl = leadingIcon && icon && <div style={{ display: 'flex', alignItems: 'flex-start' }}>{icon}</div>;

		const textEl = (
			<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nok-spacing-component-2xs, 2px)', width: '100%', wordBreak: 'break-word' }}>
				<p
					style={{
						margin: 0,
						color: 'var(--nok-color-text-primary, #141414)',
						fontFamily: 'var(--nok-typography-font-family-brand, "Plus Jakarta Sans")',
						fontSize: titleFontSize[size],
						fontStyle: 'normal',
						fontWeight: 600,
						lineHeight: titleLineHeight[size],
					}}>
					{title}
				</p>
				{showDescription && description && (
					<p
						style={{
							margin: 0,
							color: 'var(--nok-color-text-secondary, #5C5C5C)',
							fontFamily: 'var(--nok-typography-font-family-body, Roboto)',
							fontSize: descriptionFontSize[size],
							fontStyle: 'normal',
							fontWeight: 400,
							lineHeight: descriptionLineHeight[size],
						}}>
						{description}
					</p>
				)}
			</div>
		);

		const actionsEl = showActions && actions && <div style={{ display: 'flex', alignItems: 'flex-start', flexShrink: 0 }}>{actions}</div>;

		const body =
			isVertical ?
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: SPACE_MD,
						width: '100%',
						padding: isBleed ? paddingForSize[size] : undefined,
					}}>
					{iconEl}
					{textEl}
					{actionsEl}
				</div>
			:	<div
					style={{
						display: 'flex',
						flex: 1,
						minWidth: 0,
						alignSelf: 'stretch',
						alignItems: 'center',
						gap: SPACE_MD,
						padding: isBleed ? paddingForSize[size] : undefined,
					}}>
					<div style={{ display: 'flex', flex: 1, minWidth: 0, flexDirection: 'column', alignItems: 'flex-start', gap: SPACE_MD }}>
						{iconEl}
						{textEl}
					</div>
					{actionsEl}
				</div>;

		return (
			<div ref={ref} className={className} style={rootStyle} {...props}>
				{mediaArea}
				{body}
			</div>
		);
	},
);

Card.displayName = 'Card';
