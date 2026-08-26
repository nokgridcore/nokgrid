'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { nokTailwindTheme } from '@nokgridcore/tokens/tailwind-theme';
import { Icon, IconName, IconSize } from '../icons/Icon.js';

type AvatarType = 'image' | 'initials' | 'icon';
type AvatarShape = 'circle' | 'square';
type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
	type?: AvatarType;
	shape?: AvatarShape;
	size?: AvatarSize;
	initials?: string;
	icon?: IconName;
	src?: string;
	alt?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
	sm: 'w-avatar-sm h-avatar-sm',
	md: 'w-avatar-md h-avatar-md',
	lg: 'w-avatar-lg h-avatar-lg',
};

const iconSizeForAvatarSize: Record<AvatarSize, IconSize> = {
	sm: 'sm',
	md: 'md',
	lg: 'lg',
};

const shapeClasses: Record<AvatarShape, string> = {
	circle: 'rounded-full',
	square: 'rounded-md',
};

// No caption-lg exists — falls back to caption-md (largest available).
const initialsStyleKey: Record<AvatarSize, string> = {
	sm: 'caption-sm',
	md: 'caption-md',
	lg: 'caption-md',
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
	(
		{
			type = 'initials',
			shape = 'circle',
			size = 'sm',
			initials,
			icon,
			src,
			alt,
			className,
			...props
		},
		ref,
	) => {
		const classes = [
			'inline-flex shrink-0 items-center justify-center overflow-hidden',
			sizeClasses[size],
			shapeClasses[shape],
			type !== 'image' && 'border border-border-default bg-background-overlay',
			className,
		]
			.filter(Boolean)
			.join(' ');

		return (
			<div ref={ref} className={classes} {...props}>
				{type === 'image' && (
					<img src={src} alt={alt ?? ''} className='h-full w-full object-cover' />
				)}
				{type === 'initials' && (
					<span
						className='text-text-primary text-center'
						style={nokTailwindTheme.textStyles[initialsStyleKey[size]]}>
						{initials}
					</span>
				)}
				{type === 'icon' && icon && (
					<Icon name={icon} size={iconSizeForAvatarSize[size]} color='default' />
				)}
			</div>
		);
	},
);

Avatar.displayName = 'Avatar';
