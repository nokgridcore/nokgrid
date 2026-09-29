/**
 * Builds the token CSS (primitives, semantic light, semantic dark) from the
 * token trees produced by convert.js. Shared by NokGrid's own build and
 * @nokgridcore/cli, so a team's theme is generated exactly the way ours is.
 *
 * Style Dictionary is passed in rather than imported, so installing
 * @nokgridcore/tokens doesn't pull it into every app.
 */

function tokenPaths(obj, prefix = [], out = new Set()) {
	for (const [key, value] of Object.entries(obj)) {
		if (!value || typeof value !== 'object') continue;
		const path = [...prefix, key];
		if ('value' in value) out.add(path.join('.'));
		else tokenPaths(value, path, out);
	}
	return out;
}

function mergeTrees(a, b, path = []) {
	const out = { ...a };
	for (const [key, value] of Object.entries(b)) {
		const here = [...path, key];
		if (!(key in out)) out[key] = value;
		else if ('value' in value || 'value' in out[key])
			throw new Error(`Token "${here.join('.')}" is defined in both the primitive and semantic sets.`);
		else out[key] = mergeTrees(out[key], value, here);
	}
	return out;
}

function tokenEntries(obj, prefix = [], out = []) {
	for (const [key, value] of Object.entries(obj)) {
		if (!value || typeof value !== 'object') continue;
		const path = [...prefix, key];
		if ('value' in value) out.push([path.join('.'), value.value]);
		else tokenEntries(value, path, out);
	}
	return out;
}

// Style Dictionary only reports "some references could not be found", which
// doesn't help a designer find the token they renamed or deleted.
function assertReferencesResolve(tree, setName) {
	const entries = tokenEntries(tree);
	const known = new Set(entries.map(([path]) => path));
	const broken = [];
	for (const [path, value] of entries) {
		if (typeof value !== 'string') continue;
		for (const [, ref] of value.matchAll(/\{([^}]+)\}/g)) if (!known.has(ref)) broken.push(`${path} → {${ref}}`);
	}
	if (broken.length) {
		const shown = broken.slice(0, 10).map((b) => `  ${b}`).join('\n');
		const more = broken.length > 10 ? `\n  …and ${broken.length - 10} more` : '';
		throw new Error(
			`${broken.length} token(s) in the ${setName} set point at a token that doesn't exist:\n${shown}${more}\n` +
				'Was it renamed or deleted? Point these at an existing token, or restore it.',
		);
	}
}

const darkFormat = ({ dictionary }) =>
	`[data-theme="dark"] {\n${dictionary.allTokens.map((t) => `  --${t.name}: ${t.$value ?? t.value};`).join('\n')}\n}\n`;

/**
 * @returns {Promise<{ primitives: string, light: string, dark: string }>}
 */
export async function buildCss(StyleDictionary, { primitives, light, dark, prefix = 'nok', verbosity = 'silent' }) {
	assertReferencesResolve(mergeTrees(primitives, light), 'light');
	assertReferencesResolve(mergeTrees(primitives, dark), 'dark');

	const primitivePaths = tokenPaths(primitives);
	const isPrimitive = (token) => primitivePaths.has(token.path.join('.'));

	const format = async (semantic, files, formats) => {
		const sd = new StyleDictionary({
			tokens: mergeTrees(primitives, semantic),
			log: { verbosity, warnings: verbosity === 'silent' ? 'disabled' : 'warn' },
			...(formats && { hooks: { formats } }),
			platforms: { css: { transformGroup: 'css', prefix, files } },
		});
		const outputs = await sd.formatPlatform('css');
		return Object.fromEntries(outputs.map((o) => [o.destination, o.output]));
	};

	const lightOut = await format(light, [
		{ destination: 'primitives.css', format: 'css/variables', filter: isPrimitive },
		{ destination: 'semantic-light.css', format: 'css/variables', options: { selector: ':root' }, filter: (t) => !isPrimitive(t) },
	]);
	const darkOut = await format(
		dark,
		[{ destination: 'semantic-dark.css', format: 'css/variables-dark', filter: (t) => !isPrimitive(t) }],
		{ 'css/variables-dark': darkFormat },
	);

	return {
		primitives: lightOut['primitives.css'],
		light: lightOut['semantic-light.css'],
		dark: darkOut['semantic-dark.css'],
	};
}
