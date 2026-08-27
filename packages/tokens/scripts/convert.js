/**
 * convert.js
 * Transforms tokens.raw.json (Token Studio / Figma DTCG format)
 * into three Style Dictionary-compatible JSON files:
 *   src/primitives.json
 *   src/semantic-light.json
 *   src/semantic-dark.json
 *
 * Usage: node scripts/convert.js
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const RAW = join(ROOT, 'tokens.raw.json');
const OUT = join(ROOT, 'src');

const raw = JSON.parse(readFileSync(RAW, 'utf8'));

// --- Helpers ---

function isToken(obj) {
	return obj && typeof obj === 'object' && '$type' in obj;
}

function toSdKey(str) {
	// Normalise keys: lowercase, spaces to hyphens, keep hyphens
	return str.replace(/\s+/g, '-').toLowerCase();
}

/**
 * Convert a Token Studio alias reference to Style Dictionary format.
 * Token Studio uses: {colour.NokFlame.500}
 * We need:           {color.nokflame.500}
 *
 * Also handles cross-section refs like {space.1}, {radius.50} etc.
 */
function convertAlias(value) {
	if (typeof value !== 'string') return value;

	return value.replace(/\{([^}]+)\}/g, (_, path) => {
		const parts = path.split('.').map((p) => toSdKey(p));
		// Normalise "colour" -> "color"
		if (parts[0] === 'colour') parts[0] = 'color';
		return `{${parts.join('.')}}`;
	});
}

/**
 * Check if a value contains an alias reference
 */
function isAlias(value) {
	if (typeof value === 'string') return value.includes('{');
	if (typeof value === 'object' && value !== null) {
		return Object.values(value).some(
			(v) => typeof v === 'string' && v.includes('{'),
		);
	}
	return false;
}

/**
 * Walk a token group and build a Style Dictionary compatible object.
 * Handles composite typography tokens by flattening them.
 */
function walkTokens(obj, out = {}, parentPath = []) {
	for (const [key, value] of Object.entries(obj)) {
		if (key.startsWith('$')) continue;

		const sdKey = toSdKey(key === 'colour' ? 'color' : key);
		const path = [...parentPath, sdKey];

		if (isToken(value)) {
			const rawValue = value.$value;

			// Handle composite typography tokens — flatten to individual properties
			if (value.$type === 'typography' && typeof rawValue === 'object') {
				const typographyTokens = {
					fontFamily: { value: convertAlias(rawValue.fontFamily) },
					fontSize: { value: convertAlias(rawValue.fontSize) },
					fontWeight: { value: convertAlias(rawValue.fontWeight) },
					lineHeight: { value: convertAlias(rawValue.lineHeight) },
				};
				setNested(out, path, typographyTokens);
			} else {
				// Scalar or alias token
				const sdValue =
					typeof rawValue === 'string' ? convertAlias(rawValue) : rawValue;
				setNested(out, [...path], { value: sdValue });
			}
		} else if (value && typeof value === 'object') {
			walkTokens(value, out, path);
		}
	}
	return out;
}

/**
 * Set a value at a nested path in an object,
 * but if the final key already exists as a group, assign properties directly.
 */
function setNested(obj, path, value) {
	let cursor = obj;
	for (let i = 0; i < path.length - 1; i++) {
		if (!cursor[path[i]]) cursor[path[i]] = {};
		cursor = cursor[path[i]];
	}
	const lastKey = path[path.length - 1];
	if (typeof value === 'object' && !('value' in value)) {
		// Composite — merge properties
		cursor[lastKey] = cursor[lastKey] || {};
		Object.assign(cursor[lastKey], value);
	} else {
		cursor[lastKey] = value;
	}
}

// --- Extract the three sections ---
const primitiveRaw = raw['primitive tokens/mode'];
const lightRaw = raw['semantic tokens/light'];
const darkRaw = raw['semantic tokens/dark'];

if (!primitiveRaw)
	throw new Error('Missing "primitive tokens/mode" in tokens.raw.json');
if (!lightRaw) throw new Error('Missing "semantic tokens/light" in tokens.raw.json');
if (!darkRaw) throw new Error('Missing "semantic tokens/dark" in tokens.raw.json');

const primitives = walkTokens(primitiveRaw);
const light = walkTokens(lightRaw);
const dark = walkTokens(darkRaw);

// --- Write output ---
mkdirSync(OUT, { recursive: true });

writeFileSync(join(OUT, 'primitives.json'), JSON.stringify(primitives, null, 2));
writeFileSync(join(OUT, 'semantic-light.json'), JSON.stringify(light, null, 2));
writeFileSync(join(OUT, 'semantic-dark.json'), JSON.stringify(dark, null, 2));

// --- Sanity check ---
console.log('✓ src/primitives.json');
console.log('✓ src/semantic-light.json');
console.log('✓ src/semantic-dark.json');
console.log();

function countTokens(obj) {
	let n = 0;
	for (const v of Object.values(obj)) {
		if (v && typeof v === 'object') {
			'value' in v ? n++ : (n += countTokens(v));
		}
	}
	return n;
}

console.log(`Primitive tokens:     ${countTokens(primitives)}`);
console.log(`Semantic light tokens: ${countTokens(light)}`);
console.log(`Semantic dark tokens:  ${countTokens(dark)}`);
console.log();

// Spot checks
console.log('Spot checks:');
console.log(
	'  color.nokflame.500      =',
	primitives?.color?.nokflame?.['500']?.value,
);
console.log('  space.4                 =', primitives?.space?.['4']?.value);
console.log('  radius.50               =', primitives?.radius?.['50']?.value);
console.log(
	'  typography.font-family.brand =',
	primitives?.typography?.['font-family']?.brand?.value,
);
console.log(
	'  [light] color.background.canvas =',
	light?.color?.background?.canvas?.value,
);
console.log(
	'  [light] color.action.primary-default =',
	light?.color?.action?.['primary-default']?.value,
);
console.log(
	'  [light] spacing.component.xs =',
	light?.spacing?.component?.xs?.value,
);
console.log(
	'  [light] typography.display.2xl.fontFamily =',
	light?.typography?.display?.['2xl']?.fontFamily?.value,
);
console.log(
	'  [dark]  color.background.canvas =',
	dark?.color?.background?.canvas?.value,
);
console.log(
	'  [dark]  color.action.primary-hover =',
	dark?.color?.action?.['primary-hover']?.value,
);
