'use client';

import { CSSProperties, HTMLAttributes, ReactNode, forwardRef } from 'react';
import { Avatar } from '../avatar/avatar.js';

// Omit HTMLAttributes' own `content` (a real HTML attribute) — it collides
// with the `content` slot prop below.
export interface SidebarFooterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
	content?: ReactNode;
	showContent?: boolean;
	showProfile?: boolean;
	profileImage?: string;
	profileName?: string;
	profileEmail?: string;
	showProfileText?: boolean;
	attribution?: ReactNode;
	showAttribution?: boolean;
}

// Reusing the same label/md + caption/md pairing SidebarHeader's
// title/subtext use — no separate style was given for the profile text, and
// it reads identically in the reference.
const nameStyle: CSSProperties = {
	color: 'var(--nok-color-text-primary, #141414)',
	fontFamily: 'var(--nok-typography-font-family-body, Roboto)',
	fontSize: 'var(--nok-typography-font-size-13, 13px)',
	fontStyle: 'normal',
	fontWeight: 500,
	lineHeight: 'var(--nok-typography-line-height-18-2, 18.2px)',
};

const emailStyle: CSSProperties = {
	color: 'var(--nok-color-text-secondary, #5C5C5C)',
	fontFamily: 'var(--nok-typography-font-family-body, Roboto)',
	fontSize: 'var(--nok-typography-font-size-12, 12px)',
	fontStyle: 'normal',
	fontWeight: 400,
	lineHeight: 'var(--nok-typography-line-height-16-8, 16.8px)',
};

export const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(
	(
		{
			content,
			showContent = false,
			showProfile = true,
			profileImage,
			profileName,
			profileEmail,
			showProfileText = true,
			attribution,
			showAttribution = false,
			className,
			style,
			...props
		},
		ref,
	) => {
		const classes = ['flex flex-col items-start self-stretch', className].filter(Boolean).join(' ');

		return (
			<div
				ref={ref}
				className={classes}
				style={{
					padding: 'var(--nok-spacing-component-md, 12px)',
					gap: 'var(--nok-spacing-component-sm, 8px)',
					borderTop: '1px solid var(--nok-color-border-default, #D9D9D9)',
					...style,
				}}
				{...props}>
				{showContent && content}

				{showProfile && (
					<div
						className={['flex items-center self-stretch', !showProfileText && 'justify-center'].filter(Boolean).join(' ')}
						style={{ gap: 'var(--nok-spacing-component-sm, 8px)' }}>
						<Avatar type='image' shape='circle' size='sm' src={profileImage} alt={profileName} className='shrink-0' />

						{showProfileText && (
							<div className='flex min-w-0 flex-col'>
								{profileName && (
									<span className='truncate' style={nameStyle}>
										{profileName}
									</span>
								)}
								{profileEmail && (
									<span className='truncate' style={emailStyle}>
										{profileEmail}
									</span>
								)}
							</div>
						)}
					</div>
				)}

				{showAttribution && attribution}
			</div>
		);
	},
);

SidebarFooter.displayName = 'SidebarFooter';
