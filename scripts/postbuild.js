import { execSync } from 'child_process';

try {
    // Move build output to docs
    execSync('rm -rf docs && mv dist docs');

    // Fix asset paths in index.html
    execSync("sed -i 's|/assets|./assets|g' docs/index.html");

    // Fix import and from paths in JS files
    execSync(
        'sed -i -e \'s|import "\\./|import "/iota-utils/assets/|g\' -e \'s|from "\\./|from "/iota-utils/assets/|g\' docs/assets/*.js',
    );

    // Fix asset references and entry file paths in JS files
    execSync(
        "sed -i -e 's|\"assets/|\"iota-utils/assets/|g' -e 's|/iota-utils/index-|/iota-utils/assets/index-|g' docs/assets/*.js",
    );

    // Fix ledger nano debug module issues in JS files
    execSync(
        "sed -i -e 's|module.exports = debug;||g' -e 's|debug2(|JSON.stringify(|g' docs/assets/*.js",
    );

    console.log('Post-build steps completed.');
} catch (err) {
    console.error('Post-build error:', err);
    process.exit(1);
}
