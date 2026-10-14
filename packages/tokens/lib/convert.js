/**
 * Converts a Tokens Studio export (DTCG format) into the three token trees
 * Style Dictionary builds from: primitives, semantic light, semantic dark.
 */

export const TOKEN_SETS = {
	primitives: 'primitive tokens/mode',
	light: 'semantic tokens/light',
	dark: 'semantic tokens/dark',
};

function isToken(obj) {
	return obj && typeof obj === 'object' && '$type' in obj;
}

// Lowercase, spaces to hyphens.
function toSdKey(str) {
	return str.replace(/\s+/g, '-').toLowerCase();
}

// Tokens Studio aliases look like {colour.NokFlame.500}; Style Dictionary
// needs {color.nokflame.500}.
function convertAlias(value) {
	if (typeof value !== 'string') return value;

	return value.replace(/\{([^}]+)\}/g, (_, path) => {
		const parts = path.split('.').map((p) => toSdKey(p));
		if (parts[0] === 'colour') parts[0] = 'color';
		return `{${parts.join('.')}}`;
	});
}

// Figma exports FLOAT variables as bare pixel numbers ($type "number",
// e.g. 16), while NokGrid's own file stores them as rem dimensions ("1rem").
// A bare number is invalid as a CSS length, so numbers in size groups are
// converted the same way NokGrid's are: px / 16, in rem.
const DIMENSION_GROUPS = new Set(['space', 'spacing', 'size', 'radius']);
const TYPOGRAPHY_DIMENSIONS = new Set(['font-size', 'line-height', 'letter-spacing']);

function isDimensionPath(path) {
	return DIMENSION_GROUPS.has(path[0]) || (path[0] === 'typography' && TYPOGRAPHY_DIMENSIONS.has(path[1]));
}

const pxToRem = (px) => `${parseFloat((px / 16).toFixed(4))}rem`;

function normaliseValue(value, path) {
	if (typeof value === 'number' && isDimensionPath(path)) return pxToRem(value);
	return typeof value === 'string' ? convertAlias(value) : value;
}

// Composite typography: sizes as bare numbers are px; a line height of 4 or
// less is a ratio (e.g. 1.5) and stays unitless.
function normaliseTypographyPart(value, prop) {
	if (typeof value !== 'number') return convertAlias(value);
	if (prop === 'fontSize') return pxToRem(value);
	if (prop === 'lineHeight') return value <= 4 ? value : pxToRem(value);
	return value;
}

function setNested(obj, path, value) {
	let cursor = obj;
	for (let i = 0; i < path.length - 1; i++) {
		if (!cursor[path[i]]) cursor[path[i]] = {};
		cursor = cursor[path[i]];
	}
	const lastKey = path[path.length - 1];
	if (typeof value === 'object' && !('value' in value)) {
		cursor[lastKey] = cursor[lastKey] || {};
		Object.assign(cursor[lastKey], value);
	} else {
		cursor[lastKey] = value;
	}
}

function walkTokens(obj, out = {}, parentPath = []) {
	for (const [key, value] of Object.entries(obj)) {
		if (key.startsWith('$')) continue;

		const sdKey = toSdKey(key === 'colour' ? 'color' : key);
		const path = [...parentPath, sdKey];

		if (isToken(value)) {
			const rawValue = value.$value;

			// Composite typography tokens are flattened to one token per property.
			if (value.$type === 'typography' && typeof rawValue === 'object') {
				setNested(out, path, {
					fontFamily: { value: normaliseTypographyPart(rawValue.fontFamily, 'fontFamily') },
					fontSize: { value: normaliseTypographyPart(rawValue.fontSize, 'fontSize') },
					fontWeight: { value: normaliseTypographyPart(rawValue.fontWeight, 'fontWeight') },
					lineHeight: { value: normaliseTypographyPart(rawValue.lineHeight, 'lineHeight') },
				});
			} else {
				setNested(out, path, { value: normaliseValue(rawValue, path) });
			}
		} else if (value && typeof value === 'object') {
			walkTokens(value, out, path);
		}
	}
	return out;
}

// Figma names collections and modes freely ("Mode 1", "Theme - semantic
// tokens"), so sets are matched by role rather than exact name.
const SET_ROLES = {
	primitives: { label: 'a primitive set (name containing "primitive")', test: (n) => n.includes('primitive') },
	light: { label: 'a semantic light set (name containing "semantic", ending "/light")', test: (n) => n.includes('semantic') && n.endsWith('/light') },
	dark: { label: 'a semantic dark set (name containing "semantic", ending "/dark")', test: (n) => n.includes('semantic') && n.endsWith('/dark') },
};

function findSets(raw) {
	const names = Object.keys(raw).filter((k) => !k.startsWith('$'));
	const found = {};
	const problems = [];

	for (const [role, { label, test }] of Object.entries(SET_ROLES)) {
		if (raw[TOKEN_SETS[role]]) {
			found[role] = TOKEN_SETS[role];
			continue;
		}
		const matches = names.filter((n) => test(n.toLowerCase().trim()));
		if (matches.length === 1) found[role] = matches[0];
		else if (matches.length === 0) problems.push(`No ${label}.`);
		else problems.push(`More than one match for ${label}: ${matches.map((m) => `"${m}"`).join(', ')}.`);
	}

	if (problems.length) {
		throw new Error(
			`${problems.join('\n')}\n` +
				`Sets in this file: ${names.length ? names.map((n) => `"${n}"`).join(', ') : 'none'}.\n` +
				'Start from the NokGrid Tokens Studio file and keep one primitive set and one semantic set with light and dark modes.',
		);
	}
	return found;
}

/** @returns {{ primitives: object, light: object, dark: object, setNames: { primitives: string, light: string, dark: string } }} */
export function convertRaw(raw) {
	const setNames = findSets(raw);

	return {
		primitives: walkTokens(raw[setNames.primitives]),
		light: walkTokens(raw[setNames.light]),
		dark: walkTokens(raw[setNames.dark]),
		setNames,
	};
}

export function countTokens(obj) {
	let n = 0;
	for (const v of Object.values(obj)) {
		if (v && typeof v === 'object') 'value' in v ? n++ : (n += countTokens(v));
	}
	return n;
}
