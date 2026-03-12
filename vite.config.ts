import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import inject from '@rollup/plugin-inject';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svelte(),
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
        include: ['process', 'buffer', 'uniffi-bindgen-react-native'],
    },
    build: {
        minify: false,
    },
    // Allow importing from wasm/ folder
    server: {
        fs: {
            allow: ['..'],
        },
    },
});
