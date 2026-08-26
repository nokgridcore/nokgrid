'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { nokTailwindTheme } from '@nokgridcore/tokens/tailwind-theme';
import { Icon, IconName } from '../icons/Icon.js';
import { Badge, BadgeVariant, BadgeAppearance } from '../badge/badge.js';
import { Avatar } from '../avatar/avatar.js';

type TableCellColumnType = 'text' | 'numeric' | 'status' | 'person' | 'icon';
type AvatarType = 'image' | 'initials' | 'icon';
type AvatarShape = 'circle' | 'square';
type AvatarSize = 'sm' | 'md' | 'lg';

export interface TableCellProps extends HTMLAttributes<HTMLDivElement> {
	columnType?: TableCellColumnType;
	value?: string;
	subText?: string;
	showSubText?: boolean;

	// status
	badgeVariant?: BadgeVariant;
	badgeAppearance?: BadgeAppearance;
	badgeLabel?: string;
	badgeDot?: boolean;

	// person
	avatarType?: AvatarType;
	avatarShape?: AvatarShape;
	avatarSize?: AvatarSize;
	avatarInitials?: string;
	avatarIcon?: IconName;
	avatarSrc?: string;
	avatarAlt?: string;

	// icon
	icon?: IconName;
}

const valueStyle = nokTailwindTheme.textStyles['body-sm'];
const subTextStyle = nokTailwindTheme.textStyles['caption-md'];

export const TableCell = forwardRef<HTMLDivElement, TableCellProps>(
	(
		{
			columnType = 'text',
			value,
			subText,
			showSubText = false,
			badgeVariant,
			badgeAppearance,
			badgeLabel,
			badgeDot = false,
			avatarType = 'initials',
			avatarShape = 'circle',
			avatarSize = 'sm',
			avatarInitials,
			avatarIcon,
			avatarSrc,
			avatarAlt,
			icon,
			className,
			style,
			...props
		},
		ref,
	) => {
		const isNumeric = columnType === 'numeric';

		const classes = ['flex items-center gap-component-xs py-component-sm px-component-lg', className]
			.filter(Boolean)
			.join(' ');

		const rootStyle = {
			width: '200px',
			justifyContent: isNumeric ? 'flex-end' : 'flex-start',
			...style,
		};

		if (columnType === 'status') {
			return (
				<div ref={ref} className={classes} style={rootStyle} {...props}>
					<Badge variant={badgeVariant} appearance={badgeAppearance} label={badgeLabel ?? ''} dot={badgeDot} />
				</div>
			);
		}

		if (columnType === 'person') {
			return (
				<div ref={ref} className={classes} style={rootStyle} {...props}>
					<div className='flex items-center' style={{ gap: '9px' }}>
						<Avatar
							type={avatarType}
							shape={avatarShape}
							size={avatarSize}
							initials={avatarInitials}
							icon={avatarIcon}
							src={avatarSrc}
							alt={avatarAlt}
						/>
						<div className='flex flex-col'>
							<span style={valueStyle} className='text-text-primary'>
								{value}
							</span>
							{showSubText && subText && (
								<span style={subTextStyle} className='text-text-secondary'>
									{subText}
								</span>
							)}
						</div>
					</div>
				</div>
			);
		}

		if (columnType === 'icon') {
			return (
				<div ref={ref} className={classes} style={rootStyle} {...props}>
					{icon && <Icon name={icon} size='sm' />}
					{value && (
						<span style={valueStyle} className='text-text-primary'>
							{value}
						</span>
					)}
				</div>
			);
		}

		return (
			<div ref={ref} className={classes} style={rootStyle} {...props}>
				<div className={`flex flex-col ${isNumeric ? 'items-end' : 'items-start'}`}>
					<span style={valueStyle} className='text-text-primary'>
						{value}
					</span>
					{showSubText && subText && (
						<span style={subTextStyle} className='text-text-secondary'>
							{subText}
						</span>
					)}
				</div>
			</div>
		);
	},
);

TableCell.displayName = 'TableCell';
