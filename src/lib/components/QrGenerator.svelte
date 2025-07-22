<script lang="ts">
    import { Buffer } from 'buffer';
    import { UR as BCURType, UREncoder } from '@gandlaf21/bc-ur';
    import qrcode from 'qrcode-generator';
    import { onDestroy, onMount } from 'svelte';

    // Props
    export let cbor: string = '';
    export let urType: string = '';
    export let capacity: number = 500;
    export let defaultInterval: number = 200;
    export let scanError: string = '';

    // QR Code state
    let currentQR = '';
    let urEncoder: any = null;
    let qrInterval: any = null;
    let isAnimated = false;
    let allQRParts: string[] = [];
    let currentPartIndex = 0;
    let totalBasicParts = 0;
    let canvasElement: HTMLCanvasElement;

    // Reactive statement to generate QR when inputs change
    $: if (cbor && urType) {
        createAnimatedQR(cbor, urType, capacity);
    }

    // Reactive statement to update QR code when currentQR changes
    $: if (currentQR && canvasElement) {
        updateQRCode(currentQR);
    }

    /**
     * Initialize canvas on mount
     */
    onMount(() => {
        // Set canvas dimensions properly
        if (canvasElement) {
            canvasElement.width = 400;
            canvasElement.height = 400;
        }

        // Canvas is ready, trigger QR code generation if we have data
        if (currentQR) {
            updateQRCode(currentQR);
        }
    });

    /**
     * Update QR code with new value using qrcode-generator
     */
    function updateQRCode(value: string) {
        if (!canvasElement || !value) return;

        try {
            // Create QR code instance
            const qr = qrcode(0, 'M'); // Type 0 = auto-detect, error correction level M
            qr.addData(value);
            qr.make();

            // Get canvas context
            const ctx = canvasElement.getContext('2d');
            if (!ctx) return;

            // Canvas dimensions
            const canvasSize = 400;
            const padding = 10;
            const qrSize = canvasSize - padding * 2;

            // Clear canvas with white background
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvasSize, canvasSize);

            // Get QR code module count (the size of the QR matrix)
            const moduleCount = qr.getModuleCount();
            const cellSize = Math.floor(qrSize / moduleCount);

            // Calculate actual QR size based on cell size to ensure crisp pixels
            const actualQRSize = cellSize * moduleCount;

            // Center the QR code in the available space
            const offsetX = padding + Math.floor((qrSize - actualQRSize) / 2);
            const offsetY = padding + Math.floor((qrSize - actualQRSize) / 2);

            // Draw QR code modules
            ctx.fillStyle = 'black';
            for (let row = 0; row < moduleCount; row++) {
                for (let col = 0; col < moduleCount; col++) {
                    if (qr.isDark(row, col)) {
                        ctx.fillRect(
                            offsetX + col * cellSize,
                            offsetY + row * cellSize,
                            cellSize,
                            cellSize,
                        );
                    }
                }
            }
        } catch (error) {
            console.error('Failed to generate QR code:', error);
        }
    }

    /**
     * Create animated QR code from CBOR and type
     */
    function createAnimatedQR(cborHex: string, type: string, maxCapacity: number) {
        try {
            stopQRAnimation();

            const ur = new BCURType(Buffer.from(cborHex, 'hex'), type);
            urEncoder = new UREncoder(ur, maxCapacity);

            // Check if the data fits in a single QR code
            const firstPart = urEncoder.nextPart().toUpperCase();

            console.log('Generated QR part:', firstPart);
            console.log('First part length:', firstPart.length);

            // If it's a single part (doesn't contain sequence numbers), show it statically
            // Check both for no '/' and for single part sequences like "1-1"
            const parts = firstPart.split('/');
            const isSinglePart = parts.length <= 2 || (parts.length >= 2 && parts[1] === '1-1');

            if (isSinglePart) {
                console.log('Detected single QR code');
                currentQR = firstPart;
                isAnimated = false;
                allQRParts = [firstPart];
                currentPartIndex = 0;
                totalBasicParts = 1;
                scanError = '';
                return;
            }

            // For multipart URs, extract the total number of parts from the first part
            // Format: UR:TYPE/seqNum-seqLen/data
            if (parts.length >= 2) {
                const seqPart = parts[1];
                const [, totalPartsStr] = seqPart.split('-');
                const totalParts = parseInt(totalPartsStr);
                totalBasicParts = totalParts;

                if (totalParts > 0 && totalParts <= 100) {
                    // Generate the basic sequence parts (1-N, 2-N, ..., N-N)
                    allQRParts = [firstPart];

                    // Generate the remaining basic sequence parts
                    for (let i = 1; i < totalParts; i++) {
                        const nextPart = urEncoder.nextPart().toUpperCase();
                        allQRParts.push(nextPart);
                    }

                    // Generate additional fountain code parts for redundancy
                    // As per UR spec, generate about 2*N total parts for good redundancy
                    const targetTotalParts = Math.min(totalParts * 2, 50); // Cap at 50 to avoid too many parts
                    const additionalParts = targetTotalParts - totalParts;

                    for (let i = 0; i < additionalParts; i++) {
                        const nextPart = urEncoder.nextPart().toUpperCase();
                        allQRParts.push(nextPart);
                    }

                    console.log(`Generated ${allQRParts.length} parts for multipart UR:`);
                    console.log(`- Basic sequence: 1-${totalParts} to ${totalParts}-${totalParts}`);
                    console.log(
                        `- Additional fountain parts: ${totalParts + 1}-${totalParts} to ${allQRParts.length}-${totalParts}`,
                    );
                    console.log(
                        'All parts:',
                        allQRParts.map((part, idx) => {
                            const partInfo = part.split('/');
                            return `${idx + 1}: ${partInfo[1]} (${part.substring(0, 30)}...)`;
                        }),
                    );

                    // Set initial QR code
                    currentPartIndex = 0;
                    currentQR = allQRParts[currentPartIndex];
                    isAnimated = allQRParts.length > 1;

                    if (isAnimated) {
                        // Start animation cycling through all parts
                        qrInterval = setInterval(() => {
                            currentPartIndex = (currentPartIndex + 1) % allQRParts.length;
                            currentQR = allQRParts[currentPartIndex];
                        }, defaultInterval);
                    }
                } else {
                    throw new Error(`Invalid number of parts: ${totalParts}`);
                }
            } else {
                throw new Error('Unable to parse multipart UR format');
            }

            scanError = '';
        } catch (error) {
            scanError = error instanceof Error ? error.message : 'Failed to create animated QR';
            currentQR = '';
            isAnimated = false;
            allQRParts = [];
            currentPartIndex = 0;
        }
    }

    /**
     * Determine if a QR part is basic (sequential) or fountain (redundant)
     */
    function getPartType(
        part: string,
        totalBasicParts: number,
    ): { type: 'basic' | 'fountain'; seqNum: number; seqLen: number } {
        const parts = part.split('/');
        if (parts.length >= 2) {
            const seqPart = parts[1];
            const [seqNumStr, seqLenStr] = seqPart.split('-');
            const seqNum = parseInt(seqNumStr);
            const seqLen = parseInt(seqLenStr);

            // Basic parts have seqNum from 1 to totalBasicParts
            const isBasic = seqNum >= 1 && seqNum <= totalBasicParts;

            return {
                type: isBasic ? 'basic' : 'fountain',
                seqNum,
                seqLen,
            };
        }

        return { type: 'basic', seqNum: 1, seqLen: 1 };
    }

    /**
     * Stop QR animation
     */
    export function stopQRAnimation() {
        if (qrInterval) {
            clearInterval(qrInterval);
            qrInterval = null;
        }
        isAnimated = false;
        urEncoder = null;
        // Don't reset allQRParts and currentPartIndex here as we want to preserve the display info
    }

    /**
     * Start QR animation
     */
    function startQRAnimation() {
        if (allQRParts.length > 1 && !isAnimated) {
            isAnimated = true;
            qrInterval = setInterval(() => {
                currentPartIndex = (currentPartIndex + 1) % allQRParts.length;
                currentQR = allQRParts[currentPartIndex];
            }, defaultInterval);
        }
    }

    /**
     * Go to next QR part manually
     */
    function nextPart() {
        if (allQRParts.length > 1) {
            currentPartIndex = (currentPartIndex + 1) % allQRParts.length;
            currentQR = allQRParts[currentPartIndex];
        }
    }

    /**
     * Clear QR data
     */
    export function clear() {
        stopQRAnimation();
        currentQR = '';
        allQRParts = [];
        currentPartIndex = 0;
        totalBasicParts = 0;
        scanError = '';
    }

    // Cleanup on component destroy
    onDestroy(() => {
        stopQRAnimation();
    });
</script>

{#if currentQR}
    <div class="qr-section">
        <h3>Scan with Keystone to Sign</h3>
        <div class="qr-controls">
            {#if isAnimated}
                <span class="animation-status"
                    >🔄 Animated QR (cycling through {allQRParts.length} parts)</span
                >
                <span class="part-indicator"
                    >Part {currentPartIndex + 1} of {allQRParts.length}</span
                >
                <button class="control-btn" on:click={stopQRAnimation}>Stop Animation</button>
            {:else}
                <span class="animation-status">📱 Static QR</span>
                {#if allQRParts.length > 1}
                    <span class="part-indicator"
                        >Showing part {currentPartIndex + 1} of {allQRParts.length} total</span
                    >
                    <button class="control-btn" on:click={startQRAnimation}>Start Animation</button>
                {:else}
                    <span class="part-indicator">Single QR code - no animation needed</span>
                {/if}
            {/if}
            {#if allQRParts.length > 1}
                <button class="control-btn" on:click={nextPart}>Next Part</button>
            {/if}
        </div>
        <div class="qr-container">
            <canvas bind:this={canvasElement} class="qr-canvas" width="400" height="400"></canvas>
        </div>
        <div class="qr-data">
            <strong>Current UR Data:</strong>
            <code>{currentQR}</code>
        </div>

        {#if allQRParts.length > 1}
            <div class="all-parts-section">
                <h4>All UR Parts ({allQRParts.length} total)</h4>

                <!-- Fountain Code Explanation -->
                <div class="fountain-explanation">
                    <p><strong>📡 Fountain Code Structure:</strong></p>
                    <ul>
                        <li>
                            <strong>Basic Parts:</strong> Sequential parts 1-{totalBasicParts} to {totalBasicParts}-{totalBasicParts}
                            (minimum required)
                        </li>
                        <li>
                            <strong>Fountain Parts:</strong> Redundant parts beyond the basic sequence
                            (for error recovery)
                        </li>
                        <li>
                            <strong>Collection:</strong> You need to collect
                            <em>more than {totalBasicParts}</em> parts total to decode reliably
                        </li>
                        <li>
                            <strong>Redundancy:</strong> Additional fountain parts provide error
                            recovery - any {totalBasicParts}+ parts should work
                        </li>
                    </ul>
                </div>

                <div class="parts-list">
                    {#each allQRParts as part, index}
                        {@const partInfo = getPartType(part, totalBasicParts)}
                        <div class="part-item {partInfo.type}">
                            <div class="part-header">
                                <strong>Part {index + 1}:</strong>
                                <span class="part-type-badge {partInfo.type}">
                                    {partInfo.type === 'basic' ? '📄 Basic' : '🔄 Fountain'}
                                </span>
                                <span class="part-sequence"
                                    >({partInfo.seqNum}-{partInfo.seqLen})</span
                                >
                            </div>
                            <code class="part-data">{part}</code>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
{/if}

{#if scanError}
    <div class="error-message">
        <strong>QR Generation Error:</strong>
        {scanError}
    </div>
{/if}

<style>
    .qr-section {
        background: #2c3e50;
        border-radius: 12px;
        padding: 25px;
        border: 1px solid #34495e;
    }

    .qr-section h3 {
        color: #ecf0f1;
        text-align: center;
    }

    .qr-controls {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: center;
        justify-content: center;
        padding: 15px;
        background: #34495e;
        border-radius: 8px;
    }

    .animation-status {
        color: #f39c12;
        font-weight: 600;
        font-size: 0.9em;
    }

    .part-indicator {
        color: #f39c12;
        font-weight: 500;
        background: #34495e;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.9em;
    }

    .control-btn {
        background: #3498db;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.85em;
        font-weight: 500;
        transition: all 0.2s;
    }

    .control-btn:hover {
        background: #2980b9;
        transform: translateY(-1px);
    }

    .qr-container {
        text-align: center;
        border-radius: 8px;
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .qr-canvas {
        border-radius: 8px;
        background: white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        width: 400px;
        height: 400px;
    }

    .qr-data {
        background: #34495e;
        padding: 15px;
        border-radius: 8px;
        word-break: break-all;
    }

    .qr-data strong {
        color: #3498db;
    }

    .qr-data code {
        background: #2c3e50;
        color: #ecf0f1;
        padding: 10px;
        border-radius: 6px;
        display: block;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 0.8em;
        line-height: 1.4;
    }

    .all-parts-section {
        background: #34495e;
        border-radius: 8px;
        padding: 20px;
    }

    .all-parts-section h4 {
        color: #3498db;
        text-align: center;
    }

    .fountain-explanation {
        background: #2c3e50;
        border: 1px solid #34495e;
        border-radius: 8px;
        padding: 20px;
        color: #ecf0f1;
    }

    .fountain-explanation p {
        color: #3498db;
        font-weight: 600;
    }

    .fountain-explanation ul {
        padding-left: 20px;
    }

    .fountain-explanation li {
        line-height: 1.6;
    }

    .fountain-explanation strong {
        color: #f39c12;
    }

    .fountain-explanation em {
        color: #e74c3c;
        font-style: normal;
        font-weight: 600;
    }

    .parts-list {
        max-height: 600px;
        overflow-y: auto;
        border: 1px solid #2c3e50;
        border-radius: 8px;
        background: #2c3e50;
    }

    .part-item {
        border-bottom: 1px solid #34495e;
        padding: 15px;
        transition: background-color 0.2s;
    }

    .part-item:last-child {
        border-bottom: none;
    }

    .part-item:hover {
        background: #34495e;
    }

    .part-item.basic {
        border-left: 4px solid #27ae60;
    }

    .part-item.fountain {
        border-left: 4px solid #f39c12;
    }

    .part-header {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
    }

    .part-header strong {
        color: #ecf0f1;
    }

    .part-type-badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.75em;
        font-weight: 600;
    }

    .part-type-badge.basic {
        background: #27ae60;
        color: white;
    }

    .part-type-badge.fountain {
        background: #f39c12;
        color: white;
    }

    .part-sequence {
        color: #95a5a6;
        font-size: 0.8em;
        font-family: monospace;
    }

    .part-data {
        background: #1a252f;
        color: #ecf0f1;
        padding: 10px;
        border-radius: 6px;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 0.75em;
        line-height: 1.4;
        word-break: break-all;
        display: block;
    }

    .error-message {
        background: #e74c3c;
        color: white;
        padding: 15px;
        border-radius: 8px;
        border: 1px solid #c0392b;
    }

    .error-message strong {
        font-weight: 600;
    }

    /* Responsive design */
    @media (max-width: 768px) {
        .qr-controls {
            flex-direction: column;
            gap: 8px;
        }

        .part-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
        }

        .fountain-explanation {
            padding: 15px;
        }

        .all-parts-section {
            padding: 15px;
        }
    }
</style>
