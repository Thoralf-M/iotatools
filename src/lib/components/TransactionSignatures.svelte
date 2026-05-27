<script lang="ts">
    import { parseSerializedSignature } from '@iota/iota-sdk/cryptography';
    import type { MoveAuthenticatorData } from '@iota/iota-sdk/keypairs/move-authenticator';
    import { MultiSigPublicKey, parsePartialSignatures } from '@iota/iota-sdk/multisig';
    import { publicKeyFromRawBytes } from '@iota/iota-sdk/verify';

    import { copyToClipboard } from '../utils/formatting';
    import MoveAuthenticatorDetails from './MoveAuthenticatorDetails.svelte';

    type ObjectArg = MoveAuthenticatorData['objectToAuthenticate'];

    function extractObjectId(objectArg: ObjectArg): string {
        if ('SharedObject' in objectArg) return objectArg.SharedObject.objectId;
        if ('ImmOrOwnedObject' in objectArg) return objectArg.ImmOrOwnedObject.objectId;
        if ('Receiving' in objectArg) return objectArg.Receiving.objectId;
        throw new Error('Unknown ObjectArg variant');
    }

    type SignatureRole = 'sender' | 'gas_sponsor' | 'unknown';

    // One member of a multisig committee that contributed a partial signature.
    interface MemberSignature {
        signatureScheme: string;
        publicKey: any;
        signature: Uint8Array;
        weight: number;
    }

    // One top-level signature, i.e. one signer of the transaction. There are
    // usually at most two: the sender and the gas sponsor. A signer may itself be
    // a multisig, in which case the individual member signatures are nested and
    // the full serialized signature is shown only once for the whole signer.
    interface SignerSignature {
        signatureScheme: string;
        role: SignatureRole;
        rawSignature: string; // base64 encoded, full serialized signature
        address: string | null;
        // single signature
        publicKey?: any;
        signature?: Uint8Array;
        // multisig
        threshold?: number;
        members?: MemberSignature[];
        // move authenticator
        moveAuthenticator?: MoveAuthenticatorData;
    }

    let { signatures = [], transactionData = null } = $props<{
        signatures: string[];
        transactionData?: any;
    }>();

    // Map a signer's address to its role. Falls back to signature order when the
    // address can't be matched: the sender signs first, the gas sponsor second.
    function determineRole(
        address: string | null,
        senderAddress: string | null,
        gasSponsorAddress: string | null,
        index: number,
        total: number,
    ): SignatureRole {
        if (address && senderAddress && address === senderAddress) {
            return 'sender';
        }
        if (
            address &&
            gasSponsorAddress &&
            address === gasSponsorAddress &&
            gasSponsorAddress !== senderAddress
        ) {
            return 'gas_sponsor';
        }
        if (total === 1) return 'sender';
        if (index === 0) return 'sender';
        if (index === 1) return 'gas_sponsor';
        return 'unknown';
    }

    let parsedSignatures = $derived.by(() => {
        const result: SignerSignature[] = [];

        // Extract sender and gas sponsor addresses from transaction data
        let senderAddress: string | null = null;
        let gasSponsorAddress: string | null = null;
        if (transactionData) {
            senderAddress = transactionData.sender;
            gasSponsorAddress = transactionData.gasData?.owner;
        }

        const total = signatures.length;

        signatures.forEach((sigString: string, index: number) => {
            try {
                const parsed = parseSerializedSignature(sigString);

                if (parsed.signatureScheme === 'MoveAuthenticator') {
                    const v1 = parsed.moveAuthenticator.V1;
                    if (v1.objectToAuthenticate.$kind !== 'Object') {
                        throw new Error('MoveAuthenticator objectToAuthenticate must be an Object');
                    }
                    const objectArg = v1.objectToAuthenticate.Object;
                    const authenticatedObjectId = extractObjectId(objectArg);

                    result.push({
                        signatureScheme: 'MoveAuthenticator',
                        role: determineRole(
                            authenticatedObjectId,
                            senderAddress,
                            gasSponsorAddress,
                            index,
                            total,
                        ),
                        rawSignature: sigString,
                        address: authenticatedObjectId,
                        moveAuthenticator: {
                            version: 'V1',
                            callArgs: v1.callArgs,
                            typeArgs: v1.typeArgs,
                            objectToAuthenticate: objectArg,
                        },
                    });
                    return;
                }

                if (parsed.signatureScheme === 'MultiSig') {
                    const partialSignatures = parsePartialSignatures(parsed.multisig);

                    // Derive the aggregate multisig address and threshold so we can
                    // attribute the whole multisig to a sender/sponsor role.
                    let address: string | null = null;
                    let threshold: number | undefined;
                    try {
                        const multiSigPublicKey = new MultiSigPublicKey(
                            parsed.multisig.multisig_pk,
                        );
                        address = multiSigPublicKey.toIotaAddress();
                        threshold = multiSigPublicKey.getThreshold();
                    } catch (e) {
                        console.error('Failed to derive multisig address:', e);
                    }

                    result.push({
                        signatureScheme: 'MultiSig',
                        role: determineRole(
                            address,
                            senderAddress,
                            gasSponsorAddress,
                            index,
                            total,
                        ),
                        rawSignature: sigString,
                        address,
                        threshold,
                        members: partialSignatures.map((sig) => ({
                            signatureScheme: sig.signatureScheme,
                            publicKey: sig.publicKey,
                            signature: sig.signature,
                            weight: sig.weight,
                        })),
                    });
                    return;
                }

                // Single signature
                const pubKey = publicKeyFromRawBytes(parsed.signatureScheme, parsed.publicKey);
                const address = pubKey.toIotaAddress();
                result.push({
                    signatureScheme: parsed.signatureScheme,
                    role: determineRole(address, senderAddress, gasSponsorAddress, index, total),
                    rawSignature: sigString,
                    address,
                    publicKey: pubKey,
                    signature: parsed.signature,
                });
            } catch (e) {
                console.error(`Failed to parse signature ${index + 1}:`, e);
            }
        });

        return result;
    });

    function roleLabel(role: SignatureRole): string {
        if (role === 'sender') return 'Sender';
        if (role === 'gas_sponsor') return 'Gas Sponsor';
        return 'Unknown role';
    }

    function memberLabel(member: MemberSignature, index: number): string {
        return `Member #${index + 1} (${member.signatureScheme}) · weight ${member.weight}`;
    }

    // Per-signer collapse state, keyed by index into parsedSignatures. Empty /
    // missing means expanded, so signatures start fully expanded.
    let collapsed = $state<Record<number, boolean>>({});

    function toggleCollapsed(index: number) {
        collapsed[index] = !collapsed[index];
    }

    let allCollapsed = $derived(
        parsedSignatures.length > 0 && parsedSignatures.every((_, index) => collapsed[index]),
    );

    function setAllCollapsed(value: boolean) {
        const next: Record<number, boolean> = {};
        parsedSignatures.forEach((_, index) => {
            next[index] = value;
        });
        collapsed = next;
    }
</script>

<!-- Public key + signature-bytes rows shared by single signatures and multisig members -->
{#snippet keyDetails(publicKey: any, signature: Uint8Array)}
    <div class="detail-row">
        <span class="detail-label">Public Key:</span>
        <div class="detail-value-container">
            <span class="detail-value">{publicKey.toBase64()}</span>
            <button
                class="copy-btn"
                onclick={async () => await copyToClipboard(publicKey.toBase64())}
            >
                Copy
            </button>
        </div>
    </div>

    <div class="detail-row">
        <span class="detail-label">Public Key (with flag):</span>
        <div class="detail-value-container">
            <span class="detail-value">{publicKey.toIotaPublicKey()}</span>
            <button
                class="copy-btn"
                onclick={async () => await copyToClipboard(publicKey.toIotaPublicKey())}
            >
                Copy
            </button>
        </div>
    </div>

    <div class="detail-row">
        <span class="detail-label">Address:</span>
        <div class="detail-value-container">
            <span class="detail-value">{publicKey.toIotaAddress()}</span>
            <button
                class="copy-btn"
                onclick={async () => await copyToClipboard(publicKey.toIotaAddress())}
            >
                Copy
            </button>
        </div>
    </div>

    <div class="detail-row">
        <span class="detail-label">Signature Bytes:</span>
        <div class="detail-value-container">
            <span class="detail-value">{Buffer.from(signature).toString('base64')}</span>
            <button
                class="copy-btn"
                onclick={async () =>
                    await copyToClipboard(Buffer.from(signature).toString('base64'))}
            >
                Copy
            </button>
        </div>
    </div>
{/snippet}

{#if parsedSignatures.length === 0}
    <div class="no-signatures">No signatures available</div>
{:else}
    <div class="signatures-container">
        {#if parsedSignatures.length > 1}
            <div class="collapse-all-bar">
                <button
                    class="collapse-all-btn"
                    type="button"
                    onclick={() => setAllCollapsed(!allCollapsed)}
                >
                    {allCollapsed ? 'Expand all' : 'Collapse all'}
                </button>
            </div>
        {/if}
        {#each parsedSignatures as sig, index}
            <div class="signature-item">
                <button
                    class="signature-header"
                    class:collapsed={collapsed[index]}
                    type="button"
                    aria-expanded={!collapsed[index]}
                    onclick={() => toggleCollapsed(index)}
                >
                    <span class="chevron">{collapsed[index] ? '▶' : '▼'}</span>
                    <span class="signature-title"
                        >Signature #{index + 1} ({sig.signatureScheme})</span
                    >
                    <span class="role-badge {sig.role}">{roleLabel(sig.role)}</span>
                    {#if sig.address}
                        <span class="signature-address">{sig.address}</span>
                    {/if}
                </button>

                {#if !collapsed[index]}
                    <div class="signature-details">
                        {#if sig.signatureScheme === 'MoveAuthenticator' && sig.moveAuthenticator}
                            <MoveAuthenticatorDetails data={sig.moveAuthenticator} />
                        {:else if sig.signatureScheme === 'MultiSig' && sig.members}
                            <div class="detail-row">
                                <span class="detail-label">MultiSig Address:</span>
                                <div class="detail-value-container">
                                    <span class="detail-value">{sig.address ?? 'unknown'}</span>
                                    {#if sig.address}
                                        <button
                                            class="copy-btn"
                                            onclick={async () =>
                                                await copyToClipboard(sig.address ?? '')}
                                        >
                                            Copy
                                        </button>
                                    {/if}
                                </div>
                            </div>

                            {#if sig.threshold !== undefined}
                                <div class="detail-row">
                                    <span class="detail-label">Threshold:</span>
                                    <div class="detail-value-container">
                                        <span class="detail-value">{sig.threshold}</span>
                                    </div>
                                </div>
                            {/if}

                            <div class="members-label">
                                Member signatures ({sig.members.length})
                            </div>
                            {#each sig.members as member, memberIndex}
                                <div class="member-item">
                                    <div class="member-header">
                                        {memberLabel(member, memberIndex)}
                                    </div>
                                    {@render keyDetails(member.publicKey, member.signature)}
                                </div>
                            {/each}
                        {:else if sig.publicKey && sig.signature}
                            {@render keyDetails(sig.publicKey, sig.signature)}
                        {/if}

                        <!-- Full serialized signature for this signer, shown once -->
                        <div class="detail-row">
                            <span class="detail-label">Full Signature:</span>
                            <div class="detail-value-container">
                                <span class="detail-value wrap">{sig.rawSignature}</span>
                                <button
                                    class="copy-btn"
                                    onclick={async () => await copyToClipboard(sig.rawSignature)}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
{/if}

<style>
    .no-signatures {
        padding: 20px;
        text-align: center;
        color: var(--text-secondary);
    }

    .signatures-container {
        padding: 10px;
        /* Reset inherited `white-space: pre-wrap` from the transaction view so
           structural text (headers, labels) collapses whitespace normally. */
        white-space: normal;
    }

    .signature-item {
        margin-bottom: 12px;
    }

    .signature-item:last-child {
        margin-bottom: 0;
    }

    /* Separate consecutive signers without wrapping each in its own box. */
    .signature-item + .signature-item {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid var(--border-color);
    }

    .signature-header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px 10px;
        width: 100%;
        margin-bottom: 15px;
        padding: 0 0 10px 0;
        border: none;
        border-bottom: 1px solid var(--border-color);
        background: none;
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
    }

    .signature-address {
        flex-basis: 100%;
        font-family: monospace;
        font-size: 12px;
        font-weight: normal;
        color: var(--text-secondary);
        word-break: break-all;
    }

    .signature-header.collapsed {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
    }

    .chevron {
        font-size: 10px;
        color: var(--text-secondary);
        flex-shrink: 0;
        width: 12px;
    }

    .collapse-all-bar {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
    }

    .collapse-all-btn {
        padding: 4px 10px;
        font-size: 11px;
        background: var(--bg-tertiary);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .collapse-all-btn:hover {
        background: var(--bg-hover);
    }

    .signature-title {
        font-weight: bold;
        font-size: 14px;
    }

    .role-badge {
        font-size: 11px;
        padding: 3px 10px;
        border-radius: 4px;
        font-weight: 500;
    }

    .role-badge.sender {
        background-color: #4ade80;
        color: #14532d;
    }

    .role-badge.gas_sponsor {
        background-color: #60a5fa;
        color: #1e3a8a;
    }

    .role-badge.unknown {
        background-color: var(--bg-tertiary);
        color: var(--text-secondary);
    }

    .signature-details {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .members-label {
        font-weight: 600;
        font-size: 13px;
        margin-top: 4px;
    }

    /* Lightweight grouping per member (left accent rather than a full box). */
    .member-item {
        border-left: 2px solid var(--border-color);
        padding: 2px 0 2px 10px;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .member-header {
        font-weight: 600;
        font-size: 12px;
        color: var(--text-secondary);
    }

    .detail-row {
        display: flex;
        gap: 10px;
        align-items: flex-start;
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
