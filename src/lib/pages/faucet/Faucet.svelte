<script lang="ts">
    import JsonToggleView from '../../components/JsonToggleView.svelte';
    import { sharedClientConfig } from '../../utils/local-storage-store';
    import { activeAddress } from '../../utils/signer-data';
    import { Address, FaucetClient, isValidIotaAddress } from '../../utils/wasm-sdk';

    let address = '0x111111111504e9350e635d65cd38ccd2c029434c6a3a480d8947a9ba6a15b215';
    let faucetUrl = 'https://faucet.testnet.iota.cafe/gas';
    let value: any = {};
    let amountOfRequests = 1;
    let msBetweenRequests = 1000;

    const requestFundsLoop = async () => {
        for (let i = 0; i < amountOfRequests; i++) {
            requestFunds();
            // Just wait some time and don't await on the requestFunds function to get more requests faster
            await new Promise((resolve) => setTimeout(resolve, msBetweenRequests));
        }
    };
    const requestFunds = async () => {
        try {
            if (!isValidIotaAddress(address)) {
                throw new Error('invalid address');
            }
            const faucetClient = new FaucetClient(faucetUrl);
            const response = await faucetClient.request(Address.fromHex(address));
            console.log(response);
            value = response;
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    };
</script>

<main>
    <button
        on:click={() => {
            address = $activeAddress;
            faucetUrl =
                $sharedClientConfig.networks.find(
                    (network) => network.name === $sharedClientConfig.selected,
                )?.faucet ?? 'http://127.0.0.1:9123/gas';
        }}
    >
        Set to current network and active address
    </button>
    <br />
    <span>
        faucet URL:
        <input
            type="string"
            list="faucetUrls"
            class="faucet-input"
            bind:value={faucetUrl}
            placeholder="faucet URL, like http://127.0.0.1:9123/gas"
        />
        <datalist id="faucetUrls">
            {#each $sharedClientConfig.networks as network}
                <option value={network.faucet}>{network.name} </option>
            {/each}
        </datalist>
    </span>
    <br />
    <span>
        address:
        <input bind:value={address} placeholder="address" class="address-input" />
    </span>
    <br />
    <span>
        amount of requests:
        <input type="number" bind:value={amountOfRequests} placeholder="1" size="4" />
    </span>
    <span>
        milliseconds between requests:
        <input
            type="number"
            bind:value={msBetweenRequests}
            placeholder="1000"
            style="width: 7rem;"
        />
    </span>
    <br />

    <button on:click={() => requestFundsLoop()}> Request funds </button>

    <JsonToggleView {value} />
</main>

<style>
    button {
        margin: 0.5rem;
    }

    .faucet-input,
    .address-input {
        max-width: 100%;
        box-sizing: border-box;
        width: 100%;
    }

    @media (min-width: 769px) {
        .faucet-input {
            width: 60ch;
        }
        .address-input {
            width: 67ch;
        }
    }
</style>
