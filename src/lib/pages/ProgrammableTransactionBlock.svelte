<script lang="ts">
    import { javascript } from '@codemirror/lang-javascript';
    import { Transaction } from '@iota/iota-sdk/transactions';
    import { githubDark } from '@uiw/codemirror-theme-github';
    import { basicSetup, EditorView } from 'codemirror';
    import { onMount } from 'svelte';

    import TransactionView from '../components/TransactionView.svelte';
    import { getClient, getSelectedChain } from '../lib/client';
    import { activeAddress, iota_wallets } from '../lib/signer-data';

    interface CodeSnippets {
        selected: string;
        snippets: CodeSnippet[];
    }
    interface CodeSnippet {
        name: string;
        code: string;
    }

    let codeSnippets: CodeSnippets = $state(
        JSON.parse(localStorage.getItem('codeSnippets')!) || {
            selected: 'example',
            snippets: [
                {
                    name: 'example',
                    code: `let tx = new Transaction();
// Build you tx here...

 const transfers = [
     { address: '0x9938c94f4118153bbed08f14ae74e2557172542f59bf0b7a306e99d5a0b0896e', amount: 1_000_000 },
     { address: '0x9938c94f4118153bbed08f14ae74e2557172542f59bf0b7a306e99d5a0b0896e', amount: 1_000_000 }];
 // first, split the gas coin into multiple coins
 const coins = tx.splitCoins(
     tx.gas,
     transfers.map((transfer) => transfer.amount),
 );
 // next, create a transfer transaction for each coin
 transfers.forEach((transfer, index) => {
     tx.transferObjects([coins[index]], transfer.address);
 })

// Client is also in scope
// const senderCoins = await client.getCoins({ owner: "0xee68634fb93502ec391e78ccc94568e9e179ef8ec37fe12daaac4d2c2af32d5c", limit: 10 });
// console.log(senderCoins) // visible in the browser console
`,
                },
                {
                    name: 'burn stardust NFT',
                    code: `let tx = new Transaction();

tx.moveCall({
   target: "0x107a::nft::destroy",
   arguments: [
     tx.object("0x0000_your_stardust_NFT_object_id_here")
   ]
});
`,
                },
            ],
        },
    );

    function saveCodeSnippetsToLocalstorage() {
        localStorage.setItem('codeSnippets', JSON.stringify(codeSnippets));
    }

    let codeEditor: HTMLDivElement;
    let codeEditorPreview: HTMLDivElement;
    let codeEditorView: EditorView;
    let codeEditorPreviewView: EditorView;
    function createEditor(parent: HTMLDivElement) {
        return new EditorView({
            doc: activeCode,
            extensions: [
                basicSetup,
                javascript(),
                githubDark,
                EditorView.updateListener.of((v: any) => {
                    if (v.docChanged) {
                        // TODO: store index extra so this find isn't needed?
                        let index = codeSnippets.snippets.findIndex(
                            (e) => e.name == codeSnippets.selected,
                        );
                        codeSnippets.snippets[index].code = codeEditorView.state.doc.toString();
                        saveCodeSnippetsToLocalstorage();
                    }
                }),
            ],
            parent: parent,
        });
    }
    onMount(() => {
        codeEditorView = createEditor(codeEditor);
        codeEditorPreviewView = createEditor(codeEditorPreview);
    });

    // Will be updated with the result
    let value = $state({});

    async function devInspect() {
        try {
            let tx = (await buildTransaction())!;
            console.log('devInspect', tx);
            let client = getClient();
            const devInspectResult = await client.devInspectTransactionBlock({
                sender:
                    $activeAddress ||
                    '0x0000000000000000000000000000000000000000000000000000000000000000',
                transactionBlock: tx,
            });
            console.log(devInspectResult);
            value = devInspectResult;
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }

    async function dryRun() {
        try {
            let tx = (await buildTransaction())!;
            console.log('dryRun', tx);
            let client = getClient();
            tx.setSender(
                $activeAddress ||
                    '0x0000000000000000000000000000000000000000000000000000000000000000',
            );
            const bytes = await tx.build({ client });
            const dryRunResult = await client.dryRunTransactionBlock({
                transactionBlock: bytes,
            });
            console.log(dryRunResult);
            value = dryRunResult;
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }

    async function execute() {
        try {
            let tx = (await buildTransaction())!;
            console.log('execute', tx);
            let txResult = await $iota_wallets[0].signAndExecuteTransaction({
                transaction: tx,
                options: {
                    showEffects: true,
                    showObjectChanges: true,
                    showBalanceChanges: true,
                },
                account: { address: $activeAddress },
                // @ts-ignore
                chain: getSelectedChain(),
            });
            console.log(txResult);
            value = txResult;
        } catch (err: any) {
            value = err.toString();
            console.error(err);
        }
    }

    let activeCode = $state(
        codeSnippets.snippets.find((e) => e.name == codeSnippets.selected)?.code || '',
    );

    async function buildTransaction(): Promise<Transaction | undefined> {
        try {
            activeCode = codeEditorView.state.doc.toString();
            // Scope is required to make the Transaction class available
            const client = getClient();
            const scope = { Transaction, client };
            return new Function(
                'scope',
                `with(scope) {
                return (async function() {
                    try {
                        ${activeCode}
                        return tx
                    } catch (error) {
                        alert('Error in code: ' + error.message);
                    }
                })()
                }`,
            )(scope);
        } catch (error: any) {
            alert('Error in code: ' + error.message);
        }
    }

    let inputCodeSnippetName = $state('');
    let showPreview = $state(false);
    function replaceCode(codeSnippetName: string) {
        activeCode = codeSnippets.snippets.find((e) => e.name == codeSnippetName)!.code;
        codeSnippets.selected = codeSnippetName;
        saveCodeSnippetsToLocalstorage();
        codeEditorView.dispatch({
            changes: {
                from: 0,
                to: codeEditorView.state.doc.length,
                insert: activeCode,
            },
        });
    }
    function addCodeSnippet() {
        if (inputCodeSnippetName.length == 0) {
            inputCodeSnippetName = codeSnippets.snippets.length.toString();
        }
        let existingIndex = codeSnippets.snippets.findIndex((e) => e.name == inputCodeSnippetName);
        if (existingIndex > -1) {
            value = 'Name already exists';
            throw 'Name already exists';
        }
        codeSnippets.snippets.push({
            name: inputCodeSnippetName,
            code: codeEditorView.state.doc.toString(),
        });
        codeSnippets.selected = inputCodeSnippetName;
        inputCodeSnippetName = '';
        saveCodeSnippetsToLocalstorage();
    }
    function renameCodeSnippet() {
        if (inputCodeSnippetName.length == 0) {
            alert!('insert a new name first');
        } else {
            let existingIndex = codeSnippets.snippets.findIndex(
                (e) => e.name == inputCodeSnippetName,
            );
            if (existingIndex > -1) {
                value = 'Name already exists';
                throw 'Name already exists';
            }
            let index = codeSnippets.snippets.findIndex((e) => e.name == codeSnippets.selected);
            codeSnippets.snippets[index].name = inputCodeSnippetName;
            codeSnippets.selected = inputCodeSnippetName;
            inputCodeSnippetName = '';
            saveCodeSnippetsToLocalstorage();
        }
    }
    function deleteCodeSnippet() {
        if (inputCodeSnippetName.length == 0) {
            alert!('insert a name to delete first');
        } else {
            if (codeSnippets.snippets.length == 1) {
                value = 'at least one code snippet is required';
                throw new Error('at least one code snippet is required');
            }
            let index = codeSnippets.snippets.findIndex((e) => e.name == inputCodeSnippetName);
            if (index > -1) {
                codeSnippets.snippets.splice(index, 1);
                saveCodeSnippetsToLocalstorage();
                if (inputCodeSnippetName == codeSnippets.selected) {
                    codeSnippets.selected = codeSnippets.snippets[0].name || 'default';
                }
            }
        }
    }
</script>

<main>
    <div>
        <div class="codeSnippet-selection" style="float: left; padding-right: 1em;">
            <div style="float: left; display:flexbox">
                <button onclick={addCodeSnippet}> new </button>
                <button onclick={renameCodeSnippet}> rename </button>
                <button onclick={deleteCodeSnippet}> delete </button>
            </div>
            <br />
            Name:
            <input bind:value={inputCodeSnippetName} placeholder="string" size="15" />
            <div style="border: 1px solid #dee2e6; ">
                {#each codeSnippets.snippets as codeSnippet}
                    <div class={codeSnippets.selected == codeSnippet.name ? 'active' : ''}>
                        <button
                            onclick={() => replaceCode(codeSnippet.name)}
                            onmouseover={() => {
                                showPreview = true;
                                codeEditorPreviewView.dispatch({
                                    changes: {
                                        from: 0,
                                        to: codeEditorPreviewView.state.doc.length,
                                        insert: codeSnippet.code,
                                    },
                                });
                            }}
                            onmouseout={() => {
                                showPreview = false;
                            }}
                            onfocus={() => {}}
                            onblur={() => {}}
                        >
                            {codeSnippet.name}
                        </button>
                    </div>
                {/each}
            </div>
        </div>
        <div hidden={showPreview}>
            <div class="codemirror-wrapper" bind:this={codeEditor}></div>
        </div>
        <div hidden={!showPreview}>
            <div class="codemirror-wrapper" bind:this={codeEditorPreview}></div>
        </div>
    </div>

    <button onclick={devInspect}> dev inspect </button>
    <button onclick={dryRun}> dry run </button>
    <button onclick={execute}> execute </button>

    <TransactionView {value} />
</main>

<style>
    button {
        margin: 0.2rem;
    }
    .codemirror-wrapper {
        text-align: left;
    }
    div.active > button {
        background-color: #525252;
        border-color: #c3c3c3;
    }
</style>
