<script lang="ts">
    import { nanoToIota } from '../utils/iota-nano-conversion';

    interface Props {
        value: number;
        label?: string;
        placeholder?: string;
        id?: string;
    }

    let { value = $bindable(0), label = 'Amount', placeholder = '0', id }: Props = $props();

    let nanoInput = $state(value.toString());
    let iotaDisplay = $state('');
    let iotaDisplayFormatted = $state('');
    let isFocused = $state(false);

    // Update input when value changes externally, but only if not focused
    $effect(() => {
        if (!isFocused) {
            nanoInput = value.toString();
            updateIotaDisplay();
        }
    });

    function updateIotaDisplay() {
        try {
            if (nanoInput && nanoInput.trim() !== '') {
                const cleanInput = nanoInput.replace(/_/g, '');
                // Use BigInt to handle large numbers
                const nanoBigInt = BigInt(cleanInput);

                // Try to convert to number for binding, but handle overflow
                try {
                    const nanoValue = Number(nanoBigInt);
                    if (!isNaN(nanoValue) && isFinite(nanoValue)) {
                        value = nanoValue;
                    } else {
                        // For very large numbers, keep as is or set to max safe integer
                        value = Number.MAX_SAFE_INTEGER;
                    }
                } catch {
                    value = Number.MAX_SAFE_INTEGER;
                }

                // Always try to convert for display
                iotaDisplay = nanoToIota(cleanInput);
                iotaDisplayFormatted = iotaDisplay.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1_');
            } else {
                iotaDisplay = '';
                iotaDisplayFormatted = '';
                value = 0;
            }
        } catch (err) {
            iotaDisplay = '';
            iotaDisplayFormatted = '';
            value = 0;
        }
    }

    function handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        nanoInput = target.value;
        updateIotaDisplay();
    }

    function handleFocus() {
        isFocused = true;
    }

    function handleBlur() {
        isFocused = false;
    }
</script>

<div class="iota-amount-input">
    {#if label}
        <label for={id}>{label}</label>
    {/if}
    <div class="input-container">
        <input
            {id}
            type="text"
            bind:value={nanoInput}
            oninput={handleInput}
            onfocus={handleFocus}
            onblur={handleBlur}
            {placeholder}
            class="nano-input"
        />
        <span class="nano-label">NANO</span>
    </div>
    {#if iotaDisplay}
        <div class="iota-display">
            <span class="iota-value">{iotaDisplayFormatted}</span>
            <span class="iota-label">IOTA</span>
        </div>
    {/if}
</div>

<style>
    .iota-amount-input {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .input-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .nano-input {
        width: 200px;
        padding: 0.5rem;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--background-input);
        color: var(--text);
        font-family: monospace;
    }

    .nano-label {
        font-size: 0.8rem;
        color: var(--text-muted);
        font-weight: 500;
    }

    .iota-display {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0.5rem;
        background: var(--background-card);
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.9rem;
    }

    .iota-value {
        color: var(--text);
        font-weight: 600;
    }

    .iota-label {
        font-size: 0.8rem;
        color: var(--text-muted);
        font-weight: 500;
    }
</style>
