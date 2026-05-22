<script lang="ts">
    import {
        formatJsonWithCompactArrays,
        removeKindFields,
        splitObjectChanges,
    } from '../components/transaction-view';
    import { getSelectedNetworkConfig } from '../utils/client';
    import { decodeBase64Bytes } from '../utils/converter';
    import { getAddressLink, getObjectLink, getTransactionLink } from '../utils/explorer-links';
    import { formatNumberWithUnderscores, nanoToIota } from '../utils/iota-nano-conversion';

    export let transactionData: any;

    function formatAmount(amount: string, coinType?: string | { repr: string }): string {
        if (!amount) return '';
        const isNegative = amount.startsWith('-');
        const absAmount = amount.replace('-', '');

        // Extract coin type string from either string or object format
        let coinTypeStr = '';
        if (typeof coinType === 'string') {
            coinTypeStr = coinType;
        } else if (coinType && typeof coinType === 'object' && 'repr' in coinType) {
            coinTypeStr = coinType.repr;
        }

        // Extract coin symbol from coinType
        let coinSymbol = 'Unknown';
        if (coinTypeStr) {
            const parts = coinTypeStr.split('::');
            coinSymbol = parts.length > 2 ? parts[parts.length - 1].toUpperCase() : 'Unknown';
        }

        try {
            // Only use nanoToIota conversion for IOTA
            if (coinTypeStr === '0x2::iota::IOTA') {
                const iotaAmount = nanoToIota(absAmount);
                const prefix = isNegative ? '-' : '+';
                return `${prefix}${iotaAmount} ${coinSymbol}`;
            } else {
                // For other coins, display the raw amount
                const prefix = isNegative ? '-' : '+';
                const formattedAmount = parseInt(absAmount).toLocaleString();
                return `${prefix}${formattedAmount} ${coinSymbol}`;
            }
        } catch {
            return `${amount} ${coinSymbol}`;
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

    function getBalanceChangeAddress(owner: any): string {
        if (!owner) return '';
        if (typeof owner === 'string') return owner;
        return owner.address || owner.AddressOwner || owner.ObjectOwner || '';
    }

    function formatObjectId(objectId: string): string {
        if (!objectId) return '';
        return `${objectId.slice(0, 8)}...${objectId.slice(-8)}`;
    }

    function getStatusColor(status: string | any): string {
        // Handle both string format and object format
        const statusString = typeof status === 'string' ? status : status?.status;

        switch (statusString?.toUpperCase()) {
            case 'SUCCESS':
                return '#28a745';
            case 'FAILURE':
            case 'FAILED':
                return '#dc3545';
            default:
                return '#6c757d';
        }
    }

    function getStatusString(status: string | any): string {
        return typeof status === 'string' ? status : status?.status || 'Unknown';
    }

    function getStatusError(status: any, fallbackErrors?: string[]): string {
        const err = typeof status === 'object' ? status?.error : null;
        if (err) return err;
        if (Array.isArray(fallbackErrors) && fallbackErrors.length > 0) {
            return fallbackErrors.join('; ');
        }
        return '';
    }

    $: effects = transactionData?.effects;
    $: balanceChanges =
        transactionData?.balanceChanges ||
        effects?.balanceChanges?.nodes ||
        effects?.balanceChanges ||
        [];
    $: objectChanges =
        transactionData?.objectChanges ||
        effects?.objectChanges?.nodes ||
        effects?.objectChanges ||
        [];
    $: events = transactionData?.events || effects?.events?.nodes || effects?.events || [];

    $: split = splitObjectChanges(objectChanges, effects);
    $: deletedObjects = split.deleted;
    $: createdObjects = split.created;
    $: mutatedObjects = split.mutated;
    $: hasValidData =
        effects && (effects.status || effects.checkpoint || balanceChanges.length > 0);
</script>

<div class="transaction-effects">
    {#if effects}
        <!-- Top header line with transaction ID, status, checkpoint, time -->
        <div class="header-line">
            <span class="tx-header">Transaction</span>
            <a
                href={transactionData?.digest
                    ? getTransactionLink(getSelectedNetworkConfig(), transactionData.digest)
                    : '#'}
                target="_blank"
                rel="noopener noreferrer"
                class="tx-id-short"
                title={transactionData?.digest}
            >
                {transactionData?.digest}
            </a>
            <span class="status" style="color: {getStatusColor(effects.status)}"
                >{getStatusString(effects.status)}</span
            >
            {#if getStatusError(effects.status, transactionData?.errors)}
                <span
                    class="status-error"
                    title={getStatusError(effects.status, transactionData?.errors)}
                    >{getStatusError(effects.status, transactionData?.errors)}</span
                >
            {/if}
            {#if effects.checkpoint?.sequenceNumber}
                <span class="checkpoint-info"
                    >Checkpoint: {formatNumberWithUnderscores(
                        effects.checkpoint.sequenceNumber,
                    )}</span
                >
            {/if}
            {#if effects.executedEpoch !== undefined}
                <span class="epoch-info">Epoch: {effects.executedEpoch}</span>
            {/if}
            {#if effects.checkpoint?.timestamp || transactionData?.timestamp}
                <span class="time-info"
                    >{new Date(
                        effects.checkpoint?.timestamp || transactionData?.timestamp,
                    ).toLocaleString()}</span
                >
            {/if}
        </div>

        <!-- Second line with sender and fee info -->
        <div class="sender-fee-line">
            <div class="sender-section">
                <span class="field-label">Sender:</span>
                {#if transactionData?.sender}
                    <a
                        href={getAddressLink(getSelectedNetworkConfig(), transactionData.sender)}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="field-value link-style"
                        title={transactionData.sender}
                    >
                        {transactionData.sender}
                    </a>
                {:else}
                    <span class="field-value">N/A</span>
                {/if}
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
                                {@const addr = getBalanceChangeAddress(change.owner)}
                                <div class="balance-box negative">
                                    {#if addr}
                                        <a
                                            href={getAddressLink(getSelectedNetworkConfig(), addr)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="full-address link-style"
                                            title={addr}
                                        >
                                            {addr}
                                        </a>
                                    {:else}
                                        <div class="full-address">N/A</div>
                                    {/if}
                                    <div class="amount-value">
                                        {formatAmount(change.amount, change.coinType)}
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
                                {@const addr = getBalanceChangeAddress(change.owner)}
                                <div class="balance-box positive">
                                    {#if addr}
                                        <a
                                            href={getAddressLink(getSelectedNetworkConfig(), addr)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="full-address link-style"
                                            title={addr}
                                        >
                                            {addr}
                                        </a>
                                    {:else}
                                        <div class="full-address">N/A</div>
                                    {/if}
                                    <div class="amount-value">
                                        {formatAmount(change.amount, change.coinType)}
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        {/if}

        <!-- Object Changes Section -->
        {#if objectChanges.length > 0 || createdObjects.length > 0 || mutatedObjects.length > 0 || deletedObjects.length > 0}
            <div class="section">
                <h4>
                    Object Changes ({objectChanges.length +
                        createdObjects.length +
                        mutatedObjects.length +
                        deletedObjects.length}):
                </h4>
                <div class="object-columns-three">
                    <div class="deleted-objects">
                        <h5 class="column-header deleted">Deleted ({deletedObjects.length}):</h5>
                        <div class="object-content">
                            {#each deletedObjects as change}
                                <div class="object-box deleted">
                                    {#if change.objectId}
                                        <a
                                            href={getObjectLink(
                                                getSelectedNetworkConfig(),
                                                change.objectId,
                                            )}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="object-id link-style"
                                        >
                                            {change.objectId}
                                        </a>
                                    {:else if change.address}
                                        <a
                                            href={getAddressLink(
                                                getSelectedNetworkConfig(),
                                                change.address,
                                            )}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="object-id link-style"
                                        >
                                            {change.address}
                                        </a>
                                    {/if}
                                    {#if change.objectType}
                                        <div class="object-type">
                                            {change.objectType}
                                        </div>
                                    {/if}
                                    {#if change.version}
                                        <div class="object-version">
                                            Version: {change.version}
                                        </div>
                                    {/if}
                                    {#if change.sender}
                                        <div class="object-sender">
                                            Sender: {change.sender}
                                        </div>
                                    {/if}
                                    {#if change.inputState?.asMoveObject?.contents?.json}
                                        <details class="state-collapsible" open>
                                            <summary class="state-summary">Previous State:</summary>
                                            <div class="object-json">
                                                <pre>{formatJsonWithCompactArrays(
                                                        removeKindFields(
                                                            Object.fromEntries(
                                                                Object.entries({
                                                                    ...change.inputState
                                                                        .asMoveObject.contents.json,
                                                                }).filter(([key]) => key !== 'id'),
                                                            ),
                                                        ),
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
                                        <a
                                            href={getObjectLink(
                                                getSelectedNetworkConfig(),
                                                change.outputState.asMoveObject.contents.json.id,
                                            )}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="object-id link-style"
                                        >
                                            {change.outputState.asMoveObject.contents.json.id}
                                        </a>
                                        {#if change.inputState?.asMoveObject?.contents?.json}
                                            <details class="state-collapsible">
                                                <summary class="state-summary"
                                                    >Previous State:</summary
                                                >
                                                <div class="object-json">
                                                    <pre>{formatJsonWithCompactArrays(
                                                            removeKindFields(
                                                                Object.fromEntries(
                                                                    Object.entries({
                                                                        ...change.inputState
                                                                            .asMoveObject.contents
                                                                            .json,
                                                                    }).filter(
                                                                        ([key]) => key !== 'id',
                                                                    ),
                                                                ),
                                                            ),
                                                        )}</pre>
                                                </div>
                                            </details>
                                        {/if}
                                        <details class="state-collapsible" open>
                                            <summary class="state-summary">Current State:</summary>
                                            <div class="object-json">
                                                <pre>{formatJsonWithCompactArrays(
                                                        removeKindFields(
                                                            Object.fromEntries(
                                                                Object.entries({
                                                                    ...change.outputState
                                                                        .asMoveObject.contents.json,
                                                                }).filter(([key]) => key !== 'id'),
                                                            ),
                                                        ),
                                                    )}</pre>
                                            </div>
                                        </details>
                                    {:else if change.objectId}
                                        <a
                                            href={getObjectLink(
                                                getSelectedNetworkConfig(),
                                                change.objectId,
                                            )}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="object-id link-style"
                                        >
                                            {change.objectId}
                                        </a>
                                        {#if change.objectType}
                                            <div class="object-type">
                                                {change.objectType}
                                            </div>
                                        {/if}
                                        {#if change.owner}
                                            <div class="object-owner">
                                                Owner: {change.owner.AddressOwner || change.owner}
                                            </div>
                                        {/if}
                                        {#if change.version}
                                            <div class="object-version">
                                                Version: {change.version}
                                            </div>
                                        {/if}
                                        {#if change.previousVersion}
                                            <div class="object-previous-version">
                                                Previous Version: {change.previousVersion}
                                            </div>
                                        {/if}
                                    {:else}
                                        <a
                                            href={getAddressLink(
                                                getSelectedNetworkConfig(),
                                                change.address,
                                            )}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="object-id link-style"
                                        >
                                            {change.address}
                                        </a>
                                        {#if change.inputState?.asMoveObject?.contents?.json}
                                            <details class="state-collapsible">
                                                <summary class="state-summary"
                                                    >Previous State:</summary
                                                >
                                                <div class="object-json">
                                                    <pre>{formatJsonWithCompactArrays(
                                                            removeKindFields(
                                                                Object.fromEntries(
                                                                    Object.entries({
                                                                        ...change.inputState
                                                                            .asMoveObject.contents
                                                                            .json,
                                                                    }).filter(
                                                                        ([key]) => key !== 'id',
                                                                    ),
                                                                ),
                                                            ),
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
                                        <a
                                            href={getObjectLink(
                                                getSelectedNetworkConfig(),
                                                change.outputState.asMoveObject.contents.json.id,
                                            )}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="object-id link-style"
                                        >
                                            {change.outputState.asMoveObject.contents.json.id}
                                        </a>
                                        <details class="state-collapsible" open>
                                            <summary class="state-summary">Object State:</summary>
                                            <div class="object-json">
                                                <pre>{formatJsonWithCompactArrays(
                                                        removeKindFields(
                                                            Object.fromEntries(
                                                                Object.entries({
                                                                    ...change.outputState
                                                                        .asMoveObject.contents.json,
                                                                }).filter(([key]) => key !== 'id'),
                                                            ),
                                                        ),
                                                    )}</pre>
                                            </div>
                                        </details>
                                    {:else if change.objectId}
                                        <a
                                            href={getObjectLink(
                                                getSelectedNetworkConfig(),
                                                change.objectId,
                                            )}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="object-id link-style"
                                        >
                                            {change.objectId}
                                        </a>
                                        {#if change.objectType}
                                            <div class="object-type">
                                                {change.objectType}
                                            </div>
                                        {/if}
                                        {#if change.owner}
                                            <div class="object-owner">
                                                Owner: {change.owner.AddressOwner || change.owner}
                                            </div>
                                        {/if}
                                        {#if change.version}
                                            <div class="object-version">
                                                Version: {change.version}
                                            </div>
                                        {/if}
                                    {:else}
                                        <a
                                            href={getAddressLink(
                                                getSelectedNetworkConfig(),
                                                change.address,
                                            )}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="object-id link-style"
                                        >
                                            {change.address}
                                        </a>
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
                                    <pre class="event-data">{formatJsonWithCompactArrays(
                                            event.parsedJson,
                                        )}</pre>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </details>
            </div>
        {/if}

        <!-- Tx Commands Section -->
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
                                {#if command.$kind === 'MoveCall' && command.MoveCall}
                                    {@const moveCall = command.MoveCall}
                                    {@const signature = `${moveCall.package}::${moveCall.module}::${moveCall.function}`}
                                    {@const cleanData = {
                                        function: signature,
                                        typeArguments: moveCall.typeArguments,
                                        arguments: moveCall.arguments,
                                    }}
                                    <pre>{formatJsonWithCompactArrays(
                                            removeKindFields(cleanData),
                                        )}</pre>
                                {:else}
                                    <pre>{formatJsonWithCompactArrays(
                                            removeKindFields(command)[command.$kind],
                                        )}</pre>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {:else if transactionData?.input?.transaction?.transactions?.length}
            <div class="section">
                <span>Tx commands ({transactionData.input.transaction.transactions.length}):</span>
                <div class="commands-list">
                    {#each transactionData.input.transaction.transactions as command, index}
                        <div class="command-item">
                            <span class="command-index">{index}</span>
                            <span class="command-kind">{Object.keys(command)[0]}</span>
                            <div class="command-data">
                                {#if Object.keys(command)[0] === 'MoveCall'}
                                    {@const commandValue = Object.values(command)[0]}
                                    {#if commandValue && typeof commandValue === 'object' && commandValue !== null && 'package' in commandValue}
                                        {@const moveCall = commandValue as {
                                            package: string;
                                            module: string;
                                            function: string;
                                            typeArguments: any[];
                                            arguments: any[];
                                        }}
                                        {@const signature = `${moveCall.package}::${moveCall.module}::${moveCall.function}`}
                                        {@const cleanData = {
                                            function: signature,
                                            typeArguments: moveCall.typeArguments,
                                            arguments: moveCall.arguments,
                                        }}
                                        <pre>{formatJsonWithCompactArrays(
                                                removeKindFields(cleanData),
                                            )}</pre>
                                    {:else}
                                        <pre>{formatJsonWithCompactArrays(commandValue)}</pre>
                                    {/if}
                                {:else}
                                    <pre>{formatJsonWithCompactArrays(
                                            Object.values(command)[0],
                                        )}</pre>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Inputs Section -->
        {#if transactionData?.decodedBCS?.intentMessage?.value?.V1?.kind?.ProgrammableTransaction?.inputs?.length}
            <div class="section">
                <span>Inputs:</span>
                <div class="inputs-list">
                    {#each transactionData.decodedBCS.intentMessage.value.V1.kind.ProgrammableTransaction.inputs as input, index}
                        <div class="input-item">
                            <span class="input-index">{index}</span>
                            <span class="input-kind">{input.$kind}</span>
                            <div class="input-data">
                                <pre>{formatJsonWithCompactArrays(
                                        removeKindFields(input)[input.$kind],
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
                                                <span class="decode-label"
                                                    >{decoded.integer.type}:</span
                                                >
                                                <span class="decode-value"
                                                    >{decoded.integer.value}</span
                                                >
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
        {:else if transactionData?.input?.transaction?.inputs?.length}
            <div class="section">
                <span>Inputs:</span>
                <div class="inputs-list">
                    {#each transactionData.input.transaction.inputs as input, index}
                        {@const { type: _type, ...inputData } = input}
                        <div class="input-item">
                            <span class="input-index">{index}</span>
                            <span class="input-kind">{input.type}</span>
                            <div class="input-data">
                                <pre>{formatJsonWithCompactArrays(inputData)}</pre>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Gas Data Section -->
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
                                    {#if index < transactionData.decodedBCS.intentMessage.value.V1.gasData.payment.length - 1}
                                        <span class="separator">, </span>
                                    {/if}
                                {/each}
                            {:else}
                                N/A
                            {/if}
                        </span>
                    </div>
                    <div class="gas-field">
                        <span class="field-label">Owner:</span>
                        <span class="field-value"
                            >{transactionData.decodedBCS.intentMessage.value.V1.gasData.owner ||
                                'N/A'}</span
                        >
                    </div>
                    <div class="gas-field">
                        <span class="field-label">Price:</span>
                        <span class="field-value"
                            >{formatNumberWithUnderscores(
                                transactionData.decodedBCS.intentMessage.value.V1.gasData.price ||
                                    '0',
                            )} nanos</span
                        >
                    </div>
                    <div class="gas-field">
                        <span class="field-label">Budget:</span>
                        <span class="field-value"
                            >{formatNumberWithUnderscores(
                                transactionData.decodedBCS.intentMessage.value.V1.gasData.budget ||
                                    '0',
                            )} nanos</span
                        >
                    </div>
                </div>
            </div>
        {:else if transactionData?.input?.gasData}
            <div class="section">
                <span>Gas Data:</span>
                <div class="gas-info">
                    <div class="gas-field">
                        <span class="field-label">Payment:</span>
                        <span class="field-value">
                            {#if transactionData.input.gasData.payment?.length}
                                {#each transactionData.input.gasData.payment as payment, index}
                                    <span class="payment-object"
                                        >{payment.objectId} (v{payment.version})</span
                                    >
                                    {#if index < transactionData.input.gasData.payment.length - 1}
                                        <span class="separator">, </span>
                                    {/if}
                                {/each}
                            {:else}
                                N/A
                            {/if}
                        </span>
                    </div>
                    <div class="gas-field">
                        <span class="field-label">Owner:</span>
                        <span class="field-value"
                            >{transactionData.input.gasData.owner || 'N/A'}</span
                        >
                    </div>
                    <div class="gas-field">
                        <span class="field-label">Price:</span>
                        <span class="field-value"
                            >{formatNumberWithUnderscores(
                                transactionData.input.gasData.price || '0',
                            )} nanos</span
                        >
                    </div>
                    <div class="gas-field">
                        <span class="field-label">Budget:</span>
                        <span class="field-value"
                            >{formatNumberWithUnderscores(
                                transactionData.input.gasData.budget || '0',
                            )} nanos</span
                        >
                    </div>
                </div>
            </div>
        {/if}

        <!-- Dev Inspect Results Section -->
        {#if transactionData?.devInspectResults?.length}
            <div class="section">
                <span>Dev Inspect Results ({transactionData.devInspectResults.length}):</span>
                <div class="dev-inspect-results">
                    {#each transactionData.devInspectResults as result, index}
                        <div class="dev-inspect-item">
                            <div class="result-header">
                                <span class="result-index">Result #{index}</span>
                            </div>

                            {#if result.mutableReferenceOutputs?.length}
                                <div class="mutable-references">
                                    <h6>
                                        Mutable Reference Outputs ({result.mutableReferenceOutputs
                                            .length}):
                                    </h6>
                                    {#each result.mutableReferenceOutputs as output, outputIndex}
                                        <div class="reference-output">
                                            <div class="output-header">
                                                <span class="output-index"
                                                    >Output #{outputIndex}</span
                                                >
                                                <span class="output-type">{output[0]}</span>
                                            </div>
                                            {#if output[1]?.length}
                                                <div class="output-bytes">
                                                    <span class="bytes-label">Bytes:</span>
                                                    <div class="bytes-array">
                                                        [{output[1].join(', ')}]
                                                    </div>
                                                </div>
                                            {/if}
                                            {#if output[2]}
                                                <div class="output-object-type">
                                                    <span class="type-label">Type:</span>
                                                    <span class="type-value">{output[2]}</span>
                                                </div>
                                            {/if}
                                        </div>
                                    {/each}
                                </div>
                            {/if}

                            {#if result.returnValues?.length}
                                <div class="return-values">
                                    <h6>Return Values ({result.returnValues.length}):</h6>
                                    {#each result.returnValues as returnValue, returnIndex}
                                        <div class="return-value">
                                            <div class="return-header">
                                                <span class="return-index"
                                                    >Value #{returnIndex}</span
                                                >
                                            </div>
                                            {#if returnValue[0]?.length}
                                                <div class="return-bytes">
                                                    <span class="bytes-label">Bytes:</span>
                                                    <div class="bytes-array">
                                                        [{returnValue[0].join(', ')}]
                                                    </div>
                                                </div>
                                            {/if}
                                            {#if returnValue[1]}
                                                <div class="return-object-type">
                                                    <span class="type-label">Type:</span>
                                                    <span class="type-value">{returnValue[1]}</span>
                                                </div>
                                            {/if}
                                        </div>
                                    {/each}
                                </div>
                            {/if}

                            {#if Object.keys(result).length > 2 || (Object.keys(result).length === 1 && !result.mutableReferenceOutputs && !result.returnValues)}
                                <div class="result-raw">
                                    <details class="raw-collapsible">
                                        <summary>Raw Result Data</summary>
                                        <pre>{formatJsonWithCompactArrays(result)}</pre>
                                    </details>
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Raw Results Section (for dev inspect) -->
        {#if transactionData?.results?.length}
            <div class="section">
                <span>Raw Results ({transactionData.results.length}):</span>
                <div class="raw-results">
                    {#each transactionData.results as rawResult, index}
                        <div class="raw-result-item">
                            <div class="raw-result-header">
                                <span class="raw-result-index">Raw Result #{index}</span>
                            </div>
                            <div class="raw-result-content">
                                <pre>{formatJsonWithCompactArrays(rawResult)}</pre>
                            </div>
                        </div>
                    {/each}
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
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem;
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
        text-decoration: none;
        transition: all 0.2s ease;
    }

    .tx-id-short:hover {
        background: rgba(59, 130, 246, 0.3);
        color: #93c5fd;
        text-decoration: underline;
    }

    .status {
        padding: 4px 8px;
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.3);
        font-size: 0.85rem;
        text-transform: uppercase;
        font-weight: 600;
    }

    .status-error {
        padding: 4px 8px;
        border-radius: 4px;
        background: rgba(220, 53, 69, 0.15);
        border: 1px solid rgba(220, 53, 69, 0.4);
        color: #fca5a5;
        font-size: 0.85rem;
        font-family: 'JetBrains Mono', monospace;
        word-break: break-word;
    }

    .checkpoint-info,
    .epoch-info,
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

    @media (max-width: 600px) {
        .sender-fee-line {
            grid-template-columns: 1fr;
            gap: 0.75rem;
        }
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

    .link-style {
        text-decoration: none;
        transition: all 0.2s ease;
    }

    .link-style:hover {
        color: #93c5fd;
        text-decoration: underline;
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

    @media (max-width: 600px) {
        .balance-columns,
        .object-columns-three {
            grid-template-columns: 1fr;
        }
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

    .object-type,
    .object-version,
    .object-sender,
    .object-owner,
    .object-previous-version {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 0.25rem;
    }

    .object-type,
    .object-sender,
    .object-owner {
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

    @media (max-width: 600px) {
        .input-item {
            flex-direction: column;
        }

        .input-kind {
            min-width: unset;
        }

        .input-data {
            flex-direction: column;
            width: 100%;
        }
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

    /* Dev Inspect Results Styles */
    .dev-inspect-results {
        background: var(--background-light);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 0.5rem;
        max-height: 700px;
        overflow-y: auto;
    }

    .dev-inspect-item {
        margin-bottom: 1rem;
        padding: 0.5rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 6px;
        border-left: 3px solid #3b82f6;
    }

    .result-header {
        margin-bottom: 0.5rem;
    }

    .result-index {
        font-weight: 600;
        color: #3b82f6;
        font-size: 0.9rem;
    }

    .mutable-references,
    .return-values {
        margin-bottom: 0.5rem;
    }

    .mutable-references h6,
    .return-values h6 {
        margin: 0 0 0.25rem 0;
        font-size: 0.8rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
    }

    .reference-output,
    .return-value {
        background: rgba(0, 0, 0, 0.3);
        padding: 0.375rem;
        margin-bottom: 0.25rem;
        border-radius: 4px;
        border-left: 2px solid #10b981;
    }

    .output-header,
    .return-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.25rem;
    }

    .output-index,
    .return-index {
        font-size: 0.75rem;
        font-weight: 600;
        color: #10b981;
    }

    .output-type {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.7);
        font-family: 'JetBrains Mono', monospace;
    }

    .output-bytes,
    .return-bytes,
    .output-object-type,
    .return-object-type {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        margin-bottom: 0.25rem;
    }

    .bytes-label,
    .type-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.6);
        min-width: 3rem;
    }

    .bytes-array {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.8);
        background: rgba(0, 0, 0, 0.4);
        padding: 2px 6px;
        border-radius: 3px;
        word-break: break-all;
        max-width: 100%;
        overflow-wrap: anywhere;
    }

    .type-value {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.9);
        background: rgba(0, 0, 0, 0.4);
        padding: 2px 6px;
        border-radius: 3px;
    }

    .result-raw {
        margin-top: 0.5rem;
    }

    .raw-collapsible {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
        padding: 0.25rem;
    }

    .raw-collapsible summary {
        font-size: 0.75rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        list-style: none;
        padding: 0.25rem;
    }

    .raw-collapsible summary::-webkit-details-marker {
        display: none;
    }

    .raw-collapsible summary::before {
        content: '▶ ';
        margin-right: 0.5rem;
    }

    .raw-collapsible[open] summary::before {
        content: '▼ ';
    }

    .raw-collapsible pre {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.8);
        background: rgba(0, 0, 0, 0.4);
        padding: 0.375rem;
        border-radius: 4px;
        margin: 0.25rem 0 0 0;
        overflow-x: auto;
        word-break: break-all;
        white-space: pre-wrap;
    }

    /* Raw Results Styles */
    .raw-results {
        background: var(--background-light);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 0.5rem;
        max-height: 700px;
        overflow-y: auto;
    }

    .raw-result-item {
        margin-bottom: 1rem;
        padding: 0.5rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 6px;
        border-left: 3px solid #8b5cf6;
    }

    .raw-result-header {
        margin-bottom: 0.5rem;
    }

    .raw-result-index {
        font-weight: 600;
        color: #8b5cf6;
        font-size: 0.9rem;
    }

    .raw-result-content pre {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.8);
        background: rgba(0, 0, 0, 0.4);
        padding: 0.375rem;
        border-radius: 4px;
        margin: 0;
        overflow-x: auto;
        word-break: break-all;
        white-space: pre-wrap;
    }
</style>
