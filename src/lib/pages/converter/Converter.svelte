<script lang="ts">
    import { bcs, bcs as IotaBcs } from '@iota/iota-sdk/bcs';
    import { Transaction, TransactionDataBuilder } from '@iota/iota-sdk/transactions';
    import { base58 as base58codec } from '@scure/base';
    import { onMount } from 'svelte';

    import TransactionView from '../../components/TransactionView.svelte';
    import { iotaToNano, nanoToIota } from '../../utils/iota-nano-conversion';
    import { updatePageQueryParams, usePageQueryParams } from '../../utils/page-query-params';
    import { base64Decode as fromBase64, toB64 as toBase64, toHex } from '../../utils/wasm-sdk';
    import {
        bcsBytesToInteger,
        bech32ToTernary,
        bytesToUtf8,
        ed25519HexToTernary,
        hexToBytes,
        ternaryToBech32,
        ternaryToEd25519Hex,
    } from './converter';

    const fromBase58 = (s: string): Uint8Array => base58codec.decode(s);
    const toBase58 = (b: Uint8Array): string => base58codec.encode(b);

    // Query parameter integration
    const queryParamDefaults = {
        bytes: '',
        hex: '',
        base58: '',
        base64: '',
        utf8: '',
        bcsNumber: '',
        nano: '',
        iota: '',
        txBytes: '',
        addressHex: '',
        addressBech32: '',
        addressTernary: '',
    };

    const pageParams = usePageQueryParams(queryParamDefaults);

    let bytes: any;
    let hex = '';
    let base58 = '';
    let base64 = '';
    let utf8 = '';
    let bcsNumber = '';
    let bcsNumberType = '';
    let error = '';

    let value: any;

    let nano = '';
    let nanoWithUnderscore = '';
    let iota = '';
    let iotaWithUnderscore = '';

    let addressHex = '';
    let addressBech32 = '';
    let addressTernary = '';
    let addressError = '';

    let txBytesTextarea: HTMLTextAreaElement;
    const exampleSignedTx =
        'AQAAAAAABQAgAADITWzmvxDdFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQOrTZ5H0khvmeaMM7Q+RqIE3kXhhUmg8Ye1x03DM1/oxo+fFQAAAAABAQC1UdUC/HAd21HmDkcdewfnQ/8ZyCdSznxVvhX2A+UdkhQ/8xUAAAAAIGvBzsOprOdLXmvbV4WNEAdCeVyxUQC4casadEmSiOz8AQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgEAAAAAAAAAAAEBVB+vemIenOWjJKPeaiUWCEN25jsEPmTpIlut31oacd9AaKkVAAAAAAEEAKBMDts1kJoNC+au685RIk/bcqEzZUlnLfnwjJpgx1omB2ZpeGVkMTgNZnJvbV9yYXdfdTI1NgABAQAAAHS7cwUfi9jmrdrHu2LvhWKLCdye6W294+RBZ4pEgCvbC21vY2tfc291cmNlCXNldF92YWx1ZQADAQEAAQIAAgAAAHS7cwUfi9jmrdrHu2LvhWKLCdye6W294+RBZ4pEgCvbC21vY2tfc291cmNlBXByaWNlAAIBAQABAwAADSboscHb0PENnJ/ZKPsb8EgfRLahSRbrPfEuFCT0XaoGbWFya2V0DHVwZGF0ZV9wcmljZQEHVk0OWNWfzsxej+coc1GWFdn7sceB009VRe4/PcHNRf0Gc3RhYmxlBlNUQUJMRQACAQQAAgIAKncQef3db67TtP+AYhEsoc86M8mLAnwGhbj7/3IK0mEBRfaRcZkkQl7YnEMWcsyOrUsBJtE2Di3bqK/2JiFVZP0UP/MVAAAAACDNN3mgas1+l1nWysvP0pprzh7yATGvFfv+hKdhxMIwiyp3EHn93W+u07T/gGIRLKHPOjPJiwJ8BoW4+/9yCtJh6AMAAAAAAACcxWVRAAAAAAABYQBuCFSJ1RJeUMmPez2iX78Kz4uLyOBFD+mUii8dqFUHgMeg+ioHP3cI/3LnNc+id/JHyjRpl1Lgc9tXdRpnPoADDR2pqxdjx19PH7B5MVEMS2PLUy97CDQNgDC1vbQqPXQ=';
    const exampleTx =
        'AAAEAAgAypo7AAAAAAAIAJQ1dwAAAAAAIAAApJhL1JXUNG+iCN3/T11eWtSMId7GMd3ryZgJ8WkAACAREXOhTD1ALAFUbFQmXDDMBEFMe37BcyQSuxkGbdSdEQMCAAIBAAABAQABAQMAAAAAAQIAAQEDAAABAAEDAAAApJhL1JXUNG+iCN3/T11eWtSMId7GMd3ryZgJ8WkAAgG17QdHZ+O2o4na/TneylcrvwY7XNDR98PK2ffE16W3cG9SHwAAAAAgOtvL1ilwL7CT/xBDvtdFWeLe23EYPsQOeWmBNM3rMLOOPbshjMcd4lpSlNYarN19Cibrg+b3QfX4zU263nR5UlzYIBoAAAAAIPWQ2HPkYb/8uoCU0bJ+nJUDnnxOrvSuydHPsgLOozz3AACkmEvUldQ0b6II3f9PXV5a1Iwh3sYx3evJmAnxaQDoAwAAAAAAAJBlSwAAAAAAAA==';
    // Initialize values from query parameters
    onMount(() => {
        const params = $pageParams;
        if (params.bytes) {
            bytes = params.bytes;
            convert(SourceType.Bytes);
        } else if (params.hex) {
            hex = params.hex;
            convert(SourceType.Hex);
        } else if (params.base58) {
            base58 = params.base58;
            convert(SourceType.Base58);
        } else if (params.base64) {
            base64 = params.base64;
            convert(SourceType.Base64);
        } else if (params.utf8) {
            utf8 = params.utf8;
            convert(SourceType.UTF8);
        } else if (params.bcsNumber) {
            bcsNumber = params.bcsNumber;
            convert(SourceType.BcsNumber);
        }

        if (params.nano) {
            nano = params.nano;
            convertToNano();
        } else if (params.iota) {
            iota = params.iota;
            convertToIota();
        }

        if (params.txBytes && txBytesTextarea) {
            txBytesTextarea.value = params.txBytes;
            const event = new Event('input', { bubbles: true });
            txBytesTextarea.dispatchEvent(event);
        }

        if (params.addressHex) {
            addressHex = params.addressHex;
            convertAddress(AddressSourceType.Hex);
        } else if (params.addressBech32) {
            addressBech32 = params.addressBech32;
            convertAddress(AddressSourceType.Bech32);
        } else if (params.addressTernary) {
            addressTernary = params.addressTernary;
            convertAddress(AddressSourceType.Ternary);
        }
    });

    function insertExampleSignedTx() {
        if (txBytesTextarea) {
            txBytesTextarea.value = exampleSignedTx;
            // Trigger the input event to process the transaction
            const event = new Event('input', { bubbles: true });
            txBytesTextarea.dispatchEvent(event);
            // Update query params
            updatePageQueryParams({ txBytes: exampleSignedTx });
        }
    }

    function insertExampleTx() {
        if (txBytesTextarea) {
            txBytesTextarea.value = exampleTx;
            // Trigger the input event to process the transaction
            const event = new Event('input', { bubbles: true });
            txBytesTextarea.dispatchEvent(event);
            // Update query params
            updatePageQueryParams({ txBytes: exampleTx });
        }
    }

    const SourceType = {
        Bytes: 0,
        Hex: 1,
        Base58: 2,
        Base64: 3,
        UTF8: 4,
        BcsNumber: 5,
    } as const;
    type SourceType = (typeof SourceType)[keyof typeof SourceType];

    const AddressSourceType = {
        Hex: 0,
        Bech32: 1,
        Ternary: 2,
    } as const;
    type AddressSourceType = (typeof AddressSourceType)[keyof typeof AddressSourceType];

    function convertAddress(source: AddressSourceType) {
        addressError = '';
        try {
            switch (+source) {
                case AddressSourceType.Hex:
                    if (addressHex) {
                        // Normalize hex input - accept with or without 0x prefix
                        let normalizedHex = addressHex.trim();
                        if (!normalizedHex.startsWith('0x') && !normalizedHex.startsWith('0X')) {
                            normalizedHex = '0x' + normalizedHex;
                        }
                        addressTernary = ed25519HexToTernary(normalizedHex);
                        addressBech32 = ternaryToBech32(addressTernary);
                        updatePageQueryParams({
                            addressHex: addressHex,
                            addressBech32: null,
                            addressTernary: null,
                        });
                    } else {
                        addressTernary = '';
                        addressBech32 = '';
                        updatePageQueryParams({
                            addressHex: null,
                            addressBech32: null,
                            addressTernary: null,
                        });
                    }
                    break;
                case AddressSourceType.Bech32:
                    if (addressBech32) {
                        addressTernary = bech32ToTernary(addressBech32);
                        const hexResult = ternaryToEd25519Hex(addressTernary);
                        // Ensure the generated hex has 0x prefix
                        addressHex = hexResult.startsWith('0x') ? hexResult : '0x' + hexResult;
                        updatePageQueryParams({
                            addressBech32: addressBech32,
                            addressHex: null,
                            addressTernary: null,
                        });
                    } else {
                        addressTernary = '';
                        addressHex = '';
                        updatePageQueryParams({
                            addressHex: null,
                            addressBech32: null,
                            addressTernary: null,
                        });
                    }
                    break;
                case AddressSourceType.Ternary:
                    if (addressTernary) {
                        const hexResult = ternaryToEd25519Hex(addressTernary);
                        // Ensure the generated hex has 0x prefix
                        addressHex = hexResult.startsWith('0x') ? hexResult : '0x' + hexResult;
                        addressBech32 = ternaryToBech32(addressTernary);
                        updatePageQueryParams({
                            addressTernary: addressTernary,
                            addressHex: null,
                            addressBech32: null,
                        });
                    } else {
                        addressHex = '';
                        addressBech32 = '';
                        updatePageQueryParams({
                            addressHex: null,
                            addressBech32: null,
                            addressTernary: null,
                        });
                    }
                    break;
            }
        } catch (err: any) {
            addressError = err.message || err.toString();
        }
    }

    function convert(source: SourceType) {
        error = '';
        try {
            let sourceBytes: any;
            switch (+source) {
                case SourceType.Bytes:
                    let bytes_strings = bytes.trim().split(',');
                    let parsedBytes = [];
                    for (let byte_string of bytes_strings) {
                        if (Number.isInteger(parseInt(byte_string))) {
                            parsedBytes.push(parseInt(byte_string, 10));
                        }
                    }
                    sourceBytes = parsedBytes;
                    break;
                case SourceType.Hex:
                    if (hex.length % 2 != 0) {
                        return;
                    }
                    sourceBytes = hexToBytesLocal(hex);
                    break;
                case SourceType.Base58:
                    sourceBytes = fromBase58(base58);
                    break;
                case SourceType.Base64:
                    sourceBytes = fromBase64(base64);
                    break;
                case SourceType.UTF8:
                    sourceBytes = new TextEncoder().encode(utf8);
                    break;
                case SourceType.BcsNumber:
                    if (bcsNumber === '') {
                        sourceBytes = [];
                        bcsNumberType = '';
                        break;
                    }
                    sourceBytes = bcs.u64().serialize(bcsNumber).toBytes();
                    break;
            }
            // Ensure sourceBytes is always Uint8Array (some paths return number[])
            if (!(sourceBytes instanceof Uint8Array)) {
                sourceBytes = new Uint8Array(sourceBytes);
            }
            if (source != SourceType.Bytes) {
                bytes = sourceBytes;
            }
            hex = toHex(sourceBytes);
            base58 = toBase58(sourceBytes);
            base64 = toBase64(sourceBytes);
            utf8 = bytesToUtf8(sourceBytes);
            const integerResult = bcsBytesToInteger(sourceBytes);
            bcsNumber = integerResult.value;
            if (bytes.length === 0) {
                bcsNumber = '';
                bcsNumberType = '';
            } else {
                bcsNumberType = integerResult.type;
            }
        } catch (err: any) {
            try {
                error = JSON.stringify(JSON.parse(err.message).payload.error);
            } catch (e: any) {
                error = err;
            }
        }

        // Update query parameters based on which field was the source
        const queryUpdates: Record<string, string | null> = {
            bytes: null,
            hex: null,
            base58: null,
            base64: null,
            utf8: null,
            bcsNumber: null,
        };

        switch (+source) {
            case SourceType.Bytes:
                if (bytes) queryUpdates.bytes = bytes;
                break;
            case SourceType.Hex:
                if (hex) queryUpdates.hex = hex;
                break;
            case SourceType.Base58:
                if (base58) queryUpdates.base58 = base58;
                break;
            case SourceType.Base64:
                if (base64) queryUpdates.base64 = base64;
                break;
            case SourceType.UTF8:
                if (utf8) queryUpdates.utf8 = utf8;
                break;
            case SourceType.BcsNumber:
                if (bcsNumber) queryUpdates.bcsNumber = bcsNumber;
                break;
        }

        updatePageQueryParams(queryUpdates);
    }

    function hexToBytesLocal(hex: string) {
        var re = /^(0[xX])?[A-Fa-f0-9]+$/;

        if (!re.test(hex)) {
            console.error('invalid hex');
            throw 'invalid hex';
        }

        if (hex.toLowerCase().startsWith('0x')) {
            hex = hex.slice(2, hex.length);
        }
        return hexToBytes(hex);
    }

    function convertToIota() {
        error = '';
        try {
            if (nano) {
                iota = nanoToIota(nano);
                iotaWithUnderscore = iota.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1_');
                nanoWithUnderscore = nano.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1_');
                // Update query parameter
                updatePageQueryParams({ nano: nano, iota: null });
            } else {
                iota = '';
                updatePageQueryParams({ nano: null, iota: null });
            }
        } catch (err: any) {
            error = err;
        }
    }

    function convertToNano() {
        error = '';
        try {
            if (iota) {
                nano = iotaToNano(iota);
                iotaWithUnderscore = iota.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1_');
                nanoWithUnderscore = nano.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1_');
                // Update query parameter
                updatePageQueryParams({ iota: iota, nano: null });
            } else {
                nano = '';
                updatePageQueryParams({ iota: null, nano: null });
            }
        } catch (err: any) {
            error = err;
        }
    }
</script>

<main>
    <div class="wrapper">
        <div class="box">Bytes:</div>
        <div class="box">
            <input
                type="string"
                style="width: 100%;"
                bind:value={bytes}
                on:input={() => convert(SourceType.Bytes)}
                placeholder="bytes like: 1, 2, 3"
            />
        </div>

        <div class="box">Hex:</div>
        <div class="box">
            <input
                type="string"
                style="width: 100%;"
                bind:value={hex}
                on:input={() => convert(SourceType.Hex)}
                placeholder="hex string"
            />
        </div>

        <div class="box">Base64:</div>
        <div class="box">
            <input
                type="string"
                style="width: 100%;"
                bind:value={base64}
                on:input={() => convert(SourceType.Base64)}
                placeholder="base64 string"
            />
        </div>

        <div class="box">Base58:</div>
        <div class="box">
            <input
                type="string"
                style="width: 100%;"
                bind:value={base58}
                on:input={() => convert(SourceType.Base58)}
                placeholder="base58 string"
            />
        </div>

        <div class="box">UTF-8:</div>
        <div class="box">
            <input
                type="string"
                style="width: 100%;"
                bind:value={utf8}
                on:input={() => convert(SourceType.UTF8)}
                placeholder="UTF-8 string"
            />
        </div>

        <div class="box">number (from/to BCS bytes): {bcsNumberType}</div>
        <div class="box">
            <input
                type="string"
                style="width: 100%;"
                bind:value={bcsNumber}
                on:input={() => convert(SourceType.BcsNumber)}
                placeholder="number"
            />
        </div>
    </div>
    <br />
    <div class="wrapper">
        <div class="box">NANO:</div>
        <div class="box">
            <input
                type="string"
                style="width: 100%;"
                bind:value={nano}
                on:input={() => convertToIota()}
                placeholder="NANO amount"
            />
            {#if nanoWithUnderscore}<div class="formatted-value">{nanoWithUnderscore}</div>{/if}
        </div>
        <div class="box">IOTA:</div>
        <div class="box">
            <input
                type="string"
                style="width: 100%;"
                bind:value={iota}
                on:input={() => convertToNano()}
                placeholder="IOTA amount"
            />
            {#if iotaWithUnderscore}<div class="formatted-value">{iotaWithUnderscore}</div>{/if}
        </div>
    </div>
    <br />
    <div>
        <div style="float: left; display: flex; align-items: center; gap: 10px;">
            <span>Tx bytes base64:</span>
            <button on:click={insertExampleSignedTx} style="padding: 4px 8px; font-size: 12px;">
                Example signed tx
            </button>
            <button on:click={insertExampleTx} style="padding: 4px 8px; font-size: 12px;">
                Example unsigned tx
            </button>
        </div>
        <div class="box">
            <textarea
                bind:this={txBytesTextarea}
                on:input={async (event) => {
                    // @ts-ignore
                    let inputString = event.target.value;
                    // Check if input is JSON (starts with '{')
                    if (inputString.trim().startsWith('{')) {
                        try {
                            // Try to deserialize using Transaction.from
                            let deserializedTxnBuilder;
                            try {
                                deserializedTxnBuilder = Transaction.from(inputString);
                            } catch {
                                const jsonData = JSON.parse(inputString);
                                deserializedTxnBuilder = Transaction.from(
                                    // TODO: this is another representation and doesn't work this way:
                                    // "value": {
                                    //     "V1": {
                                    //         "kind": {
                                    //         "ProgrammableTransaction": {
                                    jsonData.intentMessage.value,
                                );
                            }
                            // Serialize to transaction bytes
                            const txBytes = await deserializedTxnBuilder.build();
                            // Convert to base64
                            const base64String = toBase64(txBytes);
                            // Update textarea value with base64
                            if (txBytesTextarea) {
                                txBytesTextarea.value = base64String;
                            }
                            // Set value to the deserialized builder for display
                            value = deserializedTxnBuilder;
                            inputString = base64String;
                            // Update query parameter with base64
                            updatePageQueryParams({ txBytes: base64String });
                        } catch (e) {
                            console.log('error parsing/serializing JSON', e);
                            value = e;
                        }
                    }

                    // Base64 decoding logic
                    try {
                        let txBytes = new Uint8Array(fromBase64(inputString));
                        const txBuilder = TransactionDataBuilder.fromBytes(txBytes);
                        // Attach the original base64 bytes so TransactionView can show/use them
                        value = Object.assign(txBuilder, { transactionBytes: inputString });
                    } catch (e) {
                        console.log('error TransactionDataBuilder', e);
                        try {
                            value = IotaBcs.SenderSignedData.parse(
                                new Uint8Array(fromBase64(inputString)),
                            )[0];
                        } catch (e) {
                            console.log('error SenderSignedData', e);
                            value = e;
                        }
                    }
                }}
                placeholder="base64 transaction bytes or JSON"
            ></textarea>
        </div>
    </div>

    <TransactionView {value} />
    <br />
    {error}

    <span style="float:left"> Legacy address conversion: </span>
    <br />
    <div class="wrapper">
        <div class="box">Address Hex:</div>
        <div class="box">
            <input
                type="string"
                style="width: 100%;"
                bind:value={addressHex}
                on:input={() => convertAddress(AddressSourceType.Hex)}
                placeholder="0x6f9e8510b88b0ea4fbc684df90ba310540370a0403067b22cef4971fec3e8bb8"
            />
        </div>

        <div class="box">Address Bech32:</div>
        <div class="box">
            <input
                type="string"
                style="width: 100%;"
                bind:value={addressBech32}
                on:input={() => convertAddress(AddressSourceType.Bech32)}
                placeholder="iota1qpheapgshz9saf8mc6zdly96xyz5qdc2qspsv7ezem6fw8lv869mskn2049"
            />
        </div>

        <div class="box">Legacy address (Ternary):</div>
        <div class="box">
            <input
                type="string"
                style="width: 100%;"
                bind:value={addressTernary}
                on:input={() => convertAddress(AddressSourceType.Ternary)}
                placeholder="TRANSFERCDJWLVPAIXRWNAPXV9WYKVUZWWKXVBE9JBABJ9D9C9F9OEGADYO9CWDAGZHBRWIXLXG9MAJV9RJEOLXSJW"
            />
        </div>
    </div>
    {#if addressError}
        <div style="color: red; margin-top: 10px;">Address conversion error: {addressError}</div>
    {/if}
</main>

<style>
    .wrapper {
        display: grid;
        grid-template-columns: repeat(2, auto);
        text-align: left;
        grid-template-columns: auto 1fr; /* label auto, input takes remaining space */
    }

    textarea {
        width: 100%;
        height: 100px;
    }

    .formatted-value {
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.5);
        word-break: break-all;
    }
</style>
