import type { StorybookConfig } from '@storybook/react-vite';

import { dirname } from "path"

import { fileURLToPath } from "url"

/**
* This function is used to resolve the absolute path of a package.
* It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}

// addon-mcp wires up a local MCP server for AI editor integration during
// `storybook dev` — it has no role in a static `build-storybook` output and
// pulls in an experimental component-manifest build feature, so it's left
// out of production/CI builds entirely.
const isDevServer = process.env.npm_lifecycle_event === 'storybook';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
    ...(isDevServer ? [getAbsolutePath('@storybook/addon-mcp')] : [])
  ],
  "core": {
    // Avoids a silent hang in CI build sandboxes with restricted egress —
    // Storybook's telemetry ping has no timeout guard in some versions.
    "disableTelemetry": true
  },
  "framework": getAbsolutePath('@storybook/react-vite')
};
export default config;
