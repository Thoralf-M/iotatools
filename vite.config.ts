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
        }),
        inject({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
    resolve: {
        alias: {
            buffer: 'buffer/',
        },
    },
});
