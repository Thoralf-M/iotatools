/**
 * Playwright browser test for all pages in the IOTA Tools SPA.
 * Tests that each page loads without JS errors and that clickable buttons work.
 */

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const BASE_URL = 'http://localhost:5173';

const ROUTES = [
    // Info
    { label: 'IOTA System State', path: '/iota-system-state' },
    { label: 'Transaction', path: '/transaction' },
    { label: 'Object', path: '/object' },
    { label: 'PTBs', path: '/ptbs' },
    { label: 'Dynamic Fields', path: '/dynamic-fields' },
    { label: 'Staking Rewards', path: '/staking-rewards' },
    { label: 'Delegators', path: '/delegators' },
    { label: 'TXs', path: '/txs' },
    { label: 'TXs Visualizer', path: '/txs-visualizer' },
    // Wallet
    { label: 'Multi Account View', path: '/multi-account-view' },
    { label: 'Accounts List', path: '/accounts-list' },
    { label: 'Keystone', path: '/keystone' },
    { label: 'Ledger Nano', path: '/ledger-nano' },
    { label: 'Sign', path: '/sign' },
    // Transactions
    { label: 'Publish Data', path: '/publish-data' },
    { label: 'Split/Merge Coins', path: '/split-merge-coins' },
    { label: 'Programmable Transaction Block', path: '/programmable-transaction-block' },
    { label: 'Bulk Transfer', path: '/bulk-transfer' },
    { label: 'Stake', path: '/stake' },
    // Utilities
    { label: 'Faucet', path: '/faucet' },
    { label: 'Converter', path: '/converter' },
    { label: 'Text Analyzer', path: '/text-analyzer' },
    { label: 'Address Generation', path: '/address-generation' },
    // Other
    { label: 'IOTA Names', path: '/iota-names' },
    { label: 'Settings', path: '/settings' },
];

async function testPage(page, route) {
    const errors = [];
    const warnings = [];

    // Capture console errors
    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        } else if (msg.type() === 'warning' || msg.type() === 'warn') {
            warnings.push(msg.text());
        }
    });

    // Capture page errors
    page.on('pageerror', (err) => {
        errors.push(`[pageerror] ${err.message}`);
    });

    const url = `${BASE_URL}/#${route.path}`;
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });

    // Wait for Svelte to mount content
    await page.waitForTimeout(500);

    // Get page title/heading
    const heading = await page
        .$eval('h1, h2, .page-title', (el) => el?.textContent?.trim())
        .catch(() => null);

    // Find all visible, enabled buttons
    const buttons = await page.$$eval('button:not([disabled])', (btns) =>
        btns
            .map((b) => ({
                text: b.textContent?.trim() || '',
                type: b.type || 'button',
                id: b.id || '',
                class: b.className || '',
            }))
            .filter((b) => b.text.length > 0),
    );

    // Find all inputs
    const inputs = await page.$$eval('input, textarea, select', (els) =>
        els.map((el) => ({
            type: el.tagName.toLowerCase() + (el.type ? `[${el.type}]` : ''),
            placeholder: el.placeholder || '',
            id: el.id || '',
        })),
    );

    // Try clicking "safe" buttons (not submit, not dangerous)
    const clickResults = [];
    for (const btn of buttons.slice(0, 5)) {
        const text = btn.text;
        // Skip buttons that might trigger network calls or destructive actions
        const skipKeywords = [
            'submit',
            'send',
            'transfer',
            'stake',
            'publish',
            'generate',
            'sign',
            'connect',
            'disconnect',
            'faucet',
            'request',
        ];
        const shouldSkip = skipKeywords.some((k) => text.toLowerCase().includes(k));
        if (shouldSkip) {
            clickResults.push({ text, skipped: true, reason: 'potentially destructive' });
            continue;
        }

        try {
            const btnEl = await page.$(`button:not([disabled]) >> text="${text}"`);
            if (btnEl) {
                await btnEl.click({ timeout: 2000 });
                await page.waitForTimeout(300);
                clickResults.push({ text, clicked: true, errors: [] });
            }
        } catch (e) {
            clickResults.push({ text, clicked: false, error: e.message });
        }
    }

    // Filter out noise from errors (network requests to real IOTA nodes are expected to fail)
    const significantErrors = errors.filter(
        (e) =>
            !e.includes('net::ERR_') &&
            !e.includes('Failed to fetch') &&
            !e.includes('NetworkError') &&
            !e.includes('getaddrinfo') &&
            !e.includes('ECONNREFUSED') &&
            !e.includes('NS_ERROR') &&
            !e.includes('TypeError: Failed to fetch') &&
            !e.includes('Loading module') && // dynamic imports
            !e.includes('mainnet') &&
            !e.includes('testnet') &&
            !e.includes('404'),
    );

    return {
        label: route.label,
        path: route.path,
        url,
        heading,
        buttons: buttons.slice(0, 10),
        inputs: inputs.slice(0, 5),
        clickResults,
        errors: significantErrors,
        rawErrors: errors.length,
        warnings: warnings.length,
    };
}

async function run() {
    console.log('Starting Playwright browser tests...\n');

    const browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const results = [];

    for (const route of ROUTES) {
        const context = await browser.newContext();
        const page = await context.newPage();

        process.stdout.write(`Testing ${route.label} (${route.path})... `);
        try {
            const result = await testPage(page, route);
            results.push(result);
            const status = result.errors.length > 0 ? '⚠ ERRORS' : '✓';
            console.log(
                `${status} | buttons: ${result.buttons.length} | inputs: ${result.inputs.length} | console errors: ${result.rawErrors}`,
            );
        } catch (e) {
            results.push({
                label: route.label,
                path: route.path,
                errors: [`CRASH: ${e.message}`],
            });
            console.log(`✗ CRASH: ${e.message}`);
        } finally {
            await context.close();
        }
    }

    await browser.close();

    // Summary report
    console.log('\n' + '='.repeat(80));
    console.log('DETAILED RESULTS');
    console.log('='.repeat(80));

    for (const r of results) {
        console.log(`\n--- ${r.label} (${r.path}) ---`);
        if (r.heading) console.log(`  Heading: ${r.heading}`);
        if (r.buttons && r.buttons.length > 0) {
            console.log(
                `  Buttons (${r.buttons.length}): ${r.buttons.map((b) => `"${b.text}"`).join(', ')}`,
            );
        }
        if (r.inputs && r.inputs.length > 0) {
            console.log(
                `  Inputs (${r.inputs.length}): ${r.inputs.map((i) => i.type + (i.placeholder ? ` placeholder="${i.placeholder}"` : '')).join(', ')}`,
            );
        }
        if (r.clickResults && r.clickResults.length > 0) {
            const clicked = r.clickResults.filter((c) => c.clicked);
            const skipped = r.clickResults.filter((c) => c.skipped);
            if (clicked.length > 0)
                console.log(`  Clicked: ${clicked.map((c) => `"${c.text}"`).join(', ')}`);
            if (skipped.length > 0)
                console.log(`  Skipped: ${skipped.map((c) => `"${c.text}"`).join(', ')}`);
        }
        if (r.errors && r.errors.length > 0) {
            console.log(`  ERRORS:`);
            for (const err of r.errors) {
                console.log(`    - ${err}`);
            }
        }
    }

    console.log('\n' + '='.repeat(80));
    const errorPages = results.filter((r) => r.errors && r.errors.length > 0);
    console.log(
        `SUMMARY: ${results.length - errorPages.length}/${results.length} pages loaded cleanly`,
    );
    if (errorPages.length > 0) {
        console.log(`Pages with significant errors: ${errorPages.map((r) => r.label).join(', ')}`);
    }
}

run().catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
});
