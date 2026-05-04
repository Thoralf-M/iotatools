import { getClient } from '../../utils/client';

export interface ValidatorInfoFull {
    address: string;
    name: string;
    poolId: string;
    exchangeRatesId: string;
    /** basis points (0–10000); divide by 100 to get a percent. The
     *  validator's *declared* commission — what they set on the chain.
     *  For display, prefer `effectiveCommissionBps` which factors in the
     *  IIP-8 voting-power floor. */
    commissionBps: number;
    /** basis points; protocol caps voting power per committee member.
     *  Functions as the IIP-8 commission floor (see below). */
    votingPowerBps: number;
    stakingPoolIotaBalance: bigint;
    isCommittee: boolean;
}

/** Effective commission per IIP-8: `max(declared commission, voting-power
 *  share)`. Validators with disproportionately large stake are forced to
 *  keep at least their voting-power percentage as commission, even if
 *  their declared rate is lower. Returned in basis points. */
export function effectiveCommissionBps(v: {
    commissionBps: number;
    votingPowerBps: number;
}): number {
    return Math.max(v.commissionBps, v.votingPowerBps);
}

export interface ValidatorsLoadResult {
    validators: ValidatorInfoFull[];
    currentEpoch: number;
}

/** Fetch every active validator with the fields needed for staking metrics
 *  (pool ID for exchange-rate lookups, commission rate, committee flag).
 *  Candidates are intentionally skipped — they have no exchange-rate history
 *  and earn no rewards yet, so they can't be compared. */
export async function fetchValidatorsForStaking(): Promise<ValidatorsLoadResult> {
    const client = getClient();
    const systemState = await client.getLatestIotaSystemState();
    const committeeAddrs = new Set(
        (systemState.committeeMembers || []).map((m: any) => m.iotaAddress),
    );

    const validators: ValidatorInfoFull[] = systemState.activeValidators.map((v: any) => ({
        address: v.iotaAddress,
        name: v.name || 'Unknown',
        poolId: v.stakingPoolId,
        exchangeRatesId: v.exchangeRatesId,
        commissionBps: parseInt(v.commissionRate),
        votingPowerBps: parseInt(v.votingPower),
        stakingPoolIotaBalance: BigInt(v.stakingPoolIotaBalance),
        // If committeeMembers is empty (some networks), treat all active as committee
        // — matches the convention in stake/validator-service.ts.
        isCommittee: committeeAddrs.size === 0 || committeeAddrs.has(v.iotaAddress),
    }));

    return { validators, currentEpoch: parseInt(systemState.epoch) };
}
