<script lang="ts">
    import { fromBase64, fromHex, toBase64, toHex } from '@iota/bcs';
    import { decodeIotaPrivateKey } from '@iota/iota-sdk/cryptography';
    import { Ed25519Keypair, Ed25519PublicKey } from '@iota/iota-sdk/keypairs/ed25519';
    import {
        entropyToMnemonic,
        generateMnemonic,
        mnemonicToEntropy,
        mnemonicToSeedSync,
    } from '@scure/bip39';
    import { wordlist } from '@scure/bip39/wordlists/english.js';

    import { derivePath } from './ed25519-hd-key';

    const IOTA_BIP44_COIN_TYPE = 4218;
    const SHIMMER_BIP44_COIN_TYPE = 4219;
    const TESTNET_BIP44_COIN_TYPE = 1;
    let coinType = IOTA_BIP44_COIN_TYPE;
    let accountIndex = 0;
    let change = 0;
    let addressIndex = 0;

    let mnemonic = '';
    let mnemonicEntropy = '';
    let seed = '';
    let privateKeyBech32 = '';
    let privateKeyHex = '';
    let publicKeyBase64 = '';
    let publicKey = '';
    let address = '';
    let error = '';

    const generate = () => {
        tryCatch(generateInner);
    };
    const generateInner = () => {
        // 256 for 24 words
        mnemonic = generateMnemonic(wordlist, 256);
        generateAddressFromMnemonic();
    };
    const generateShort = () => {
        tryCatch(generateShortInner);
    };
    const generateShortInner = () => {
        mnemonic = '';
        while (mnemonic.length == 0 || mnemonic.length > 129) {
            mnemonic = generateMnemonic(wordlist, 256);
        }
        generateAddressFromMnemonic();
    };
    const generateFromEntropy = () => {
        tryCatch(generateFromEntropyInner);
    };
    const generateFromEntropyInner = () => {
        mnemonic = entropyToMnemonic(fromHex(mnemonicEntropy), wordlist);
        generateSeedAndAddress();
    };

    const generateAddressFromMnemonic = () => {
        tryCatch(generateAddressFromMnemonicInner);
    };
    const generateAddressFromMnemonicInner = () => {
        mnemonicEntropy = toHex(mnemonicToEntropy(mnemonic, wordlist));
        generateSeedAndAddress();
    };
    const generateSeedAndAddress = () => {
        tryCatch(generateSeedAndAddressInner);
    };
    const generateSeedAndAddressInner = () => {
        // empty passphrase
        seed = toHex(mnemonicToSeedSync(mnemonic, ''));
        generateAddressFromSeed();
    };

    const generateAddressFromSeed = () => {
        tryCatch(generateAddressFromSeedInner);
    };
    const generateAddressFromSeedInner = () => {
        let keyPair = deriveKeypairFromSeed(
            seed,
            `m/44'/${coinType}'/${accountIndex}'/${change}'/${addressIndex}'`,
        );
        privateKeyBech32 = keyPair.getSecretKey();
        // @ts-ignore
        privateKeyHex = toHex(keyPair.keypair.secretKey.slice(0, 32));
        generatePublicKey(keyPair);
    };

    const generateKeysfromHexPrivateKey = () => {
        tryCatch(generateKeysfromHexPrivateKeyInner);
    };
    const generateKeysfromHexPrivateKeyInner = () => {
        let keyPair = Ed25519Keypair.fromSecretKey(fromHex(privateKeyHex));
        privateKeyBech32 = keyPair.getSecretKey();
        generatePublicKey(keyPair);
    };

    const generateKeysFromBech32PrivateKey = () => {
        tryCatch(generateKeysFromBech32PrivateKeyInner);
    };
    const generateKeysFromBech32PrivateKeyInner = () => {
        const { schema, secretKey } = decodeIotaPrivateKey(privateKeyBech32);
        if (schema != 'ED25519') {
            throw 'unsupported schema: ' + schema;
        }
        // use schema to choose the correct key pair
        const keyPair = Ed25519Keypair.fromSecretKey(secretKey);
        // @ts-ignore
        privateKeyHex = toHex(keyPair.keypair.secretKey.slice(0, 32));
        generatePublicKey(keyPair);
    };

    const generatePublicKey = (keyPair: Ed25519Keypair) => {
        error = '';
        try {
            publicKeyBase64 = toBase64(keyPair.getPublicKey().toRawBytes());
            publicKey = toHex(keyPair.getPublicKey().toRawBytes());
            address = keyPair.getPublicKey().toIotaAddress();
        } catch (err: any) {
            try {
                error = JSON.stringify(JSON.parse(err.message).payload.error);
            } catch (e: any) {
                error = err;
            }
        }
    };

    const addressFromPublicKeyBase64 = () => {
        tryCatch(addressFromPublicKeyBase64Inner);
    };
    const addressFromPublicKeyBase64Inner = () => {
        let bytes = fromBase64(publicKeyBase64);
        // Remove byte flag if existing
        if (bytes.length == 33) {
            bytes = bytes.slice(1);
        }
        publicKey = toHex(bytes);
        address = new Ed25519PublicKey(bytes).toIotaAddress();
    };
    const addressFromPublicKey = () => {
        tryCatch(addressFromPublicKeyInner);
    };
    const addressFromPublicKeyInner = () => {
        let bytes = fromHex(publicKey);
        publicKeyBase64 = toBase64(bytes);
        address = new Ed25519PublicKey(bytes).toIotaAddress();
    };

    const tryCatch = (fn: any) => {
        error = '';
        try {
            fn();
        } catch (err: any) {
            try {
                error = JSON.stringify(JSON.parse(err.message).payload.error);
            } catch (e: any) {
                error = err;
            }
        }
    };

    // Workaround as `Ed25519Keypair.deriveKeypairFromSeed()` is limited to coin type 4218
    function deriveKeypairFromSeed(seedHex: string, path: string): Ed25519Keypair {
        const { key } = derivePath(path, seedHex);
        return Ed25519Keypair.fromSecretKey(key);
    }
</script>

<main>
    <div>For development purposes only, never use with real funds!</div>
    <br />
    <button on:click={() => generate()}>Generate new</button>
    <button on:click={() => generateShort()}>Generate new short (&#60;130 chars)</button>
    <input
        id="mnemonic"
        type="string"
        size="140"
        bind:value={mnemonic}
        on:input={() => generateAddressFromMnemonic()}
        placeholder="24 word BIP-39 mnemonic. For development purposes only, never use with real funds!"
    />
    <br />

    BIP 44 path:
    <input
        id="coinType"
        type="number"
        list="coinTypes"
        bind:value={coinType}
        placeholder="BIP-44 coin type"
        on:input={() => generateAddressFromSeed()}
    />
    <datalist id="coinTypes">
        <option value={IOTA_BIP44_COIN_TYPE}>IOTA </option>
        <option value={SHIMMER_BIP44_COIN_TYPE}>Shimmer </option>
        <option value={TESTNET_BIP44_COIN_TYPE}>Testnet </option>
    </datalist>

    <input
        id="accountIndex"
        type="number"
        min="0"
        bind:value={accountIndex}
        placeholder="account index"
        on:input={() => generateAddressFromSeed()}
    />
    <select id="change" bind:value={change} on:input={() => generateAddressFromSeed()}>
        <option value={0}>0</option>
        <option value={1}>1</option>
    </select>
    <input
        id="addressIndex"
        type="number"
        width="1"
        min="0"
        bind:value={addressIndex}
        placeholder="address index"
        on:input={() => generateAddressFromSeed()}
    />

    <br />
    <div>Insert anything and it will generate/convert what's possible:</div>
    <div>
        <label for="mnemonicEntropy">Mnemonic entropy:</label>
        <input
            id="mnemonicEntropy"
            type="string"
            size="70"
            bind:value={mnemonicEntropy}
            on:input={() => generateFromEntropy()}
            placeholder="hex mnemonic entropy"
        />
    </div>
    <div>
        <label for="seed">Seed:</label>
        <input
            id="seed"
            type="string"
            size="130"
            bind:value={seed}
            on:input={() => generateAddressFromSeed()}
            placeholder="hex seed"
        />
    </div>
    <div>
        <label for="privateKeyBech32">Private key bech32:</label>
        <input
            id="privateKeyBech32"
            type="string"
            size="75"
            bind:value={privateKeyBech32}
            on:input={() => generateKeysFromBech32PrivateKey()}
            placeholder="bech32 iotaprivkey"
        />
    </div>
    <div>
        <label for="privateKeyHex">Private key hex:</label>
        <input
            id="privateKeyHex"
            type="string"
            size="70"
            bind:value={privateKeyHex}
            on:input={() => generateKeysfromHexPrivateKey()}
            placeholder="hex Ed25519 private key"
        />
    </div>
    <div>
        <label for="publicKeyBase64">Public key base64:</label>
        <input
            id="publicKeyBase64"
            type="string"
            size="70"
            bind:value={publicKeyBase64}
            on:input={() => addressFromPublicKeyBase64()}
            placeholder="base64 Ed25519 public key"
        />
    </div>
    <div>
        <label for="publicKey">Public key:</label>
        <input
            id="publicKey"
            type="string"
            size="70"
            bind:value={publicKey}
            on:input={() => addressFromPublicKey()}
            placeholder="hex Ed25519 public key"
        />
    </div>
    <div>
        <span class="label">Address:</span>
        <span style="text-align: left;">&nbsp;{address}</span>
    </div>
    <br />
    {error}
</main>

<style>
    div {
        display: flex;
        align-items: center;
        margin-bottom: 0.2rem;
        gap: 0.5rem;
    }

    div:has(input[type='string']:not([size='140'])),
    div:has(.label) {
        display: grid;
        grid-template-columns: 180px 1fr;
        align-items: center;
        gap: 0.5rem;
    }

    label,
    .label {
        font-weight: 500;
        color: rgba(255, 255, 255, 0.8);
        text-align: left;
        font-size: 0.9rem;
    }

    /* Address output styling */
    span:not(.label) {
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace;
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.8rem;
        word-break: break-all;
    }

    input[type='number'] {
        width: 8rem;
        text-align: center;
    }

    input[type='string'] {
        min-width: 300px;
        font-size: 0.8rem;
    }

    /* Larger input fields for better usability */
    input[size='130'] {
        min-width: min(100%, 450px);
    }

    input[size='75'] {
        min-width: min(100%, 350px);
    }

    input[size='70'] {
        min-width: min(100%, 320px);
    }

    button {
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
    }

    select {
        width: 4rem;
        text-align: center;
    }

    /* Error output styling */
    div:last-of-type:not(:has(label)):not(:has(.label)) {
        display: block;
        margin-top: 1.5rem;
        padding: 1rem;
        background: rgba(31, 41, 55, 0.6);
        border: 1px solid rgba(156, 163, 175, 0.2);
        border-radius: 8px;
        word-break: break-all;
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace;
        font-size: 0.85rem;
        text-align: left;
    }

    div:last-of-type:not(:has(label)):not(:has(.label))::before {
        display: block;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: rgba(255, 255, 255, 0.9);
        font-family:
            'Inter',
            'Segoe UI',
            -apple-system,
            BlinkMacSystemFont,
            system-ui,
            sans-serif;
    }

    @media (max-width: 768px) {
        div:has(input[type='string']:not([size='140'])),
        div:has(.label) {
            grid-template-columns: 1fr;
            gap: 0.25rem;
        }

        input[type='string'] {
            min-width: 100%;
        }

        input[type='number'] {
            width: 5rem;
        }

        select {
            width: 4rem;
        }
    }
</style>
