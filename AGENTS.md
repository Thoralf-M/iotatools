# AGENTS.md - AI Agent Instructions for IOTA Tools

## Project Overview

IOTA Tools is a **Svelte 5 SPA (Single Page Application)** providing utility tools for the IOTA blockchain ecosystem. It's a browser-based toolset that helps users interact with the IOTA network for transactions, staking, address management, and more.

**Live site:** https://iotatools.dev

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Svelte 5 with TypeScript |
| Build Tool | Vite 7 |
| Package Manager | pnpm |
| Routing | svelte-spa-router (hash-based SPA routing) |
| Testing | Vitest + jsdom |
| Formatting | Prettier (with import sorting) |
| IOTA SDK | @iota/iota-sdk, @iota/bcs, @iota/graphql-transport |
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
pnpm build

# Run production server
pnpm production

# Type checking
pnpm run check

# Format code
pnpm run prettier:fix

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

| Component | Purpose |
|-----------|---------|
| `JsonToggleView.svelte` | Toggle between formatted/raw JSON display |
| `IotaAmountInput.svelte` | Input field for IOTA amounts with conversion |
| `TransactionView.svelte` | Display transaction details |
| `ObjectView.svelte` | Display IOTA object details |
| `QrGenerator.svelte` | Generate QR codes |
| `QrScanner.svelte` | Scan QR codes via camera |
| `Signer.svelte` | Transaction signing interface |
| `Tabs.svelte` | Tab navigation component |

## Testing

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

## Build & Deployment

- `pnpm build` runs Vite build + `scripts/postbuild.js`
- Output goes to `docs/` folder (for GitHub Pages)
- `docs/CNAME` contains custom domain: `iotatools.dev`
- Asset paths are adjusted for relative loading

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
    import { usePageQueryParams, updatePageQueryParams } from '../../utils/page-query-params';

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
