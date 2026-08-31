'use client';

import { CSSProperties, HTMLAttributes, forwardRef } from 'react';

type TooltipRowColor = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface TooltipRowProps extends HTMLAttributes<HTMLDivElement> {
	color?: TooltipRowColor;
	showSwatch?: boolean;
	label?: string;
	value?: string;
}

const captionStyle: CSSProperties = {
	fontFamily: 'var(--nok-typography-font-family-body, Roboto)',
	fontSize: 'var(--nok-typography-font-size-12, 12px)',
	fontStyle: 'normal',
	fontWeight: 400,
	lineHeight: 'var(--nok-typography-line-height-16-8, 16.8px)',
};

export const TooltipRow = forwardRef<HTMLDivElement, TooltipRowProps>(
	({ color = 1, showSwatch = true, label, value, className, style, ...props }, ref) => {
		const classes = ['inline-flex items-center', className].filter(Boolean).join(' ');

		return (
			<div ref={ref} className={classes} style={{ gap: 'var(--nok-spacing-component-md, 12px)', ...style }} {...props}>
				<div className='inline-flex items-center' style={{ gap: 'var(--nok-space-1, 4px)' }}>
					{showSwatch && (
						<span
							className='shrink-0 rounded-xs'
							style={{
								width: 'var(--nok-space-2, 8px)',
								height: 'var(--nok-space-2, 8px)',
								background: `var(--nok-color-chart-${color})`,
							}}
						/>
					)}
					{label && <span style={{ ...captionStyle, color: 'var(--nok-color-text-secondary, #5C5C5C)' }}>{label}</span>}
				</div>
				{value && (
					<span
						style={{
							...captionStyle,
							color: 'var(--nok-color-text-primary, #141414)',
							textAlign: 'right',
							marginLeft: 'auto',
						}}>
						{value}
					</span>
				)}
			</div>
		);
	},
);

TooltipRow.displayName = 'TooltipRow';
