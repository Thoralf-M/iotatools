<script lang="ts">
    import { bcs, fromB58, fromB64, toB58, toB64, toHEX } from '@iota/bcs';
    import { bcs as IotaBcs } from '@iota/iota-sdk/bcs';
    import { messageWithIntent } from '@iota/iota-sdk/cryptography';
    import { TransactionDataBuilder } from '@iota/iota-sdk/transactions';
    import { blake2b } from '@noble/hashes/blake2';

    import TransactionView from '../components/TransactionView.svelte';
    import { bcsBytesToInteger, bytesToUtf8, hexToBytes } from '../lib/converter';
    import { iotaToNano, nanoToIota } from '../lib/iota-nano-conversion';

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

    let txBytesTextarea: HTMLTextAreaElement;
    const exampleTx =
        'AQAAAAAABQAgAADITWzmvxDdFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQOrTZ5H0khvmeaMM7Q+RqIE3kXhhUmg8Ye1x03DM1/oxo+fFQAAAAABAQC1UdUC/HAd21HmDkcdewfnQ/8ZyCdSznxVvhX2A+UdkhQ/8xUAAAAAIGvBzsOprOdLXmvbV4WNEAdCeVyxUQC4casadEmSiOz8AQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgEAAAAAAAAAAAEBVB+vemIenOWjJKPeaiUWCEN25jsEPmTpIlut31oacd9AaKkVAAAAAAEEAKBMDds1kJoNC+au685RIk/bcqEzZUlnLfnwjJpgx1omB2ZpeGVkMTgNZnJvbV9yYXdfdTI1NgABAQAAAHS7cwUfi9jmrdrHu2LvhWKLCdye6W294+RBZ4pEgCvbC21vY2tfc291cmNlCXNldF92YWx1ZQADAQEAAQIAAgAAAHS7cwUfi9jmrdrHu2LvhWKLCdye6W294+RBZ4pEgCvbC21vY2tfc291cmNlBXByaWNlAAIBAQABAwAADSboscHb0PENnJ/ZKPsb8EgfRLahSRbrPfEuFCT0XaoGbWFya2V0DHVwZGF0ZV9wcmljZQEHVk0OWNWfzsxej+coc1GWFdn7sceB009VRe4/PcHNRf0Gc3RhYmxlBlNUQUJMRQACAQQAAgIAKncQef3db67TtP+AYhEsoc86M8mLAnwGhbj7/3IK0mEBRfaRcZkkQl7YnEMWcsyOrUsBJtE2Di3bqK/2JiFVZP0UP/MVAAAAACDNN3mgas1+l1nWysvP0pprzh7yATGvFfv+hKdhxMIwiyp3EHn93W+u07T/gGIRLKHPOjPJiwJ8BoW4+/9yCtJh6AMAAAAAAACcxWVRAAAAAAABYQBuCFSJ1RJeUMmPez2iX78Kz4uLyOBFD+mUii8dqFUHgMeg+ioHP3cI/3LnNc+id/JHyjRpl1Lgc9tXdRpnPoADDR2pqxdjx19PH7B5MVEMS2PLUy97CDQNgDC1vbQqPXQ=';

    function insertExampleTx() {
        if (txBytesTextarea) {
            txBytesTextarea.value = exampleTx;
            // Trigger the input event to process the transaction
            const event = new Event('input', { bubbles: true });
            txBytesTextarea.dispatchEvent(event);
        }
    }

    enum SourceType {
        Bytes,
        Hex,
        Base58,
        Base64,
        UTF8,
        BcsNumber,
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
                case SourceType.BcsNumber:
                    if (bcsNumber === '') {
                        sourceBytes = [];
                        bcsNumberType = '';
                        break;
                    }
                    sourceBytes = bcs.u64().serialize(bcsNumber).toBytes();
                    break;
            }
            if (source != SourceType.Bytes) {
                bytes = sourceBytes;
            }
            hex = toHEX(sourceBytes);
            base58 = toB58(sourceBytes);
            base64 = toB64(sourceBytes);
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
        <div style="float: left; display: flex; align-items: center; gap: 10px;">
            <span>Tx bytes base64:</span>
            <button on:click={insertExampleTx} style="padding: 4px 8px; font-size: 12px;">
                Example tx
            </button>
        </div>
        <div class="box">
            <textarea
                bind:this={txBytesTextarea}
                on:input={(event) => {
                    // @ts-ignore
                    let inputString = event.target.value;
                    try {
                        value = TransactionDataBuilder.fromBytes(fromB64(inputString));
                        const intentMessage = messageWithIntent(
                            'TransactionData',
                            fromB64(inputString),
                        );
                        const digest = toB58(blake2b(intentMessage, { dkLen: 32 }));
                        // TODO: why is this digest different from the one for the API?
                        console.log('1 ' + digest);
                    } catch (e) {
                        console.log('error TransactionDataBuilder', e);
                        try {
                            value = IotaBcs.SenderSignedData.parse(fromB64(inputString))[0];
                            const [
                                {
                                    txSignatures: [signature],
                                    intentMessage: { value: bcsTransaction },
                                },
                            ] = IotaBcs.SenderSignedData.parse(fromB64(inputString));

                            const bytes =
                                IotaBcs.TransactionData.serialize(bcsTransaction).toBytes();
                            console.log('bytes: ', toB64(bytes));
                            const intentMessage = messageWithIntent('TransactionData', bytes);
                            const digest = toB58(blake2b(intentMessage, { dkLen: 32 }));
                            console.log('2 ' + digest);
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

    <TransactionView {value} />
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
