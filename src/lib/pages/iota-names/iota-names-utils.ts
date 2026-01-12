// IOTA Names utility functions

/**
 * Convert timestamp to relative time string
 */
export function timeAgo(timestamp: number): string {
    const now = new Date().getTime();
    const diff = now - timestamp;
    const isFuture = diff < 0;
    const absDiff = Math.abs(diff);

    const seconds = Math.floor(absDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let timeString = '';
    if (days > 0) {
        const remainingHours = hours % 24;
        timeString = `${days} day${days > 1 ? 's' : ''} ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
        const remainingMinutes = minutes % 60;
        timeString = `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
    } else if (minutes > 0) {
        const remainingSeconds = seconds % 60;
        timeString = `${minutes} minute${minutes > 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
    } else {
        timeString = `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }

    return isFuture ? `in ${timeString}` : `${timeString} ago`;
}
