'use client';

import { HTMLAttributes, ReactNode, forwardRef } from 'react';

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
}

// Just a content slot, plus the same spacing-lg inset ModalHeader's title
// uses, so body content aligns flush with the header/footer instead of
// sitting flush against the dialog edge.
export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
	({ children, className, style, ...props }, ref) => {
		const classes = ['p-layout-lg', className].filter(Boolean).join(' ');

		return (
			<div ref={ref} className={classes} style={style} {...props}>
				{children}
			</div>
		);
	},
);

ModalBody.displayName = 'ModalBody';
