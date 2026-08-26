'use client';

import {
	Children,
	CSSProperties,
	HTMLAttributes,
	ReactElement,
	ReactNode,
	cloneElement,
	forwardRef,
	isValidElement,
} from 'react';
import { ModalBody } from './modal-body.js';

type ModalPosition = 'center' | 'bottom' | 'start' | 'end' | 'full-screen';
type ModalSize = 'small' | 'medium' | 'large';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
	position?: ModalPosition;
	size?: ModalSize;
	children?: ReactNode;
}

const sizeWidth: Record<ModalSize, string> = {
	small: '480px',
	medium: '640px',
	large: '800px',
};

// Where the dialog sits within the fixed full-viewport overlay.
const positionAlignClasses: Record<ModalPosition, string> = {
	center: 'items-center justify-center',
	bottom: 'items-end justify-center',
	start: 'items-center justify-start',
	end: 'items-center justify-end',
	'full-screen': 'items-stretch justify-stretch',
};

// Only round the corners that are actually visible — an edge the dialog
// sits flush against (or full-screen, which has none) stays square.
// Order: top-left top-right bottom-right bottom-left.
const RADIUS = 'var(--nok-spacing-radius-xl)';
const positionBorderRadius: Record<ModalPosition, string> = {
	center: RADIUS,
	bottom: `${RADIUS} ${RADIUS} 0 0`,
	start: `0 ${RADIUS} ${RADIUS} 0`,
	end: `${RADIUS} 0 0 ${RADIUS}`,
	'full-screen': '0',
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
	({ position = 'center', size = 'medium', children, className, style, ...props }, ref) => {
		const dialogStyle: CSSProperties = {
			borderRadius: positionBorderRadius[position],
			background: 'var(--nok-color-background-surface)',
			boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.12)',
		};

		if (position === 'bottom') {
			dialogStyle.width = '100%';
		} else if (position === 'start' || position === 'end') {
			dialogStyle.width = sizeWidth[size];
			dialogStyle.height = '100%';
		} else if (position === 'full-screen') {
			dialogStyle.width = '100%';
			dialogStyle.height = '100%';
		} else {
			dialogStyle.width = sizeWidth[size];
		}

		const classes = ['flex flex-col overflow-hidden', className].filter(Boolean).join(' ');

		// start/end/full-screen force the dialog to a fixed viewport height —
		// without this, Header/Body/Footer just stack at the top per normal
		// flow, leaving Footer floating right under Body instead of pinned to
		// the bottom. Growing ModalBody to fill the leftover space (and
		// letting it scroll its own overflow) pushes Footer down to the edge.
		const hasFixedHeight = position === 'start' || position === 'end' || position === 'full-screen';
		const dialogChildren = hasFixedHeight
			? Children.map(children, (child) =>
					isValidElement(child) && child.type === ModalBody ?
						cloneElement(child as ReactElement<{ style?: CSSProperties }>, {
							style: { flex: 1, overflow: 'auto', ...(child.props as { style?: CSSProperties }).style },
						})
					:	child,
				)
			: children;

		return (
			<div className='fixed inset-0'>
				<div
					className='absolute inset-0'
					// Literal color, not the --nok-color-background-inverse token —
					// that token flips per theme (near-black in light, white in
					// dark), so a backdrop built from it turns near-invisible in
					// dark mode. A backdrop's job is to darken whatever's behind it
					// the same way regardless of theme.
					style={{ background: '#080708', opacity: 0.5 }}
				/>

				<div className={`absolute inset-0 flex ${positionAlignClasses[position]}`}>
					<div ref={ref} className={classes} style={{ ...dialogStyle, ...style }} {...props}>
						{dialogChildren}
					</div>
				</div>
			</div>
		);
	},
);

Modal.displayName = 'Modal';
