export interface CheckpointData {
    sequenceNumber: number;
    transactionCount: number;
}

/**
 * Check if there is a previous checkpoint with transactions
 */
export function hasPreviousCheckpoint(
    selectedCheckpoint: string,
    checkpointData: CheckpointData[],
): boolean {
    if (!selectedCheckpoint) return false;
    const current = parseInt(selectedCheckpoint);
    return checkpointData.some((cp) => cp.transactionCount > 0 && cp.sequenceNumber < current);
}

/**
 * Check if there is a next checkpoint with transactions
 */
export function hasNextCheckpoint(
    selectedCheckpoint: string,
    checkpointData: CheckpointData[],
): boolean {
    if (!selectedCheckpoint) return false;
    const current = parseInt(selectedCheckpoint);
    return checkpointData.some((cp) => cp.transactionCount > 0 && cp.sequenceNumber > current);
}

/**
 * Navigate to the previous checkpoint with transactions
 */
export function getPreviousCheckpoint(
    selectedCheckpoint: string,
    checkpointData: CheckpointData[],
): string | undefined {
    if (!selectedCheckpoint) return;
    const current = parseInt(selectedCheckpoint);
    const checkpointsWithTxs = checkpointData
        .filter((cp) => cp.transactionCount > 0)
        .map((cp) => cp.sequenceNumber)
        .sort((a, b) => a - b);
    const lower = checkpointsWithTxs.filter((num) => num < current).pop();
    return lower?.toString();
}

/**
 * Navigate to the next checkpoint with transactions
 */
export function getNextCheckpoint(
    selectedCheckpoint: string,
    checkpointData: CheckpointData[],
): string | undefined {
    if (!selectedCheckpoint) return;
    const current = parseInt(selectedCheckpoint);
    const checkpointsWithTxs = checkpointData
        .filter((cp) => cp.transactionCount > 0)
        .map((cp) => cp.sequenceNumber)
        .sort((a, b) => a - b);
    const higher = checkpointsWithTxs.find((num) => num > current);
    return higher?.toString();
}
