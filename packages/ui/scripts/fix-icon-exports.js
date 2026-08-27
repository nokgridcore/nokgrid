import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const indexPath = join(__dirname, "..", "src", "icons", "generated", "index.ts");

const content = readFileSync(indexPath, "utf8");
const fixed = content.replace(/(from "\.\/[^"]+)"/g, '$1.js"');

writeFileSync(indexPath, fixed);
console.log("? Fixed icon export extensions");
