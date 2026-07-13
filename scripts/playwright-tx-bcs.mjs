/**
 * Test Transaction page BCS decoding with example buttons
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const BASE_URL = 'http://localhost:5173';

async function run() {
    const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    const codeErrors = [];
    const networkErrors = [];
    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            const text = msg.text();
            if (
                text.includes('CORS') ||
                text.includes('fetch') ||
                text.includes('network') ||
                text.includes('SdkFfi') ||
                text.includes('wallet')
            ) {
                networkErrors.push(text.slice(0, 80));
            } else {
                codeErrors.push(text);
            }
        }
    });
    page.on('pageerror', (err) => {
        if (!err.message.includes('fetch') && !err.message.includes('network')) {
            codeErrors.push(err.message);
        }
    });

    await page.goto(`${BASE_URL}/#/transaction`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(800);

    console.log('=== Transaction Page - BCS Decode Tests ===\n');

    // Click "Example Tx (base64)"
    const exampleTxBtn = page.locator('button:has-text("Example Tx (base64)")');
    await exampleTxBtn.click();
    await page.waitForTimeout(1000);

    const txInput = page.locator('textarea').first();
    const txVal = await txInput.inputValue();
    console.log(`After "Example Tx (base64)":`);
    console.log(`  Input: ${txVal.slice(0, 60)}... (${txVal.length} chars)`);

    // Check if it decoded and shows content
    const bodyText = await page.innerText('body');
    const hasPTBContent =
        bodyText.includes('TransactionData') ||
        bodyText.includes('ProgrammableTransaction') ||
        bodyText.includes('sender') ||
        bodyText.includes('commands') ||
        bodyText.includes('inputs');
    console.log(
        `  BCS decoded/displayed: ${hasPTBContent ? 'yes ✓' : 'no (might need fetch to decode)'}`,
    );

    await page.screenshot({ path: '/tmp/playwright-tx-example1.png' });

    // Click "Example Signed Tx (base64)"
    const exampleSignedBtn = page.locator('button:has-text("Example Signed Tx (base64)")');
    await exampleSignedBtn.click();
    await page.waitForTimeout(1000);
    const signedVal = await txInput.inputValue();
    console.log(`\nAfter "Example Signed Tx (base64)":`);
    console.log(`  Input: ${signedVal.slice(0, 60)}... (${signedVal.length} chars)`);

    await page.screenshot({ path: '/tmp/playwright-tx-example2.png' });

    // Check "Fetch Latest PTB" button
    const fetchLatestBtn = page.locator('button:has-text("Fetch Latest PTB")');
    if ((await fetchLatestBtn.count()) > 0) {
        await fetchLatestBtn.click();
        await page.waitForTimeout(2000);
        console.log('\nClicked "Fetch Latest PTB" (network call - may fail)');
        const bodyText2 = await page.innerText('body');
        const hasResult =
            bodyText2.includes('digest') ||
            bodyText2.includes('error') ||
            bodyText2.includes('Error');
        console.log(`  Result shown: ${hasResult ? 'yes' : 'no'}`);
    }

    await page.screenshot({ path: '/tmp/playwright-tx-final.png' });

    console.log(`\nCode errors: ${codeErrors.length === 0 ? 'none ✓' : codeErrors.join(', ')}`);
    console.log(`Network errors (expected): ${networkErrors.length}`);

    await ctx.close();
    await browser.close();
    console.log('\nScreenshots: /tmp/playwright-tx-*.png');
}

run().catch((e) => {
    console.error('Fatal:', e);
    process.exit(1);
});
