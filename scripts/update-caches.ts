#!/usr/bin/env node

// npx tsx scripts/update-caches.ts --all
// Mock localStorage for Node.js environment - must be set before any imports
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { defaultClientConfig } from '../src/lib/lib/default-client-config.js';
import {
    updateExchangeRatesCache,
    updateTimestampsCache,
} from '../src/lib/lib/staking-rewards/graphql-requests.js';
import { updatePricesCache } from '../src/lib/lib/staking-rewards/price-fetching.js';

global.localStorage = {
    getItem: (key) => {
        if (key === 'iota-tools-client-config') {
            return JSON.stringify({
                selected: 'mainnet',
                networks: [
                    {
                        name: 'mainnet',
                        node: 'https://api.mainnet.iota.cafe',
                        graphql: 'https://graphql.mainnet.iota.cafe',
                        faucet: 'https://faucet.mainnet.iota.cafe',
                        explorer: 'https://explorer.iota.org',
                    },
                ],
            });
        }
        return null;
    },
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    get length() {
        return 0;
    },
    key: () => null,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.join(__dirname, '..', 'src', 'lib', 'lib', 'staking-rewards', 'cache');
const EXCHANGE_RATE_CACHE_FILE = path.join(CACHE_DIR, 'exchange-rate-cache.json');
const PRICES_CACHE_FILE = path.join(CACHE_DIR, 'iota-prices-coingecko.json');
const TIMESTAMPS_CACHE_FILE = path.join(CACHE_DIR, 'mainnet-epoch-timestamps-cache.json');

const args = process.argv.slice(2);
const options = {
    exchangeRates: args.includes('--exchange-rates') || args.includes('--all') || args.length === 0,
    prices: args.includes('--prices') || args.includes('--all') || args.length === 0,
    timestamps: args.includes('--timestamps') || args.includes('--all') || args.length === 0,
    network: 'mainnet',
    help: args.includes('--help'),
};

const networkIndex = args.indexOf('--network');
if (networkIndex !== -1 && networkIndex + 1 < args.length) {
    options.network = args[networkIndex + 1];
}

if (options.help) {
    console.log(`
Cache Update Script

Updates the staking rewards cache files.

Usage: npx tsx scripts/update-caches.ts [options]

Options:
  --exchange-rates   Update exchange rates cache
  --prices           Update prices cache
  --timestamps       Update timestamps cache
  --all              Update all caches (default)
  --network <name>   Network to use (default: mainnet)
  --help             Show this help

Examples:
  npx tsx scripts/update-caches.ts --all
  npx tsx scripts/update-caches.ts --exchange-rates --prices
  npx tsx scripts/update-caches.ts --network testnet --timestamps
`);
    process.exit(0);
}

console.log('Starting cache update script...');
console.log('⚠️  WARNING: Price fetching uses CoinGecko free tier which has strict rate limits.');
console.log('   This may take several minutes per missing date. Use --help for options.');
console.log('Options:', options);

defaultClientConfig.selected = options.network;
console.log(`Using network: ${options.network}`);

async function main() {
    try {
        if (!fs.existsSync(CACHE_DIR)) {
            fs.mkdirSync(CACHE_DIR, { recursive: true });
        }

        const tasks = [];

        if (options.exchangeRates) {
            tasks.push(
                updateExchangeRatesCache().then(async () => {
                    const module =
                        await import('../src/lib/lib/staking-rewards/graphql-requests.js');
                    const cacheArray = Array.from(module.exchangeRateCache.values());
                    fs.writeFileSync(EXCHANGE_RATE_CACHE_FILE, JSON.stringify(cacheArray, null, 4));
                    console.log(
                        `✅ Exchange rates cache saved to file with ${cacheArray.length} pools`,
                    );

                    // Convert to binary format
                    console.log('Converting exchange rates cache to binary format...');
                    const { spawn } = await import('child_process');
                    const convertProcess = spawn(
                        'npx',
                        [
                            'tsx',
                            'src/lib/lib/staking-rewards/cache/convert-cache.ts',
                            EXCHANGE_RATE_CACHE_FILE,
                            EXCHANGE_RATE_CACHE_FILE.replace('.json', '.bin'),
                        ],
                        {
                            stdio: 'inherit',
                            cwd: process.cwd(),
                        },
                    );

                    return new Promise((resolve, reject) => {
                        convertProcess.on('close', (code) => {
                            if (code === 0) {
                                console.log('✅ Exchange rates cache converted to binary format');
                                resolve(void 0);
                            } else {
                                reject(new Error(`Conversion failed with code ${code}`));
                            }
                        });
                        convertProcess.on('error', reject);
                    });
                }),
            );
        }

        if (options.prices) {
            let existingPricesCache = {};
            if (fs.existsSync(PRICES_CACHE_FILE)) {
                try {
                    existingPricesCache = JSON.parse(fs.readFileSync(PRICES_CACHE_FILE, 'utf8'));
                    console.log(
                        `Loaded existing prices cache with ${Object.keys(existingPricesCache).length} dates`,
                    );
                } catch (e) {
                    console.warn('Failed to load existing prices cache, starting fresh:', e);
                }
            }

            tasks.push(
                updatePricesCache(existingPricesCache).then((pricesCache) => {
                    fs.writeFileSync(PRICES_CACHE_FILE, JSON.stringify(pricesCache, null, 4));
                    const newEntries =
                        Object.keys(pricesCache).length - Object.keys(existingPricesCache).length;
                    console.log(
                        `✅ Prices cache saved to file with ${Object.keys(pricesCache).length} dates (${newEntries > 0 ? newEntries + ' new' : 'no new entries'})`,
                    );
                }),
            );
        }

        if (options.timestamps) {
            let existingTimestampsCache = {};
            if (fs.existsSync(TIMESTAMPS_CACHE_FILE)) {
                try {
                    existingTimestampsCache = JSON.parse(
                        fs.readFileSync(TIMESTAMPS_CACHE_FILE, 'utf8'),
                    );
                    console.log(
                        `Loaded existing timestamps cache with ${Object.keys(existingTimestampsCache).length} epochs`,
                    );
                } catch (e) {
                    console.warn('Failed to load existing timestamps cache, starting fresh:', e);
                }
            }

            tasks.push(
                updateTimestampsCache(existingTimestampsCache).then((timestamps) => {
                    fs.writeFileSync(TIMESTAMPS_CACHE_FILE, JSON.stringify(timestamps, null, 4));
                    const newEntries =
                        Object.keys(timestamps).length -
                        Object.keys(existingTimestampsCache).length;
                    console.log(
                        `✅ Timestamps cache saved to file with ${Object.keys(timestamps).length} epochs (${newEntries > 0 ? newEntries + ' new' : 'no new entries'})`,
                    );
                }),
            );
        }

        await Promise.all(tasks);
        console.log('\n🎉 All cache updates completed successfully!');
    } catch (error) {
        console.error('\n💥 Cache update failed:', error);
        process.exit(1);
    }
}

main();
