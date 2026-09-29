import primitivesCss from '@nokgridcore/tokens/dist/css/primitives.css?raw';
import lightCss from '@nokgridcore/tokens/dist/css/semantic-light.css?raw';
import darkCss from '@nokgridcore/tokens/dist/css/semantic-dark.css?raw';
import lightSourceRaw from '../../../tokens/src/semantic-light.json?raw';
import darkSourceRaw from '../../../tokens/src/semantic-dark.json?raw';

// Every value shown on a docs page is read from the generated token output
// (dist/css) — nothing here is a hand-typed value.

export type TokenMap = Map<string, string>;

const parse = (css: string): TokenMap => {
	const map: TokenMap = new Map();
	for (const match of css.matchAll(/--nok-([a-z0-9-]+):\s*([^;]+);/g)) {
		const [, name, value] = match;
		if (name && value) map.set(name, value.trim());
	}
	return map;
};

export const primitives = parse(primitivesCss);
export const semanticLight = parse(lightCss);
export const semanticDark = parse(darkCss);

// Semantic tokens are authored as references to primitives ("{color.neutral.50}");
// this maps each semantic token name to the primitive token name it points at.
const collectReferences = (source: unknown): Map<string, string> => {
	const refs = new Map<string, string>();
	const walk = (node: unknown, path: string[]) => {
		if (!node || typeof node !== 'object') return;
		const record = node as Record<string, unknown>;
		if (typeof record.value === 'string') {
			const match = /^\{(.+)\}$/.exec(record.value);
			if (match?.[1]) refs.set(path.join('-').toLowerCase(), match[1].replace(/\./g, '-').toLowerCase());
			return;
		}
		for (const [key, child] of Object.entries(record)) walk(child, [...path, key]);
	};
	walk(source, []);
	return refs;
};

export const lightReferences = collectReferences(JSON.parse(lightSourceRaw));
export const darkReferences = collectReferences(JSON.parse(darkSourceRaw));

export const cssVar = (name: string) => `var(--nok-${name})`;

const REM = 16;
const round = (n: number) => Math.round(n * 10) / 10;

/** "0.813rem" → 13 — the docs root font size is the browser default 16px. */
export const remToPx = (value: string | undefined): number | undefined => {
	if (!value) return undefined;
	const match = /^(-?[\d.]+)rem$/.exec(value);
	return match?.[1] ? round(parseFloat(match[1]) * REM) : undefined;
};

export const semanticNames = (prefix: string) => [...semanticLight.keys()].filter((name) => name.startsWith(prefix));
export const primitiveNames = (prefix: string) => [...primitives.keys()].filter((name) => name.startsWith(prefix));
