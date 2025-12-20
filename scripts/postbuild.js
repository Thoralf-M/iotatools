import { execSync } from 'child_process';

try {
    // Move build output to docs
    execSync('rm -rf docs && mv dist docs');

    // Create CNAME file for custom domain
    execSync('echo "iotatools.dev" > docs/CNAME');

    // Fix asset paths in index.html
    execSync("sed -i 's|/assets|./assets|g' docs/index.html");
    // Fix ledger nano debug module issues in JS files
    execSync(
        "sed -i -e 's|module.exports = debug;||g' -e 's|debug2(|JSON.stringify(|g' docs/assets/*.js",
    );

    console.log('Post-build steps completed.');
} catch (err) {
    console.error('Post-build error:', err);
    process.exit(1);
}
