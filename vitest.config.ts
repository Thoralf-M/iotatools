import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [svelte({ hot: !process.env.VITEST })],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test-setup.ts'],
        alias: {
            '@testing-library/svelte': '@testing-library/svelte/svelte5',
        },
        // Staking-rewards integration tests process hundreds of txs through
        // the full rewards pipeline; some do multiple end-to-end runs. Locally
        // each run is ~1s but CI can be several times slower. 30s gives
        // comfortable headroom without hiding real hangs.
        testTimeout: 30_000,
    },
    resolve: {
        conditions: ['browser'],
    },
});
