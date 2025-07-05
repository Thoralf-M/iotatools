<script lang="ts">
    import { decodeBase64Bytes } from '../lib/converter';
    import { formatNumberWithUnderscores, nanoToIota } from '../lib/iota-nano-conversion';

    export let transactionData: any;

    function formatAmount(amount: string, coinType?: string): string {
        if (!amount) return '';
        const isNegative = amount.startsWith('-');
        const absAmount = amount.replace('-', '');

        try {
            const iotaAmount = nanoToIota(absAmount);
            const prefix = isNegative ? '-' : '+';
            return `${prefix}${iotaAmount} IOTA`;
        } catch {
            return `${amount} nanos`;
        }
    }

    function formatGasCost(gasSummary: any): string {
        if (!gasSummary) return '';
        const total =
            BigInt(gasSummary.storageCost || 0) +
            BigInt(gasSummary.computationCost || 0) -
            BigInt(gasSummary.storageRebate || 0);

        try {
            return `${nanoToIota(total.toString())} IOTA`;
        } catch {
            return `${formatNumberWithUnderscores(total.toString())} nanos`;
        }
    }

    function formatObjectId(objectId: string): string {
        if (!objectId) return '';
        return `${objectId.slice(0, 8)}...${objectId.slice(-8)}`;
    }

    function getStatusColor(status: string): string {
        switch (status?.toUpperCase()) {
            case 'SUCCESS':
                return '#28a745';
            case 'FAILURE':
            case 'FAILED':
                return '#dc3545';
            default:
                return '#6c757d';
        }
    }

    function removeKindFields(obj: any): any {
        if (obj === null || obj === undefined) return obj;

        if (Array.isArray(obj)) {
            return obj.map((item) => removeKindFields(item));
        }

        if (typeof obj === 'object') {
            const cleaned: any = {};
            for (const [key, value] of Object.entries(obj)) {
                if (key !== '$kind') {
                    cleaned[key] = removeKindFields(value);
                }
            }
            return cleaned;
        }

        return obj;
    }

    $: effects = transactionData?.effects;
    $: balanceChanges = effects?.balanceChanges?.nodes || [];
    $: objectChanges = effects?.objectChanges?.nodes || [];
    $: events = effects?.events?.nodes || [];
    $: deletedObjects = objectChanges.filter((change: any) => change.idDeleted === true);
    $: createdObjects = objectChanges.filter((change: any) => change.idCreated === true);
    $: mutatedObjects = objectChanges.filter(
        (change: any) => change.idDeleted === false && change.idCreated === false,
    );
    $: hasValidData =
        effects && (effects.status || effects.checkpoint || balanceChanges.length > 0);
</script>

<div class="transaction-effects">
    {#if effects}
        <!-- Top header line with transaction ID, status, checkpoint, time -->
        <div class="header-line">
            <span class="tx-header">Transaction</span>
            <span class="tx-id-short" title={transactionData?.digest}
                >{transactionData?.digest}</span
            >
            <span class="status" style="color: {getStatusColor(effects.status)}"
                >{effects.status}</span
            >
            <span class="checkpoint-info"
                >Checkpoint: {formatNumberWithUnderscores(
                    effects.checkpoint?.sequenceNumber || '',
                )}</span
            >
            <span class="time-info"
                >{new Date(
                    effects.checkpoint?.timestamp || transactionData?.timestamp,
                ).toLocaleString()}</span
            >
        </div>

        <!-- Second line with sender and fee info -->
        <div class="sender-fee-line">
            <div class="sender-section">
                <span class="field-label">Sender:</span>
                <span class="field-value" title={transactionData?.sender}
                    >{transactionData?.sender || 'N/A'}</span
                >
            </div>
            <div class="fee-section">
                {#if effects.gasEffects?.gasSummary}
                    <div class="fee-main">
                        <span class="field-label">Fee:</span>
                        <span class="gas-fee">{formatGasCost(effects.gasEffects.gasSummary)}</span>
                        <span class="field-label">Storage cost:</span>
                        <span class="field-value"
                            >{nanoToIota(effects.gasEffects.gasSummary.storageCost || 0)}</span
                        >
                        <span class="field-label">Rebate:</span>
                        <span class="field-value"
                            >{nanoToIota(effects.gasEffects.gasSummary.storageRebate || 0)}</span
                        >
                    </div>
                {/if}
            </div>
        </div>

        <!-- Balance Changes Section -->
        {#if balanceChanges.length > 0}
            <div class="section">
                <h4>Balance Changes ({balanceChanges.length}):</h4>
                <div class="balance-columns">
                    <div class="negative-changes">
                        <h5 class="column-header deleted">
                            Negative Changes ({balanceChanges.filter((change: any) =>
                                change.amount.startsWith('-'),
                            ).length}):
                        </h5>
                        <div class="balance-content">
                            {#each balanceChanges.filter( (change: any) => change.amount.startsWith('-'), ) as change}
                                <div class="balance-box negative">
                                    <div class="full-address" title={change.owner?.address}>
                                        {change.owner?.address}
                                    </div>
                                    <div class="amount-value">
                                        {formatAmount(change.amount, change.coinType?.repr)}
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                    <div class="positive-changes">
                        <h5 class="column-header created">
                            Positive Changes ({balanceChanges.filter(
                                (change: any) => !change.amount.startsWith('-'),
                            ).length}):
                        </h5>
                        <div class="balance-content">
                            {#each balanceChanges.filter((change: any) => !change.amount.startsWith('-')) as change}
                                <div class="balance-box positive">
                                    <div class="full-address" title={change.owner?.address}>
                                        {change.owner?.address}
                                    </div>
                                    <div class="amount-value">
                                        {formatAmount(change.amount, change.coinType?.repr)}
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        {/if}

        <!-- Object Changes Section -->
        {#if objectChanges.length > 0}
            <div class="section">
                <h4>Object Changes ({objectChanges.length}):</h4>
                <div class="object-columns-three">
                    <div class="deleted-objects">
                        <h5 class="column-header deleted">Deleted ({deletedObjects.length}):</h5>
                        <div class="object-content">
                            {#each deletedObjects as change}
                                <div class="object-box deleted">
                                    <div class="object-id">{change.address}</div>
                                    {#if change.inputState?.asMoveObject?.contents?.json}
                                        <details class="state-collapsible" open>
                                            <summary class="state-summary">Previous State:</summary>
                                            <div class="object-json">
                                                <pre>{JSON.stringify(
                                                        removeKindFields({
                                                            ...change.inputState.asMoveObject
                                                                .contents.json,
                                                            id: undefined,
                                                        }),
                                                        null,
                                                        2,
                                                    )}</pre>
                                            </div>
                                        </details>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </div>
                    <div class="mutated-objects">
                        <h5 class="column-header mutated">Mutated ({mutatedObjects.length}):</h5>
                        <div class="object-content">
                            {#each mutatedObjects as change}
                                <div class="object-box mutated">
                                    {#if change.outputState?.asMoveObject?.contents?.json?.id}
                                        <div class="object-id">
                                            {change.outputState.asMoveObject.contents.json.id}
                                        </div>
                                        {#if change.inputState?.asMoveObject?.contents?.json}
                                            <details class="state-collapsible">
                                                <summary class="state-summary"
                                                    >Previous State:</summary
                                                >
                                                <div class="object-json">
                                                    <pre>{JSON.stringify(
                                                            removeKindFields({
                                                                ...change.inputState.asMoveObject
                                                                    .contents.json,
                                                                id: undefined,
                                                            }),
                                                            null,
                                                            2,
                                                        )}</pre>
                                                </div>
                                            </details>
                                        {/if}
                                        <details class="state-collapsible" open>
                                            <summary class="state-summary">Current State:</summary>
                                            <div class="object-json">
                                                <pre>{JSON.stringify(
                                                        removeKindFields({
                                                            ...change.outputState.asMoveObject
                                                                .contents.json,
                                                            id: undefined,
                                                        }),
                                                        null,
                                                        2,
                                                    )}</pre>
                                            </div>
                                        </details>
                                    {:else}
                                        <div class="object-id">{change.address}</div>
                                        {#if change.inputState?.asMoveObject?.contents?.json}
                                            <details class="state-collapsible">
                                                <summary class="state-summary"
                                                    >Previous State:</summary
                                                >
                                                <div class="object-json">
                                                    <pre>{JSON.stringify(
                                                            removeKindFields({
                                                                ...change.inputState.asMoveObject
                                                                    .contents.json,
                                                                id: undefined,
                                                            }),
                                                            null,
                                                            2,
                                                        )}</pre>
                                                </div>
                                            </details>
                                        {/if}
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </div>
                    <div class="created-objects">
                        <h5 class="column-header created">Created ({createdObjects.length}):</h5>
                        <div class="object-content">
                            {#each createdObjects as change}
                                <div class="object-box created">
                                    {#if change.outputState?.asMoveObject?.contents?.json?.id}
                                        <div class="object-id">
                                            {change.outputState.asMoveObject.contents.json.id}
                                        </div>
                                        <details class="state-collapsible" open>
                                            <summary class="state-summary">Object State:</summary>
                                            <div class="object-json">
                                                <pre>{JSON.stringify(
                                                        removeKindFields({
                                                            ...change.outputState.asMoveObject
                                                                .contents.json,
                                                            id: undefined,
                                                        }),
                                                        null,
                                                        2,
                                                    )}</pre>
                                            </div>
                                        </details>
                                    {:else}
                                        <div class="object-id">{change.address}</div>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        {/if}

        <!-- Events Section -->
        {#if events.length > 0}
            <div class="section">
                <details class="events-collapsible">
                    <summary>Events ({events.length})</summary>
                    <div class="events-content">
                        {#each events as event, index}
                            <div class="event-item">
                                <span class="event-index">#{index + 1}</span>
                                <span class="event-type">{event.type || 'Unknown'}</span>
                                {#if event.parsedJson}
                                    <pre class="event-data">{JSON.stringify(
                                            event.parsedJson,
                                            null,
                                            2,
                                        )}</pre>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </details>
            </div>
        {/if}

        <!-- Tx Commands Section (moved from TransactionRawData) -->
        {#if transactionData?.decodedBCS?.intentMessage?.value?.V1?.kind?.ProgrammableTransaction?.commands?.length}
            <div class="section">
                <span
                    >Tx commands ({transactionData.decodedBCS.intentMessage.value.V1.kind
                        .ProgrammableTransaction.commands.length}):</span
                >
                <div class="commands-list">
                    {#each transactionData.decodedBCS.intentMessage.value.V1.kind.ProgrammableTransaction.commands as command, index}
                        <div class="command-item">
                            <span class="command-index">{index}</span>
                            <span class="command-kind">{command.$kind}</span>
                            <div class="command-data">
                                <pre>{JSON.stringify(
                                        removeKindFields(command)[command.$kind],
                                        null,
                                        2,
                                    )}</pre>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Inputs Section (moved from TransactionRawData) -->
        {#if transactionData?.decodedBCS?.intentMessage?.value?.V1?.kind?.ProgrammableTransaction?.inputs?.length}
            <div class="section">
                <span>Inputs:</span>
                <div class="inputs-list">
                    {#each transactionData.decodedBCS.intentMessage.value.V1.kind.ProgrammableTransaction.inputs as input, index}
                        <div class="input-item">
                            <span class="input-index">{index}</span>
                            <span class="input-kind">{input.$kind}</span>
                            <div class="input-data">
                                <pre>{JSON.stringify(
                                        removeKindFields(input)[input.$kind],
                                        null,
                                        2,
                                    )}</pre>
                                {#if input.$kind === 'Pure' && input[input.$kind].bytes}
                                    {@const decoded = decodeBase64Bytes(input[input.$kind].bytes)}
                                    {#if decoded}
                                        <div class="decoded-bytes">
                                            <div class="decoded-item">
                                                <span class="decode-label">UTF-8:</span>
                                                <span class="decode-value">{decoded.utf8}</span>
                                            </div>
                                            <div class="decoded-item">
                                                <span class="decode-label">u64:</span>
                                                <span class="decode-value">{decoded.u64}</span>
                                            </div>
                                            <div class="decoded-item">
                                                <span class="decode-label">Bytes:</span>
                                                <span class="decode-value"
                                                    >[{decoded.bytes.join(', ')}]</span
                                                >
                                            </div>
                                        </div>
                                    {/if}
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Gas Data Section (moved from TransactionRawData) -->
        {#if transactionData?.decodedBCS?.intentMessage?.value?.V1?.gasData}
            <div class="section">
                <span>Gas Data:</span>
                <div class="gas-info">
                    <div class="gas-field">
                        <span class="field-label">Payment:</span>
                        <span class="field-value">
                            {#if transactionData.decodedBCS.intentMessage.value.V1.gasData.payment?.length}
                                {#each transactionData.decodedBCS.intentMessage.value.V1.gasData.payment as payment, index}
                                    <span class="payment-object"
                                        >{payment.objectId} (v{payment.version})</span
                                    >
                                {/each}
                            {:else}
                                N/A
                            {/if}
                        </span>
                    </div>
                    <div class="gas-field">
                        <span class="field-label">Owner:</span>
                        <span
                            class="field-value"
                            title={transactionData.decodedBCS.intentMessage.value.V1.gasData.owner}
                            >{transactionData.decodedBCS.intentMessage.value.V1.gasData.owner}</span
                        >
                    </div>
                </div>
            </div>
        {/if}
    {:else if !hasValidData}
        <div class="no-data">No transaction effects data available</div>
    {/if}
</div>

<style>
    .transaction-effects {
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 0;
    }

    .transaction-effects > * {
        margin: 0 !important;
    }

    .header-line {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.375rem;
        background: var(--background-light);
        border-radius: 6px;
        border: 1px solid var(--border-color);
        font-weight: 600;
    }

    .tx-header {
        color: rgba(255, 255, 255, 0.9);
        font-size: 1rem;
    }

    .tx-id-short {
        font-family: 'JetBrains Mono', monospace;
        background: rgba(0, 0, 0, 0.3);
        padding: 3px 6px;
        border-radius: 4px;
        color: rgba(255, 255, 255, 0.85);
        font-size: 0.85rem;
    }

    .status {
        padding: 4px 8px;
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.3);
        font-size: 0.85rem;
        text-transform: uppercase;
        font-weight: 600;
    }

    .checkpoint-info,
    .time-info {
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.85rem;
    }

    .sender-fee-line {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        padding: 0.375rem;
        background: var(--background-light);
        border-radius: 6px;
        border: 1px solid var(--border-color);
    }

    .field-label {
        font-weight: 600;
        color: rgba(255, 255, 255, 0.7);
        margin-right: 0.5rem;
    }

    .field-value {
        font-family: 'JetBrains Mono', monospace;
        color: rgba(255, 255, 255, 0.85);
        font-size: 0.85rem;
        word-break: break-all;
    }

    .gas-fee {
        font-family: 'JetBrains Mono', monospace;
        color: #f87171;
        font-weight: 600;
        background: rgba(248, 113, 113, 0.1);
        padding: 2px 6px;
        border-radius: 4px;
    }

    .section {
        margin: 0;
        display: flex;
        flex-direction: column;
    }

    .section span {
        font-size: 1rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
    }

    .section h4 {
        font-size: 1rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
        margin: 0;
    }

    .balance-columns {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .object-columns-three {
        display: grid;
        grid-template-columns: 0.6fr 1fr 1fr;
        gap: 1rem;
    }

    .negative-changes,
    .positive-changes,
    .deleted-objects,
    .created-objects,
    .mutated-objects {
        display: flex;
        flex-direction: column;
    }

    .balance-content,
    .object-content {
        max-height: 400px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
    }

    .balance-box,
    .object-box {
        background: var(--background-light);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 0.375rem;
        margin-bottom: 0.125rem;
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
    }

    .object-box.mutated {
        border-left: 3px solid #fbbf24;
        gap: 0.125rem;
    }

    .object-box.mutated .state-collapsible {
        margin: 0 !important;
        padding: 0 !important;
    }

    .object-json {
        display: flex;
        flex-direction: column;
        gap: 0;
    }

    .balance-box.negative {
        border-left: 3px solid #f87171;
    }

    .balance-box.positive {
        border-left: 3px solid #4ade80;
    }

    .object-box.deleted {
        border-left: 3px solid #f87171;
    }

    .object-box.created {
        border-left: 3px solid #4ade80;
    }

    .object-box.mutated {
        border-left: 3px solid #fbbf24;
    }

    .full-address {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.7);
        word-break: break-all;
    }

    .amount-value {
        font-family: 'JetBrains Mono', monospace;
        font-weight: 600;
        font-size: 0.9rem;
    }

    .negative .amount-value {
        color: #f87171;
    }

    .positive .amount-value {
        color: #4ade80;
    }

    .column-header {
        margin: 0;
        font-size: 0.9rem;
        font-weight: 600;
    }

    .column-header.deleted {
        color: #f87171;
    }

    .column-header.created {
        color: #4ade80;
    }

    .column-header.mutated {
        color: #fbbf24;
    }

    .object-id {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 0.25rem;
        word-break: break-all;
    }
    .state-summary {
        font-size: 0.7rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.6);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        cursor: pointer;
        list-style: none;
        padding: 0.25rem;
        padding-bottom: 0 !important;
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.2);
        margin: 0 !important;
        margin-bottom: 0 !important;
        line-height: 1 !important;
    }

    .state-collapsible {
        font-size: 0;
    }

    .state-collapsible > * {
        font-size: 0.7rem;
    }

    .state-summary::before {
        content: '▶ ';
        margin-right: 0.5rem;
        color: rgba(255, 255, 255, 0.4);
    }

    .state-collapsible[open] .state-summary::before {
        content: '▼ ';
    }

    .object-json pre {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.8);
        background: rgba(0, 0, 0, 0.3);
        padding: 0.25rem;
        border-radius: 4px;
        margin: 0 0 0.5rem 0;
        max-width: 30rem;
        word-break: break-all;
        white-space: pre-wrap;
    }

    .object-json:last-child pre {
        margin-bottom: 0;
    }

    .events-collapsible {
        background: var(--background-light);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 0.5rem;
    }

    .events-collapsible summary {
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        list-style: none;
    }

    .events-collapsible summary::-webkit-details-marker {
        display: none;
    }

    .events-collapsible summary::before {
        content: '▶ ';
        margin-right: 0.5rem;
    }

    .events-collapsible[open] summary::before {
        content: '▼ ';
    }

    .event-item {
        margin: 0.375rem 0;
        padding: 0.375rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        border-left: 3px solid #a78bfa;
    }

    .event-index {
        font-weight: 600;
        color: #a78bfa;
        margin-right: 0.5rem;
    }

    .event-type {
        color: rgba(255, 255, 255, 0.8);
        font-weight: 500;
    }

    .event-data {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.7);
        background: rgba(0, 0, 0, 0.3);
        padding: 0.25rem;
        border-radius: 4px;
        overflow-x: auto;
        margin: 0.25rem 0 0 0;
    }

    /* Styles for moved sections */
    .commands-list,
    .inputs-list {
        background: var(--background-light);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 0.5rem;
        max-height: 700px;
        overflow-y: auto;
    }

    .command-item,
    .input-item {
        display: flex;
        align-items: flex-start;
        margin-bottom: 0.25rem;
        padding: 0.375rem;
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
        padding: 0.25rem;
        border-radius: 4px;
        width: 100%;
        overflow-x: auto;
        margin: 0;
    }

    .input-data {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        overflow-y: auto;
    }
    .input-data pre {
        max-width: 100%;
        word-wrap: break-all;
        white-space: pre-wrap;
        max-height: 300px;
        overflow-y: auto;
    }
    .decoded-bytes {
        padding: 0.25rem;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
        word-wrap: break-all;
        white-space: pre-wrap;
        width: 100%;
        max-height: 300px;
        display: flex;
        flex-direction: column;
    }

    .decoded-item {
        display: flex;
    }

    .decode-label {
        font-size: 0.75rem !important;
        min-width: 4rem;
    }

    .decode-value {
        font-family: 'JetBrains Mono', monospace;
        font-weight: 400 !important;
        font-size: 0.75rem !important;
        max-height: 300px;
        word-wrap: break-all;
        white-space: pre-wrap;
        width: 100%;
        overflow-y: auto;
    }

    .gas-info {
        background: var(--background-light);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
    }

    .gas-field {
        display: flex;
        align-items: center;
        margin-bottom: 0.375rem;
    }

    .gas-field .field-label {
        min-width: 5rem;
        margin-right: 1rem;
    }

    .gas-field .field-value {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8rem;
        word-break: break-all;
        background: rgba(0, 0, 0, 0.3);
        padding: 2px 6px;
    }

    .payment-object {
        font-size: 0.8rem !important;
        display: inline-block;
        padding: 2px 6px;
        border-radius: 3px;
        margin-right: 0.5rem;
        margin-bottom: 0.25rem;
    }
</style>
