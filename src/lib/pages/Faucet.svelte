<script lang="ts">
    import {
        getFaucetRequestStatus,
        requestIotaFromFaucetV0,
        requestIotaFromFaucetV1,
    } from '@iota/iota-sdk/faucet';
    import { isValidIotaAddress } from '@iota/iota-sdk/utils';

    import JsonToggleView from '../components/JsonToggleView.svelte';

    let address = '0x111111111504e9350e635d65cd38ccd2c029434c6a3a480d8947a9ba6a15b215';
    let faucetUrl = 'https://faucet.testnet.iota.cafe/gas';
    let value = {};
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
            // Try batched request and switch to single request in case of an error
            try {
                var response = await requestIotaFromFaucetV1({
                    host: faucetUrl,
                    recipient: address,
                });
                // @ts-ignore
                let taskId = response.task?.taskId;

                if (error || !taskId) {
                    throw new Error(error ?? 'Failed, task id not found.');
                }

                console.log(taskId);

                var {
                    status: { status, transferred_gas_objects },
                    error,
                } = await getFaucetRequestStatus({
                    host: faucetUrl,
                    taskId,
                });

                console.log(status);
                console.log(transferred_gas_objects);

                value = transferred_gas_objects;
            } catch (e) {
                console.log(e);
                const faucetResponse = await requestIotaFromFaucetV0({
                    host: faucetUrl,
                    recipient: address,
                });
                console.log(faucetResponse);
                value = faucetResponse;
            }
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    };
</script>

<main>
    <span>
        faucet URL:
        <input
            type="string"
            list="faucetUrls"
            size="60"
            bind:value={faucetUrl}
            placeholder="faucet URL, like http://127.0.0.1:9123/gas"
        />
        <datalist id="faucetUrls">
            <option value={'http://127.0.0.1:9123/gas'}>Localnet </option>
            <option value={'https://faucet.testnet.iota.cafe/gas'}>Testnet </option>
            <option value={'https://faucet.testnet.iota.cafe/gas'}>Testnet </option>
            <option value={'https://faucet.devnet.iota.cafe/gas'}>Devnet </option>
            <option value={'https://faucet.iota-rebased-alphanet.iota.cafe/gas'}>Alphanet </option>
        </datalist>
    </span>
    <br />
    <span>
        address:
        <input bind:value={address} placeholder="address" size="67" />
    </span>
    <br />
    <span>
        amount of requests:
        <input type="number" bind:value={amountOfRequests} placeholder="1" size="4" />
    </span>
    <span>
        milliseconds between requests:
        <input type="number" bind:value={msBetweenRequests} placeholder="1000" size="4" />
    </span>
    <br />

    <button on:click={() => requestFundsLoop()}> Request funds </button>

    <JsonToggleView {value} />
</main>

<style>
    button {
        margin: 0.5rem;
    }
</style>
