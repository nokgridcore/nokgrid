#!/usr/bin/env node
import path from 'node:path';
import { buildTheme } from '../lib/theme.js';

const HELP = `
Usage: npx @nokgridcore/cli theme <tokens.json> [options]

Builds a CSS theme for @nokgridcore/ui from a Tokens Studio export.

Options:
  --out <file>      Where to write the CSS (default: nokgrid-theme.css)
  --prefix <name>   Prefix for your CSS variables (default: nok)
  --strict          Fail if any NokGrid token is missing (for CI)
  -h, --help        Show this help

Then import the file after NokGrid's stylesheet:
  import '@nokgridcore/ui/styles.css';
  import './nokgrid-theme.css';
`;

const LIST_LIMIT = 15;

function parseArgs(argv) {
	const args = { positional: [], out: 'nokgrid-theme.css', prefix: 'nok', strict: false, help: false };
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (arg === '-h' || arg === '--help') args.help = true;
		else if (arg === '--strict') args.strict = true;
		else if (arg === '--out' || arg === '--prefix') {
			const value = argv[++i];
			if (!value || value.startsWith('--')) throw new Error(`${arg} needs a value.`);
			args[arg.slice(2)] = value;
		} else if (arg.startsWith('--')) throw new Error(`Unknown option ${arg}.`);
		else args.positional.push(arg);
	}
	return args;
}

function printList(names) {
	for (const name of names.slice(0, LIST_LIMIT)) console.log(`    ${name}`);
	if (names.length > LIST_LIMIT) console.log(`    …and ${names.length - LIST_LIMIT} more`);
}

async function main() {
	const args = parseArgs(process.argv.slice(2));
	const [command, input] = args.positional;

	if (args.help || !command) {
		console.log(HELP);
		return;
	}
	if (command !== 'theme') throw new Error(`Unknown command "${command}". Run with --help to see usage.`);
	if (!input) throw new Error('Pass the path to your Tokens Studio export, e.g. npx @nokgridcore/cli theme ./tokens/brand.json');

	const result = await buildTheme({ input, out: args.out, prefix: args.prefix });
	const shownPath = path.relative(process.cwd(), result.outPath) || result.outPath;

	console.log(`\n✔ Wrote ${shownPath} (${result.tokenCount} tokens)`);
	console.log(
		`  Checked against NokGrid ${result.contract.version} (${result.contract.size} required tokens` +
			`${result.contract.source === 'cli' ? ', @nokgridcore/ui not found in this project' : ''}).`,
	);

	if (result.missing.length) {
		console.log(`\n⚠ ${result.missing.length} NokGrid token(s) are missing from your file.`);
		console.log('  Components will use NokGrid\'s default value for these:');
		printList(result.missing);
	}
	if (result.missingDark.length) {
		console.log(`\n⚠ ${result.missingDark.length} token(s) have no dark value, so dark mode will use NokGrid's default:`);
		printList(result.missingDark);
	}

	if (!result.missing.length && !result.missingDark.length) console.log('  Every NokGrid token is covered.');
	console.log(`\nImport it after NokGrid's stylesheet:\n  import '@nokgridcore/ui/styles.css';\n  import './${shownPath.split(path.sep).join('/')}';\n`);

	if (args.strict && (result.missing.length || result.missingDark.length)) process.exitCode = 1;
}

main().catch((error) => {
	console.error(`\n✖ ${error.message}\n`);
	process.exitCode = 1;
});
