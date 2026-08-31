'use client';

import { CSSProperties, HTMLAttributes, ReactNode, forwardRef } from 'react';
import { Icon, IconName } from '../icons/Icon.js';

type ToastColor = 'neutral' | 'primary' | 'success' | 'warning' | 'error';
type ToastOrientation = 'horizontal' | 'vertical';
type ToastPosition = 'top' | 'bottom';

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
	color?: ToastColor;
	orientation?: ToastOrientation;
	/**
	 * Where this toast is meant to be mounted (top/bottom of the viewport) —
	 * a layout concern for whatever renders the toast stack, not something
	 * that changes the Toast's own CSS.
	 */
	position?: ToastPosition;
	showStartSlot?: boolean;
	title?: string;
	showTitle?: boolean;
	text?: string;
	showText?: boolean;
	content?: ReactNode;
	showContentSlot?: boolean;
	primaryAction?: ReactNode;
	showPrimaryAction?: boolean;
	secondaryAction?: ReactNode;
	showSecondaryAction?: boolean;
	onClose?: () => void;
	showClose?: boolean;
	stacked?: boolean;
}

// TODO: neutral/primary still share the Info placeholder — primary's own
// icon hasn't been given yet.
const variantIcon: Record<ToastColor, IconName> = {
	neutral: 'Info',
	primary: 'Info',
	success: 'CircleCheck',
	warning: 'AlertTriangle',
	error: 'CircleX',
};

// Same semantic families Alert's "strong" appearance already uses — matches
// the solid, borderless backgrounds in the reference (only neutral keeps a
// border, since it's the only one not already a saturated fill).
const colorClasses: Record<ToastColor, string> = {
	neutral: 'border border-border-default bg-background-surface',
	primary: 'bg-background-brand',
	success: 'bg-background-success-strong',
	warning: 'bg-background-warning-strong',
	error: 'bg-background-error-strong',
};

// Dark text/icon for neutral & warning (light backgrounds), white for
// primary/success/error (saturated backgrounds) — "icons take color of
// title" is handled by setting this as the container's `color` and leaving
// Icon's own `color` prop unset so it inherits currentColor.
const titleColor: Record<ToastColor, string> = {
	neutral: 'var(--nok-color-text-primary, #141414)',
	primary: '#FFF',
	success: '#FFF',
	warning: 'var(--nok-color-text-primary, #141414)',
	error: '#FFF',
};

// Only neutral/warning differ from their title color (secondary gray vs the
// same dark primary); primary/success/error stay white like their title.
const textColor: Record<ToastColor, string> = {
	neutral: 'var(--nok-color-text-secondary, #5C5C5C)',
	primary: '#FFF',
	success: '#FFF',
	warning: 'var(--nok-color-text-primary, #141414)',
	error: '#FFF',
};

const titleStyle: CSSProperties = {
	fontFamily: 'var(--nok-typography-font-family-body, Roboto)',
	fontSize: 'var(--nok-typography-font-size-13, 13px)',
	fontStyle: 'normal',
	fontWeight: 500,
	lineHeight: 'var(--nok-typography-line-height-18-2, 18.2px)',
};

const textStyle: CSSProperties = {
	fontFamily: 'var(--nok-typography-font-family-body, Roboto)',
	fontSize: 'var(--nok-typography-font-size-13, 13px)',
	fontStyle: 'normal',
	fontWeight: 400,
	lineHeight: 'var(--nok-typography-line-height-19-5, 19.5px)',
};

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
	(
		{
			color = 'neutral',
			orientation = 'horizontal',
			position = 'top',
			showStartSlot = true,
			title,
			showTitle = true,
			text,
			showText = true,
			content,
			showContentSlot = false,
			primaryAction,
			showPrimaryAction = false,
			secondaryAction,
			showSecondaryAction = false,
			onClose,
			showClose = true,
			stacked = false,
			className,
			style,
			...props
		},
		ref,
	) => {
		void position;
		void stacked;

		const isVertical = orientation === 'vertical';
		const classes = ['flex', colorClasses[color], className].filter(Boolean).join(' ');

		const containerStyle: CSSProperties = {
			width: '420px',
			padding: 'var(--nok-spacing-component-lg, 16px)',
			alignItems: isVertical ? 'flex-start' : 'center',
			gap: 'var(--nok-spacing-component-md, 12px)',
			borderRadius: 'var(--nok-spacing-radius-lg, 8px)',
			boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.10)',
			color: titleColor[color],
			...style,
		};

		const startIcon = showStartSlot && <Icon name={variantIcon[color]} className='shrink-0' />;

		const closeButton = showClose && (
			<button type='button' aria-label='Close' onClick={onClose} className='inline-flex shrink-0'>
				<Icon name='X' size='sm' />
			</button>
		);

		const titleEl = showTitle && title && <span style={titleStyle}>{title}</span>;
		const textEl = showText && text && <span style={{ ...textStyle, color: textColor[color] }}>{text}</span>;
		const contentEl = showContentSlot && content;

		const actions = (showPrimaryAction || showSecondaryAction) && (
			<div className='flex shrink-0 items-center' style={{ gap: 'var(--nok-spacing-component-sm, 8px)' }}>
				{showPrimaryAction && primaryAction}
				{showSecondaryAction && secondaryAction}
			</div>
		);

		const body = (
			<div className='flex flex-1 flex-col' style={{ gap: 'var(--nok-spacing-component-xs, 4px)' }}>
				{isVertical ?
					<div className='flex items-center gap-component-sm'>
						{titleEl}
						<div className='flex' style={{ marginLeft: 'auto' }}>
							{closeButton}
						</div>
					</div>
				:	titleEl}
				{textEl}
				{contentEl}
				{isVertical && actions}
			</div>
		);

		return (
			<div ref={ref} className={classes} style={containerStyle} {...props}>
				{startIcon}
				{body}
				{!isVertical && actions}
				{!isVertical && closeButton}
			</div>
		);
	},
);

Toast.displayName = 'Toast';
