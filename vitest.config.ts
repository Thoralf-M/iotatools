import { svelte } from '@sveltejs/vite-plugin-svelte';
import { configDefaults, defineConfig } from 'vitest/config';

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
        // Those runs happen in beforeAll hooks, which testTimeout does not
        // cover — hooks have their own 10s default. The tx caches grow with
        // every daily update, so give hooks the same headroom.
        hookTimeout: 30_000,
        // The explorer sub-app ships its own Playwright suite under
        // apps/explorer/tests — Playwright test() must not run inside Vitest.
        exclude: [...configDefaults.exclude, 'apps/**'],
    },
    resolve: {
        conditions: ['browser'],
    },
});
