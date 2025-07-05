<script lang="ts">
    import { bcs, fromB58, fromB64, toB58, toB64, toHEX } from '@iota/bcs';
    import { bcs as IotaBcs } from '@iota/iota-sdk/bcs';
    import { TransactionDataBuilder } from '@iota/iota-sdk/transactions';

    import JsonToggleView from '../components/JsonToggleView.svelte';
    import { bcsBytesToU64, bytesToUtf8, hexToBytes } from '../lib/converter';
    import { iotaToNano, nanoToIota } from '../lib/iota-nano-conversion';

    let bytes: any;
    let hex = '';
    let base58 = '';
    let base64 = '';
    let utf8 = '';
    let u64 = '';
    let error = '';

    let value: any;

    let nano = '';
    let nanoWithUnderscore = '';
    let iota = '';
    let iotaWithUnderscore = '';

    enum SourceType {
        Bytes,
        Hex,
        Base58,
        Base64,
        UTF8,
        U64,
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
                    sourceBytes = fromB58(base58);
                    break;
                case SourceType.Base64:
                    sourceBytes = fromB64(base64);
                    break;
                case SourceType.UTF8:
                    sourceBytes = new TextEncoder().encode(utf8);
                    break;
                case SourceType.U64:
                    sourceBytes = bcs.u64().serialize(u64).toBytes();
                    break;
            }
            if (source != SourceType.Bytes) {
                bytes = sourceBytes;
            }
            hex = toHEX(sourceBytes);
            base58 = toB58(sourceBytes);
            base64 = toB64(sourceBytes);
            utf8 = bytesToUtf8(sourceBytes);
            u64 = bcsBytesToU64(sourceBytes);
        } catch (err: any) {
            try {
                error = JSON.stringify(JSON.parse(err.message).payload.error);
            } catch (e: any) {
                error = err;
            }
        }
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
            } else {
                iota = '';
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
            } else {
                nano = '';
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

        <div class="box">u64 (from/to BCS bytes):</div>
        <div class="box">
            <input
                type="string"
                style="width: 100%;"
                bind:value={u64}
                on:input={() => convert(SourceType.U64)}
                placeholder="u64 number"
            />
        </div>
    </div>
    <br />
    <div class="wrapper">
        <div class="box">NANO:</div>
        <div class="box">
            <input
                type="string"
                size="40"
                bind:value={nano}
                on:input={() => convertToIota()}
                placeholder="NANO amount"
            />
            {nanoWithUnderscore}
        </div>
        <div class="box">IOTA:</div>
        <div class="box">
            <input
                type="string"
                size="40"
                bind:value={iota}
                on:input={() => convertToNano()}
                placeholder="IOTA amount"
            />
            {iotaWithUnderscore}
        </div>
    </div>
    <br />
    <div>
        <div style="float: left">Tx bytes base64:</div>
        <div class="box">
            <textarea
                on:input={(event) => {
                    // @ts-ignore
                    let inputString = event.target.value;
                    try {
                        value = TransactionDataBuilder.fromBytes(fromB64(inputString));
                    } catch (e) {
                        console.log('error TransactionDataBuilder', e);
                        try {
                            value = IotaBcs.SenderSignedData.parse(fromB64(inputString));
                        } catch (e) {
                            console.log('error SenderSignedData', e);
                            value = e;
                        }
                    }
                }}
                placeholder="base64 transaction bytes"
            ></textarea>
        </div>
    </div>

    <JsonToggleView {value} />
    <br />
    {error}
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
</style>
