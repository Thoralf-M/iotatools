/**
 * Test the Address Generation page specifically
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
];

function isExpectedError(msg) {
    return EXPECTED_ERROR_PATTERNS.some((p) => msg.includes(p));
}

async function run() {
    const browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

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

    console.log('Testing Address Generation page...');
    await page.goto(`${BASE_URL}/#/address-generation`, {
        waitUntil: 'networkidle',
        timeout: 15000,
    });
    await page.waitForTimeout(800);

    await page.screenshot({ path: '/tmp/playwright-addr-gen-1.png' });

    // Use the specific mnemonic input
    const mnemonicInput = page.locator('#mnemonic');
    const testMnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    await mnemonicInput.fill(testMnemonic);
    await page.waitForTimeout(1000);

    await page.screenshot({ path: '/tmp/playwright-addr-gen-2.png' });

    // Check if addresses appeared
    const bodyText = await page.innerText('body');
    const addresses = bodyText.match(/0x[a-f0-9]{40,64}/gi) || [];
    console.log(
        `  Addresses generated: ${addresses.length > 0 ? addresses.slice(0, 3).join(', ') : 'none'}`,
    );

    // Look for generate button
    const allButtons = await page.$$eval('button:not([disabled])', (btns) =>
        btns
            .map((b) => b.textContent?.trim())
            .filter(
                (b) =>
                    b &&
                    ![
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
                    ].includes(b),
            ),
    );
    console.log(`  Page-specific buttons: ${allButtons.join(', ') || '(none beyond nav)'}`);

    // Click "Generate addresses" if present
    const genBtn = page
        .locator('button')
        .filter({ hasText: /generate/i })
        .first();
    if ((await genBtn.count()) > 0) {
        console.log('  Clicking Generate button...');
        await genBtn.click();
        await page.waitForTimeout(1500);
        await page.screenshot({ path: '/tmp/playwright-addr-gen-3.png' });
        const bodyText2 = await page.innerText('body');
        const addresses2 = bodyText2.match(/0x[a-f0-9]{40,64}/gi) || [];
        console.log(
            `  Addresses after Generate: ${addresses2.length > 0 ? addresses2.slice(0, 3).join(', ') : 'none'}`,
        );
    }

    // Test address index change
    const addrIndexInput = page.locator('input[placeholder="address index"]').first();
    if ((await addrIndexInput.count()) > 0) {
        await addrIndexInput.fill('1');
        await page.waitForTimeout(500);
        const bodyText3 = await page.innerText('body');
        const addresses3 = bodyText3.match(/0x[a-f0-9]{40,64}/gi) || [];
        console.log(
            `  After index=1: ${addresses3.length > 0 ? addresses3.slice(0, 2).join(', ') : 'none'}`,
        );
    }

    console.log(`  Code errors: ${errors.length === 0 ? 'none ✓' : errors.join('\n  ')}`);

    await ctx.close();
    await browser.close();

    console.log('\nScreenshots: /tmp/playwright-addr-gen-*.png');
}

run().catch((e) => {
    console.error('Fatal:', e);
    process.exit(1);
});
