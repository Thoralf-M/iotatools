import { getWallets, isWalletWithRequiredFeatureSet } from '@iota/wallet-standard';
import { get } from 'svelte/store';

import { activeAddress, iota_accounts, iota_wallets } from './signer-data';

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
    return get(iota_wallets)[0];
};

// If silent is true, it will only try to connect without prompting the user
export const connectWallet = async (silent: boolean) => {
    get_wallets();
    if (get(iota_wallets).length == 0) {
        // wait a bit for the extension to load and try again
        await new Promise((resolve) => setTimeout(resolve, 300));
        get_wallets();
    }

    let connectResult = await get(iota_wallets)[0].connect({ silent: true });

    if (silent && connectResult.accounts && connectResult.accounts.length == 0) {
        return;
    }

    if (connectResult.accounts && connectResult.accounts.length == 0) {
        connectResult = await get(iota_wallets)[0].connect({ silent: false });
    }
    console.log('Web wallet accounts:', connectResult);
    iota_accounts.set(connectResult.accounts);
    activeAddress.set(connectResult.accounts[0].address);
};
