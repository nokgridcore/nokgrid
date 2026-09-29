import { CSSProperties, ReactNode } from 'react';
import { Button } from '../button/button.js';
import { Card } from '../card/card.js';
import {
	cssVar,
	darkReferences,
	lightReferences,
	primitiveNames,
	primitives,
	remToPx,
	semanticDark,
	semanticLight,
	semanticNames,
} from './token-data.js';

const text = (weight = 400): CSSProperties => ({
	fontFamily: 'var(--nok-typography-font-family-body, Roboto)',
	fontWeight: weight,
	color: 'var(--nok-color-text-primary)',
});

const mono: CSSProperties = { fontFamily: 'ui-monospace, Menlo, Consolas, monospace', fontSize: '12px', color: 'var(--nok-color-text-secondary)' };
const cell: CSSProperties = { padding: '10px 12px', borderBottom: '1px solid var(--nok-color-border-default)', verticalAlign: 'middle', textAlign: 'left' };
const head: CSSProperties = { ...cell, ...text(600), fontSize: '12px', color: 'var(--nok-color-text-secondary)' };
const table: CSSProperties = { width: '100%', borderCollapse: 'collapse', ...text(), fontSize: '13px' };

// Transparent tokens (rgba) need something behind them to read as a swatch.
const checker =
	'repeating-conic-gradient(var(--nok-color-background-overlay) 0% 25%, var(--nok-color-background-surface) 0% 50%) 50% / 10px 10px';

export const Swatch = ({ value, size = 28 }: { value: string; size?: number }) => (
	<span
		style={{
			display: 'inline-block',
			flexShrink: 0,
			width: size,
			height: size,
			borderRadius: 'var(--nok-spacing-radius-sm)',
			border: '1px solid var(--nok-color-border-default)',
			background: checker,
			overflow: 'hidden',
		}}>
		<span style={{ display: 'block', width: '100%', height: '100%', background: value }} />
	</span>
);

const humanise = (s: string) => s.replace(/-/g, ' ');

// ───────────────────────────── Colour ─────────────────────────────

export const ColourPrimitives = () => {
	const palettes = new Map<string, { step: string; name: string }[]>();
	for (const name of primitiveNames('color-')) {
		const [, palette = '', ...rest] = name.split('-');
		const entries = palettes.get(palette) ?? [];
		entries.push({ step: rest.join('-'), name });
		palettes.set(palette, entries);
	}
	const byStep = (a: { step: string }, b: { step: string }) => parseFloat(a.step) - parseFloat(b.step) || a.step.localeCompare(b.step);

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
			{[...palettes.entries()].map(([palette, steps]) => (
				<section key={palette}>
					<h4 style={{ ...text(600), margin: '0 0 8px', textTransform: 'capitalize' }}>{palette}</h4>
					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: '8px' }}>
						{steps.sort(byStep).map(({ step, name }) => (
							<div key={name} title={`--nok-${name}`} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
								<Swatch value={cssVar(name)} size={56} />
								<span style={{ ...text(600), fontSize: '12px' }}>{step}</span>
								<span style={mono}>{primitives.get(name)}</span>
							</div>
						))}
					</div>
				</section>
			))}
		</div>
	);
};

const ThemeCell = ({ value, reference }: { value?: string; reference?: string }) => (
	<td style={cell}>
		{value === undefined ?
			<span style={mono}>-</span>
		:	<span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
				<Swatch value={value} />
				<span style={{ display: 'flex', flexDirection: 'column' }}>
					<span style={mono}>{value}</span>
					{reference && <span style={{ ...mono, color: 'var(--nok-color-text-tertiary)' }}>{reference}</span>}
				</span>
			</span>
		}
	</td>
);

export const ColourSemantics = ({ group }: { group: 'background' | 'text' | 'icon' | 'border' | 'action' | 'chart' }) => {
	const names = semanticNames(`color-${group}-`);
	return (
		<table style={table}>
			<thead>
				<tr>
					<th style={head}>Token</th>
					<th style={head}>Light</th>
					<th style={head}>Dark</th>
				</tr>
			</thead>
			<tbody>
				{names.map((name) => (
					<tr key={name}>
						<td style={{ ...cell, ...mono }}>--nok-{name}</td>
						<ThemeCell value={semanticLight.get(name)} reference={lightReferences.get(name)} />
						<ThemeCell value={semanticDark.get(name)} reference={darkReferences.get(name)} />
					</tr>
				))}
			</tbody>
		</table>
	);
};

/** A single token resolved in both themes — used for worked examples. */
export const TokenBothThemes = ({ name }: { name: string }) => (
	<table style={table}>
		<thead>
			<tr>
				<th style={head}>Token</th>
				<th style={head}>Light</th>
				<th style={head}>Dark</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td style={{ ...cell, ...mono }}>--nok-{name}</td>
				<ThemeCell value={semanticLight.get(name)} reference={lightReferences.get(name)} />
				<ThemeCell value={semanticDark.get(name)} reference={darkReferences.get(name)} />
			</tr>
		</tbody>
	</table>
);

// ─────────────────────────── Typography ───────────────────────────

const weightValue: Record<string, number> = { regular: 400, medium: 500, semibold: 600, bold: 700 };

export const TypeFamilies = () => (
	<table style={table}>
		<thead>
			<tr>
				<th style={head}>Token</th>
				<th style={head}>Family</th>
				<th style={head}>Specimen</th>
			</tr>
		</thead>
		<tbody>
			{primitiveNames('typography-font-family-').map((name) => (
				<tr key={name}>
					<td style={{ ...cell, ...mono }}>--nok-{name}</td>
					<td style={cell}>{primitives.get(name)}</td>
					<td style={{ ...cell, fontFamily: cssVar(name), fontSize: '20px' }}>Aa Bb Cc 0123456789</td>
				</tr>
			))}
		</tbody>
	</table>
);

export const TypeScale = ({ group, sample = 'The quick brown fox jumps over the lazy dog' }: { group: string; sample?: string }) => {
	const steps = [...new Set(semanticNames(`typography-${group}-`).map((n) => n.split('-')[2] ?? ''))];
	const semantic = (step: string, prop: string) => `typography-${group}-${step}-${prop}`;

	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			{steps.map((step) => {
				const size = semanticLight.get(semantic(step, 'font-size'));
				const lineHeight = semanticLight.get(semantic(step, 'line-height'));
				const weight = semanticLight.get(semantic(step, 'font-weight'));
				const family = semanticLight.get(semantic(step, 'font-family'));
				return (
					<div key={step} style={{ display: 'grid', gridTemplateColumns: 'minmax(160px, 220px) 1fr', gap: '16px', alignItems: 'center', ...cell }}>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
							<span style={{ ...text(600), fontSize: '13px' }}>
								{group}/{step}
							</span>
							<span style={mono}>
								{family} · {remToPx(size)}px / {remToPx(lineHeight)}px · {weight}
							</span>
						</div>
						<span
							style={{
								fontFamily: cssVar(semantic(step, 'font-family')),
								fontSize: cssVar(semantic(step, 'font-size')),
								lineHeight: cssVar(semantic(step, 'line-height')),
								fontWeight: weightValue[weight ?? 'regular'] ?? 400,
								color: 'var(--nok-color-text-primary)',
							}}>
							{sample}
						</span>
					</div>
				);
			})}
		</div>
	);
};

/** Flags a token that the pipeline emitted but that isn't usable as a value. */
export const brokenTokens = (prefix: string) => semanticNames(prefix).filter((name) => semanticLight.get(name)?.includes('[object'));

// ───────────────────────────── Spacing ─────────────────────────────

const Bar = ({ px }: { px: number | undefined }) => (
	<span
		style={{
			display: 'block',
			height: '12px',
			width: `${Math.min(px ?? 0, 480)}px`,
			minWidth: '1px',
			borderRadius: 'var(--nok-spacing-radius-xs)',
			background: 'var(--nok-color-background-brand)',
		}}
	/>
);

const valueCells = (value: string | undefined) => (
	<>
		<td style={{ ...cell, ...mono }}>{value}</td>
		<td style={{ ...cell, ...mono }}>{remToPx(value)}px</td>
	</>
);

export const ScaleTable = ({
	names,
	showReference = false,
	referenceOf,
}: {
	names: string[];
	showReference?: boolean;
	referenceOf?: (name: string) => string | undefined;
}) => (
	<table style={table}>
		<thead>
			<tr>
				<th style={head}>Token</th>
				<th style={head}>rem</th>
				<th style={head}>px</th>
				{showReference && <th style={head}>Resolves to</th>}
				<th style={{ ...head, width: '50%' }}>Visual</th>
			</tr>
		</thead>
		<tbody>
			{names.map((name) => {
				const value = semanticLight.get(name) ?? primitives.get(name);
				return (
					<tr key={name}>
						<td style={{ ...cell, ...mono }}>--nok-{name}</td>
						{valueCells(value)}
						{showReference && <td style={{ ...cell, ...mono }}>{referenceOf?.(name)}</td>}
						<td style={cell}>
							<Bar px={remToPx(value)} />
						</td>
					</tr>
				);
			})}
		</tbody>
	</table>
);

export const PrimitiveSpacing = () => <ScaleTable names={primitiveNames('space-')} />;
export const SemanticSpacing = ({ group }: { group: 'component' | 'layout' }) => <ScaleTable names={semanticNames(`spacing-${group}-`)} />;

/** The 4px grid unit, read from the smallest whole step in the primitive scale. */
export const BaseUnit = () => <>{remToPx(primitives.get('space-1'))}px</>;

// Usage copy for size tokens comes from the descriptions in tokens.raw.json.
const sizeUsage: Record<string, string> = {
	'size-control-xs': 'Icon button, chips',
	'size-control-sm': 'Compact button, small input',
	'size-control-md': 'Default button, input, select',
	'size-icon-xs': 'Inline micro icon',
	'size-icon-sm': 'Inline icon',
	'size-icon-md': 'Default icon',
	'size-icon-lg': 'Large icon',
	'size-avatar-sm': 'Small avatar',
	'size-avatar-md': 'Default avatar',
	'size-avatar-lg': 'Large avatar',
	'size-topbar': 'Topbar nav height',
	'size-sidebar-collapsed': 'Collapsed sidebar',
};

export const SizeTable = ({ group }: { group: string }) => {
	const names = semanticNames(`size-${group}`);
	return (
		<table style={table}>
			<thead>
				<tr>
					<th style={head}>Token</th>
					<th style={head}>Value</th>
					<th style={head}>Resolves to</th>
					<th style={head}>Used for</th>
					<th style={{ ...head, width: '30%' }}>Visual</th>
				</tr>
			</thead>
			<tbody>
				{names.map((name) => {
					const value = semanticLight.get(name);
					const px = remToPx(value);
					return (
						<tr key={name}>
							<td style={{ ...cell, ...mono }}>--nok-{name}</td>
							<td style={{ ...cell, ...mono }}>
								{value} ({px}px)
							</td>
							<td style={{ ...cell, ...mono }}>{lightReferences.get(name)}</td>
							<td style={cell}>{sizeUsage[name] ?? ''}</td>
							<td style={cell}>
								<Bar px={px} />
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

export const SizeGroups = () => {
	const groups = [...new Set(semanticNames('size-').map((n) => n.split('-')[1] ?? ''))];
	return (
		<>
			{groups.map((group) => (
				<section key={group} style={{ marginBottom: '24px' }}>
					<h4 style={{ ...text(600), textTransform: 'capitalize' }}>{humanise(group)}</h4>
					<SizeTable group={group} />
				</section>
			))}
		</>
	);
};

// ───────────────────────────── Radius ─────────────────────────────

export const RadiusTable = ({ names }: { names: string[] }) => (
	<table style={table}>
		<thead>
			<tr>
				<th style={head}>Token</th>
				<th style={head}>Value</th>
				<th style={head}>Resolves to</th>
				<th style={head}>Sample</th>
			</tr>
		</thead>
		<tbody>
			{names.map((name) => {
				const value = semanticLight.get(name) ?? primitives.get(name);
				const px = remToPx(value);
				return (
					<tr key={name}>
						<td style={{ ...cell, ...mono }}>--nok-{name}</td>
						<td style={{ ...cell, ...mono }}>{px !== undefined && px < 1000 ? `${px}px` : 'full'}</td>
						<td style={{ ...cell, ...mono }}>{lightReferences.get(name)}</td>
						<td style={cell}>
							<span
								style={{
									display: 'block',
									width: '64px',
									height: '40px',
									borderRadius: cssVar(name),
									border: '1px solid var(--nok-color-border-strong, var(--nok-color-border-default))',
									background: 'var(--nok-color-background-brand-subtle)',
								}}
							/>
						</td>
					</tr>
				);
			})}
		</tbody>
	</table>
);

export const SemanticRadius = () => <RadiusTable names={semanticNames('spacing-radius-')} />;
export const PrimitiveRadius = () => <RadiusTable names={primitiveNames('radius-')} />;

// ────────────────────────── Getting Started ──────────────────────────

export const Callout = ({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'draft' }) => (
	<div
		style={{
			margin: '16px 0',
			padding: '12px 16px',
			borderRadius: 'var(--nok-spacing-radius-md)',
			border: '1px solid var(--nok-color-border-default)',
			background: tone === 'draft' ? 'var(--nok-color-background-warning)' : 'var(--nok-color-background-brand-subtle)',
			...text(),
			fontSize: '14px',
		}}>
		{children}
	</div>
);

const ThemePanel = ({ theme }: { theme: 'light' | 'dark' }) => (
	<div
		data-theme={theme === 'dark' ? 'dark' : undefined}
		style={{ flex: 1, minWidth: '300px', padding: '24px', borderRadius: 'var(--nok-spacing-radius-lg)', background: 'var(--nok-color-background-canvas)' }}>
		<div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
			<span style={{ ...text(600), fontSize: '12px', color: 'var(--nok-color-text-secondary)', textTransform: 'capitalize' }}>{theme}</span>
			<Card
				size='sm'
				showMedia={false}
				title='Card title'
				description='Same component, different mode.'
				actions={
					<Button variant='primary' size='sm'>
						Primary
					</Button>
				}
			/>
			<Button variant='secondary' size='sm'>
				Secondary
			</Button>
		</div>
	</div>
);

export const ThemeSideBySide = () => (
	<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
		<ThemePanel theme='light' />
		<ThemePanel theme='dark' />
	</div>
);
