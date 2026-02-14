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
    },
    resolve: {
        conditions: ['browser'],
    },
});
