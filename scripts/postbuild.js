import { execSync } from 'child_process';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

try {
    // Move build output to docs
    execSync('rm -rf docs && mv dist docs');

    // Bundle the explorer sub-app (built separately with a relative base +
    // hash routing) under /explorer/
    execSync('rm -rf docs/explorer && cp -R apps/explorer/dist docs/explorer');

    // Create CNAME file for custom domain
    writeFileSync('docs/CNAME', 'iotatools.dev\n');

    // Disable Jekyll processing so files starting with _ are served
    writeFileSync('docs/.nojekyll', '');

    // Fix asset paths in index.html
    const indexPath = 'docs/index.html';
    writeFileSync(indexPath, readFileSync(indexPath, 'utf8').replaceAll('/assets', './assets'));

    // Fix ledger nano debug module issues in JS files
    for (const file of readdirSync('docs/assets').filter((f) => f.endsWith('.js'))) {
        const filePath = join('docs/assets', file);
        const content = readFileSync(filePath, 'utf8')
            .replaceAll('module.exports = debug;', '')
            .replaceAll('debug2(', 'JSON.stringify(');
        writeFileSync(filePath, content);
    }

    console.log('Post-build steps completed.');
} catch (err) {
    console.error('Post-build error:', err);
    process.exit(1);
}
