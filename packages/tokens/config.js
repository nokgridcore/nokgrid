import StyleDictionary from 'style-dictionary';

// --- Light build ---
const light = new StyleDictionary({
	source: ['src/primitives.json', 'src/semantic-light.json'],
	log: { verbosity: 'silent' },
	platforms: {
		css: {
			transformGroup: 'css',
			prefix: 'nok',
			buildPath: 'dist/css/',
			files: [
				{
					destination: 'primitives.css',
					format: 'css/variables',
					filter: (token) => token.filePath.includes('primitives'),
				},
				{
					destination: 'semantic-light.css',
					format: 'css/variables',
					selector: ':root',
					filter: (token) => token.filePath.includes('semantic-light'),
				},
			],
		},
		js: {
			transformGroup: 'js',
			buildPath: 'dist/js/',
			files: [
				{
					destination: 'tokens.js',
					format: 'javascript/es6',
					filter: (token) => token.filePath.includes('primitives'),
				},
			],
		},
		ts: {
			transformGroup: 'js',
			buildPath: 'dist/ts/',
			files: [
				{
					destination: 'tokens.d.ts',
					format: 'typescript/es6-declarations',
					filter: (token) => token.filePath.includes('primitives'),
				},
			],
		},
	},
});

// --- Dark build ---
const dark = new StyleDictionary({
	source: ['src/primitives.json', 'src/semantic-dark.json'],
	log: { verbosity: 'silent' },
	platforms: {
		css: {
			transformGroup: 'css',
			prefix: 'nok',
			buildPath: 'dist/css/',
			files: [
				{
					destination: 'semantic-dark.css',
					format: 'css/variables-dark',
					filter: (token) => token.filePath.includes('semantic-dark'),
				},
			],
		},
	},
});

// Register custom dark format before building
dark.registerFormat({
	name: 'css/variables-dark',
	format: ({ dictionary }) => {
		const vars = dictionary.allTokens
			.map(
				(token) =>
					`  --nok-${token.path.join('-')}: ${token.$value ?? token.value};`,
			)
			.join('\n');
		return `[data-theme="dark"] {\n${vars}\n}\n`;
	},
});

await light.buildAllPlatforms();
await dark.buildAllPlatforms();
