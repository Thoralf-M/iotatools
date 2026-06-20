import type { IotaGraphQLClient } from '@iota/iota-sdk/graphql';

// Retry tuning. Fetching many addresses fans out into hundreds of GraphQL
// requests; the public endpoint answers bursts with HTTP 429, which the browser
// surfaces as a thrown `TypeError: Failed to fetch` (net::ERR_FAILED) rather
// than a readable status. We retry those with exponential backoff + jitter so a
// transient rate-limit doesn't abort an entire address's fetch.
const MAX_RETRIES = 6;
const BASE_DELAY_MS = 1000;
const MAX_DELAY_MS = 30000;

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * True for errors worth retrying: rate-limit responses and transient network
 * failures. A 429 from the GraphQL server reaches the browser as a thrown
 * `TypeError: Failed to fetch`, so that case is covered both by the TypeError
 * check and the message regex.
 */
function isRetryableError(err: unknown): boolean {
    if (err instanceof TypeError) return true; // "Failed to fetch"
    const msg = err instanceof Error ? err.message : String(err);
    return /429|too many requests|failed to fetch|networkerror|econnreset|timeout/i.test(msg);
}

/**
 * Run a GraphQL query, retrying on rate-limit / transient network errors with
 * exponential backoff and jitter. Non-retryable errors (and the final attempt)
 * are rethrown unchanged so callers keep their existing error handling.
 */
export async function queryWithRetry<T = any>(
    gqlClient: IotaGraphQLClient,
    args: { query: string; variables?: Record<string, unknown> },
): Promise<T> {
    for (let attempt = 0; ; attempt++) {
        try {
            return (await gqlClient.query(args as any)) as T;
        } catch (err) {
            if (attempt >= MAX_RETRIES || !isRetryableError(err)) {
                throw err;
            }
            const backoff = Math.min(BASE_DELAY_MS * 2 ** attempt, MAX_DELAY_MS);
            const wait = backoff + Math.random() * backoff * 0.5; // up to +50% jitter
            console.warn(
                `GraphQL request failed (${err instanceof Error ? err.message : String(err)}); ` +
                    `retrying in ${Math.round(wait)}ms (attempt ${attempt + 1}/${MAX_RETRIES})`,
            );
            await delay(wait);
        }
    }
}

/**
 * Map over `items` running at most `limit` calls of `fn` concurrently. Results
 * are returned in input order. Used to cap how many addresses fetch in parallel
 * so the GraphQL endpoint isn't flooded (the prior `Promise.all(map(...))` ran
 * every address at once, which tripped server rate limits).
 */
export async function mapWithConcurrency<T, R>(
    items: T[],
    limit: number,
    fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
    const results = Array.from<R>({ length: items.length });
    let next = 0;
    async function worker(): Promise<void> {
        while (true) {
            const i = next++;
            if (i >= items.length) return;
            results[i] = await fn(items[i], i);
        }
    }
    const workerCount = Math.max(1, Math.min(limit, items.length));
    await Promise.all(Array.from({ length: workerCount }, () => worker()));
    return results;
}
