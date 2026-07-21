import { SVGProps } from 'react';
import * as icons from './generated/index.js';

export type IconName = keyof typeof icons;
export type IconSize = 'xs' | 'sm' | 'md' | 'lg';
type IconColor =
	| 'default'
	| 'secondary'
	| 'brand'
	| 'inverse'
	| 'disabled'
	| 'success'
	| 'warning'
	| 'error'
	| 'info'
	| 'white';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'color'> {
	name: IconName;
	size?: IconSize;
	/** Omit to inherit currentColor from a parent (e.g. inside Button) */
	color?: IconColor;
}

const sizeClasses: Record<IconSize, string> = {
	xs: 'w-icon-xs h-icon-xs',
	sm: 'w-icon-sm h-icon-sm',
	md: 'w-icon-md h-icon-md',
	lg: 'w-icon-lg h-icon-lg',
};

const colorClasses: Record<IconColor, string> = {
	default: 'text-icon-default',
	secondary: 'text-icon-secondary',
	brand: 'text-icon-brand',
	inverse: 'text-icon-inverse',
	disabled: 'text-icon-disabled',
	success: 'text-icon-success',
	warning: 'text-icon-warning',
	error: 'text-icon-error',
	info: 'text-icon-info',
	white: 'text-icon-white',
};

export const Icon = ({
	name,
	size = 'md',
	color,
	className,
	...props
}: IconProps) => {
	const SvgIcon = icons[name];
	const classes = [sizeClasses[size], color ? colorClasses[color] : '', className]
		.filter(Boolean)
		.join(' ');

	return <SvgIcon className={classes} {...props} />;
};
