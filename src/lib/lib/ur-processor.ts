import { Buffer } from 'buffer';
import { Ed25519PublicKey } from '@iota/iota-sdk/keypairs/ed25519';
import * as IotaRegistry from '@keystonehq/bc-ur-registry-iota';
// @ts-ignore - keystone-sdk doesn't have complete type definitions
import * as KeystoneSdk from '@keystonehq/keystone-sdk';
// @ts-ignore - bc-ur doesn't have complete type definitions
import { URDecoder } from '@ngraveio/bc-ur';

import { ADDRESS_PREFIXES, UI_LABELS, UR_TYPES } from './keystone';

const UR = (KeystoneSdk as any).UR;

const IotaSignature = IotaRegistry.IotaSignature;

// Types for the processor
export interface UrProcessorState {
    urDecoder: URDecoder | null;
    scannedParts: Set<string>;
    expectedParts: number;
    receivedParts: number;
    isMultipart: boolean;
}

export interface ProcessorResult {
    success: boolean;
    debugInfo: string;
    connectionError?: string;
    scanResult?: any;
    connectedDevice?: string;
    devicePublicKey?: string;
    deviceChainCode?: string;
    accountAddress?: string;
    fullMultiAccountsData?: string;
    keystoneAccountData?: any;
    selectedAccountIndex?: number;
    needsMoreParts?: boolean;
}

export interface SignatureResult {
    type: string;
    requestId: string;
    signature: string;
    publicKey: string;
    cborHex: string;
}

/**
 * UUID utility functions
 */
export const uuidParse = (str: string): Uint8Array => {
    // Convert UUID string to Uint8Array
    const hex = str.replace(/-/g, '');
    const bytes = new Uint8Array(16);
    for (let i = 0; i < 16; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
};

export const uuidStringify = (bytes: Uint8Array | Buffer): string => {
    const hex = Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    return [
        hex.substr(0, 8),
        hex.substr(8, 4),
        hex.substr(12, 4),
        hex.substr(16, 4),
        hex.substr(20, 12),
    ].join('-');
};

/**
 * Derive IOTA address from public key
 * This converts an Ed25519 public key to an IOTA address using blake2b hash
 */
export function deriveIotaAddress(publicKeyHex: string): string {
    try {
        // Ensure the public key is in the correct format
        let cleanHex = publicKeyHex;
        if (cleanHex.startsWith(ADDRESS_PREFIXES.HEX)) {
            cleanHex = cleanHex.slice(2);
        }

        // Convert hex string to Uint8Array
        const publicKeyBytes = new Uint8Array(
            cleanHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || [],
        );

        // Create Ed25519PublicKey from bytes
        const publicKey = new Ed25519PublicKey(publicKeyBytes);
        return publicKey.toIotaAddress();
    } catch (error) {
        console.error('Failed to derive IOTA address:', error, 'for public key:', publicKeyHex);
        return 'Error deriving address';
    }
}

/**
 * Create a new UR processor state
 */
export function createUrProcessorState(): UrProcessorState {
    return {
        urDecoder: null,
        scannedParts: new Set<string>(),
        expectedParts: 0,
        receivedParts: 0,
        isMultipart: false,
    };
}

/**
 * Reset multipart UR state
 */
export function resetMultipartState(state: UrProcessorState): void {
    state.urDecoder = null;
    state.scannedParts.clear();
    state.receivedParts = 0;
    state.expectedParts = 0;
    state.isMultipart = false;
}

/**
 * Handle scanned QR code result with multipart UR support
 */
export function handleScanResult(data: string, state: UrProcessorState): ProcessorResult {
    try {
        console.log('Scanned data:', data);

        // Check if this is a UR format (case-insensitive)
        const lowerData = data.toLowerCase();
        if (!lowerData.startsWith(UR_TYPES.UR_PREFIX)) {
            throw new Error(`Invalid UR format - must start with "${UR_TYPES.UR_PREFIX}" or "UR:"`);
        }

        // Use the proper UR decoder instead of manual parsing
        if (!state.urDecoder) {
            state.urDecoder = new URDecoder();
            state.scannedParts.clear();
            state.receivedParts = 0;
        }

        // Check if we've already scanned this part
        if (state.scannedParts.has(data)) {
            return {
                success: true,
                debugInfo: 'Already scanned this part',
                needsMoreParts: true,
            };
        }

        // Add this part to the decoder
        state.scannedParts.add(data);
        state.urDecoder.receivePart(data);
        state.receivedParts = state.scannedParts.size;

        // Check if this is a multipart UR by looking at the format
        const parts = lowerData.split('/');
        if (parts.length >= 3 && (parts[1].includes('-') || parts[1].match(/\d+-\d+/))) {
            state.isMultipart = true;
            const seqPart = parts[1];
            if (seqPart.includes('-')) {
                const [current, total] = seqPart.split('-').map(Number);
                state.expectedParts = total;
            }
        } else {
            state.isMultipart = false;
        }
        // Force Svelte reactivity by reassigning state properties
        state.isMultipart = !!state.isMultipart;
        state.expectedParts = Number(state.expectedParts);
        state.receivedParts = Number(state.receivedParts);

        // Check if we have all parts for single-part URs
        if (state.urDecoder.isComplete()) {
            const result = state.urDecoder.resultUR();
            console.log('UR decode complete!', result);

            const type = result.type;
            const cborHex = result.cbor.toString('hex');

            console.log('Final decoded type:', type);
            console.log('Final decoded CBOR hex:', cborHex);

            return processCompleteUR(type, cborHex, state);
        } else {
            console.log(
                `Waiting for more parts... (${state.receivedParts}/${state.expectedParts || '?'})`,
            );
            return {
                success: true,
                debugInfo: state.isMultipart
                    ? `Received part (${state.receivedParts}/${state.expectedParts || '?'} parts)`
                    : 'Single part UR - processing...',
                needsMoreParts: true,
            };
        }
    } catch (error) {
        console.error('Failed to process scanned data:', error);
        return {
            success: false,
            debugInfo: 'Scan processing failed: ' + (error as Error).message,
            connectionError: 'Failed to process scan: ' + (error as Error).message,
        };
    }
}

/**
 * Process complete UR data (either single or multipart)
 */
export function processCompleteUR(
    type: string,
    cborHex: string,
    state: UrProcessorState,
): ProcessorResult {
    try {
        // Reset multipart state since we're done
        resetMultipartState(state);

        console.log('Processing UR type:', type, 'CBOR hex:', cborHex);

        // Initialize Keystone SDK
        const keystoneSDK = new (KeystoneSdk as any).default();

        // Handle different UR types
        if (type === UR_TYPES.IOTA_SIGNATURE) {
            const signature = IotaSignature.fromCBOR(Buffer.from(cborHex, 'hex'));
            const decodedData: any = {
                type: type,
                cborHex: cborHex,
                specific: {
                    requestId: uuidStringify(signature.getRequestId()),
                    signature: Buffer.from(signature.getSignature()).toString('hex'),
                    publicKey: Buffer.from(signature.getPublicKey()).toString('hex'),
                },
            };
            return {
                success: true,
                scanResult: JSON.stringify(decodedData, null, 2),
                debugInfo: 'IOTA signature UR processed successfully',
                needsMoreParts: false,
            };
        } else {
            return processAccountData(type, cborHex, keystoneSDK);
        }
    } catch (error) {
        console.error('Failed to process complete UR:', error);
        return {
            success: false,
            debugInfo: 'Processing failed: ' + (error as Error).message,
            connectionError: 'Failed to process complete UR: ' + (error as Error).message,
        };
    }
}

/**
 * Process account data UR (multi-accounts or HD key)
 */
function processAccountData(type: string, cborHex: string, keystoneSDK: any): ProcessorResult {
    const onSucceed = ({ type, cbor }: { type: string; cbor: string }) => {
        try {
            console.log('Attempting to parse as multi-accounts...');
            const multiAccounts = keystoneSDK.parseMultiAccounts(
                new UR(Buffer.from(cbor, 'hex'), type),
            );
            console.log('MultiAccounts: ', multiAccounts);

            // Store the full data for display
            const fullMultiAccountsData = JSON.stringify(multiAccounts, null, 2);

            // Populate keystoneAccountData from scanned data
            const keystoneAccountData = {
                device: multiAccounts.device || 'Keystone Device',
                masterFingerprint: multiAccounts.masterFingerprint || '',
                keys: multiAccounts.keys || [],
            };

            // Extract information from parsed multi-accounts
            if (multiAccounts && multiAccounts.keys && multiAccounts.keys.length > 0) {
                const firstAccount = multiAccounts.keys[0];
                const connectedDevice = multiAccounts.device || 'Keystone Device';
                const devicePublicKey = (firstAccount as any).key || firstAccount.publicKey || '';
                const deviceChainCode = (firstAccount as any).chainCode || '';
                const accountAddress = deriveIotaAddress(devicePublicKey);
                const debugInfo = `Successfully parsed multi-accounts (${multiAccounts.keys.length} keys)`;

                return {
                    success: true,
                    debugInfo,
                    connectedDevice,
                    devicePublicKey,
                    deviceChainCode,
                    accountAddress,
                    fullMultiAccountsData,
                    keystoneAccountData,
                    selectedAccountIndex: 0,
                };
            } else {
                return {
                    success: true,
                    debugInfo: 'Connected but no account data found',
                    connectedDevice: 'Keystone Device',
                    devicePublicKey: 'Successfully connected',
                    deviceChainCode: '',
                    accountAddress: '',
                    fullMultiAccountsData,
                    keystoneAccountData,
                    selectedAccountIndex: 0,
                };
            }
        } catch (parseError) {
            console.log('Multi-accounts parsing failed, trying as HD Key...');

            try {
                // Fallback: try parsing as HD Key
                const hdKey = keystoneSDK.parseHDKey(new UR(Buffer.from(cbor, 'hex'), type));
                console.log('HD Key: ', hdKey);

                // Store the full HD Key data for display
                const fullMultiAccountsData = JSON.stringify(hdKey, null, 2);

                const connectedDevice = (hdKey as any).name || 'Keystone Device';
                const devicePublicKey = (hdKey as any).bip32Key || '';
                const deviceChainCode = (hdKey as any).chainCode || '';
                const accountAddress = deriveIotaAddress(devicePublicKey);

                return {
                    success: true,
                    debugInfo: 'Successfully parsed as HD Key',
                    connectedDevice,
                    devicePublicKey,
                    deviceChainCode,
                    accountAddress,
                    fullMultiAccountsData,
                };
            } catch (hdKeyError) {
                const parseErrorMsg =
                    parseError instanceof Error ? parseError.message : String(parseError);
                const hdKeyErrorMsg =
                    hdKeyError instanceof Error ? hdKeyError.message : String(hdKeyError);
                throw new Error(
                    `Failed to parse as both multi-accounts and HD Key: ${parseErrorMsg}, ${hdKeyErrorMsg}`,
                );
            }
        }
    };

    // Process the complete UR for account data
    return onSucceed({ type, cbor: cborHex });
}

/**
 * Parse manual UR input
 * Allows manual entry of UR strings for testing
 */
export function parseManualUR(manualUR: string): { scanResult?: string; scanError?: string } {
    try {
        if (!manualUR.trim()) {
            return { scanError: 'Please enter a UR string' };
        }

        const urDecoder = new URDecoder();
        urDecoder.receivePart(manualUR);

        if (urDecoder.isComplete()) {
            const result = urDecoder.resultUR();

            if (result.type === UR_TYPES.IOTA_SIGNATURE) {
                const scanResult = JSON.stringify(
                    {
                        type: UI_LABELS.IOTA_SIGNATURE_TYPE,
                        cbor: result.cbor.toString('hex'),
                        message:
                            'IOTA signature detected - use UR Decode Tool for detailed parsing',
                    },
                    null,
                    2,
                );
                return { scanResult };
            } else {
                const scanResult = JSON.stringify(
                    {
                        type: result.type,
                        cbor: result.cbor.toString('hex'),
                    },
                    null,
                    2,
                );
                return { scanResult };
            }
        } else {
            return { scanError: 'UR is incomplete or invalid' };
        }
    } catch (error) {
        return {
            scanError: error instanceof Error ? error.message : 'Failed to parse UR',
        };
    }
}
