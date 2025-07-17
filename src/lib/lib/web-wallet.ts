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
        iota_wallets.set(
            getWallets()
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
                ),
        );

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

export const connectWallet = async () => {
    get_wallets();
    // @ts-ignore
    let connectResult = await get(iota_wallets)[0].connect();
    console.log('web wallet connectResult', connectResult);
    iota_accounts.set(connectResult.accounts);
    activeAddress.set(connectResult.accounts[0].address);
};
