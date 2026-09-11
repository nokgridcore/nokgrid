'use client';

import { HTMLAttributes, ReactNode, cloneElement, forwardRef, isValidElement } from 'react';

type ModalFooterLayout = 'standard' | 'full-width-single-button';

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
	layout?: ModalFooterLayout;
	showPrimaryAction?: boolean;
	/** Slot for the primary `<Button />`. */
	primaryAction?: ReactNode;
	showSecondaryAction?: boolean;
	/** Slot for the secondary `<Button />`. Ignored when layout is full-width-single-button. */
	secondaryAction?: ReactNode;
	showTertiaryAction?: boolean;
	/** Slot for the tertiary `<Button />`. Ignored when layout is full-width-single-button. */
	tertiaryAction?: ReactNode;
}

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
	(
		{
			layout = 'standard',
			showPrimaryAction = true,
			primaryAction,
			showSecondaryAction = false,
			secondaryAction,
			showTertiaryAction = false,
			tertiaryAction,
			className,
			style,
			...props
		},
		ref,
	) => {
		const classes = ['flex items-center gap-component-sm p-component-lg', className]
			.filter(Boolean)
			.join(' ');

		if (layout === 'full-width-single-button') {
			// Only the primary action survives this layout — secondary/tertiary
			// go off regardless of their own show* toggles.
			const fullWidthPrimaryAction =
				isValidElement<{ style?: object }>(primaryAction) ?
					cloneElement(primaryAction, { style: { flex: 1, ...primaryAction.props.style } })
				:	primaryAction;

			return (
				<div ref={ref} className={classes} style={style} {...props}>
					{showPrimaryAction && fullWidthPrimaryAction}
				</div>
			);
		}

		return (
			<div ref={ref} className={classes} style={style} {...props}>
				{showTertiaryAction && tertiaryAction}

				<div className='flex items-center gap-component-sm' style={{ marginLeft: 'auto' }}>
					{showPrimaryAction && primaryAction}
					{showSecondaryAction && secondaryAction}
				</div>
			</div>
		);
	},
);

ModalFooter.displayName = 'ModalFooter';
