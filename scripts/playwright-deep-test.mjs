/**
 * Deep Playwright tests for specific pages - testing real button interactions
 * and checking for actual code errors (not network or wallet errors).
 */

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const BASE_URL = 'http://localhost:5173';

// Errors that are expected in a headless environment
const EXPECTED_ERROR_PATTERNS = [
    'No wallet available',
    'error sending request',
    'SdkFfiError',
    'Failed to fetch',
    'net::ERR_',
    'NetworkError',
    'ECONNREFUSED',
    'NS_ERROR',
    'mainnet.iota.cafe',
    'testnet.iota.cafe',
    'devnet.iota',
    'api.iota',
    '404',
    'TypeError: Failed to fetch',
    'getaddrinfo',
    'Loading failed',
];

function isExpectedError(msg) {
    return EXPECTED_ERROR_PATTERNS.some((p) => msg.includes(p));
}

async function captureErrors(page) {
    const errors = [];
    page.on('console', (msg) => {
        if (msg.type() === 'error' && !isExpectedError(msg.text())) {
            errors.push({ type: 'console.error', text: msg.text() });
        }
    });
    page.on('pageerror', (err) => {
        if (!isExpectedError(err.message)) {
            errors.push({ type: 'pageerror', text: err.message });
        }
    });
    return errors;
}

async function goto(page, path) {
    await page.goto(`${BASE_URL}/#${path}`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(800);
}

// Take a screenshot
async function screenshot(page, name) {
    await page.screenshot({ path: `/tmp/playwright-${name}.png`, fullPage: false });
    console.log(`  📸 Screenshot: /tmp/playwright-${name}.png`);
}

async function testConverter(browser) {
    console.log('\n=== Converter Page ===');
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errors = await captureErrors(page);

    await goto(page, '/converter');
    await screenshot(page, 'converter');

    // Test hex to bytes conversion
    const hexInput = page.locator('input[placeholder="hex string"]');
    await hexInput.fill('deadbeef');
    await page.waitForTimeout(500);

    const bytesInput = page.locator('input[placeholder="bytes like: 1, 2, 3"]');
    const bytesVal = await bytesInput.inputValue();
    console.log(`  Hex "deadbeef" → bytes: "${bytesVal}"`);

    // Test base64
    const b64Input = page.locator('input[placeholder="base64 string"]');
    await b64Input.fill('aGVsbG8=');
    await page.waitForTimeout(500);
    const hexAfterB64 = await hexInput.inputValue();
    console.log(`  Base64 "aGVsbG8=" → hex: "${hexAfterB64}"`);

    // Test bytes input
    await bytesInput.fill('72, 101, 108, 108, 111');
    await page.waitForTimeout(500);
    const hexFromBytes = await hexInput.inputValue();
    console.log(`  Bytes "72, 101, 108, 108, 111" → hex: "${hexFromBytes}"`);

    console.log(
        `  Code errors: ${errors.length === 0 ? 'none ✓' : errors.map((e) => e.text).join(', ')}`,
    );
    await ctx.close();
    return errors;
}

async function testTextAnalyzer(browser) {
    console.log('\n=== Text Analyzer Page ===');
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errors = await captureErrors(page);

    await goto(page, '/text-analyzer');
    await screenshot(page, 'text-analyzer');

    const textarea = page.locator('textarea[placeholder="Paste your text here for analysis..."]');
    await textarea.fill(
        '0x1ee12dca0e798966a82f74c010c109e1bd0674f4f47517db6843f223bad5eb7c Hello world 0x2::coin::COIN',
    );
    await page.waitForTimeout(800);

    // Get results
    const bodyText = await page.locator('body').innerText();
    const hasAddresses = bodyText.includes('0x1ee12dca') || bodyText.includes('address');
    console.log(`  Analysis results loaded: ${hasAddresses ? '✓' : '?'}`);

    console.log(
        `  Code errors: ${errors.length === 0 ? 'none ✓' : errors.map((e) => e.text).join(', ')}`,
    );
    await ctx.close();
    return errors;
}

async function testAddressGeneration(browser) {
    console.log('\n=== Address Generation Page ===');
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errors = await captureErrors(page);

    await goto(page, '/address-generation');
    await screenshot(page, 'address-generation');

    // Enter a test mnemonic (BIP-39 test mnemonic, not real funds)
    const mnemonicInput = page.locator('input[placeholder*="mnemonic"]');
    const testMnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    await mnemonicInput.fill(testMnemonic);
    await page.waitForTimeout(1000);

    // Check if addresses were generated
    const bodyText = await page.locator('body').innerText();
    const hasAddress = bodyText.includes('0x') || bodyText.includes('address');
    console.log(`  Address generated: ${hasAddress ? '✓' : '? (might need Generate button)'}`);

    // Look for a generate button
    const generateBtn = page.locator('button:has-text("Generate")').first();
    if ((await generateBtn.count()) > 0) {
        await generateBtn.click();
        await page.waitForTimeout(1000);
        const bodyText2 = await page.locator('body').innerText();
        const hasAddr = bodyText2.includes('0x');
        console.log(`  After Generate click: ${hasAddr ? 'address shown ✓' : 'no address shown'}`);
    }

    await screenshot(page, 'address-generation-after');

    console.log(
        `  Code errors: ${errors.length === 0 ? 'none ✓' : errors.map((e) => e.text).join(', ')}`,
    );
    await ctx.close();
    return errors;
}

async function testSign(browser) {
    console.log('\n=== Sign Page ===');
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errors = await captureErrors(page);

    await goto(page, '/sign');
    await screenshot(page, 'sign');

    // Try to verify a signature (read-only operation)
    const buttons = await page.$$eval('button:not([disabled])', (btns) =>
        btns.map((b) => b.textContent?.trim()).filter(Boolean),
    );
    console.log(`  Buttons: ${buttons.join(', ')}`);

    // Find verify button if present
    const verifyBtn = page.locator('button:has-text("Verify")').first();
    if ((await verifyBtn.count()) > 0) {
        console.log('  Found Verify button');
    }

    console.log(
        `  Code errors: ${errors.length === 0 ? 'none ✓' : errors.map((e) => e.text).join(', ')}`,
    );
    await ctx.close();
    return errors;
}

async function testTransaction(browser) {
    console.log('\n=== Transaction Page ===');
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errors = await captureErrors(page);

    await goto(page, '/transaction');
    await screenshot(page, 'transaction');

    // Test with a real mainnet transaction digest (known, safe to query)
    const input = page.locator('textarea').first();
    if ((await input.count()) > 0) {
        await input.fill('7k7oF2xeaSUGTwvL6GTFqUJUBpqR5wFCX3K1aRHSzQH3');
        await page.waitForTimeout(300);

        // Click submit/search button
        const submitBtn = page
            .locator(
                'button[type="submit"], button:has-text("Search"), button:has-text("Load"), button:has-text("Fetch"), button:has-text("Decode")',
            )
            .first();
        if ((await submitBtn.count()) > 0) {
            await submitBtn.click();
            await page.waitForTimeout(2000);
            console.log(`  Clicked search button`);
        }
    }

    await screenshot(page, 'transaction-after');
    console.log(
        `  Code errors: ${errors.length === 0 ? 'none ✓' : errors.map((e) => e.text).join(', ')}`,
    );
    await ctx.close();
    return errors;
}

async function testSettings(browser) {
    console.log('\n=== Settings Page ===');
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errors = await captureErrors(page);

    await goto(page, '/settings');
    await screenshot(page, 'settings');

    // Get all buttons
    const buttons = await page.$$eval('button:not([disabled])', (btns) =>
        btns.map((b) => b.textContent?.trim()).filter(Boolean),
    );
    console.log(`  Buttons: ${buttons.slice(0, 15).join(', ')}`);

    // Click network tabs
    const mainnetBtn = page.locator('button:has-text("Mainnet")').first();
    const testnetBtn = page.locator('button:has-text("Testnet")').first();
    if ((await testnetBtn.count()) > 0) {
        await testnetBtn.click();
        await page.waitForTimeout(500);
        console.log('  Clicked Testnet button ✓');
    }
    if ((await mainnetBtn.count()) > 0) {
        await mainnetBtn.click();
        await page.waitForTimeout(500);
        console.log('  Clicked Mainnet button ✓');
    }

    console.log(
        `  Code errors: ${errors.length === 0 ? 'none ✓' : errors.map((e) => e.text).join(', ')}`,
    );
    await ctx.close();
    return errors;
}

async function testStakingRewards(browser) {
    console.log('\n=== Staking Rewards Page ===');
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errors = await captureErrors(page);

    await goto(page, '/staking-rewards');
    await screenshot(page, 'staking-rewards');

    const buttons = await page.$$eval('button:not([disabled])', (btns) =>
        btns.map((b) => b.textContent?.trim()).filter(Boolean),
    );
    console.log(`  Buttons: ${buttons.slice(0, 10).join(', ')}`);

    // Enter address
    const addrInput = page.locator('input[placeholder*="address"]').first();
    if ((await addrInput.count()) > 0) {
        await addrInput.fill('0x1ee12dca0e798966a82f74c010c109e1bd0674f4f47517db6843f223bad5eb7c');
        await page.waitForTimeout(300);
    }

    console.log(
        `  Code errors: ${errors.length === 0 ? 'none ✓' : errors.map((e) => e.text).join(', ')}`,
    );
    await ctx.close();
    return errors;
}

async function testIotaSystemState(browser) {
    console.log('\n=== IOTA System State Page ===');
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errors = await captureErrors(page);

    await goto(page, '/iota-system-state');
    await screenshot(page, 'iota-system-state');

    const buttons = await page.$$eval('button:not([disabled])', (btns) =>
        btns.map((b) => b.textContent?.trim()).filter(Boolean),
    );
    console.log(`  Buttons (all): ${buttons.join(', ')}`);

    // Look for specific page buttons (not nav buttons)
    const fetchBtn = page
        .locator('button:has-text("Fetch"), button:has-text("Load"), button:has-text("Get")')
        .first();
    if ((await fetchBtn.count()) > 0) {
        console.log('  Found Fetch/Load/Get button');
    }

    console.log(
        `  Code errors: ${errors.length === 0 ? 'none ✓' : errors.map((e) => e.text).join(', ')}`,
    );
    await ctx.close();
    return errors;
}

async function testPTBs(browser) {
    console.log('\n=== PTBs (Programmable Transaction Blocks) Analysis Page ===');
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errors = await captureErrors(page);

    await goto(page, '/ptbs');
    await screenshot(page, 'ptbs');

    const buttons = await page.$$eval('button:not([disabled])', (btns) =>
        btns.map((b) => b.textContent?.trim()).filter(Boolean),
    );
    console.log(`  Buttons: ${buttons.join(', ')}`);

    const inputs = await page.$$eval('input, textarea, select', (els) =>
        els.map((el) => ({
            type: el.tagName + '[' + (el.type || 'text') + ']',
            placeholder: el.placeholder || '',
        })),
    );
    console.log(
        `  Inputs: ${inputs.map((i) => i.type + (i.placeholder ? ` "${i.placeholder}"` : '')).join(', ')}`,
    );

    console.log(
        `  Code errors: ${errors.length === 0 ? 'none ✓' : errors.map((e) => e.text).join(', ')}`,
    );
    await ctx.close();
    return errors;
}

async function testKeystone(browser) {
    console.log('\n=== Keystone Page ===');
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errors = await captureErrors(page);

    await goto(page, '/keystone');
    await screenshot(page, 'keystone');

    const heading = await page.$eval('h1, h2', (el) => el.textContent?.trim()).catch(() => null);
    console.log(`  Heading: ${heading}`);

    const bodyText = await page
        .locator('.page-content, main, .content')
        .first()
        .innerText()
        .catch(() => '');
    console.log(`  Content preview: ${bodyText.slice(0, 200).replace(/\n/g, ' ')}`);

    console.log(
        `  Code errors: ${errors.length === 0 ? 'none ✓' : errors.map((e) => e.text).join(', ')}`,
    );
    await ctx.close();
    return errors;
}

async function run() {
    console.log('Starting deep Playwright browser tests...\n');
    console.log('Note: Network errors and "No wallet available" are expected in headless mode.\n');

    const browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const allErrors = [];

    const tests = [
        testConverter,
        testTextAnalyzer,
        testAddressGeneration,
        testSign,
        testTransaction,
        testSettings,
        testStakingRewards,
        testIotaSystemState,
        testPTBs,
        testKeystone,
    ];

    for (const test of tests) {
        try {
            const errors = await test(browser);
            if (errors && errors.length > 0) {
                allErrors.push(...errors.map((e) => `${test.name}: ${e.text}`));
            }
        } catch (e) {
            console.log(`  CRASH: ${e.message}`);
            allErrors.push(`${test.name}: CRASH: ${e.message}`);
        }
    }

    await browser.close();

    console.log('\n' + '='.repeat(80));
    if (allErrors.length === 0) {
        console.log('✓ All tests passed - no unexpected code errors found!');
    } else {
        console.log(`⚠ Found ${allErrors.length} unexpected errors:`);
        for (const err of allErrors) {
            console.log(`  - ${err}`);
        }
    }
    console.log('='.repeat(80));
    console.log('\nScreenshots saved to /tmp/playwright-*.png');
}

run().catch((e) => {
    console.error('Fatal:', e);
    process.exit(1);
});
