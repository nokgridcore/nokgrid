/**
 * Transforms tokens.raw.json (Tokens Studio export) into
 * src/primitives.json, src/semantic-light.json and src/semantic-dark.json.
 *
 * Usage: node scripts/convert.js
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { convertRaw, countTokens } from '../lib/convert.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src');

const { primitives, light, dark } = convertRaw(JSON.parse(readFileSync(join(ROOT, 'tokens.raw.json'), 'utf8')));

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'primitives.json'), JSON.stringify(primitives, null, 2));
writeFileSync(join(OUT, 'semantic-light.json'), JSON.stringify(light, null, 2));
writeFileSync(join(OUT, 'semantic-dark.json'), JSON.stringify(dark, null, 2));

console.log('✓ src/primitives.json');
console.log('✓ src/semantic-light.json');
console.log('✓ src/semantic-dark.json');
console.log();
console.log(`Primitive tokens:      ${countTokens(primitives)}`);
console.log(`Semantic light tokens: ${countTokens(light)}`);
console.log(`Semantic dark tokens:  ${countTokens(dark)}`);
