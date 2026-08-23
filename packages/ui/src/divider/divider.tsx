'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { nokTailwindTheme } from '@nokgridcore/tokens/tailwind-theme';

type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
	orientation?: DividerOrientation;
	/** horizontal only — vertical never shows a label. */
	showLabel?: boolean;
	label?: string;
}

// No explicit size given — defaults to 320px (matching Card's own fixed
// width) so the divider renders visibly without depending on a parent's
// width/flex-stretch context. Fully overridable via style/className.
const DEFAULT_LENGTH = '320px';

const lineStyle = { background: 'var(--nok-color-border-default)' };

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
	({ orientation = 'horizontal', showLabel = false, label, className, style, ...props }, ref) => {
		if (orientation === 'vertical') {
			return (
				<div
					ref={ref}
					role='separator'
					aria-orientation='vertical'
					className={className}
					style={{ width: '1px', height: DEFAULT_LENGTH, ...lineStyle, ...style }}
					{...props}
				/>
			);
		}

		if (showLabel && label) {
			return (
				<div
					ref={ref}
					role='separator'
					aria-orientation='horizontal'
					className={['flex items-center gap-component-sm', className].filter(Boolean).join(' ')}
					style={{ width: DEFAULT_LENGTH, ...style }}
					{...props}>
					<div className='flex-1' style={{ height: '1px', ...lineStyle }} />
					<span
						className='shrink-0 text-text-tertiary'
						style={nokTailwindTheme.textStyles['caption-md']}>
						{label}
					</span>
					<div className='flex-1' style={{ height: '1px', ...lineStyle }} />
				</div>
			);
		}

		return (
			<div
				ref={ref}
				role='separator'
				aria-orientation='horizontal'
				className={className}
				style={{ width: DEFAULT_LENGTH, height: '1px', ...lineStyle, ...style }}
				{...props}
			/>
		);
	},
);

Divider.displayName = 'Divider';
