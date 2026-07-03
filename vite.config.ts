import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import inject from '@rollup/plugin-inject';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svelte(),
        // Serve the staged explorer sub-app (public/explorer, see
        // `pnpm build:explorer`) at /explorer/ in dev — Vite's SPA fallback
        // would otherwise swallow the directory request.
        {
            name: 'serve-explorer-dir-index',
            configureServer(server) {
                server.middlewares.use((req, _res, next) => {
                    if (req.url === '/explorer' || req.url === '/explorer/') {
                        req.url = '/explorer/index.html';
                    }
                    next();
                });
            },
        },
        // Required for the HID connection for Ledger devices
        NodeGlobalsPolyfillPlugin({
            buffer: true,
            process: true,
        }),
        inject({
            Buffer: ['buffer', 'Buffer'],
            process: 'process',
        }),
    ],
    resolve: {
        alias: {
            buffer: 'buffer/',
        },
    },
    define: {
        global: 'globalThis',
        'process.env.NODE_DEBUG': JSON.stringify(''), // or 'my-module'
    },
    optimizeDeps: {
        include: ['process', 'buffer'],
    },
    build: {
        minify: false,
    },
});
