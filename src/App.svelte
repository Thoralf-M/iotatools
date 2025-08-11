<script>
    import Router from 'svelte-spa-router';
    import { wrap } from 'svelte-spa-router/wrap';

    import Options from './lib/Options.svelte';
    import Signer from './lib/Signer.svelte';
    import Tabs from './lib/Tabs.svelte';

    // Lazy-load page components using dynamic imports
    const pageImports = {
        IotaSystemState: () => import('./lib/pages/IotaSystemState.svelte'),
        PTBs: () => import('./lib/pages/PTBs.svelte'),
        DynamicFields: () => import('./lib/pages/DynamicFields.svelte'),
        StakingRewards: () => import('./lib/pages/StakingRewards.svelte'),
        MultiAccountView: () => import('./lib/pages/MultiAccountView.svelte'),
        AccountsList: () => import('./lib/pages/AccountsList.svelte'),
        Keystone: () => import('./lib/pages/Keystone.svelte'),
        LedgerNano: () => import('./lib/pages/LedgerNano.svelte'),
        PublishData: () => import('./lib/pages/PublishData.svelte'),
        SplitMergeCoins: () => import('./lib/pages/SplitMergeCoins.svelte'),
        BulkTransfer: () => import('./lib/pages/BulkTransfer.svelte'),
        Stake: () => import('./lib/pages/Stake.svelte'),
        Faucet: () => import('./lib/pages/Faucet.svelte'),
        Converter: () => import('./lib/pages/Converter.svelte'),
        TextAnalyzer: () => import('./lib/pages/TextAnalyzer.svelte'),
        Ed25519AddressGeneration: () => import('./lib/pages/Ed25519AddressGeneration.svelte'),
        IotaNames: () => import('./lib/pages/IotaNames.svelte'),
        Settings: () => import('./lib/pages/Settings.svelte'),
    };

    // Route definitions: map route paths to lazy-loaded components using wrap
    const routes = {
        '/': wrap({ asyncComponent: pageImports['IotaSystemState'] }),
        '/iota-system-state': wrap({ asyncComponent: pageImports['IotaSystemState'] }),
        '/ptbs': wrap({ asyncComponent: pageImports['PTBs'] }),
        '/dynamic-fields': wrap({ asyncComponent: pageImports['DynamicFields'] }),
        '/staking-rewards': wrap({ asyncComponent: pageImports['StakingRewards'] }),
        '/multi-account-view': wrap({ asyncComponent: pageImports['MultiAccountView'] }),
        '/accounts-list': wrap({ asyncComponent: pageImports['AccountsList'] }),
        '/keystone': wrap({ asyncComponent: pageImports['Keystone'] }),
        '/ledger-nano': wrap({ asyncComponent: pageImports['LedgerNano'] }),
        '/publish-data': wrap({ asyncComponent: pageImports['PublishData'] }),
        '/split-merge-coins': wrap({ asyncComponent: pageImports['SplitMergeCoins'] }),
        '/bulk-transfer': wrap({ asyncComponent: pageImports['BulkTransfer'] }),
        '/stake': wrap({ asyncComponent: pageImports['Stake'] }),
        '/faucet': wrap({ asyncComponent: pageImports['Faucet'] }),
        '/converter': wrap({ asyncComponent: pageImports['Converter'] }),
        '/text-analyzer': wrap({ asyncComponent: pageImports['TextAnalyzer'] }),
        '/address-generation': wrap({ asyncComponent: pageImports['Ed25519AddressGeneration'] }),
        '/iota-names': wrap({ asyncComponent: pageImports['IotaNames'] }),
        '/settings': wrap({ asyncComponent: pageImports['Settings'] }),
    };

    // Tab items with route paths
    let items = [
        { label: 'IOTA System State', route: '/iota-system-state', group: 'Info' },
        { label: 'PTBs', route: '/ptbs', group: 'Info' },
        { label: 'Dynamic Fields', route: '/dynamic-fields', group: 'Info' },
        { label: 'Staking Rewards', route: '/staking-rewards', group: 'Info' },
        { label: 'Multi Account View', route: '/multi-account-view', group: 'Wallet' },
        { label: 'Accounts List', route: '/accounts-list', group: 'Wallet' },
        { label: 'Keystone', route: '/keystone', group: 'Wallet' },
        { label: 'LedgerNano', route: '/ledger-nano', group: 'Wallet' },
        { label: 'Publish Data', route: '/publish-data', group: 'Transactions' },
        { label: 'Split Merge Coins', route: '/split-merge-coins', group: 'Transactions' },
        { label: 'Bulk Transfer', route: '/bulk-transfer', group: 'Transactions' },
        { label: 'Stake', route: '/stake', group: 'Transactions' },
        { label: 'Faucet', route: '/faucet', group: 'Utilities' },
        { label: 'Converter', route: '/converter', group: 'Utilities' },
        { label: 'Text Analyzer', route: '/text-analyzer', group: 'Utilities' },
        { label: 'Address generation', route: '/address-generation', group: 'Utilities' },
        { label: 'IOTA-Names', route: '/iota-names', group: 'Other' },
        { label: '⚙ Settings', route: '/settings', group: 'Other' },
    ].map((e, index) => {
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
        <Tabs
            {items}
            tabComponents={{
                '/iota-system-state': pageImports.IotaSystemState,
                '/ptbs': pageImports.PTBs,
                '/dynamic-fields': pageImports.DynamicFields,
                '/staking-rewards': pageImports.StakingRewards,
                '/multi-account-view': pageImports.MultiAccountView,
                '/accounts-list': pageImports.AccountsList,
                '/keystone': pageImports.Keystone,
                '/ledger-nano': pageImports.LedgerNano,
                '/publish-data': pageImports.PublishData,
                '/split-merge-coins': pageImports.SplitMergeCoins,
                '/bulk-transfer': pageImports.BulkTransfer,
                '/stake': pageImports.Stake,
                '/faucet': pageImports.Faucet,
                '/converter': pageImports.Converter,
                '/text-analyzer': pageImports.TextAnalyzer,
                '/address-generation': pageImports.Ed25519AddressGeneration,
                '/iota-names': pageImports.IotaNames,
                '/settings': pageImports.Settings,
            }}
        />
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
