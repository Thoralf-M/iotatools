<script lang="ts">
    import { Buffer } from 'buffer';
    // @ts-ignore - bc-ur doesn't have complete type definitions
    import { URDecoder } from '@gandlaf21/bc-ur';
    import { toHex as toHEX, toB64 as toBase64 } from '../../utils/wasm-sdk';
    // [GAP] messageWithIntent from @iota/iota-sdk/cryptography not in WASM SDK
    const messageWithIntent = (...args: any[]): any => {
        throw new Error('[GAP] messageWithIntent not available in WASM SDK');
    };

    import QrGeneratorComponent from '../../components/QrGenerator.svelte';
    import QrScannerComponent from '../../components/QrScanner.svelte';
    import TransactionView from '../../components/TransactionView.svelte';
    import { getClient } from '../../utils/client';
    // @ts-ignore - bc-ur-registry-iota doesn't have complete type definitions
    import {
        CryptoKeypath,
        generateKeyDerivationCall,
        IotaSignature,
        IotaSignRequest,
        PathComponent,
    } from './bc-ur-registry-iota/src';
    import {
        ADDRESS_PREFIXES,
        DEFAULT_ACCOUNT_ADDRESS,
        DEFAULT_DERIVATION_PATHS,
        DEFAULT_MASTER_FINGERPRINT,
        EXAMPLE_DECODE_SIGN_REQUEST_UR,
        EXAMPLE_MULTIPART_SIGN_REQUEST_UR,
        EXAMPLE_SIGNATURE_UR,
        getExampleData,
        TRANSACTION_EXAMPLES,
        UR_TYPES,
    } from './keystone';
    import {
        createUrProcessorState,
        deriveIotaAddress,
        handleScanResult as processQrScanResult,
        resetMultipartState as resetUrState,
        uuidParse,
        uuidStringify,
        type UrProcessorState,
    } from './ur-processor.js';

    // State variables
    let activeStep: 'connect' | 'prepare' | 'scan-signature' | 'ur-decode' | 'key-derivation' =
        'connect';
    let scanResult = '';
    let scanError = '';

    // Multipart UR state
    let urProcessorState: UrProcessorState = createUrProcessorState();
    $: isMultipart = urProcessorState.isMultipart;
    $: expectedParts = urProcessorState.expectedParts;
    $: receivedParts = urProcessorState.receivedParts;

    // Connection state
    let connectedDevice = '';
    let connectionError = '';

    // Connection data - initially empty, populated after scanning Keystone account data
    let derivationPaths = DEFAULT_DERIVATION_PATHS;
    let masterFingerprint = DEFAULT_MASTER_FINGERPRINT;
    let accountAddress = DEFAULT_ACCOUNT_ADDRESS;

    // Sign request data - initialized from example data
    const exampleData = getExampleData();
    let requestId = exampleData.requestId;
    let rawTransactionBytes = '';
    let walletOrigin = exampleData.walletOrigin;

    // Keystone account data - initially empty, populated after scanning
    let keystoneAccountData: any = null;
    let selectedAccountIndex = 0;

    // QR Scanner component reference
    let qrScannerComponent: any;

    // QR Generator component reference
    let qrGeneratorComponent: any;

    // QR generation state
    let qrCbor = '';
    let qrUrType = '';
    let showQrGenerator = false;

    // UR Decoding section
    let urToDecode = '';
    let decodedUrData = '';
    let urDecodeError = '';

    // Transaction submission state

    let transactionResult: any = null;
    let submitting = false;
    let submitError = '';

    // Key derivation section state
    let derivePath = "m/44'/4218'/0'/0'/0'";
    let deriveOrigin = walletOrigin;
    let deriveResult = '';
    let deriveError = '';

    function handleDeriveKey() {
        try {
            const schemas = [{ path: derivePath }];
            const ur = generateKeyDerivationCall({ schemas, origin: deriveOrigin });
            deriveResult = JSON.stringify(
                { type: ur.type, cborHex: ur.cbor.toString('hex') },
                null,
                2,
            );
            deriveError = '';
        } catch (e) {
            deriveError = e instanceof Error ? e.message : String(e);
            deriveResult = '';
        }
    }

    /**
     * Handle scanned QR code result with multipart UR support
     */
    function handleScanResult(data: string) {
        const result = processQrScanResult(data, urProcessorState);

        // Force Svelte reactivity for multipart props
        isMultipart = urProcessorState.isMultipart;
        expectedParts = urProcessorState.expectedParts;
        receivedParts = urProcessorState.receivedParts;

        if (result.success) {
            if (result.needsMoreParts) {
                // Continue scanning for more parts
                return;
            }

            // Successfully completed scanning - stop the camera
            if (qrScannerComponent) {
                qrScannerComponent.stopScanning();
            }

            // Update connection state from result
            if (result.connectedDevice) connectedDevice = result.connectedDevice;
            if (result.accountAddress) accountAddress = result.accountAddress;
            if (result.accountAddressBip32Path) derivationPaths = result.accountAddressBip32Path;
            if (result.keystoneAccountData) {
                keystoneAccountData = result.keystoneAccountData;
                // Add path string to each key for display purposes
                if (keystoneAccountData.keys) {
                    for (const key of keystoneAccountData.keys) {
                        if (key.origin && key.origin.components) {
                            const pathComponents = key.origin.components;
                            let pathString = 'm/';
                            for (const comp of pathComponents) {
                                pathString += comp.index;
                                if (comp.hardened) {
                                    pathString += "'";
                                }
                                pathString += '/';
                            }
                            pathString = pathString.slice(0, -1); // remove trailing /
                            key.path = pathString;
                        }
                    }
                }
                console.log('Keystone account data:', JSON.stringify(keystoneAccountData, null, 2));
                console.log('Keystone account data:', keystoneAccountData);
            }
            if (result.scanResult) scanResult = result.scanResult;

            connectionError = '';
        } else {
            connectionError = result.connectionError || 'Unknown error occurred';
        }
    }

    /**
     * Reset multipart UR state
     */
    function resetMultipartState() {
        resetUrState(urProcessorState);
        // Force Svelte reactivity for multipart props
        isMultipart = urProcessorState.isMultipart;
        expectedParts = urProcessorState.expectedParts;
        receivedParts = urProcessorState.receivedParts;
    }

    /**
     * Clear connection state
     */
    function clearConnection() {
        connectedDevice = '';
        accountAddress = '';
        derivationPaths = '';
        masterFingerprint = '';
        connectionError = '';
        scanError = '';
        keystoneAccountData = null;
        selectedAccountIndex = 0;
        resetMultipartState();
    }

    /**
     * Generate an IOTA sign request QR code
     */
    function generateSignRequest() {
        try {
            if (!rawTransactionBytes || rawTransactionBytes.trim() === '') {
                showQrGenerator = false;
                return;
            }

            // Use Keystone account data if available, otherwise use default values for demo
            const useMasterFingerprint = masterFingerprint || DEFAULT_MASTER_FINGERPRINT;
            const useAccountAddress = accountAddress || DEFAULT_ACCOUNT_ADDRESS;

            // Convert base64 encoded transaction bytes to Uint8Array
            const txBytes = new Uint8Array(Buffer.from(rawTransactionBytes, 'base64'));

            // Construct the message intent with transaction data
            const txMessageIntent = messageWithIntent('TransactionData', txBytes);

            // Parse derivation path from the input field
            const pathString = derivationPaths.trim().replace(/^m\//, '');
            const pathSegments = pathString.split('/');
            const pathComponents = pathSegments
                .filter((part) => part.trim() !== '')
                .map((part) => {
                    const isHardened = part.includes("'");
                    const index = parseInt(part.replace("'", ''));
                    return new PathComponent({ index, hardened: isHardened });
                });

            const signKeyPath = new CryptoKeypath(
                pathComponents,
                Buffer.from(useMasterFingerprint, 'hex'),
            );

            const idBuffer = uuidParse(requestId) as Uint8Array;

            const iotaSignRequest = new IotaSignRequest({
                requestId: Buffer.from(idBuffer),
                intentMessage: Buffer.from(txMessageIntent),
                derivationPaths: [signKeyPath],
                addresses: [
                    Buffer.from(
                        useAccountAddress
                            .replace(ADDRESS_PREFIXES.HEX, '')
                            .replace(ADDRESS_PREFIXES.IOTA1Q, ''),
                        'hex',
                    ),
                ],
                origin: walletOrigin,
            });

            // Get the CBOR data and create animated QR
            const cborHex = iotaSignRequest.toCBOR().toString('hex');

            // Show a warning if using default values
            if (!keystoneAccountData) {
                scanError = 'ℹ️ Using demo values - connect Keystone device for real account data';
            } else {
                scanError = '';
            }

            // Set QR generation parameters for the QrGenerator component
            qrCbor = cborHex;
            qrUrType = UR_TYPES.IOTA_SIGN_REQUEST;
            showQrGenerator = true;
        } catch (error) {
            console.error('Error in generateSignRequest:', error);
            scanError = error instanceof Error ? error.message : 'Failed to generate sign request';
            showQrGenerator = false;
        }
    }

    /**
     * Update form fields when account selection changes
     */
    function updateSelectedAccount() {
        if (!keystoneAccountData || !keystoneAccountData.keys) {
            return;
        }

        const selectedAccount = keystoneAccountData.keys[selectedAccountIndex];
        if (selectedAccount) {
            console.log('selectedAccount', selectedAccount);
            // Force Svelte reactivity by clearing and then setting
            derivationPaths = '';
            derivationPaths = selectedAccount.path + '';
            masterFingerprint = keystoneAccountData.masterFingerprint;
            accountAddress = deriveIotaAddress(toHEX(selectedAccount.getKey()));
        }
    }

    /**
     * UR Decoding functions
     */
    function loadExampleUR(type: 'signRequest' | 'signature' | 'multipart') {
        switch (type) {
            case 'signRequest':
                urToDecode = EXAMPLE_DECODE_SIGN_REQUEST_UR;
                break;
            case 'signature':
                urToDecode = EXAMPLE_SIGNATURE_UR;
                break;
            case 'multipart':
                urToDecode = EXAMPLE_MULTIPART_SIGN_REQUEST_UR;
                break;
        }
        decodedUrData = '';
        urDecodeError = '';
        decodeUR(); // Automatically decode after loading example
    }

    function decodeUR() {
        try {
            if (!urToDecode.trim()) {
                urDecodeError = 'Please enter a UR to decode';
                decodedUrData = '';
                return;
            }

            // Parse the UR using the proper bc-ur library
            const urDecoder = new URDecoder();
            const urParts = urToDecode.trim().split(/[\n\s]+/);

            for (const part of urParts) {
                if (part.trim()) {
                    urDecoder.receivePart(part.trim());
                }
            }

            if (urDecoder.isComplete()) {
                const result = urDecoder.resultUR();
                const type = result.type;
                const cborHex = result.cbor.toString('hex');

                let decodedData: any = {
                    type: type,
                    cborHex: cborHex,
                };

                // Try to decode specific types
                if (type === UR_TYPES.IOTA_SIGN_REQUEST) {
                    const signRequest = IotaSignRequest.fromCBOR(result.cbor);
                    decodedData.specific = {
                        requestId: uuidStringify(signRequest.getRequestId()!),
                        intentMessage: Buffer.from(signRequest.getIntentMessage()!).toString('hex'),
                        derivationPaths: signRequest
                            .getDerivationPaths()
                            .map((p: any) => p.getPath()),
                        addresses:
                            signRequest
                                .getAddresses()
                                ?.map((a: any) => Buffer.from(a).toString('hex')) || [],
                        origin: signRequest.getOrigin(),
                    };
                } else if (type === UR_TYPES.IOTA_SIGNATURE) {
                    const signature = IotaSignature.fromCBOR(result.cbor);
                    const signatureBytes = signature.getSignature()!;
                    const publicKeyBytes = signature.getPublicKey()!;
                    // BCS encoding: 0x00 (Ed25519) + signature + publicKey
                    const bcsSignature = Buffer.concat([
                        Buffer.from([0x00]),
                        signatureBytes,
                        publicKeyBytes,
                    ]);
                    let signatureBase64 = toBase64(bcsSignature);
                    console.log('signaturebase64', signatureBase64);
                    decodedData.specific = {
                        signatureBase64,
                        requestId: uuidStringify(signature.getRequestId()!),
                        signature: Buffer.from(signature.getSignature()!).toString('hex'),
                        publicKey: Buffer.from(signature.getPublicKey()!).toString('hex'),
                    };
                }

                decodedUrData = JSON.stringify(decodedData, null, 2);
                urDecodeError = '';
            } else {
                throw new Error('UR decoding incomplete');
            }
        } catch (error) {
            console.error('Failed to decode UR:', error);
            urDecodeError = 'Failed to decode UR: ' + (error as Error).message;
            decodedUrData = '';
        }
    }

    /**
     * Submit the signed transaction to the network
     */
    async function submitSignedTransaction() {
        submitting = true;
        submitError = '';
        transactionResult = null;
        try {
            // Extract transaction bytes and signature from scanResult
            const parsed = JSON.parse(scanResult);
            console.log('rawTransactionBytes', rawTransactionBytes);
            const txBytes = new Uint8Array(Buffer.from(rawTransactionBytes, 'base64'));

            const signatureBase64 = parsed.specific.signatureBase64;
            console.log('signatureBase64', signatureBase64);

            const result = await getClient().executeTransactionBlock({
                transactionBlock: txBytes,
                signature: signatureBase64,
                options: {
                    showBalanceChanges: true,
                    showObjectChanges: true,
                    showEffects: true,
                    showInput: true,
                },
            });
            transactionResult = result;
        } catch (error) {
            submitError = error instanceof Error ? error.message : String(error);
        } finally {
            submitting = false;
        }
    }

    function switchStep(
        step: 'connect' | 'prepare' | 'scan-signature' | 'ur-decode' | 'key-derivation',
    ) {
        activeStep = step;
        scanError = '';
        resetMultipartState();
    }

    // Reactive statement to auto-generate QR code when form data changes
    $: if (
        requestId &&
        rawTransactionBytes &&
        accountAddress &&
        derivationPaths &&
        masterFingerprint &&
        walletOrigin
    ) {
        generateSignRequest();
    }

    $: if (rawTransactionBytes === '' || rawTransactionBytes.trim() === '') {
        showQrGenerator = false;
        qrCbor = '';
        qrUrType = '';
    }

    // Initialize with example data
    const data = getExampleData();
    requestId = data.requestId;
    walletOrigin = data.walletOrigin;

    // Simulated UR parts from animated QR codes
    const simulatedUrParts = [
        'UR:CRYPTO-MULTI-ACCOUNTS/56-4/LPCSETAACFAXBTCYMKWSWELPHDSSOTADCYJOWYFNPSAOLETAADDLOXAOWKAXHDCXSAFTGRSESGFLCSISVWGAPYKEOSKBGWEOTKCXGDFPBWOXBBIOIDVEIDDTTDHKAMAOAMTAADDYOTADLECSDWYKCFBEKNYKAEYKAEYKAEYKAOCYJOWYFNPSAXAHASIHGUGOGADPDYTAADDLOXAOWKAXHDCXBEKOSTZCRSWMTLSFASFXNLROHGNYCPYKVLNSVYGRROTAEOWPGDSSWEBALFTKGYCXAMTAADDYOTADLECSDWYKCFBEKNYKADYKAEYKAEYKAOCYJOWYFNPSAXAHASIHGUGOGADPEHTAADDLOXAOWKAXHDCXWZWKHTGRBSGRDIRSHNNTJPVAVDDYAOQDJYPROLZSJLHTAXAMNYDMIDESTIPL',
        'UR:CRYPTO-MULTI-ACCOUNTS/57-4/LPCSESAACFAXBTCYMKWSWELPHDSSDMBEWZHHAYFSIDJZMNOTBYKNWMLODMWFPSTNJKECIDSKHLKBIDIYLUCAPFFYCLZTCSHPRDRNCXLKYAFHJSESNNGMSRMNRNNYRKCHCNEEGMJYJEGRCKSTQZFRVOYLDPHHCSBZHEVOFHBDUYJELESTPLKGMWKNHFAAFWSOESWYWKETJKCWFLWTHHVORKREDPECBYAOEMPAWNWFIAJTSAMSATLACEPAFLVTJOIHKGDYBEOLPTGMBSFHJLSAHGDYNDMKLEKOAMZTEMKBRPREUORPKEKEZTMWWMDYTSKGAYIHOSGWAERNHKRTVLDMETFRCEGAJEWPDTDSHEHKCPADNDJLZSAMVYLDHPTDAHFZBNDNOELBCSPMLRESHGNECTAMFEMNAHWSETAESEGYVWJL',
        'UR:CRYPTO-MULTI-ACCOUNTS/58-4/LPCSFTAACFAXBTCYMKWSWELPHDSSOTADCYJOWYFNPSAOLETAADDLOXAOWKAXHDCXSAFTGRSESGFLCSISVWGAPYKEOSKBGWEOTKCXGDFPBWOXBBIOIDVEIDDTTDHKAMAOAMTAADDYOTADLECSDWYKCFBEKNYKAEYKAEYKAEYKAOCYJOWYFNPSAXAHASIHGUGOGADPDYTAADDLOXAOWKAXHDCXBEKOSTZCRSWMTLSFASFXNLROHGNYCPYKVLNSVYGRROTAEOWPGDSSWEBALFTKGYCXAMTAADDYOTADLECSDWYKCFBEKNYKADYKAEYKAEYKAOCYJOWYFNPSAXAHASIHGUGOGADPEHTAADDLOXAOWKAXHDCXWZWKHTGRBSGRDIRSHNNTJPVAVDDYAOQDJYPROLZSJLHTAXAMNYDMPRJTIMDY',
        'UR:CRYPTO-MULTI-ACCOUNTS/59-4/LPCSFRAACFAXBTCYMKWSWELPHDSSDMCYTPYNFPDYSPRLAHGEQDGHSKMOYNAHWEWDSBZSDNWNMSSFKNZOJZGLJETBRDDMGHJNKEZOCNMKOERPHGLTZCNLAHONMKRTVWECNBZSYNURGTEHAEUTKBWNLFCTTNJSSSKTCYNETPAEGWWKEEWLOEDMDMCYTPYNFPDYKOCYSKTTTTECINWDLRBBZSLPFLRPTLBKLOPEDKSGISEMDNSEJZRPFSFPPMCFSAKGLESSBEMUYARHFGEOCFBAHYDYRNYALEGYIDYAPEVSFMSPRNBKAXGWENQDVSVEJTQDGWWKEMWLOEDMDMCYTPYNFPDYGURYHPAHLUAYJSFXZSYLTNHEJPATRSEMGHJZCPBKJTPSNBKTSREHLPMYDRFDWDPTIAYTEYDYOTADMNONIYFT',
        'UR:CRYPTO-MULTI-ACCOUNTS/60-4/LPCSFNAACFAXBTCYMKWSWELPHDSSAEBKDRPKGABTPKUYLUWLOEDMDMCYTPYNFPDYROTKGAEESGPRCSNTVDGUUYMONDTDGSENSWFEAXBBHTLDDSRNIASBSWDNDSHTHYCPLSTOOXPYDSKNCKCYSGSGHNVSYLDPUOIDFEKIVDBDMWNERNDMBNGORDHNMNWZAXYTGWWKEHWLOEDMDMCYTPYNFPDYIMLSSSAYRSCKTLESBDHKWLHFJEENCLWTWDYTPRCKWNWKAEECGYWMGABNKOSFASAEDAHNAEDIIEAAMKMTLOKIIDRFLBEOSGDIAXTYRHSPFLMEMHOLOEMHKTTNFRTPKKBDGWWKDYWLOEDMDMCYTPYNFPDYLOADHYRNBSRNDIGEIDLTAOAYUYNSADRPKITSYKPEDSKTEMURNDADPEJTVALY',
        'UR:CRYPTO-MULTI-ACCOUNTS/61-4/LPCSFSAACFAXBTCYMKWSWELPHDSSOTADCYJOWYFNPSAOLETAADDLOXAOWKAXHDCXSAFTGRSESGFLCSISVWGAPYKEOSKBGWEOTKCXGDFPBWOXBBIOIDVEIDDTTDHKAMAOAMTAADDYOTADLECSDWYKCFBEKNYKAEYKAEYKAEYKAOCYJOWYFNPSAXAHASIHGUGOGADPDYTAADDLOXAOWKAXHDCXBEKOSTZCRSWMTLSFASFXNLROHGNYCPYKVLNSVYGRROTAEOWPGDSSWEBALFTKGYCXAMTAADDYOTADLECSDWYKCFBEKNYKADYKAEYKAEYKAOCYJOWYFNPSAXAHASIHGUGOGADPEHTAADDLOXAOWKAXHDCXWZWKHTGRBSGRDIRSHNNTJPVAVDDYAOQDJYPROLZSJLHTAXAMNYDMJSSFKBNS',
        'UR:CRYPTO-MULTI-ACCOUNTS/62-4/LPCSFMAACFAXBTCYMKWSWELPHDSSOXAOWKAXHDCXPRFWAORSQDOYSKIOWKCTNTAAYLHFDEWKNNPTDTPLDAIAHHBSRKADWTJLLOYAKGROAMTAADDYOTADLECSDWYKCFBEKNYKAHYKAEYKAEYKAOCYJOWYFNPSAXAHASIHGUGOGADPECTAADDLOXAOWKAXHDCXBNWSSNDKTTRTINCTLNBALEJEKGCYTBBSLYSGKTNECLCYBWCSJNNLNLFXHKCYNYHPAMTAADDYOTADLECSDWYKCFBEKNYKAMYKAEYKAEYKAOCYJOWYFNPSAXAHASIHGUGOGADPENTAADDLOXAOWKAXHDCXDTFDGMWTLUZCJSRPYAWEPKPAGLPYRFEYHLASJSHEDILYNLJYPTHTVTYNHKFNLPSTAMTAADDYOTADSNGYPRCT',
    ];

    function simulateScanUrParts() {
        for (const part of simulatedUrParts) {
            handleScanResult(part);
        }
    }
    function simulateScanUrPartsSignature() {
        handleScanResult(EXAMPLE_SIGNATURE_UR);
    }
</script>

<div class="keystone-container">
    <h1>Keystone Hardware Wallet - IOTA Integration</h1>

    <!-- Keystone Account Info -->
    {#if keystoneAccountData && keystoneAccountData.keys}
        <div class="account-info">
            <h2>Connected Keystone Device</h2>
            <label for="account-select">Select Account:</label>
            <select
                id="account-select"
                bind:value={selectedAccountIndex}
                on:change={updateSelectedAccount}
            >
                {#each keystoneAccountData.keys as account, index}
                    <option value={index}>
                        Account {account.path} - {deriveIotaAddress(toHEX(account.getKey()))}
                    </option>
                {/each}
            </select>

            <div class="account-details">
                <p><strong>Device:</strong> {keystoneAccountData.device}</p>
                <p>
                    <strong>Master Fingerprint:</strong>
                    <code>{keystoneAccountData.masterFingerprint}</code>
                </p>
                <p>
                    <strong>Selected Path:</strong>
                    <code>{keystoneAccountData.keys[selectedAccountIndex]?.path}</code>
                </p>
                <p>
                    <strong>Address:</strong>
                    <code
                        >{deriveIotaAddress(
                            toHEX(keystoneAccountData.keys[selectedAccountIndex]?.key) || '',
                        )}</code
                    >
                </p>
            </div>
        </div>
    {/if}

    <!-- Step Navigation -->
    <div class="steps">
        <button
            class="step-btn {activeStep === 'connect' ? 'active' : ''}"
            on:click={() => switchStep('connect')}
        >
            1. Connect Wallet
        </button>
        <button
            class="step-btn {activeStep === 'prepare' ? 'active' : ''}"
            on:click={() => switchStep('prepare')}
        >
            2. Prepare Transaction
        </button>
        <button
            class="step-btn {activeStep === 'scan-signature' ? 'active' : ''}"
            on:click={() => switchStep('scan-signature')}
        >
            4. Scan Signature
        </button>
        <button
            class="step-btn {activeStep === 'ur-decode' ? 'active' : ''}"
            on:click={() => switchStep('ur-decode')}
        >
            UR Decode Tool
        </button>
        <button
            class="step-btn {activeStep === 'key-derivation' ? 'active' : ''}"
            on:click={() => switchStep('key-derivation')}
        >
            Address generation
        </button>
    </div>

    <!-- Step 1: Connect Wallet -->
    {#if activeStep === 'connect'}
        <div class="step-content">
            <h2>Step 1: Connect Keystone Device</h2>
            <p>
                Display the wallet connect QR code on your Keystone device and scan it with the
                camera below.
            </p>

            <QrScannerComponent
                bind:this={qrScannerComponent}
                bind:isMultipart
                bind:expectedParts
                bind:receivedParts
                on:scanResult={(event) => handleScanResult(event.detail)}
                on:error={(event) => (scanError = event.detail)}
                on:connectionError={(event) => (connectionError = event.detail)}
            />

            {#if isMultipart}
                <div class="controls">
                    <button on:click={resetMultipartState}>Reset Multipart</button>
                </div>
            {/if}

            <button on:click={simulateScanUrParts} style="margin: 0;"> Simulate Scan </button>
            {#if connectedDevice}
                <div class="success">
                    <p>✅ Connected to: {connectedDevice}</p>
                    <button on:click={clearConnection}>Clear Connection</button>
                </div>
            {/if}
        </div>
    {/if}

    <!-- Step 2: Prepare Transaction -->
    {#if activeStep === 'prepare'}
        <div class="step-content">
            <h2>Step 2: Prepare Transaction</h2>
            <p>Configure the transaction parameters and generate a signing request QR code.</p>

            <div class="form-section">
                <div class="form-row">
                    <label for="request-id">Request ID:</label>
                    <input id="request-id" bind:value={requestId} />
                </div>

                <label for="raw-tx" class="full-width">Transaction Bytes (Base64):</label>
                <textarea id="raw-tx" bind:value={rawTransactionBytes} rows="4" class="full-width"
                ></textarea>

                <div class="example-buttons">
                    <button
                        on:click={() => (rawTransactionBytes = TRANSACTION_EXAMPLES.simple.data)}
                    >
                        {TRANSACTION_EXAMPLES.simple.title}
                    </button>
                    <button
                        on:click={() => (rawTransactionBytes = TRANSACTION_EXAMPLES.complex.data)}
                    >
                        {TRANSACTION_EXAMPLES.complex.title}
                    </button>
                </div>

                <div class="form-row">
                    <label for="account-address">Account Address:</label>
                    <input id="account-address" bind:value={accountAddress} />
                </div>

                <div class="form-row">
                    <label for="derivation-path">Derivation Path:</label>
                    <input id="derivation-path" bind:value={derivationPaths} />
                </div>

                <div class="form-row">
                    <label for="master-fingerprint">Master Fingerprint:</label>
                    <input id="master-fingerprint" bind:value={masterFingerprint} />
                </div>

                <div class="form-row">
                    <label for="wallet-origin">Wallet Origin:</label>
                    <input id="wallet-origin" bind:value={walletOrigin} />
                </div>
            </div>

            {#if showQrGenerator}
                <div class="qr-section">
                    <h3>
                        3. Scan this QR code with your Keystone device to approve the transaction
                    </h3>
                    <QrGeneratorComponent
                        bind:this={qrGeneratorComponent}
                        cbor={qrCbor}
                        urType={qrUrType}
                    />
                </div>
            {/if}
        </div>
    {/if}

    <!-- Step 4: Scan Signature -->
    {#if activeStep === 'scan-signature'}
        <div class="step-content">
            <h2>Step 4: Scan Signature</h2>
            <p>
                After approving the transaction on your Keystone device, scan the signature QR code
                it displays.
            </p>

            <QrScannerComponent
                bind:this={qrScannerComponent}
                bind:isMultipart
                bind:expectedParts
                bind:receivedParts
                on:scanResult={(event) => handleScanResult(event.detail)}
                on:error={(event) => (scanError = event.detail)}
            />

            <button on:click={simulateScanUrPartsSignature} style="margin: 0;">
                Simulate Scan
            </button>

            {#if scanResult}
                <div class="result">
                    <h3>Signature Result:</h3>
                    <pre>{scanResult}</pre>
                    <button on:click={submitSignedTransaction} disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Transaction to Network'}
                    </button>
                    {#if submitError}
                        <div class="error">{submitError}</div>
                    {/if}
                    {#if transactionResult}
                        <TransactionView value={transactionResult} />
                    {/if}
                </div>
            {/if}
        </div>
    {/if}

    <!-- Key Derivation Tool -->
    {#if activeStep === 'key-derivation'}
        <div class="step-content">
            <h2>Key Derivation Tool</h2>
            <p>Derive a key using a specific path and generate a KeyDerivationCall UR.</p>
            <div class="form-section">
                <div class="form-row">
                    <label for="derive-path">Derivation Path:</label>
                    <input id="derive-path" bind:value={derivePath} />
                </div>
                <div class="form-row">
                    <label for="derive-origin">Origin:</label>
                    <input id="derive-origin" bind:value={deriveOrigin} />
                </div>
                <button on:click={handleDeriveKey}>Generate KeyDerivationCall UR</button>
            </div>
            {#if deriveResult}
                <div class="result">
                    <h3>KeyDerivationCall UR:</h3>
                    <div class="qr-section">
                        <h3>Scan this QR code with your Keystone device</h3>
                        <QrGeneratorComponent
                            cbor={JSON.parse(deriveResult).cborHex}
                            urType={JSON.parse(deriveResult).type}
                        />
                    </div>
                    <pre>{deriveResult}</pre>
                </div>
            {/if}
            {#if deriveError}
                <div class="error">{deriveError}</div>
            {/if}
        </div>
    {/if}

    <!-- UR Decode Tool -->
    {#if activeStep === 'ur-decode'}
        <div class="step-content">
            <h2>UR Decode Tool</h2>
            <p>Decode and analyze UR strings from Keystone devices.</p>

            <div class="form-section">
                <label for="ur-input" class="full-width">UR String:</label>
                <textarea
                    id="ur-input"
                    bind:value={urToDecode}
                    rows="4"
                    placeholder="Paste UR string here..."
                    class="full-width"
                    on:input={() => decodeUR()}
                ></textarea>

                <div class="example-buttons">
                    <button on:click={() => loadExampleUR('signRequest')}>
                        Load Sign Request Example
                    </button>
                    <button on:click={() => loadExampleUR('signature')}>
                        Load Signature Example
                    </button>
                    <button on:click={() => loadExampleUR('multipart')}>
                        Load Multipart Example
                    </button>
                </div>
            </div>

            {#if decodedUrData}
                <div class="result">
                    <h3>Decoded Data:</h3>
                    <pre>{decodedUrData}</pre>
                </div>
            {/if}
        </div>
    {/if}

    <!-- Error Display -->
    {#if scanError || connectionError || urDecodeError}
        <div class="error">
            <p>{scanError || connectionError || urDecodeError}</p>
        </div>
    {/if}
</div>

<style>
    .keystone-container {
        max-width: 100%;
        margin: 0 auto;
        padding: 20px;
    }

    h1 {
        text-align: center;
        margin-bottom: 10px;
    }

    .account-info {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
    }

    .account-info h2 {
        margin-top: 0;
        margin-bottom: 15px;
    }

    .account-details {
        margin-top: 15px;
    }

    .account-details p {
        margin: 5px 0;
    }

    .account-details code {
        padding: 2px 6px;
        border-radius: 3px;
        font-family: monospace;
        word-break: break-all;
    }

    .steps {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
    }

    .step-btn {
        padding: 10px 20px;
        border: 1px solid #ddd;
        cursor: pointer;
        border-radius: 5px;
    }

    .step-btn.active {
        background: #202d68;
        color: white;
        border-color: #004ea1;
    }

    .step-content {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
    }

    .form-section {
        margin-bottom: 20px;
    }

    .form-section .form-row {
        display: flex;
        align-items: center;
    }

    .form-section .form-row label {
        display: inline-block;
        margin-bottom: 0;
        margin-right: 10px;
        font-weight: bold;
        width: 150px;
        flex-shrink: 0;
    }

    .form-section .form-row input {
        flex: 1;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-family: monospace;
        margin-bottom: 0;
        box-sizing: border-box;
    }

    .form-section label.full-width {
        display: block;
        width: auto;
        margin-right: 0;
        margin-bottom: 5px;
        font-weight: bold;
    }

    .form-section textarea.full-width {
        width: 100%;
        display: block;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-family: monospace;
        margin-bottom: 15px;
        box-sizing: border-box;
    }

    .example-buttons {
        display: flex;
        gap: 10px;
        margin: 10px 0;
        flex-wrap: wrap;
    }

    .example-buttons button {
        padding: 6px 12px;
        border: 1px solid #ddd;
        cursor: pointer;
        border-radius: 4px;
        font-size: 0.9em;
    }

    .qr-section {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
        text-align: center;
    }

    .qr-section h3 {
        margin-top: 0;
    }

    .controls {
        margin: 15px 0;
        text-align: center;
    }

    .controls button {
        padding: 8px 16px;
        border: 1px solid #ddd;

        cursor: pointer;
        border-radius: 4px;
        margin: 0 5px;
    }

    .success {
        border: 1px solid #c3e6cb;
        color: #155724;
        padding: 15px;
        border-radius: 4px;
        margin: 15px 0;
    }

    .result {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 15px;
        margin: 15px 0;
    }

    .result h3 {
        margin-top: 0;
    }

    .result pre {
        border: 1px solid #e9ecef;
        border-radius: 3px;
        padding: 10px;
        overflow: auto;
        font-size: 0.9em;
    }

    .error {
        border: 1px solid #f5c6cb;
        color: #721c24;
        padding: 15px;
        border-radius: 4px;
        margin: 15px 0;
    }

    /* Style the select dropdown */
    select#account-select {
        background: #222b44;
        color: white;
        border: 1px solid #144f8e;
        border-radius: 5px;
        padding: 10px 20px;
    }

    @media (max-width: 768px) {
        .steps {
            flex-direction: column;
        }

        .example-buttons {
            flex-direction: column;
        }

        .example-buttons button {
            width: 100%;
        }
    }
</style>
