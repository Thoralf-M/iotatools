# AGENTS.md - AI Agent Instructions for IOTA Tools

## Project Overview

IOTA Tools is a **Svelte 5 SPA (Single Page Application)** providing utility tools for the IOTA blockchain ecosystem. It's a browser-based toolset that helps users interact with the IOTA network for transactions, staking, address management, and more.

**Live site:** https://iotatools.dev

## Tech Stack

| Category        | Technology                                                |
| --------------- | --------------------------------------------------------- |
| Framework       | Svelte 5 with TypeScript                                  |
| Build Tool      | Vite 7                                                    |
| Package Manager | pnpm                                                      |
| Routing         | svelte-spa-router (hash-based SPA routing)                |
| Testing         | Vitest + jsdom                                            |
| Formatting      | Prettier (with import sorting)                            |
| IOTA SDK        | @iota/iota-sdk, @iota/bcs, @iota/graphql-transport        |
| Hardware Wallet | @iota/ledgerjs-hw-app-iota, @ledgerhq/hw-transport-webhid |

## Project Structure

```
src/
├── App.svelte              # Main app with router and navigation tabs
├── app.css                 # Global styles and CSS variables
├── main.ts                 # Entry point
└── lib/
    ├── components/         # Reusable Svelte components
    ├── pages/              # Page components (one folder per route)
    ├── stores/             # Svelte stores for state management
    ├── styles/             # Shared CSS files
    └── utils/              # Utility functions and shared logic

scripts/                    # Build and utility scripts (Node.js)
docs/                       # Production build output (GitHub Pages deployment)
public/                     # Static assets
```

## Key Commands

```bash
# Install dependencies
pnpm i

# Development server (with hot reload)
pnpm run dev

# Production build (outputs to docs/ folder - do NOT use for testing changes)
# Run only as the final step, in its own commit — see "When to run pnpm build"
pnpm build

# Run production server
pnpm production

# Type checking
pnpm run check

# Format + lint (run after every edit)
pnpm fix

# Run tests
pnpm test

# Run tests with UI
pnpm test:ui
```

## Code Conventions

### Svelte Components

- Use **Svelte 5 syntax** with runes (`$state`, `$derived`, `$effect`) for new code
- Component files use `.svelte` extension with `<script lang="ts">` for TypeScript
- Each page is in its own folder under `src/lib/pages/` with a matching component name
- Pages are lazy-loaded using dynamic imports in `App.svelte`

### TypeScript

- Strict TypeScript is encouraged but `checkJs: false` in tsconfig
- Type definitions go in `src/types/` for external modules
- Use ES modules (`import`/`export`)

### Styling

- Global styles in `src/app.css` with CSS custom properties (variables)
- Page-specific styles use `<style>` blocks within Svelte components
- Dark theme by default with the color scheme defined in `:root`
- Common page styles in `src/lib/styles/common-pages.css`

### Prettier Configuration

```javascript
{
    printWidth: 100,
    semi: true,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'all',
    useTabs: false
}
```

Imports are auto-sorted: built-ins → third-party → local.

## Adding a New Page/Tool

1. **Create the page folder and component:**

    ```
    src/lib/pages/my-new-tool/
    └── MyNewTool.svelte
    ```

2. **Add the lazy import in `App.svelte`:**

    ```typescript
    const pageImports = {
        // ... existing imports
        MyNewTool: () => import('./lib/pages/my-new-tool/MyNewTool.svelte'),
    };
    ```

3. **Register the route in `App.svelte`:**

    ```typescript
    const routes = {
        // ... existing routes
        '/my-new-tool': wrap({ asyncComponent: pageImports['MyNewTool'] }),
    };
    ```

4. **Add navigation tab in `App.svelte`:**

    ```typescript
    const allItems = [
        // ... existing items
        { label: 'My New Tool', route: '/my-new-tool', group: 'Utilities' },
    ];
    ```

    Groups: `Info`, `Wallet`, `Transactions`, `Utilities`, `Other`

## Core Utilities

### Network/Client (`src/lib/utils/client.ts`)

- `getClient(graphql?)` - Returns configured IotaClient instance
- `getSelectedNetworkConfig()` - Returns current network configuration
- Supports mainnet, testnet, devnet

### Local Storage (`src/lib/utils/local-storage-store.ts`)

- `sharedClientConfig` - Network configuration store
- `isProMode` - Toggle for advanced features
- Persistent stores using `localStorage`

### Query Parameters (`src/lib/utils/page-query-params.ts`)

- `usePageQueryParams(defaults)` - Hook for URL query parameter state
- `updatePageQueryParams(params)` - Update URL params

### Formatting (`src/lib/utils/formatting.ts`)

- IOTA amount formatting utilities
- Address formatting helpers

### IOTA Conversion (`src/lib/utils/iota-nano-conversion.ts`)

- `iotaToNano(iota)` - Convert IOTA to nano
- `nanoToIota(nano)` - Convert nano to IOTA

## Reusable Components

| Component                | Purpose                                      |
| ------------------------ | -------------------------------------------- |
| `JsonToggleView.svelte`  | Toggle between formatted/raw JSON display    |
| `IotaAmountInput.svelte` | Input field for IOTA amounts with conversion |
| `TransactionView.svelte` | Display transaction details                  |
| `ObjectView.svelte`      | Display IOTA object details                  |
| `QrGenerator.svelte`     | Generate QR codes                            |
| `QrScanner.svelte`       | Scan QR codes via camera                     |
| `Signer.svelte`          | Transaction signing interface                |
| `Tabs.svelte`            | Tab navigation component                     |

## Post-edit checks

After making code changes, run these before reporting the task as complete:

```bash
pnpm fix      # format (oxfmt + prettier on .svelte) and lint (oxlint)
pnpm check    # svelte-check + tsc — catches type errors
```

`pnpm fix` is a convenience wrapper around `pnpm format:fix && pnpm lint`. Format and lint are kept as separate scripts so CI can run the non-mutating `pnpm format:check` independently.

## Testing

### Unit tests (Vitest)

- Test files: `*.test.ts` alongside source files
- Uses Vitest with jsdom environment
- Test fixtures in `src/lib/components/tx-fixtures/`

Example test location:

```
src/lib/components/transaction-view.test.ts
```

Run tests:

```bash
pnpm test              # Run tests once
pnpm test:ui           # Interactive UI
```

### UI / end-to-end testing (Playwright MCP)

For any change that affects UI or user-facing behavior, **verify the change in a real browser using the Playwright MCP tools** before reporting the task as complete. Type checks and unit tests catch code correctness, not feature correctness.

Workflow:

1. Start the dev server in the background: `pnpm run dev` (default URL: http://localhost:5173).
2. Navigate to the affected route with `browser_navigate`, then exercise the feature using `browser_snapshot`, `browser_click`, `browser_fill_form`, `browser_type`, etc.
3. Test the **golden path** (the primary flow you changed) and at least one **edge case** (empty input, invalid address, network switch, etc.).
4. Check `browser_console_messages` for unexpected errors and watch for regressions in adjacent features.
5. Close the page with `browser_close` when done.

If browser testing is not possible for a given change (e.g., Ledger/WebHID hardware-wallet flows, camera-based QR scanning), say so explicitly in the summary rather than claiming the change was verified.

#### Testing real transactions

For flows that build, sign, or execute transactions, use **devnet** with one of the **built-in default accounts** so signing happens fully in the browser — no Ledger or external wallet needed:

1. Switch the network to **devnet** via the network selector (persisted in `sharedClientConfig`).
2. Click **"Enable Pro Mode"** in the top toolbar. The default-toolbar only exposes `Connect Web Wallet` and `Use External Address` — the **Localstorage** signer (which uses the default accounts) is hidden until Pro Mode is on. Pro Mode also surfaces the `Tx execution` selector you'll need in step 4.
3. In the per-page signer panel, set **Signer → `Localstorage`** and **Address → `Default Account 0/1/2`** ([src/lib/utils/default-private-keys.ts](src/lib/utils/default-private-keys.ts)). They're pre-loaded into `sharedPrivateKeyAccounts` and signed via the wallet-standard wrapper in [src/lib/utils/signer-data.ts](src/lib/utils/signer-data.ts) — do **not** create or import a new account just for testing.
4. Set **Tx execution → `send (transaction, costs gas)`**. The default is `dry-run`, which simulates only and won't produce an on-chain digest.
5. These accounts usually carry devnet funds. If a flow fails because the chosen account is empty, top it up from the devnet faucet and retry.
6. Drive the transaction through the UI with Playwright and assert on the resulting effects / digest in the Transactions panel.

## Build & Deployment

- `pnpm build` runs Vite build + `scripts/postbuild.js`
- Output goes to `docs/` folder (for GitHub Pages)
- `docs/CNAME` contains custom domain: `iotatools.dev`
- Asset paths are adjusted for relative loading

### When to run `pnpm build`

- **Run `pnpm build` only once, as the very last step**, after all source
  changes are finished and verified (`pnpm check`, `pnpm lint`, `pnpm test`) and
  you are ready to commit and push the branch for a pull request.
- **Keep the build output in its own dedicated, final commit** — never mix the
  generated `docs/` output into commits that contain source changes. The build
  re-hashes every asset filename, so committing it alongside source edits buries
  the real diff in churn.
- Do **not** run `pnpm build` to test changes during development — use
  `pnpm run dev` for that. The `docs/` output is a deployment artifact only.

## Important Notes

1. **Browser-only:** This is a client-side SPA. No SSR/SSG.

2. **Polyfills:** Buffer and process polyfills are configured in `vite.config.ts` for Node.js compatibility (needed for Ledger integration).

3. **Network Configuration:** The app supports multiple networks (mainnet, testnet, devnet). Network selection is persisted in localStorage.

4. **Hardware Wallets:** Ledger Nano support uses WebHID API. Keystone uses QR-based signing.

5. **No Backend:** All operations are client-side. Faucet requests go directly to IOTA faucet endpoints.

## Common Patterns

### Page with Query Parameters

```svelte
<script lang="ts">
    import { onMount } from 'svelte';

    import { updatePageQueryParams, usePageQueryParams } from '../../utils/page-query-params';

    const queryParamDefaults = {
        address: '',
        amount: '',
    };

    const pageParams = usePageQueryParams(queryParamDefaults);

    let address = '';

    onMount(() => {
        if ($pageParams.address) {
            address = $pageParams.address;
        }
    });

    function updateUrl() {
        updatePageQueryParams({ address });
    }
</script>
```

### Using IOTA Client

```svelte
<script lang="ts">
    import { getClient } from '../../utils/client';

    async function fetchData() {
        const client = getClient();
        const result = await client.getObject({ id: objectId });
        // ...
    }
</script>
```

### Shared Store Usage

```svelte
<script lang="ts">
    import { sharedClientConfig } from '../../utils/local-storage-store';
    import { activeAddress } from '../../utils/signer-data';

    // Access current network
    $: currentNetwork = $sharedClientConfig.selected;

    // Access active wallet address
    $: walletAddress = $activeAddress;
</script>
```

## File Naming Conventions

- **Components:** PascalCase (e.g., `MyComponent.svelte`)
- **Utilities:** kebab-case (e.g., `my-utility.ts`)
- **Pages:** kebab-case folder, PascalCase component (e.g., `my-page/MyPage.svelte`)
- **Tests:** Same name as source with `.test.ts` suffix
