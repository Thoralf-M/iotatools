<script>
    import Options from './lib/Options.svelte';
    import BulkTransfer from './lib/pages/BulkTransfer.svelte';
    import Converter from './lib/pages/Converter.svelte';
    import DynamicFields from './lib/pages/DynamicFields.svelte';
    import Ed25519AddressGeneration from './lib/pages/Ed25519AddressGeneration.svelte';
    import EpochPtBs from './lib/pages/EpochPTBs.svelte';
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
    import TextAnalyzer from './lib/pages/TextAnalyzer.svelte';
    import Signer from './lib/Signer.svelte';
    import Tabs from './lib/Tabs.svelte';

    // List of tab items with labels, values and assigned components
    let items = [
        { label: 'IOTA System State', component: IotaSystemState },
        { label: 'Converter', component: Converter },
        {
            label: 'Ed25519 address generation',
            component: Ed25519AddressGeneration,
        },
        { label: 'Faucet', component: Faucet },
        { label: 'Publish Data', component: PublishData },
        { label: 'PTB Code', component: ProgrammableTransactionBlock },
        { label: 'Split Merge Coins', component: SplitMergeCoins },
        { label: 'Bulk Transfer', component: BulkTransfer },
        { label: 'Stake', component: Stake },
        { label: 'IOTA-Names', component: IotaNames },
        { label: 'Dynamic Fields', component: DynamicFields },
        { label: 'Epoch PTBs', component: EpochPtBs },
        { label: 'LedgerNano', component: LedgerNano },
        { label: 'Multi Account View', component: MultiAccountView },
        { label: 'Text Analyzer', component: TextAnalyzer },
        { label: '⚙ Settings', component: Settings },
    ].map((e, index) => {
        // @ts-ignore
        e.value = index;
        return e;
    });
</script>

<main>
    <header class="app-header">
        <div class="header-row">
            <div class="warning-banner">Experimental website, use at your own risk.</div>
            <Options />
        </div>
    </header>

    <div class="app-content">
        <Signer />
        <Tabs {items} />
    </div>

    <footer class="app-footer">
        <div class="footer-content">
            <a
                href="https://github.com/Thoralf-M/iota-utils"
                target="_blank"
                rel="noopener noreferrer"
                class="github-link"
            >
                View on GitHub
            </a>
        </div>
    </footer>
</main>

<style>
    main {
        min-height: 92vh;
        display: flex;
        flex-direction: column;
        position: relative;
    }

    .app-header {
        margin-bottom: 0.5rem;
    }

    .header-row {
        display: flex;
    }

    .warning-banner {
        color: rgba(255, 255, 255, 0.7);
        font-weight: 400;
        font-size: 0.85rem;
        flex: 1;
        text-align: left;
    }

    .app-content {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .app-footer {
        margin-top: 2rem;
        padding-top: 2rem;
    }

    .footer-content {
        text-align: center;
    }

    .github-link {
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: rgba(55, 65, 81, 0.3);
        border: 1px solid rgba(156, 163, 175, 0.2);
        border-radius: 50px;
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s ease;
        backdrop-filter: blur(5px);
    }

    .github-link:hover {
        background: rgba(59, 130, 246, 0.1);
        border-color: rgba(59, 130, 246, 0.3);
        color: rgba(255, 255, 255, 0.95);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
    }

    @media (max-width: 768px) {
        .header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }

        .warning-banner {
            font-size: 0.8rem;
        }

        .github-link {
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
        }
    }
</style>
