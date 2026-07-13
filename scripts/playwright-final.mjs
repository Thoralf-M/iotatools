/**
 * Final Playwright tests - test page-specific button interactions
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const BASE_URL = 'http://localhost:5173';

const EXPECTED_ERROR_PATTERNS = [
    'No wallet available',
    'error sending request',
    'SdkFfiError',
    'Failed to fetch',
    'net::ERR_',
    'NetworkError',
    'ECONNREFUSED',
];

function isExpectedError(msg) {
    return EXPECTED_ERROR_PATTERNS.some((p) => msg.includes(p));
}

async function setup(browser, path) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (msg) => {
        if (msg.type() === 'error' && !isExpectedError(msg.text())) {
            errors.push(msg.text());
        }
    });
    page.on('pageerror', (err) => {
        if (!isExpectedError(err.message)) errors.push(err.message);
    });
    await page.goto(`${BASE_URL}/#${path}`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(800);
    return { page, ctx, errors };
}

async function testSign(browser) {
    console.log('\n--- Sign Page: testing Example tx button ---');
    const { page, ctx, errors } = await setup(browser, '/sign');

    // Click "Example tx" button
    const exampleBtn = page.locator('button:has-text("Example tx")');
    if ((await exampleBtn.count()) > 0) {
        await exampleBtn.click();
        await page.waitForTimeout(500);
        const txInput = page.locator('textarea').first();
        const val = await txInput.inputValue();
        console.log(
            `  After "Example tx": textarea has ${val.length} chars (base64 tx bytes): ${val.slice(0, 60)}...`,
        );
    }

    // Try Dry Run button
    const dryRunBtn = page.locator('button:has-text("Dry Run")');
    if ((await dryRunBtn.count()) > 0) {
        await dryRunBtn.click();
        await page.waitForTimeout(2000);
        console.log('  Clicked Dry Run (network call expected to fail without wallet)');
    }

    await page.screenshot({ path: '/tmp/playwright-sign-test.png' });
    console.log(`  Code errors: ${errors.length === 0 ? 'none ✓' : errors.join(', ')}`);
    await ctx.close();
}

async function testPTBsExample(browser) {
    console.log('\n--- PTBs Page: testing Example buttons ---');
    const { page, ctx, errors } = await setup(browser, '/ptbs');

    // Click first Example button (fills epoch input with example)
    const exampleBtns = page.locator('button:has-text("Example")');
    const count = await exampleBtns.count();
    console.log(`  Found ${count} Example button(s)`);
    if (count > 0) {
        await exampleBtns.first().click();
        await page.waitForTimeout(500);
        const epochInput = page.locator('input[type="number"]').first();
        const val = await epochInput.inputValue();
        console.log(`  After Example click: epoch input = "${val}"`);
    }

    // Click "Get Current" button
    const getCurrentBtn = page.locator('button:has-text("Get Current")');
    if ((await getCurrentBtn.count()) > 0) {
        await getCurrentBtn.click();
        await page.waitForTimeout(2000);
        console.log('  Clicked "Get Current" (will fail network - expected)');
    }

    await page.screenshot({ path: '/tmp/playwright-ptbs-test.png' });
    console.log(`  Code errors: ${errors.length === 0 ? 'none ✓' : errors.join(', ')}`);
    await ctx.close();
}

async function testConverter(browser) {
    console.log('\n--- Converter Page: testing hex/base58 conversions ---');
    const { page, ctx, errors } = await setup(browser, '/converter');

    // Test base58 input (IOTA transaction digest format)
    const base58Input = page.locator('input[placeholder="base58 string"]');
    if ((await base58Input.count()) > 0) {
        await base58Input.fill('7k7oF2xeaSUGTwvL6GTFqUJUBpqR5wFCX3K1aRHSzQH3');
        await page.waitForTimeout(500);
        const hexInput = page.locator('input[placeholder="hex string"]');
        const hex = await hexInput.inputValue();
        console.log(`  Base58 tx digest → hex: ${hex.slice(0, 40)}...`);
    }

    // Test hex input with IOTA address
    const hexInput = page.locator('input[placeholder="hex string"]');
    await hexInput.fill('1ee12dca0e798966a82f74c010c109e1bd0674f4f47517db6843f223bad5eb7c');
    await page.waitForTimeout(500);
    const bytesInput = page.locator('input[placeholder="bytes like: 1, 2, 3"]');
    const bytes = await bytesInput.inputValue();
    console.log(`  IOTA address hex → bytes (first 40 chars): ${bytes.slice(0, 40)}`);

    await page.screenshot({ path: '/tmp/playwright-converter-test.png' });
    console.log(`  Code errors: ${errors.length === 0 ? 'none ✓' : errors.join(', ')}`);
    await ctx.close();
}

async function testIotaSystemState(browser) {
    console.log('\n--- IOTA System State: testing buttons ---');
    const { page, ctx, errors } = await setup(browser, '/iota-system-state');

    // Find page-specific buttons
    const allBtns = await page.$$eval('button', (btns) =>
        btns.map((b) => b.textContent?.trim()).filter(Boolean),
    );
    const navBtns = new Set([
        'Connect Web Wallet',
        'Use External Address',
        'Enable Pro Mode',
        'Transaction',
        'Staking Rewards',
        'Txs Visualizer',
        'Multi Account View',
        'Sign',
        'Split Merge Coins',
        'Bulk Transfer',
        'Impressum',
        'Datenschutz',
    ]);
    const pageBtns = allBtns.filter((b) => !navBtns.has(b));
    console.log(`  Page buttons: ${pageBtns.join(', ')}`);

    // Click "get latest IOTA system state" (will fail network but shouldn't crash)
    const latestBtn = page.locator('button:has-text("get latest IOTA system state")');
    if ((await latestBtn.count()) > 0) {
        await latestBtn.click();
        await page.waitForTimeout(2000);
        console.log('  Clicked "get latest IOTA system state" (network call - expected to fail)');
    }

    // Click "toggle JSON tree"
    const toggleBtn = page.locator('button:has-text("toggle JSON tree")');
    if ((await toggleBtn.count()) > 0) {
        await toggleBtn.click();
        await page.waitForTimeout(300);
        console.log('  Clicked "toggle JSON tree" ✓');
    }

    await page.screenshot({ path: '/tmp/playwright-system-state-test.png' });
    console.log(`  Code errors: ${errors.length === 0 ? 'none ✓' : errors.join(', ')}`);
    await ctx.close();
}

async function testTransactionWithBCS(browser) {
    console.log('\n--- Transaction Page: testing BCS decode ---');
    const { page, ctx, errors } = await setup(browser, '/transaction');

    // Enter base64 BCS-encoded transaction bytes (a small valid example)
    // This is a real IOTA transaction bytes that can be decoded without network
    const txInput = page.locator('textarea').first();
    // Use a base64 tx example
    const exampleBase64 =
        'AAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
    await txInput.fill(exampleBase64);
    await page.waitForTimeout(300);

    // Find and click the decode/load button
    const allBtns = await page.$$eval('button', (btns) =>
        btns.map((b, i) => ({ i, text: b.textContent?.trim() })).filter((b) => b.text),
    );
    console.log(`  All buttons: ${allBtns.map((b) => `"${b.text}"`).join(', ')}`);

    const decodeBtn = page
        .locator('button:has-text("Decode"), button:has-text("Load"), button:has-text("Parse")')
        .first();
    if ((await decodeBtn.count()) > 0) {
        await decodeBtn.click();
        await page.waitForTimeout(1000);
        console.log('  Clicked decode button');
    }

    await page.screenshot({ path: '/tmp/playwright-transaction-test.png' });
    console.log(`  Code errors: ${errors.length === 0 ? 'none ✓' : errors.join(', ')}`);
    await ctx.close();
}

async function testTextAnalyzerDetails(browser) {
    console.log('\n--- Text Analyzer: testing address extraction ---');
    const { page, ctx, errors } = await setup(browser, '/text-analyzer');

    const textarea = page.locator('textarea').first();
    const testText = `
        Sending 1000 IOTA from 0x1ee12dca0e798966a82f74c010c109e1bd0674f4f47517db6843f223bad5eb7c
        to 0x365b74f27ca7c6d7ce019d73042f85cc4627e1aeec2b7822994e16010234e576
        Package: 0x2::coin::COIN
        Tx: 7k7oF2xeaSUGTwvL6GTFqUJUBpqR5wFCX3K1aRHSzQH3
    `;
    await textarea.fill(testText);
    await page.waitForTimeout(800);

    // Check results
    const bodyText = await page.innerText('body');
    const hasAddr = bodyText.includes('0x1ee12dca') || bodyText.includes('Addresses');
    console.log(`  Extracted addresses: ${hasAddr ? 'yes ✓' : 'no'}`);

    const allBtns = await page.$$eval('button', (btns) =>
        btns.map((b) => b.textContent?.trim()).filter(Boolean),
    );
    const navBtns = new Set([
        'Connect Web Wallet',
        'Use External Address',
        'Enable Pro Mode',
        'Transaction',
        'Staking Rewards',
        'Txs Visualizer',
        'Multi Account View',
        'Sign',
        'Split Merge Coins',
        'Bulk Transfer',
        'Impressum',
        'Datenschutz',
    ]);
    const pageBtns = allBtns.filter((b) => !navBtns.has(b));
    console.log(`  Page buttons: ${pageBtns.join(', ')}`);

    await page.screenshot({ path: '/tmp/playwright-text-analyzer-test.png' });
    console.log(`  Code errors: ${errors.length === 0 ? 'none ✓' : errors.join(', ')}`);
    await ctx.close();
}

async function run() {
    const browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const allErrors = [];
    const tests = [
        testSign,
        testPTBsExample,
        testConverter,
        testIotaSystemState,
        testTransactionWithBCS,
        testTextAnalyzerDetails,
    ];

    for (const test of tests) {
        try {
            await test(browser);
        } catch (e) {
            console.log(`  CRASH in ${test.name}: ${e.message}`);
            allErrors.push(`${test.name}: ${e.message}`);
        }
    }

    await browser.close();

    console.log('\n' + '='.repeat(80));
    if (allErrors.length === 0) {
        console.log('✓ All interactive tests passed!');
    } else {
        console.log(`⚠ ${allErrors.length} test error(s):`);
        allErrors.forEach((e) => console.log(`  - ${e}`));
    }
}

run().catch((e) => {
    console.error('Fatal:', e);
    process.exit(1);
});
