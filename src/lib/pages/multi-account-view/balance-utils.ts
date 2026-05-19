import { formatNumberWithUnderscores, nanoToIota } from '../../utils/iota-nano-conversion';
import type { ExtendedAccount, ExtendedObject } from './multi-account-service';

const IOTA_COIN_TYPE = '0x2::coin::Coin<0x2::iota::IOTA>';
const STAKE_LABELS: ReadonlySet<string> = new Set(['StakedIota', 'TimelockedStakedIota']);

/** True if the object is a stake (regular or timelocked). Used by the
 *  "staking mode" filter in MultiAccountView to hide everything else. */
export function isStakeObject(item: ExtendedObject): boolean {
    return STAKE_LABELS.has(item.label);
}

/** Liquid IOTA balance carried by a normal-owned IOTA coin object. */
export function objectIotaCoinAmount(obj: ExtendedObject): bigint {
    if (obj.data?.content?.type === IOTA_COIN_TYPE && obj.data?.content?.fields?.balance) {
        return BigInt(obj.data.content.fields.balance);
    }
    return 0n;
}

/** Staked principal carried by a normal-owned object (StakedIota only). */
export function objectStakedPrincipal(obj: ExtendedObject): bigint {
    if (obj.label === 'StakedIota' && obj.data?.content?.fields?.principal) {
        return BigInt(obj.data.content.fields.principal);
    }
    return 0n;
}

/** Liquid IOTA balance carried by a timelocked object (TimeLock<Balance<IOTA>>). */
export function timelockedIotaCoinAmount(obj: ExtendedObject): bigint {
    if (obj.data?.content?.fields?.locked) {
        return BigInt(obj.data.content.fields.locked);
    }
    return 0n;
}

/** Staked principal carried by a timelocked object (TimelockedStakedIota). */
export function timelockedStakedPrincipal(obj: ExtendedObject): bigint {
    const p = obj.data?.content?.fields?.staked_iota?.fields?.principal;
    return p ? BigInt(p) : 0n;
}

/** Total amount sitting in a normal-owned object regardless of liquid vs staked. */
export function objectPrincipalOrBalance(obj: ExtendedObject): bigint {
    if (obj.data?.content?.fields?.balance) {
        return BigInt(obj.data.content.fields.balance);
    }
    if (obj.data?.content?.fields?.principal) {
        return BigInt(obj.data.content.fields.principal);
    }
    return 0n;
}

/** Total amount sitting in a timelocked object regardless of liquid vs staked. */
export function timelockedAmount(obj: ExtendedObject): bigint {
    if (obj.data?.content?.fields?.locked) {
        return BigInt(obj.data.content.fields.locked);
    }
    if (obj.data?.content?.fields?.staked_iota?.fields?.principal) {
        return BigInt(obj.data.content.fields.staked_iota.fields.principal);
    }
    return 0n;
}

export function accountIotaCoins(account: ExtendedAccount): bigint {
    let total = 0n;
    for (const obj of account.objects) total += objectIotaCoinAmount(obj);
    for (const obj of account.timelockedObjects) total += timelockedIotaCoinAmount(obj);
    return total;
}

export function accountStaked(account: ExtendedAccount): bigint {
    let total = 0n;
    for (const obj of account.objects) total += objectStakedPrincipal(obj);
    for (const obj of account.timelockedObjects) total += timelockedStakedPrincipal(obj);
    return total;
}

export function accountTotalBalance(account: ExtendedAccount): bigint {
    let total = 0n;
    for (const obj of account.objects) total += objectPrincipalOrBalance(obj);
    for (const obj of account.timelockedObjects) total += timelockedAmount(obj);
    total += account.stakingRewards;
    return total;
}

export function sumAccounts(
    accounts: ExtendedAccount[],
    pick: (account: ExtendedAccount) => bigint,
): bigint {
    let total = 0n;
    for (const a of accounts) total += pick(a);
    return total;
}

/** Compact IOTA: integer part with `_` thousands separators, two decimal
 *  digits. Sufficient resolution for staking dashboards without dragging the
 *  full 9-digit nano tail along. */
export function formatIotaCompact(nano: bigint): string {
    const [intPart, decPart = ''] = nanoToIota(nano.toString()).split('.');
    return `${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '_')}.${decPart.slice(0, 2).padEnd(2, '0')}`;
}

export type FiatPrice = { usd: number; eur: number } | null;
export type Currency = 'USD' | 'EUR';

/** Render a nano-IOTA amount in the chosen fiat currency. Returns an empty
 *  string when no price is available so callers can decide whether to render
 *  the parenthesized "(≈ $…)" suffix or skip it entirely. */
export function fiatValue(nano: bigint, price: FiatPrice, currency: Currency): string {
    if (!price) return '';
    const rate = currency === 'USD' ? price.usd : price.eur;
    const v = (Number(nano) / 1e9) * rate;
    const symbol = currency === 'USD' ? '$' : '€';
    return `${symbol}${v.toFixed(2)}`;
}

/** "1_234.56 IOTA (≈ $123.45)" — drops the fiat parens entirely when no
 *  price has been fetched yet. */
export function formatIotaWithFiat(nano: bigint, price: FiatPrice, currency: Currency): string {
    const iota = `${formatIotaCompact(nano)} IOTA`;
    const f = fiatValue(nano, price, currency);
    return f ? `${iota} (≈ ${f})` : iota;
}

/** Display amount for an object: liquid balance, staked principal, or
 *  timelocked-staked principal — formatted in IOTA with thousands separators.
 *  When `compact` is true the value is rounded to 2 decimals (see
 *  `formatIotaCompact`) instead of showing the full 9-digit nano tail. */
export function objectDisplayAmount(item: ExtendedObject, compact = false): string {
    let nano: string | undefined;
    if (item.label.startsWith('Coin<0x2::iota::IOTA>')) {
        nano = item.data?.content?.fields?.balance;
    } else if (item.label === 'StakedIota') {
        nano = item.data?.content?.fields?.principal;
    } else if (item.label === 'TimelockedStakedIota') {
        nano = item.data.content.fields.staked_iota.fields.principal;
    }
    if (nano === undefined) return '';
    if (compact) return formatIotaCompact(BigInt(nano));
    return formatNumberWithUnderscores(nanoToIota(nano));
}

/** Format a nano-IOTA amount for display in either full precision (9 decimals,
 *  thousands-separated) or compact (2 decimals) mode. Mirrors the rendering
 *  conventions of the per-object amounts. */
export function formatIotaAmount(nano: bigint, compact: boolean): string {
    if (compact) return formatIotaCompact(nano);
    return formatNumberWithUnderscores(nanoToIota(nano.toString()));
}
