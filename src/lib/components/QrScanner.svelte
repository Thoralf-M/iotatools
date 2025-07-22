<script lang="ts">
    import QrScanner from 'qr-scanner';
    import { createEventDispatcher, onDestroy, tick } from 'svelte';

    // Event dispatcher for parent communication
    const dispatch = createEventDispatcher();

    // Scanner state
    let videoElement: HTMLVideoElement | null = null;
    let qrScanner: QrScanner | null = null;
    let scanning = false;
    let debugInfo = '';
    let connectionError = '';
    let scanError = '';

    // Multipart state
    export let isMultipart = false;
    export let expectedParts = 0;
    export let receivedParts = 0;

    /**
     * Initialize QR scanner
     */
    function initializeScanner() {
        console.log(
            'Initializing scanner, videoElement:',
            videoElement,
            'qrScanner exists:',
            !!qrScanner,
        );

        if (!videoElement) {
            console.error('Video element not available');
            return;
        }

        if (qrScanner) {
            console.log('Scanner already exists, destroying old one');
            qrScanner.destroy();
        }

        try {
            qrScanner = new QrScanner(
                videoElement,
                (result) => {
                    console.log('QR code scanned:', result.data);
                    dispatch('scanResult', result.data);
                },
                {
                    returnDetailedScanResult: true,
                    highlightScanRegion: true,
                    highlightCodeOutline: true,
                },
            );
            console.log('QR Scanner created successfully');
        } catch (error) {
            console.error('Failed to create QR scanner:', error);
            const errorMsg = 'Failed to initialize scanner: ' + (error as Error).message;
            connectionError = errorMsg;
            dispatch('connectionError', errorMsg);
        }
    }

    /**
     * Check camera support and permissions
     */
    async function checkCameraSupport() {
        try {
            debugInfo = 'Checking camera support...';

            // Check if QrScanner has camera support
            const hasCamera = await QrScanner.hasCamera();
            console.log('Has camera:', hasCamera);

            if (!hasCamera) {
                throw new Error('No camera found on this device');
            }

            // List available cameras
            const cameras = await QrScanner.listCameras(true);
            console.log('Available cameras:', cameras);

            debugInfo = `Found ${cameras.length} camera(s): ${cameras.map((c) => c.label).join(', ')}`;

            return true;
        } catch (error) {
            console.error('Camera check failed:', error);
            debugInfo = 'Camera check failed: ' + (error as Error).message;
            return false;
        }
    }

    /**
     * Start QR code scanning
     */
    export async function startScanning() {
        console.log('Starting scanner...');
        debugInfo = 'Starting scanner...';

        try {
            connectionError = '';
            scanError = '';
            dispatch('connectionError', '');
            dispatch('error', '');

            // First check camera support
            const cameraSupported = await checkCameraSupport();
            if (!cameraSupported) {
                return;
            }

            // Force DOM update to re-create video element
            scanning = false;
            if (qrScanner) {
                qrScanner.destroy();
                qrScanner = null;
            }
            videoElement = null;
            await tick();

            // Set scanning to true so the video element gets created
            scanning = true;
            debugInfo = 'Creating video element...';

            // Wait for the video element to be created in the DOM
            await tick();
            await new Promise((resolve) => setTimeout(resolve, 100));

            // Check if video element exists after DOM update
            if (!videoElement) {
                debugInfo = 'Video element not found after DOM update, waiting longer...';
                // Wait a bit more for the element to be created
                await new Promise((resolve) => setTimeout(resolve, 200));
            }

            // If still not found, try to query it directly
            if (!videoElement) {
                const el = document.querySelector('video');
                videoElement = el instanceof HTMLVideoElement ? el : null;
            }

            debugInfo = 'Initializing scanner...';
            initializeScanner();

            if (!qrScanner) {
                throw new Error('Scanner not initialized - video element may not be available');
            }

            debugInfo = 'Requesting camera permissions...';
            console.log('Starting QR scanner...');
            await (qrScanner as QrScanner).start();
            debugInfo = '';
            console.log('Scanner started successfully');
        } catch (error) {
            console.error('Failed to start scanning:', error);
            const errorMessage = 'Failed to start camera: ' + (error as Error).message;
            scanError = errorMessage;
            debugInfo = errorMessage;
            scanning = false;
            dispatch('error', scanError);
        }
    }

    /**
     * Stop QR code scanning
     */
    export function stopScanning() {
        if (qrScanner) {
            qrScanner.stop();
            qrScanner.destroy();
            qrScanner = null;
        }
        scanning = false;
        videoElement = null;
    }

    /**
     * Check camera support (exposed function)
     */
    export function checkCamera() {
        return checkCameraSupport();
    }

    /**
     * Reset scanner state
     */
    export function reset() {
        stopScanning();
        connectionError = '';
        scanError = '';
        debugInfo = '';
        dispatch('connectionError', '');
        dispatch('error', '');
    }

    // Cleanup on component destroy
    onDestroy(() => {
        stopScanning();
        // qrScanner is already destroyed and nullified in stopScanning()
    });
</script>

<div class="qr-scanner">
    <p class="info">
        On your Keystone device, navigate to the IOTA wallet and generate a connection QR code. Then
        use the camera scanner below to scan it and capture your account information.
    </p>

    <div class="scanner-controls">
        {#if !scanning}
            <button class="action-btn" on:click={startScanning}> Start Camera </button>
        {:else}
            <button class="action-btn danger" on:click={stopScanning}> Stop Camera </button>
        {/if}

        <button class="control-btn" on:click={checkCameraSupport}> Check Camera </button>

        {#if connectionError || scanError}
            <button class="control-btn" on:click={reset}> Reset Scanner </button>
        {/if}
    </div>

    <!-- Video container - only rendered when scanning -->
    {#if scanning}
        <div class="video-container">
            <video bind:this={videoElement} autoplay muted playsinline width="500" height="300"
            ></video>
            <p class="scanner-instructions">
                Position the QR code displayed on the Keystone within the camera view
            </p>
            {#if isMultipart}
                <div class="multipart-message">
                    <strong>Multipart mode:</strong> Keep scanning until all parts are collected<br
                    />
                    <span>Received {receivedParts} of {expectedParts} parts</span>
                </div>
            {/if}
        </div>
    {/if}

    {#if connectionError}
        <div class="error-message">
            <strong>Error:</strong>
            {connectionError}
        </div>
    {/if}

    {#if scanError}
        <div class="error-message">
            <strong>Scan Error:</strong>
            {scanError}
        </div>
    {/if}

    {#if debugInfo}
        <div class="debug-info">
            <strong>Debug:</strong>
            {debugInfo}
            {#if isMultipart && expectedParts > 0}
                <div class="multipart-progress">
                    <div class="progress-bar">
                        <div
                            class="progress-fill"
                            style="width: {(receivedParts / expectedParts) * 100}%"
                        ></div>
                    </div>
                    <span class="progress-text">
                        {receivedParts}/{expectedParts} parts received
                    </span>
                </div>
            {/if}
        </div>
    {/if}
</div>

<style>
    .qr-scanner {
        width: 100%;
    }

    .info {
        margin-bottom: 1rem;
        color: var(--text-color, #888888);
        font-size: 0.9rem;
    }

    .scanner-controls {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
    }

    .action-btn {
        background: var(--primary-color, #007bff);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.2s;
    }

    .action-btn:hover {
        background: var(--primary-hover, #0056b3);
    }

    .action-btn.danger {
        background: var(--danger-color, #dc3545);
    }

    .action-btn.danger:hover {
        background: var(--danger-hover, #c82333);
    }

    .control-btn {
        background: var(--secondary-color, #6c757d);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.875rem;
        transition: background-color 0.2s;
    }

    .control-btn:hover {
        background: var(--secondary-hover, #545b62);
    }

    .video-container {
        background: #000;
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem 0;
        text-align: center;
    }

    .video-container video {
        border-radius: 4px;
        max-width: 100%;
        height: auto;
    }

    .scanner-instructions {
        color: white;
        margin-top: 0.5rem;
        font-size: 0.875rem;
    }

    .error-message {
        background: var(--error-bg, #f8d7da);
        color: var(--error-color, #721c24);
        padding: 0.75rem;
        border-radius: 4px;
        margin: 0.5rem 0;
        border: 1px solid var(--error-border, #f5c6cb);
    }

    .debug-info {
        background: var(--info-bg, #d1ecf1);
        color: var(--info-color, #0c5460);
        padding: 0.75rem;
        border-radius: 4px;
        margin: 0.5rem 0;
        border: 1px solid var(--info-border, #bee5eb);
        font-size: 0.875rem;
    }

    .multipart-progress {
        margin-top: 0.5rem;
    }

    .progress-bar {
        background: var(--progress-bg, #e9ecef);
        border-radius: 10px;
        height: 20px;
        overflow: hidden;
        margin-bottom: 0.25rem;
    }

    .progress-fill {
        background: var(--progress-fill, #28a745);
        height: 100%;
        transition: width 0.3s ease;
    }

    .progress-text {
        font-size: 0.75rem;
        font-weight: 500;
    }

    .multipart-message {
        color: white;
        margin-top: 0.5rem;
        font-size: 0.875rem;
        text-align: center;
    }
</style>
