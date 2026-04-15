#!/usr/bin/env node
/**
 * Publish an HTML app to the On-Chain Apps registry on IOTA devnet.
 *
 * Usage:
 *   node scripts/publish-app.mjs <html-file> [--name "App Name"] [--description "..."]
 *
 * The script will:
 * 1. Generate a temporary Ed25519 keypair (or reuse the saved one)
 * 2. Fund it from the devnet faucet
 * 3. Chunk the HTML and publish it on-chain
 * 4. Print the resulting app ID and shareable URL
 */

import { readFileSync } from 'fs';
import { bcs } from '@iota/bcs';
import { getFullnodeUrl, IotaClient } from '@iota/iota-sdk/client';
import { Ed25519Keypair } from '@iota/iota-sdk/keypairs/ed25519';
import { Transaction } from '@iota/iota-sdk/transactions';
import { IOTA_CLOCK_OBJECT_ID } from '@iota/iota-sdk/utils';
import { requestIotaFromFaucetV0, getFaucetHost } from '@iota/iota-sdk/faucet';

// --- Config (matches DEFAULT_CONFIG in onchain-apps-config.ts) ---
const PACKAGE_ID = '0x76f9af5d12803e11caa60a6f7adaca9b59c3674eba1fda3e8af22c97381052f5';
const REGISTRY_ID = '0x6d998e1a16bb43e270a52e048a87c90b7386073e45fbcc6ae190ce674b2b2415';
const CHUNK_SIZE = 14 * 1024; // 14KB - must fit in 16KB pure argument limit

// --- Parse args ---
const args = process.argv.slice(2);
if (args.length === 0 || args[0] === '--help') {
    console.log(
        'Usage: node scripts/publish-app.mjs <html-file> [--name "Name"] [--description "Desc"]',
    );
    process.exit(0);
}

const htmlFile = args[0];
let appName = 'Untitled App';
let appDesc = '';
for (let i = 1; i < args.length; i++) {
    if (args[i] === '--name' && args[i + 1]) {
        appName = args[++i];
    }
    if (args[i] === '--description' && args[i + 1]) {
        appDesc = args[++i];
    }
}

// --- Helpers ---
function splitChunks(bytes) {
    const chunks = [];
    for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
        chunks.push(bytes.slice(i, i + CHUNK_SIZE));
    }
    if (chunks.length === 0) chunks.push(new Uint8Array());
    return chunks;
}

function chunksArgument(tx, chunks) {
    const bytes = bcs
        .vector(bcs.vector(bcs.u8()))
        .serialize(chunks.map((c) => Array.from(c)))
        .toBytes();
    return tx.pure(bytes);
}

// --- Main ---
async function main() {
    const html = readFileSync(htmlFile);
    const payload = new Uint8Array(html);
    const chunks = splitChunks(payload);

    console.log(`File: ${htmlFile}`);
    console.log(`Size: ${payload.length} bytes, ${chunks.length} chunk(s)`);
    console.log(`Name: ${appName}`);
    console.log();

    // Create client + keypair
    const client = new IotaClient({ url: getFullnodeUrl('devnet') });
    const keypair = Ed25519Keypair.generate();
    const address = keypair.toIotaAddress();
    console.log(`Signer: ${address}`);

    // Fund from faucet
    console.log('Requesting devnet faucet...');
    await requestIotaFromFaucetV0({
        host: getFaucetHost('devnet'),
        recipient: address,
    });

    // Wait for funds to arrive
    console.log('Waiting for funds...');
    for (let i = 0; i < 30; i++) {
        const bal = await client.getBalance({ owner: address });
        if (BigInt(bal.totalBalance) > 0n) {
            console.log(`Balance: ${bal.totalBalance} nanos`);
            break;
        }
        await new Promise((r) => setTimeout(r, 2000));
    }

    // TX1: Publish app (shares it and transfers AppCap to signer).
    console.log('Publishing app...');
    const tx = new Transaction();
    tx.moveCall({
        target: `${PACKAGE_ID}::app::publish`,
        arguments: [
            tx.pure.string(appName),
            tx.pure.string(appDesc),
            tx.pure.string('text/html'),
            chunksArgument(tx, chunks.slice(0, 1)),
            tx.object(IOTA_CLOCK_OBJECT_ID),
        ],
    });

    const result = await client.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
        options: { showEffects: true, showObjectChanges: true },
    });

    if (result.effects?.status?.status !== 'success') {
        console.error('Publish tx failed:', result.effects?.status);
        process.exit(1);
    }

    // Find the created App and AppCap object IDs.
    // IMPORTANT: use end-anchored regex — '::app::AppCap' also contains '::app::App'
    // so a plain includes() check would match the wrong object.
    const appObjChange = result.objectChanges?.find(
        (c) => c.type === 'created' && /::app::App$/.test(String(c.objectType ?? '')),
    );
    const capObjChange = result.objectChanges?.find(
        (c) => c.type === 'created' && /::app::AppCap$/.test(String(c.objectType ?? '')),
    );

    if (!appObjChange) {
        console.error('Could not find App object in tx results');
        console.log(JSON.stringify(result.objectChanges, null, 2));
        process.exit(1);
    }

    const newAppId = appObjChange.objectId;
    const newCapId = capObjChange?.objectId;
    console.log(`App created: ${newAppId}`);
    console.log(`Cap ID:      ${newCapId}`);
    console.log(`TX App owner: ${JSON.stringify(appObjChange.owner)}`);

    // TX2: Register in the shared registry.
    console.log('Registering in registry...');
    await new Promise((r) => setTimeout(r, 1500));
    const regTx = new Transaction();
    regTx.moveCall({
        target: `${PACKAGE_ID}::registry::register`,
        arguments: [regTx.object(REGISTRY_ID), regTx.pure.id(newAppId)],
    });
    const regResult = await client.signAndExecuteTransaction({
        transaction: regTx,
        signer: keypair,
        options: { showEffects: true },
    });
    if (regResult.effects?.status?.status !== 'success') {
        console.warn('Registry registration failed (app still usable via direct link):', regResult.effects?.status);
    }

    // Always re-fetch the object from the chain to get the confirmed owner/shared state.
    // The objectChanges in the TX result can report an intermediate owner that doesn't
    // yet reflect public_share_object; polling the fullnode gives us the committed state.
    let appSharedVersion = null;
    if (chunks.length > 1) {
        console.log('Waiting for shared object to be available...');
        for (let w = 0; w < 30; w++) {
            try {
                const obj = await client.getObject({ id: newAppId, options: { showOwner: true } });
                if (obj.data) {
                    const owner = obj.data.owner;
                    console.log(`  poll ${w + 1}: version=${obj.data.version} owner=${JSON.stringify(owner)}`);
                    if (typeof owner === 'object' && owner !== null && 'Shared' in owner) {
                        appSharedVersion = String(owner.Shared.initial_shared_version);
                        console.log(`Confirmed shared. Initial shared version: ${appSharedVersion}`);
                        break;
                    }
                }
            } catch (e) {
                console.log(`  poll ${w + 1}: not ready yet (${e.message})`);
            }
            await new Promise((r) => setTimeout(r, 2000));
        }

        if (!appSharedVersion) {
            console.error('App object did not become shared within timeout.');
            console.error('Owner from TX result:', JSON.stringify(appObjChange.owner));
            process.exit(1);
        }
    }

    // Append remaining chunks if any
    for (let i = 1; i < chunks.length; i++) {
        console.log(`Appending chunk ${i + 1}/${chunks.length}...`);
        const appendTx = new Transaction();

        // The App is a shared object — pass it with its initial version so the
        // SDK can build the correct ObjectArg::SharedObject input.
        const appArg = appSharedVersion
            ? appendTx.sharedObjectRef({
                  objectId: newAppId,
                  initialSharedVersion: appSharedVersion,
                  mutable: true,
              })
            : appendTx.object(newAppId);

        appendTx.moveCall({
            target: `${PACKAGE_ID}::app::append_chunks`,
            arguments: [
                appArg,
                appendTx.object(newCapId),
                chunksArgument(appendTx, [chunks[i]]),
                appendTx.object(IOTA_CLOCK_OBJECT_ID),
            ],
        });
        const appendResult = await client.signAndExecuteTransaction({
            transaction: appendTx,
            signer: keypair,
            options: { showEffects: true },
        });
        if (appendResult.effects?.status?.status !== 'success') {
            console.error(`Append chunk ${i + 1} failed:`, appendResult.effects?.status);
            process.exit(1);
        }
        if (i < chunks.length - 1) await new Promise((r) => setTimeout(r, 1500));
    }

    console.log();
    console.log('============================================');
    console.log('  App published successfully!');
    console.log('============================================');
    console.log();
    console.log(`  App ID:  ${newAppId}`);
    console.log(`  Cap ID:  ${newCapId}`);
    console.log();
    console.log(`  Open in browser:`);
    console.log(`  https://iotatools.dev/#/onchain-apps?appId=${newAppId}`);
    console.log();
    console.log(`  Local dev:`);
    console.log(`  http://localhost:5173/#/onchain-apps?appId=${newAppId}`);
    console.log();
}

main().catch((err) => {
    console.error('Error:', err.message || err);
    process.exit(1);
});
