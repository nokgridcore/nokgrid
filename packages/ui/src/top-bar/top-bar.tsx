'use client';

import { CSSProperties, HTMLAttributes, ReactNode, forwardRef } from 'react';
import { nokTailwindTheme } from '@nokgridcore/tokens/tailwind-theme';
import { Icon, IconName } from '../icons/Icon.js';
import { SearchInput } from '../search-input/search-input.js';

export interface TopBarProps extends HTMLAttributes<HTMLElement> {
	showSidebarToggle?: boolean;
	onSidebarToggle?: () => void;
	logo?: IconName;
	showLogo?: boolean;
	productName?: string;
	showProductName?: boolean;
	/** Leading slot — sits after the product name (e.g. a Breadcrumb). */
	showLeading?: boolean;
	leading?: ReactNode;
	/** Additional slot — a real 32×32 drop target even when empty; hidden while off. */
	showAdditional?: boolean;
	additional?: ReactNode;
	showSearch?: boolean;
	searchPlaceholder?: string;
	/** Actions slot — the icon buttons on the right (help, notifications, settings…). */
	showActions?: boolean;
	actions?: ReactNode;
}

// TODO: cluster gaps not given — component/md (12px), matching the mock.
const CLUSTER_GAP = 'var(--nok-spacing-component-md, 12px)';

const productNameStyle: CSSProperties = {
	...nokTailwindTheme.textStyles['label-md'],
	color: 'var(--nok-color-text-primary, #141414)',
};

// Icon button used for the sidebar toggle — plain, square, hover fill.
const iconButtonClass =
	'inline-flex items-center justify-center rounded-sm text-icon-default transition-colors hover:bg-background-overlay focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nok-color-border-focus)]';

export const TopBar = forwardRef<HTMLElement, TopBarProps>(
	(
		{
			showSidebarToggle = true,
			onSidebarToggle,
			logo = 'LayoutGrid',
			showLogo = true,
			productName = 'NokGridCore',
			showProductName = true,
			showLeading = true,
			leading,
			showAdditional = false,
			additional,
			showSearch = true,
			searchPlaceholder = 'Search...',
			showActions = true,
			actions,
			className,
			style,
			...props
		},
		ref,
	) => {
		return (
			<header
				ref={ref}
				className={['flex items-center justify-between', className].filter(Boolean).join(' ')}
				style={{
					// Full-width — the 1000px in Figma is just the artboard, not a
					// real constraint. Never exceeds the container.
					width: '100%',
					height: 'var(--nok-size-topbar, 56px)',
					padding: '0 var(--nok-spacing-component-lg, 16px)',
					borderBottom: '1px solid var(--nok-color-border-default, #D9D9D9)',
					background: 'var(--nok-color-background-surface, #FFF)',
					...style,
				}}
				{...props}>
				<div className='flex min-w-0 items-center' style={{ gap: CLUSTER_GAP }}>
					{showSidebarToggle && (
						<button
							type='button'
							aria-label='Toggle sidebar'
							onClick={onSidebarToggle}
							className={iconButtonClass}
							style={{ width: '28px', height: '28px' }}>
							<Icon name='PanelLeft' size='sm' color='default' />
						</button>
					)}

					{showLogo && logo && (
						// Branded tile — the mock shows the logo on a brand plate, not
						// a bare glyph. TODO: no icon.tile component / no literal CSS yet.
						<span
							className='inline-flex shrink-0 items-center justify-center rounded-sm'
							style={{ width: '28px', height: '28px', background: 'var(--nok-color-background-brand, #F05D23)' }}>
							<Icon name={logo} size='sm' color='white' />
						</span>
					)}

					{showProductName && productName && (
						<span className='shrink-0' style={productNameStyle}>
							{productName}
						</span>
					)}

					{showLeading && leading}
				</div>

				<div className='flex shrink-0 items-center' style={{ gap: CLUSTER_GAP }}>
					{showSearch && <SearchInput size='sm' placeholder={searchPlaceholder} />}

					{showAdditional && (additional ?? <span aria-hidden='true' style={{ width: '32px', height: '32px' }} />)}

					{showActions && actions}
				</div>
			</header>
		);
	},
);

TopBar.displayName = 'TopBar';
