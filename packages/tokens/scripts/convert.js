/**
 * convert.js
 * Converts Figma DTCG exports into Style Dictionary compatible tokens.json
 * Handles: primitives, semantic light/dark, alias chain resolution
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// --- Load raw files ---
const primitives = JSON.parse(
	readFileSync(join(ROOT, 'src/raw/primitives.json'), 'utf8'),
);
const semanticLight = JSON.parse(
	readFileSync(join(ROOT, 'src/raw/semantic-light.json'), 'utf8'),
);
const semanticDark = JSON.parse(
	readFileSync(join(ROOT, 'src/raw/semantic-dark.json'), 'utf8'),
);

// --- Helpers ---

function isToken(obj) {
	return obj && typeof obj === 'object' && '$type' in obj;
}

function extractHex(value) {
	if (typeof value === 'string') return value;
	if (value && typeof value === 'object' && value.hex) return value.hex;
	return value;
}

function toCamelKey(str) {
	return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function toSdKey(str) {
	// Convert Figma key (may have spaces, dashes) to SD-friendly camelCase
	return toCamelKey(str.replace(/\s+/g, '-').toLowerCase());
}

/**
 * Build alias reference string from aliasData targetVariableName
 * e.g. "colour/NokFlame/500" -> "{color.nokFlame.500}"
 */
function buildAlias(targetVariableName) {
	const parts = targetVariableName.split('/').map((p) => toSdKey(p));
	// Normalise "colour" -> "color"
	if (parts[0] === 'colour') parts[0] = 'color';
	return `{${parts.join('.')}}`;
}

/**
 * Walk a DTCG object and emit Style Dictionary tokens
 * parentPath: array of keys leading to this node
 * isSemanticAlias: if true, emit alias refs instead of raw hex
 */
function walkTokens(obj, out = {}, parentPath = [], useAlias = false) {
	for (const [key, value] of Object.entries(obj)) {
		if (key.startsWith('$')) continue; // skip $extensions etc

		const sdKey = toSdKey(key === 'colour' ? 'color' : key);
		const path = [...parentPath, sdKey];

		if (isToken(value)) {
			const alias = value.$extensions?.['com.figma.aliasData'];
			const rawValue = extractHex(value.$value);

			let sdValue;
			if (useAlias && alias) {
				sdValue = buildAlias(alias.targetVariableName);
			} else {
				sdValue = typeof rawValue === 'number' ? rawValue : rawValue;
			}

			// Navigate/create nested object
			let cursor = out;
			for (let i = 0; i < path.length - 1; i++) {
				cursor[path[i]] = cursor[path[i]] || {};
				cursor = cursor[path[i]];
			}
			cursor[path[path.length - 1]] = { value: sdValue };
		} else if (value && typeof value === 'object') {
			walkTokens(value, out, path, useAlias);
		}
	}
	return out;
}

// --- Build tokens ---

// 1. Primitives (raw hex values, no aliases)
const primitiveTokens = walkTokens(primitives, {}, [], false);

// 2. Semantic light (with alias refs back to primitives)
const semanticLightTokens = walkTokens(semanticLight, {}, [], true);

// 3. Semantic dark (with alias refs back to primitives)
const semanticDarkTokens = walkTokens(semanticDark, {}, [], true);

// --- Write output ---
mkdirSync(join(ROOT, 'src/tokens'), { recursive: true });

writeFileSync(
	join(ROOT, 'src/tokens/primitives.json'),
	JSON.stringify(primitiveTokens, null, 2),
);
writeFileSync(
	join(ROOT, 'src/tokens/semantic-light.json'),
	JSON.stringify(semanticLightTokens, null, 2),
);
writeFileSync(
	join(ROOT, 'src/tokens/semantic-dark.json'),
	JSON.stringify(semanticDarkTokens, null, 2),
);

console.log('✓ primitives.json');
console.log('✓ semantic-light.json');
console.log('✓ semantic-dark.json');

// --- Quick sanity check ---
const p = primitiveTokens;
console.log('\nSample primitives:');
console.log('  color.nokFlame.500 =', p?.color?.nokFlame?.['500']?.value);
console.log('  space.1 =', p?.space?.['1']?.value);
console.log('  radius.50 =', p?.radius?.['50']?.value);

const l = semanticLightTokens;
console.log('\nSample semantic (light):');
console.log('  color.background.canvas =', l?.color?.background?.canvas?.value);
console.log(
	'  color.action.primaryDefault =',
	l?.color?.action?.primaryDefault?.value,
);
console.log('  spacing.component.xs =', l?.spacing?.component?.xs?.value);
