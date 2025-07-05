<script lang="ts">
    import { formatNumberWithUnderscores, nanoToIota } from '../lib/iota-nano-conversion';

    export let transactionData: any;

    function formatAddress(address: string): string {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-6)}`;
    }

    function formatDigest(digest: string): string {
        if (!digest) return '';
        return `${digest.slice(0, 8)}...${digest.slice(-8)}`;
    }

    function formatExpiration(expiration: any): string {
        if (!expiration) return 'None';
        if (expiration.None) return 'None';
        if (expiration.Epoch) return `Epoch ${expiration.Epoch}`;
        return 'Unknown';
    }

    function formatGasBudget(budget: string): string {
        if (!budget) return '';
        try {
            const iotaAmount = nanoToIota(budget);
            return `${iotaAmount} IOTA (${formatNumberWithUnderscores(budget)} nanos)`;
        } catch {
            return formatNumberWithUnderscores(budget);
        }
    }

    $: decodedTransaction = transactionData?.decodedBCS?.intentMessage?.value?.V1;
    $: rawTransaction = transactionData;
    $: hasValidData =
        rawTransaction && (rawTransaction.digest || rawTransaction.sender || decodedTransaction);
</script>

<style>
    .transaction-raw {
        text-align: left;
        margin: 0.5rem 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    .section {
        margin: 1rem 0;
    }

    .section h4 {
        margin: 0 0 0.75rem 0;
        font-size: 1rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
    }

    .commands-list,
    .inputs-list {
        background: var(--background-light);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 0.75rem;
    }

    .command-item,
    .input-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1rem;
        padding: 0.75rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        border-left: 3px solid #a78bfa;
    }

    .command-index,
    .input-index {
        font-family: 'JetBrains Mono', monospace;
        font-weight: 600;
        color: #a78bfa;
        min-width: 2rem;
        font-size: 0.9rem;
    }

    .command-kind,
    .input-kind {
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
        min-width: 8rem;
        font-size: 0.9rem;
    }

    .command-data pre,
    .input-data pre {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.7);
        background: rgba(0, 0, 0, 0.3);
        padding: 0.5rem;
        border-radius: 4px;
        overflow-x: auto;
        margin: 0;
        flex: 1;
    }

    .gas-info {
        background: var(--background-light);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 0.75rem;
    }

    .gas-field {
        display: flex;
        align-items: center;
        margin-bottom: 0.75rem;
    }

    .field-label {
        font-weight: 600;
        color: rgba(255, 255, 255, 0.7);
        min-width: 6rem;
        margin-right: 1rem;
    }

    .field-value {
        font-family: 'JetBrains Mono', monospace;
        color: rgba(255, 255, 255, 0.85);
        font-size: 0.85rem;
        word-break: break-all;
        flex: 1;
    }

    .payment-object {
        display: inline-block;
        background: rgba(0, 0, 0, 0.3);
        padding: 2px 6px;
        border-radius: 3px;
        margin-right: 0.5rem;
        margin-bottom: 0.25rem;
        font-size: 0.8rem;
    }
</style>
