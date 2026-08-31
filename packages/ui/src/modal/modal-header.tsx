'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { nokTailwindTheme } from '@nokgridcore/tokens/tailwind-theme';
import { Icon } from '../icons/Icon.js';

type ModalHeaderArtworkType = 'hero' | 'standard';
type ModalHeaderTitleStyle = 'standard' | 'promotional';
type ModalHeaderCloseButtonPosition = 'overlay' | 'inline';

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
	artworkType?: ModalHeaderArtworkType;
	titleStyle?: ModalHeaderTitleStyle;
	closeButtonPosition?: ModalHeaderCloseButtonPosition;
	title?: string;
	showTitle?: boolean;
	showArtwork?: boolean;
	showCloseButton?: boolean;
	subtitle?: string;
	showSubtitle?: boolean;
	onClose?: () => void;
}

// No "heading"/"display" bundle exists in nokTailwindTheme.textStyles (only
// body/label/caption groups are generated) — literal inline styles.
const titleStyles: Record<ModalHeaderTitleStyle, object> = {
	standard: {
		color: 'var(--nok-color-text-primary)',
		fontFamily: 'var(--nok-typography-font-family-brand)',
		fontSize: 'var(--nok-typography-font-size-16)',
		fontStyle: 'normal',
		fontWeight: 600,
		lineHeight: 'var(--nok-typography-line-height-22-4)',
	},
	promotional: {
		color: 'var(--nok-color-text-primary)',
		fontFamily: 'var(--nok-typography-font-family-brand)',
		fontSize: 'var(--nok-typography-font-size-20)',
		fontStyle: 'normal',
		fontWeight: 600,
		lineHeight: 'var(--nok-typography-line-height-26)',
	},
};

const subtitleStyle = nokTailwindTheme.textStyles['body-md'];

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
	(
		{
			artworkType = 'hero',
			titleStyle = 'standard',
			closeButtonPosition = 'overlay',
			title,
			showTitle = true,
			showArtwork = true,
			showCloseButton = true,
			subtitle,
			showSubtitle = false,
			onClose,
			className,
			style,
			...props
		},
		ref,
	) => {
		const classes = ['flex flex-col', className].filter(Boolean).join(' ');

		// Overlay only makes sense sitting on top of the hero artwork — any
		// other combination (standard artwork, or no artwork at all) falls
		// back to the inline treatment.
		const isOverlay = artworkType === 'hero' && closeButtonPosition === 'overlay';
		const showInlineCloseButton = showCloseButton && !isOverlay;

		return (
			<div ref={ref} className={classes} style={style} {...props}>
				{showArtwork && artworkType === 'hero' && (
					<div
						style={{
							position: 'relative',
							width: '100%',
							height: '160px',
							background: 'var(--nok-color-background-sunken)',
						}}>
						{showCloseButton && isOverlay && (
							<button
								type='button'
								aria-label='Close'
								onClick={onClose}
								className='inline-flex rounded-full bg-background-surface'
								style={{
									width: '32px',
									height: '32px',
									justifyContent: 'center',
									alignItems: 'center',
									position: 'absolute',
									right: '12px',
									top: '12px',
								}}>
								<Icon name='X' size='sm' color='secondary' />
							</button>
						)}
					</div>
				)}

				<div
					className='flex items-center p-layout-lg'
					style={{
						gap: showArtwork && artworkType === 'standard' ? '12px' : undefined,
					}}>
					{showArtwork && artworkType === 'standard' && (
						<div
							className='rounded-md shrink-0'
							style={{
								width: '48px',
								height: '48px',
								background: 'var(--nok-color-background-sunken)',
							}}
						/>
					)}

					<div className='flex flex-1 flex-col'>
						<div className='flex items-center'>
							{showTitle && title && (
								<span style={titleStyles[titleStyle]}>{title}</span>
							)}

							{showInlineCloseButton && (
								<button
									type='button'
									aria-label='Close'
									onClick={onClose}
									className='inline-flex'
									style={{
										width: '32px',
										height: '32px',
										justifyContent: 'center',
										alignItems: 'center',
										marginLeft: 'auto',
										// The 32px hit box is bigger than the 16px icon it
										// centers, so its edge sits 8px further in than the
										// icon glyph itself — pull the box out by that same
										// 8px so the glyph lines up flush with the title's
										// own inset, keeping the larger tap target..
										marginRight: '-8px',
									}}>
									<Icon name='X' size='sm' color='inverse' />
								</button>
							)}
						</div>

						{showSubtitle && subtitle && (
							<span style={subtitleStyle} className='text-text-secondary'>
								{subtitle}
							</span>
						)}
					</div>
				</div>
			</div>
		);
	},
);

ModalHeader.displayName = 'ModalHeader';
