<script>
    import Router from 'svelte-spa-router';
    import { wrap } from 'svelte-spa-router/wrap';

    import DisclaimerModal from './lib/components/DisclaimerModal.svelte';
    import MainnetTransactionConfirmation from './lib/components/MainnetTransactionConfirmation.svelte';
    import Options from './lib/components/Options.svelte';
    import Signer from './lib/components/Signer.svelte';
    import Tabs from './lib/components/Tabs.svelte';
    import { isProMode } from './lib/utils/local-storage-store';
    import { navigateWithGlobalParams } from './lib/utils/query-param-store';

    // Lazy-load page components using dynamic imports
    const pageImports = {
        IotaSystemState: () => import('./lib/pages/iota-system-state/IotaSystemState.svelte'),
        Transaction: () => import('./lib/pages/transaction/Transaction.svelte'),
        Object: () => import('./lib/pages/object/Object.svelte'),
        PTBs: () => import('./lib/pages/ptbs/PTBs.svelte'),
        DynamicFields: () => import('./lib/pages/dynamic-fields/DynamicFields.svelte'),
        StakingRewards: () => import('./lib/pages/staking-rewards/StakingRewards.svelte'),
        Delegators: () => import('./lib/pages/delegators/Delegators.svelte'),
        MultiAccountView: () => import('./lib/pages/multi-account-view/MultiAccountView.svelte'),
        AccountsList: () => import('./lib/pages/accounts-list/AccountsList.svelte'),
        Keystone: () => import('./lib/pages/keystone/Keystone.svelte'),
        LedgerNano: () => import('./lib/pages/ledger-nano/LedgerNano.svelte'),
        Sign: () => import('./lib/pages/sign/Sign.svelte'),
        PublishData: () => import('./lib/pages/publish-data/PublishData.svelte'),
        SplitMergeCoins: () => import('./lib/pages/split-merge-coins/SplitMergeCoins.svelte'),
        ProgrammableTransactionBlock: () =>
            import('./lib/pages/programmable-transaction-block/ProgrammableTransactionBlock.svelte'),
        BulkTransfer: () => import('./lib/pages/bulk-transfer/BulkTransfer.svelte'),
        Stake: () => import('./lib/pages/stake/Stake.svelte'),
        Faucet: () => import('./lib/pages/faucet/Faucet.svelte'),
        Converter: () => import('./lib/pages/converter/Converter.svelte'),
        TextAnalyzer: () => import('./lib/pages/text-analyzer/TextAnalyzer.svelte'),
        Ed25519AddressGeneration: () =>
            import('./lib/pages/ed25519-address-generation/Ed25519AddressGeneration.svelte'),
        IotaNames: () => import('./lib/pages/iota-names/IotaNames.svelte'),
        CandidateStake: () => import('./lib/pages/candidate-stake/CandidateStake.svelte'),
        Settings: () => import('./lib/pages/settings/Settings.svelte'),
        Txs: () => import('./lib/pages/txs/Txs.svelte'),
        TxsVisualizer: () => import('./lib/pages/txs-visualizer/TxsVisualizer.svelte'),
        Impressum: () => import('./lib/pages/impressum/Impressum.svelte'),
        Datenschutz: () => import('./lib/pages/datenschutz/Datenschutz.svelte'),
        Disclaimer: () => import('./lib/pages/disclaimer/Disclaimer.svelte'),
        OnChainApps: () => import('./lib/pages/onchain-apps/OnChainApps.svelte'),
    };

    // Route definitions: map route paths to lazy-loaded components using wrap
    const routes = {
        '/': wrap({ asyncComponent: pageImports['IotaSystemState'] }),
        '/iota-system-state': wrap({ asyncComponent: pageImports['IotaSystemState'] }),
        '/transaction': wrap({ asyncComponent: pageImports['Transaction'] }),
        '/object': wrap({ asyncComponent: pageImports['Object'] }),
        '/ptbs': wrap({ asyncComponent: pageImports['PTBs'] }),
        '/dynamic-fields': wrap({ asyncComponent: pageImports['DynamicFields'] }),
        '/staking-rewards': wrap({ asyncComponent: pageImports['StakingRewards'] }),
        '/delegators': wrap({ asyncComponent: pageImports['Delegators'] }),
        '/multi-account-view': wrap({ asyncComponent: pageImports['MultiAccountView'] }),
        '/accounts-list': wrap({ asyncComponent: pageImports['AccountsList'] }),
        '/keystone': wrap({ asyncComponent: pageImports['Keystone'] }),
        '/ledger-nano': wrap({ asyncComponent: pageImports['LedgerNano'] }),
        '/sign': wrap({ asyncComponent: pageImports['Sign'] }),
        '/publish-data': wrap({ asyncComponent: pageImports['PublishData'] }),
        '/split-merge-coins': wrap({ asyncComponent: pageImports['SplitMergeCoins'] }),
        '/programmable-transaction-block': wrap({
            asyncComponent: pageImports['ProgrammableTransactionBlock'],
        }),
        '/bulk-transfer': wrap({ asyncComponent: pageImports['BulkTransfer'] }),
        '/stake': wrap({ asyncComponent: pageImports['Stake'] }),
        '/faucet': wrap({ asyncComponent: pageImports['Faucet'] }),
        '/converter': wrap({ asyncComponent: pageImports['Converter'] }),
        '/text-analyzer': wrap({ asyncComponent: pageImports['TextAnalyzer'] }),
        '/address-generation': wrap({ asyncComponent: pageImports['Ed25519AddressGeneration'] }),
        '/iota-names': wrap({ asyncComponent: pageImports['IotaNames'] }),
        '/candidate-stake': wrap({ asyncComponent: pageImports['CandidateStake'] }),
        '/settings': wrap({ asyncComponent: pageImports['Settings'] }),
        '/txs': wrap({ asyncComponent: pageImports['Txs'] }),
        '/txs-visualizer': wrap({ asyncComponent: pageImports['TxsVisualizer'] }),
        '/impressum': wrap({ asyncComponent: pageImports['Impressum'] }),
        '/datenschutz': wrap({ asyncComponent: pageImports['Datenschutz'] }),
        '/disclaimer': wrap({ asyncComponent: pageImports['Disclaimer'] }),
        '/onchain-apps': wrap({ asyncComponent: pageImports['OnChainApps'] }),
    };

    // Tab items with route paths
    const allItems = [
        { label: 'IOTA System State', route: '/iota-system-state', group: 'Info' },
        { label: 'Transaction', route: '/transaction', group: 'Info' },
        { label: 'Object', route: '/object', group: 'Info' },
        { label: 'PTBs', route: '/ptbs', group: 'Info' },
        { label: 'Dynamic Fields', route: '/dynamic-fields', group: 'Info' },
        { label: 'Staking Rewards', route: '/staking-rewards', group: 'Info' },
        { label: 'Delegators', route: '/delegators', group: 'Info' },
        { label: 'Txs', route: '/txs', group: 'Info' },
        { label: 'Txs Visualizer', route: '/txs-visualizer', group: 'Info' },
        { label: 'Multi Account View', route: '/multi-account-view', group: 'Wallet' },
        { label: 'Accounts List', route: '/accounts-list', group: 'Wallet' },
        { label: 'Keystone', route: '/keystone', group: 'Wallet' },
        { label: 'LedgerNano', route: '/ledger-nano', group: 'Wallet' },
        { label: 'Sign', route: '/sign', group: 'Wallet' },
        { label: 'Publish Data', route: '/publish-data', group: 'Transactions' },
        { label: 'Split Merge Coins', route: '/split-merge-coins', group: 'Transactions' },
        { label: 'PTB', route: '/programmable-transaction-block', group: 'Transactions' },
        { label: 'Bulk Transfer', route: '/bulk-transfer', group: 'Transactions' },
        { label: 'Stake', route: '/stake', group: 'Transactions' },
        { label: 'Faucet', route: '/faucet', group: 'Utilities' },
        { label: 'Converter', route: '/converter', group: 'Utilities' },
        { label: 'Text Analyzer', route: '/text-analyzer', group: 'Utilities' },
        { label: 'Address generation', route: '/address-generation', group: 'Utilities' },
        { label: 'On-Chain Apps', route: '/onchain-apps', group: 'Other' },
        { label: 'IOTA-Names', route: '/iota-names', group: 'Other' },
        { label: 'Candidate Stake', route: '/candidate-stake', group: 'Other' },
        { label: '⚙ Settings', route: '/settings', group: 'Other' },
    ];

    $: items = $isProMode
        ? allItems.map((e, index) => ({ ...e, value: index }))
        : allItems
              .filter((e) =>
                  [
                      'Transaction',
                      'Staking Rewards',
                      'Txs Visualizer',
                      'Multi Account View',
                      'Sign',
                      'Split Merge Coins',
                      'Bulk Transfer',
                  ].includes(e.label),
              )
              .map((e, index) => ({ ...e, value: index, group: '' }));
</script>

<main>
    <header class="app-header">
        <div class="header-row">
            <div class="warning-banner">Experimental website, use at your own risk.</div>
            <div class="header-controls">
                <Options />
                <div class="pro-toggle">
                    <button class="pro-mode-btn" onclick={() => ($isProMode = !$isProMode)}>
                        {$isProMode ? 'Disable Pro Mode' : 'Enable Pro Mode'}
                    </button>
                </div>
            </div>
        </div>
    </header>

    <div class="app-content">
        <Signer />
        <Tabs
            {items}
            tabComponents={{
                '/iota-system-state': pageImports.IotaSystemState,
                '/transaction': pageImports.Transaction,
                '/object': pageImports.Object,
                '/ptbs': pageImports.PTBs,
                '/dynamic-fields': pageImports.DynamicFields,
                '/staking-rewards': pageImports.StakingRewards,
                '/delegators': pageImports.Delegators,
                '/txs-visualizer': pageImports.TxsVisualizer,
                '/multi-account-view': pageImports.MultiAccountView,
                '/accounts-list': pageImports.AccountsList,
                '/keystone': pageImports.Keystone,
                '/ledger-nano': pageImports.LedgerNano,
                '/sign': pageImports.Sign,
                '/publish-data': pageImports.PublishData,
                '/split-merge-coins': pageImports.SplitMergeCoins,
                '/programmable-transaction-block': pageImports.ProgrammableTransactionBlock,
                '/bulk-transfer': pageImports.BulkTransfer,
                '/stake': pageImports.Stake,
                '/faucet': pageImports.Faucet,
                '/converter': pageImports.Converter,
                '/text-analyzer': pageImports.TextAnalyzer,
                '/address-generation': pageImports.Ed25519AddressGeneration,
                '/iota-names': pageImports.IotaNames,
                '/candidate-stake': pageImports.CandidateStake,
                '/settings': pageImports.Settings,
                '/txs': pageImports.Txs,
                '/impressum': pageImports.Impressum,
                '/datenschutz': pageImports.Datenschutz,
                '/disclaimer': pageImports.Disclaimer,
                '/onchain-apps': pageImports.OnChainApps,
            }}
        />
    </div>

    <footer class="app-footer">
        <div class="footer-content">
            <a
                href="https://github.com/Thoralf-M/iotatools"
                target="_blank"
                rel="noopener noreferrer"
                class="github-link"
            >
                View on GitHub
            </a>
            <button class="impressum-link" onclick={() => navigateWithGlobalParams('/impressum')}
                >Impressum</button
            >
            <button
                class="datenschutz-link"
                onclick={() => navigateWithGlobalParams('/datenschutz')}>Datenschutz</button
            >
            <button class="disclaimer-link" onclick={() => navigateWithGlobalParams('/disclaimer')}
                >Disclaimer</button
            >
        </div>
    </footer>

    <DisclaimerModal />
    <MainnetTransactionConfirmation />
</main>

<style>
    main {
        min-height: 94vh;
        display: flex;
        flex-direction: column;
        position: relative;
        width: 100%;
    }

    .app-header {
        margin-bottom: 0.5rem;
    }

    .header-row {
        display: flex;
        align-items: center;
    }

    .header-controls {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 0;
    }

    .warning-banner {
        color: rgba(255, 255, 255, 0.7);
        font-weight: 400;
        font-size: 0.85rem;
        flex: 0 0 auto;
        text-align: left;
        max-width: 25%;
    }

    .pro-toggle {
        display: flex;
        align-items: center;
        margin-right: 0;
    }

    .pro-mode-btn {
        padding: 0.4rem 0.8rem;
        margin-left: 0.5rem;
        border: 1px solid transparent;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.75rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        white-space: nowrap;
        background: rgba(55, 65, 81, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        height: 32px;
    }

    .pro-mode-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(16, 185, 129, 0.2);
    }

    .app-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .app-footer {
        margin-top: 2rem;
        padding-top: 2rem;
    }

    .footer-content {
        text-align: center;
    }

    .footer-content {
        display: flex;
        gap: 1rem;
        justify-content: center;
        align-items: center;
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
    }

    .github-link:hover {
        background: rgba(59, 130, 246, 0.1);
        border-color: rgba(59, 130, 246, 0.3);
        color: rgba(255, 255, 255, 0.95);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
    }

    .impressum-link {
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;
    }

    .impressum-link:hover {
        color: rgba(255, 255, 255, 0.95);
    }

    .datenschutz-link {
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;
    }

    .datenschutz-link:hover {
        color: rgba(255, 255, 255, 0.95);
    }

    .disclaimer-link {
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;
    }

    .disclaimer-link:hover {
        color: rgba(255, 255, 255, 0.95);
    }

    @media (max-width: 768px) {
        .header-row {
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            gap: 0.5rem;
        }

        .header-controls {
            margin-left: 0;
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }

        .pro-mode-btn {
            margin-left: 0;
        }

        .warning-banner {
            font-size: 0.8rem;
            width: 100%;
            max-width: 100%;
            margin-bottom: 0.5rem;
        }

        .github-link {
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
        }
    }
</style>
