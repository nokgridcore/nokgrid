/** @type {import('next').NextConfig} */
const nextConfig = {
  // @nokgridcore/ui is consumed as TypeScript source from the workspace.
  transpilePackages: ["@nokgridcore/ui", "@nokgridcore/tokens"],
  webpack(config) {
    // The ui source uses NodeNext-style `./file.js` imports that point at
    // `.ts`/`.tsx` files. Turbopack can't remap these, so the app builds with
    // webpack (`--webpack` in package.json).
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js"],
    };
    return config;
  },
};

export default nextConfig;
