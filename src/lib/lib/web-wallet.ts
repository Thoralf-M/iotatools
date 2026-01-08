import { getWallets, isWalletWithRequiredFeatureSet } from '@iota/wallet-standard';
import type { WalletAccount } from '@iota/wallet-standard';
import { get, writable } from 'svelte/store';

import { sharedSelectedAddress, SignerType } from './local-storage-store';
import { activeAddress, iota_accounts, iota_wallets } from './signer-data';

// Store for the selected wallet index
let selectedWalletIndex = writable<number>(0);

const features = {
    CONNECT: 'standard:connect',
    EVENTS: 'standard:events',
    SIGN_AND_EXECUTE_TRANSACTION: 'iota:signAndExecuteTransaction',
    SIGN_PERSONAL_MESSAGE: 'iota:signPersonalMessage',
    SIGN_TRANSACTION: 'iota:signTransaction',
};

function get_wallets() {
    try {
        let iotaWallets = getWallets()
            .get()
            .filter((wallet) => {
                const raw_features = Object.values(features);
                // console.log(wallet);
                let isWalletWithRequired = isWalletWithRequiredFeatureSet(wallet, raw_features);
                // console.log(
                //     "isWalletWithRequiredFeatureSet",
                //     isWalletWithRequired,
                // );
                return isWalletWithRequired;
            })
            .map(
                ({
                    accounts,
                    chains,
                    features: {
                        // @ts-ignore
                        [features.CONNECT]: { connect },
                        // @ts-ignore
                        [features.EVENTS]: { on },
                        // @ts-ignore
                        [features.SIGN_AND_EXECUTE_TRANSACTION]: { signAndExecuteTransaction },
                        // @ts-ignore
                        [features.SIGN_PERSONAL_MESSAGE]: { signPersonalMessage },
                        // @ts-ignore
                        [features.SIGN_TRANSACTION]: {
                            // @ts-ignore
                            signTransaction,
                        },
                    },
                    icon,
                    name,
                    version,
                }) => {
                    return {
                        accounts,
                        chains,
                        icon,
                        name,
                        version,
                        connect,
                        on,
                        signAndExecuteTransaction,
                        signPersonalMessage,
                        signTransaction,
                        features,
                    };
                },
            );
        // iotaWallets[0].on('*', (event: any, second: any) => {
        //     console.log('Wallet event:', event, second);
        // });
        console.log('Web wallets found:', iotaWallets);
        iota_wallets.set(iotaWallets);

        // @ts-ignore
        if (iota_wallets.length == 0) {
            throw new Error('no web wallet found');
        }
    } catch (err) {
        console.error(err);
    }
}

export const getActiveWallet = () => {
    const wallets = get(iota_wallets);
    const index = get(selectedWalletIndex);
    return wallets[index] || wallets[0];
};

export const setSelectedWallet = (index: number) => {
    selectedWalletIndex.set(index);
    // Persist the selected wallet name for future sessions
    const wallets = get(iota_wallets);
    if (wallets[index]) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('selectedWalletName', wallets[index].name);
        }
    }
};

// If silent is true, it will only try to connect without prompting the user
export const connectWallet = async (silent: boolean) => {
    get_wallets();
    if (get(iota_wallets).length == 0) {
        // wait a bit for the extension to load and try again
        await new Promise((resolve) => setTimeout(resolve, 300));
        get_wallets();
    }

    // Restore previously selected wallet if available
    if (typeof localStorage !== 'undefined') {
        const savedWalletName = localStorage.getItem('selectedWalletName');
        if (savedWalletName) {
            const wallets = get(iota_wallets);
            const savedIndex = wallets.findIndex((w) => w.name === savedWalletName);
            if (savedIndex >= 0) {
                selectedWalletIndex.set(savedIndex);
            }
        }
    }

    const wallet = getActiveWallet();
    if (!wallet) {
        console.error('No wallet available');
        return;
    }

    let connectResult = await wallet.connect({ silent: true });

    if (silent && connectResult.accounts && connectResult.accounts.length == 0) {
        return;
    }

    if (connectResult.accounts && connectResult.accounts.length == 0) {
        connectResult = await wallet.connect({ silent: false });
    }
    console.log('Web wallet accounts:', connectResult);
    iota_accounts.set(connectResult.accounts);
    const currentActive = get(activeAddress);
    const accountAddresses = connectResult.accounts.map((a: WalletAccount) => a.address);
    const persisted = get(sharedSelectedAddress)[SignerType.WebWallet];
    let addressToUse =
        persisted && accountAddresses.includes(persisted)
            ? persisted
            : accountAddresses.includes(currentActive)
              ? currentActive
              : connectResult.accounts[0].address;
    activeAddress.set(addressToUse);
    sharedSelectedAddress.update((obj) => ({ ...obj, [SignerType.WebWallet]: addressToUse }));
};

export const disconnectWallet = () => {
    iota_accounts.set([]);
    activeAddress.set('');
    selectedWalletIndex.set(0);
};
