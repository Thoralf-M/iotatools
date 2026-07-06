import { execSync } from 'child_process';
import { cpSync, existsSync, rmSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const explorerDir = join(root, 'apps/explorer');
const explorerDist = join(explorerDir, 'dist');

// Vite copies everything under `public/` into the build output, so staging the
// explorer here is what lands it under `docs/explorer/` after `pnpm build`.
const stagedDir = join(root, 'public/explorer');

// The last built explorer output, committed to the repo and deployed as-is.
const committedDir = join(root, 'docs/explorer');

// The explorer is built on the `@iota/sdk-wasm` bindings, produced by compiling
// the sibling `iota-rust-sdk` checkout to wasm (`make wasm`). That toolchain is
// only present in a full dev setup; the data-only "Update Staking Rewards
// Caches" CI job checks out iotatools alone. Detect the built bindings via the
// type declarations they emit — the `link:` dependency in
// apps/explorer/package.json points here.
const wasmTypes = join(
    explorerDir,
    '../../../iota-rust-sdk/bindings/wasm/dist/types/index.web.d.ts',
);

function stageFrom(sourceDir) {
    rmSync(stagedDir, { recursive: true, force: true });
    cpSync(sourceDir, stagedDir, { recursive: true });
}

if (existsSync(wasmTypes)) {
    // Bindings are available: rebuild from source. Let build failures surface
    // as hard errors so real regressions in the explorer aren't masked.
    execSync('pnpm --filter iota-explorer run build:integrated', {
        stdio: 'inherit',
        cwd: root,
    });
    stageFrom(explorerDist);
    console.log('Explorer built from source and staged into public/explorer.');
} else if (existsSync(committedDir)) {
    // Bindings unavailable (e.g. the cache-update CI job): reuse the committed
    // output so `pnpm build` still produces a complete docs/ that includes the
    // explorer instead of dropping it.
    console.warn(
        '@iota/sdk-wasm bindings not built; reusing committed docs/explorer.\n' +
            'To rebuild the explorer, run `make wasm` in the sibling iota-rust-sdk checkout.',
    );
    stageFrom(committedDir);
} else {
    console.warn(
        '@iota/sdk-wasm bindings not built and no committed docs/explorer to reuse; ' +
            'skipping explorer. The resulting build will not include /explorer.',
    );
}
