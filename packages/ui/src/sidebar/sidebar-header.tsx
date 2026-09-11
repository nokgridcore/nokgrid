'use client';

import { CSSProperties, HTMLAttributes, forwardRef } from 'react';
import { Icon, IconName } from '../icons/Icon.js';

export interface SidebarHeaderProps extends HTMLAttributes<HTMLDivElement> {
	logo?: IconName;
	showLogo?: boolean;
	title?: string;
	showTitle?: boolean;
	subtext?: string;
	showSubtext?: boolean;
	showChevron?: boolean;
	showTrigger?: boolean;
	showText?: boolean;
	onTriggerClick?: () => void;
}

const titleStyle: CSSProperties = {
	color: 'var(--nok-color-text-primary, #141414)',
	fontFamily: 'var(--nok-typography-font-family-body, Roboto)',
	fontSize: 'var(--nok-typography-font-size-13, 13px)',
	fontStyle: 'normal',
	fontWeight: 500,
	lineHeight: 'var(--nok-typography-line-height-18-2, 18.2px)',
};

const subtextStyle: CSSProperties = {
	color: 'var(--nok-color-text-secondary, #5C5C5C)',
	fontFamily: 'var(--nok-typography-font-family-body, Roboto)',
	fontSize: 'var(--nok-typography-font-size-12, 12px)',
	fontStyle: 'normal',
	fontWeight: 400,
	lineHeight: 'var(--nok-typography-line-height-16-8, 16.8px)',
};

export const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
	(
		{
			logo,
			showLogo = true,
			title,
			showTitle = true,
			subtext,
			showSubtext = true,
			showChevron = false,
			showTrigger = true,
			showText = true,
			onTriggerClick,
			className,
			style,
			...props
		},
		ref,
	) => {
		const classes = ['flex items-center justify-center', className].filter(Boolean).join(' ');

		// With the text column hidden (collapsed sidebar) there's no room left
		// for the trigger inline next to the logo — the reference shows it as a
		// floating circular badge over the logo instead. Exact badge size/inset
		// wasn't given; this is a reasonable placeholder.
		const floatingTrigger = !showText;

		return (
			<div
				ref={ref}
				className={classes}
				style={{
					position: 'relative',
					width: '100%',
					height: 'var(--nok-size-topbar, 56px)',
					padding: '0 var(--nok-spacing-component-md, 12px)',
					gap: 'var(--nok-spacing-component-sm, 8px)',
					...style,
				}}
				{...props}>
				<div
					className={['flex flex-1 items-center', !showText && 'justify-center'].filter(Boolean).join(' ')}
					style={{ gap: '14px', minWidth: 0 }}>
					{showLogo && (
						<div
							className='flex shrink-0 items-center justify-center rounded-md'
							style={{ width: '32px', height: '32px', background: 'var(--nok-color-background-brand, #F05D23)' }}>
							{logo && <Icon name={logo} color='white' />}
						</div>
					)}

					{showText && (
						<div className='flex min-w-0 flex-1 flex-col'>
							{showTitle && title && (
								<span className='truncate' style={titleStyle}>
									{title}
								</span>
							)}
							{showSubtext && subtext && (
								<span className='truncate' style={subtextStyle}>
									{subtext}
								</span>
							)}
						</div>
					)}

					{/* Mounted whenever text is (i.e. only in expanded layout, so it never
					reserves space in collapsed mode) — opacity-animated so hover in/out
					fades rather than snaps. */}
					{showText && (
						<span
							className='shrink-0'
							style={{
								opacity: showChevron ? 1 : 0,
								transition: 'opacity 150ms ease',
								pointerEvents: showChevron ? 'auto' : 'none',
							}}>
							<Icon name='ChevronsUpDown' size='sm' color='secondary' />
						</span>
					)}
				</div>

				{floatingTrigger ?
					// Always mounted while collapsed — opacity/scale-animated so the
					// hover reveal fades in instead of popping. The gap between the
					// sidebar's edge and the badge is empty space, not part of the
					// sidebar's own DOM — without this bridge, moving the cursor
					// through that gap fires the sidebar's mouseleave before it ever
					// reaches the button. The bridge sits flush against the sidebar
					// (no dead zone) with the visible circle at its far edge, so the
					// whole path stays inside a hoverable descendant. Exact badge
					// size/gap wasn't given; this is a reasonable placeholder.
					<div
						className='absolute flex items-center justify-end'
						style={{
							top: '50%',
							right: 'calc(-28px - var(--nok-spacing-component-sm, 8px))',
							width: 'calc(28px + var(--nok-spacing-component-sm, 8px))',
							height: '28px',
							transform: 'translateY(-50%)',
							opacity: showTrigger ? 1 : 0,
							transition: 'opacity 150ms ease',
							pointerEvents: showTrigger ? 'auto' : 'none',
						}}>
						<button
							type='button'
							aria-label='Toggle sidebar'
							onClick={onTriggerClick}
							className='inline-flex shrink-0 items-center justify-center rounded-full bg-background-surface'
							style={{
								width: '28px',
								height: '28px',
								boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.16)',
								transform: `scale(${showTrigger ? 1 : 0.85})`,
								transition: 'transform 150ms ease',
							}}>
							<Icon name='PanelLeft' color='inverse' size='sm' />
						</button>
					</div>
				:	showTrigger && (
						<button
							type='button'
							aria-label='Toggle sidebar'
							onClick={onTriggerClick}
							className='inline-flex shrink-0 items-center justify-center'>
							<Icon name='PanelLeft' color='inverse' size='md' />
						</button>
					)
				}
			</div>
		);
	},
);

SidebarHeader.displayName = 'SidebarHeader';
