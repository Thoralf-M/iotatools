<script lang="ts">
    import type { MoveAuthenticatorData } from '@iota/iota-sdk/keypairs/move-authenticator';

    import { getSelectedNetworkConfig } from '../utils/client';
    import { getObjectLink } from '../utils/explorer-links';
    import { copyToClipboard } from '../utils/formatting';

    type ObjectArg = MoveAuthenticatorData['objectToAuthenticate'];

    function extractObjectId(objectArg: ObjectArg): string {
        if ('SharedObject' in objectArg) return objectArg.SharedObject.objectId;
        if ('ImmOrOwnedObject' in objectArg) return objectArg.ImmOrOwnedObject.objectId;
        if ('Receiving' in objectArg) return objectArg.Receiving.objectId;
        throw new Error('Unknown ObjectArg variant');
    }

    let { data }: { data: MoveAuthenticatorData } = $props();

    let authenticatedObjectId = $derived(extractObjectId(data.objectToAuthenticate));
</script>

<div class="detail-row">
    <span class="detail-label">Version:</span>
    <div class="detail-value-container">
        <span class="detail-value">{data.version}</span>
    </div>
</div>

<div class="detail-row">
    <span class="detail-label">Authenticated Object ID:</span>
    <div class="detail-value-container">
        <a
            class="detail-value link"
            href={getObjectLink(getSelectedNetworkConfig(), authenticatedObjectId)}
            target="_blank"
            rel="noopener noreferrer">{authenticatedObjectId}</a
        >
        <button class="copy-btn" onclick={async () => await copyToClipboard(authenticatedObjectId)}>
            Copy
        </button>
    </div>
</div>

<div class="detail-row">
    <span class="detail-label">Call Arguments:</span>
    <div class="detail-value-container">
        <span class="detail-value wrap">{JSON.stringify(data.callArgs, null, 2)}</span>
        <button
            class="copy-btn"
            onclick={async () => await copyToClipboard(JSON.stringify(data.callArgs))}
        >
            Copy
        </button>
    </div>
</div>

<div class="detail-row">
    <span class="detail-label">Type Arguments:</span>
    <div class="detail-value-container">
        <span class="detail-value wrap">{JSON.stringify(data.typeArgs, null, 2)}</span>
        <button
            class="copy-btn"
            onclick={async () => await copyToClipboard(JSON.stringify(data.typeArgs))}
        >
            Copy
        </button>
    </div>
</div>

<div class="detail-row">
    <span class="detail-label">Object to Authenticate:</span>
    <div class="detail-value-container">
        <span class="detail-value wrap">{JSON.stringify(data.objectToAuthenticate, null, 2)}</span>
        <button
            class="copy-btn"
            onclick={async () => await copyToClipboard(JSON.stringify(data.objectToAuthenticate))}
        >
            Copy
        </button>
    </div>
</div>

<style>
    .detail-row {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        text-align: left;
    }

    .detail-label {
        font-weight: 600;
        min-width: 180px;
        flex-shrink: 0;
        padding-top: 2px;
        font-size: 13px;
    }

    @media (max-width: 600px) {
        .detail-row {
            flex-direction: column;
            gap: 4px;
        }
        .detail-label {
            min-width: 0;
        }
    }

    .detail-value-container {
        flex: 1;
        display: flex;
        gap: 8px;
        align-items: flex-start;
    }

    .detail-value {
        font-family: monospace;
        font-size: 12px;
        word-break: break-all;
        flex: 1;
        line-height: 1.5;
    }

    .detail-value.link {
        color: var(--link-color, #0066cc);
        text-decoration: underline;
        cursor: pointer;
    }

    .detail-value.link:hover {
        color: var(--link-hover-color, #004499);
    }

    .detail-value.wrap {
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .copy-btn {
        flex-shrink: 0;
        padding: 4px 10px;
        font-size: 11px;
        background: var(--bg-tertiary);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .copy-btn:hover {
        background: var(--bg-hover);
    }
</style>
