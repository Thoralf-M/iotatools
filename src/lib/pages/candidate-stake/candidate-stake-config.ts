import { getSelectedNetworkConfig } from '../../utils/client';

const DEVNET_PACKAGE_ID = '0x5b8e73954c18a0d743e967de27e588ddcae6b7d060098e7a2e55c5d269cf76c1';
const TESTNET_PACKAGE_ID = '0xfc65701aeba619e4c1e33c58738874fd76330e8a50cf6a7d34626d198407c653';
const MAINNET_PACKAGE_ID = '0x82db91a26597e11d40afcbee6e71d2d7816de6513fe3a95d9e56bea0aca59f04';

export function getCandidateStakePackageId(): string {
    const network = getSelectedNetworkConfig();
    switch (network.name) {
        case 'mainnet':
            return MAINNET_PACKAGE_ID;
        case 'testnet':
            return TESTNET_PACKAGE_ID;
        case 'devnet':
            return DEVNET_PACKAGE_ID;
        default:
            return '';
    }
}

export function getGraphqlUrl(): string {
    const network = getSelectedNetworkConfig();
    return network.graphql;
}
