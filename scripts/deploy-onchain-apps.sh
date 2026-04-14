#!/usr/bin/env bash
set -euo pipefail

# Deploy the onchain_apps Move package to IOTA devnet and print the
# object IDs needed by the On-Chain Apps page.
#
# Prerequisites:
#   - `iota` CLI installed (https://github.com/iotaledger/iota/releases)
#   - active env set to devnet: `iota client switch --env devnet`
#   - funded address: `iota client faucet`
#
# Usage:
#   ./scripts/deploy-onchain-apps.sh
#
# After a successful publish the script prints three IDs:
#   PACKAGE_ID, REGISTRY_ID, STORAGE_ID
# Paste them into src/lib/pages/onchain-apps/onchain-apps-config.ts
# (DEFAULT_CONFIG) or type them into the config panel on the page.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MOVE_DIR="$SCRIPT_DIR/../move/onchain_apps"

if ! command -v iota &>/dev/null; then
    echo "Error: 'iota' CLI not found. Install from https://github.com/iotaledger/iota/releases" >&2
    exit 1
fi

echo "Building Move package..."
iota move build --path "$MOVE_DIR"

echo ""
echo "Publishing to devnet (gas budget 500_000_000)..."
PUBLISH_OUTPUT=$(iota client publish --path "$MOVE_DIR" --gas-budget 500000000 --json 2>&1)

# Extract the package ID (the "Published Objects" entry).
PACKAGE_ID=$(echo "$PUBLISH_OUTPUT" | python3 -c "
import sys, json
data = json.load(sys.stdin)
changes = data.get('objectChanges', [])
for c in changes:
    if c.get('type') == 'published':
        print(c['packageId'])
        break
" 2>/dev/null || echo "")

if [ -z "$PACKAGE_ID" ]; then
    echo "Failed to extract package ID from publish output." >&2
    echo "Raw output:" >&2
    echo "$PUBLISH_OUTPUT" >&2
    exit 1
fi

# Extract shared object IDs (Registry and Storage are created in init()).
REGISTRY_ID=$(echo "$PUBLISH_OUTPUT" | python3 -c "
import sys, json
data = json.load(sys.stdin)
changes = data.get('objectChanges', [])
for c in changes:
    if c.get('type') == 'created' and '::registry::Registry' in c.get('objectType', ''):
        print(c['objectId'])
        break
" 2>/dev/null || echo "")

STORAGE_ID=$(echo "$PUBLISH_OUTPUT" | python3 -c "
import sys, json
data = json.load(sys.stdin)
changes = data.get('objectChanges', [])
for c in changes:
    if c.get('type') == 'created' and '::generic_storage::Storage' in c.get('objectType', ''):
        print(c['objectId'])
        break
" 2>/dev/null || echo "")

echo ""
echo "============================================"
echo "  Deployment successful!"
echo "============================================"
echo ""
echo "  PACKAGE_ID:  $PACKAGE_ID"
echo "  REGISTRY_ID: $REGISTRY_ID"
echo "  STORAGE_ID:  $STORAGE_ID"
echo ""
echo "Paste these into onchain-apps-config.ts DEFAULT_CONFIG:"
echo ""
echo "  export const DEFAULT_CONFIG: OnChainAppsConfig = {"
echo "      packageId: '$PACKAGE_ID',"
echo "      registryId: '$REGISTRY_ID',"
echo "      storageId: '$STORAGE_ID',"
echo "  };"
echo ""
