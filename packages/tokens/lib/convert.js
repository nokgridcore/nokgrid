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
					fontFamily: { value: convertAlias(rawValue.fontFamily) },
					fontSize: { value: convertAlias(rawValue.fontSize) },
					fontWeight: { value: convertAlias(rawValue.fontWeight) },
					lineHeight: { value: convertAlias(rawValue.lineHeight) },
				});
			} else {
				setNested(out, path, { value: typeof rawValue === 'string' ? convertAlias(rawValue) : rawValue });
			}
		} else if (value && typeof value === 'object') {
			walkTokens(value, out, path);
		}
	}
	return out;
}

/** @returns {{ primitives: object, light: object, dark: object }} */
export function convertRaw(raw) {
	const missing = Object.values(TOKEN_SETS).filter((name) => !raw[name]);
	if (missing.length) {
		const found = Object.keys(raw).filter((k) => !k.startsWith('$'));
		throw new Error(
			`Token file is missing the set(s): ${missing.map((m) => `"${m}"`).join(', ')}.\n` +
				`Found: ${found.length ? found.map((f) => `"${f}"`).join(', ') : 'none'}.\n` +
				'Start from the NokGrid Tokens Studio file and keep its set names.',
		);
	}

	return {
		primitives: walkTokens(raw[TOKEN_SETS.primitives]),
		light: walkTokens(raw[TOKEN_SETS.light]),
		dark: walkTokens(raw[TOKEN_SETS.dark]),
	};
}

export function countTokens(obj) {
	let n = 0;
	for (const v of Object.values(obj)) {
		if (v && typeof v === 'object') 'value' in v ? n++ : (n += countTokens(v));
	}
	return n;
}
