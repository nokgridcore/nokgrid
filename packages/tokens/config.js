export default {
	source: ['src/tokens.json'],
	platforms: {
		css: {
			transformGroup: 'css',
			prefix: 'nok',
			buildPath: 'dist/css/',
			files: [
				{
					destination: 'variables.css',
					format: 'css/variables',
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
				},
			],
		},
	},
};
