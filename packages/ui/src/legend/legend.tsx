'use client';

import { CSSProperties, HTMLAttributes, forwardRef } from 'react';

type LegendSwatchShape = 'line' | 'square' | 'circle';
type LegendColor = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 'neutral' | 'positive' | 'negative';

// Omit HTMLAttributes' own `color` (a real HTML attribute) — it collides with
// the `color` chart-token prop below. Same as TooltipRow.
export interface LegendProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
	swatchShape?: LegendSwatchShape;
	color?: LegendColor;
	label?: string;
}

const labelStyle: CSSProperties = {
	color: 'var(--nok-color-text-secondary, #5C5C5C)',
	fontFamily: 'var(--nok-typography-font-family-body, Roboto)',
	fontSize: 'var(--nok-typography-font-size-12, 12px)',
	fontStyle: 'normal',
	fontWeight: 400,
	lineHeight: 'var(--nok-typography-line-height-16-8, 16.8px)',
};

// TODO: swatch dimensions not given — 8px square/dot matches TooltipRow's
// swatch; the line reads as a 12×2 bar (chart line weight).
const swatchStyleForShape: Record<LegendSwatchShape, CSSProperties> = {
	line: { width: '12px', height: '2px', borderRadius: 'var(--nok-spacing-radius-full, 9999px)' },
	square: { width: '8px', height: '8px', borderRadius: 'var(--nok-spacing-radius-xs, 2px)' },
	circle: { width: '8px', height: '8px', borderRadius: 'var(--nok-spacing-radius-full, 9999px)' },
};

export const Legend = forwardRef<HTMLDivElement, LegendProps>(
	({ swatchShape = 'square', color = 1, label, className, style, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={['inline-flex items-center', className].filter(Boolean).join(' ')}
				style={{ gap: 'var(--nok-spacing-component-xs, 4px)', ...style }}
				{...props}>
				<span
					className='shrink-0'
					style={{ ...swatchStyleForShape[swatchShape], background: `var(--nok-color-chart-${color})` }}
				/>
				{label && <span style={labelStyle}>{label}</span>}
			</div>
		);
	},
);

Legend.displayName = 'Legend';
