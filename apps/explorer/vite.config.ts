import react from "@vitejs/plugin-react";
import { createRequire } from "node:module";
import path from "node:path";
import { defineConfig } from "vite";

// The @iota/sdk-wasm package is consumed as a local `link:` dependency
// (a symlink into iota-rust-sdk/bindings/wasm), so:
//  - it must not be esbuild-prebundled (the wasm-bindgen glue relies on
//    `import.meta.url` to locate index_bg.wasm),
//  - the dev server must be allowed to serve files from the sibling repo,
//  - the wasm binary is resolved through the package itself (not a relative
//    path) so the app works both standalone and inside the iotatools
//    workspace. `require.resolve` follows the symlink to the real dist.
const require = createRequire(import.meta.url);
const sdkWasmDist = path.dirname(require.resolve("@iota/sdk-wasm"));
const sdkWasmBinary = path.join(sdkWasmDist, "index_bg.wasm");

export default defineConfig({
  plugins: [react()],
  resolve: {
    // regex form so the "?url" suffix survives the replacement
    // (object-form aliases only match exact ids or "id/…")
    alias: [{ find: /^@sdk-wasm-binary/, replacement: sdkWasmBinary }],
  },
  optimizeDeps: {
    exclude: ["@iota/sdk-wasm"],
  },
  server: {
    fs: {
      // allow /@fs access to the workspace and the (symlinked) sdk dist
      allow: ["..", sdkWasmDist],
    },
  },
  build: {
    target: "es2022",
    chunkSizeWarningLimit: 4000,
  },
});
