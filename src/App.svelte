<script>
    import Network from './lib/Network.svelte';
    import Converter from './lib/pages/Converter.svelte';
    import Ed25519AddressGeneration from './lib/pages/Ed25519AddressGeneration.svelte';
    import Faucet from './lib/pages/Faucet.svelte';
    import IotaNames from './lib/pages/IotaNames.svelte';
    import IotaSystemState from './lib/pages/IotaSystemState.svelte';
    import LedgerNano from './lib/pages/LedgerNano.svelte';
    import MultiAccountView from './lib/pages/MultiAccountView.svelte';
    import ProgrammableTransactionBlock from './lib/pages/ProgrammableTransactionBlock.svelte';
    import PublishData from './lib/pages/PublishData.svelte';
    import Settings from './lib/pages/Settings.svelte';
    import SplitMergeCoins from './lib/pages/SplitMergeCoins.svelte';
    import Stake from './lib/pages/Stake.svelte';
    import Signer from './lib/Signer.svelte';
    import Tabs from './lib/Tabs.svelte';

    // List of tab items with labels, values and assigned components
    let items = [
        {
            label: 'Ed25519 address generation',
            component: Ed25519AddressGeneration,
        },
        { label: 'Converter', component: Converter },
        { label: 'Faucet', component: Faucet },
        { label: 'IOTA System State', component: IotaSystemState },
        { label: 'Publish Data', component: PublishData },
        { label: 'PTB Code', component: ProgrammableTransactionBlock },
        { label: 'Split Merge Coins', component: SplitMergeCoins },
        { label: 'Stake', component: Stake },
        { label: 'IOTA-Names', component: IotaNames },
        { label: 'LedgerNano', component: LedgerNano },
        { label: 'Multi Account View', component: MultiAccountView },
        { label: '⚙ Settings', component: Settings },
    ].map((e, index) => {
        // @ts-ignore
        e.value = index;
        return e;
    });
</script>

<main>
    <span
        style="z-index: 1000;
    position: absolute;
    left: 0.5rem;
    top: 0.5rem;">This website is experimental, use at your own risk.</span
    >
    <Network />
    <Signer />
    <Tabs {items} />
    <a href="https://github.com/Thoralf-M/iota-utils" target="_blank" rel="noopener noreferrer"
        >https://github.com/Thoralf-M/iota-utils</a
    >
</main>
