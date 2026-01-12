/**
 * Format an address for display by showing first 8 and last 6 characters
 */
export function formatAddress(address: string): string {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<void> {
    try {
        await navigator.clipboard.writeText(text);
    } catch (e) {
        console.error('Failed to copy', e);
    }
}
