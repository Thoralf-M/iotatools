/**
 * Patch uniffi-bindgen-react-native package.json to declare CommonJS.
 *
 * The package ships CJS code (require/exports) but declares "type": "module",
 * which prevents Vite from applying its CJS-to-ESM transformation.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const pkgPath = join(process.cwd(), 'node_modules', 'uniffi-bindgen-react-native', 'package.json');

try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    if (pkg.type !== 'commonjs') {
        pkg.type = 'commonjs';
        writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
        console.log('Patched uniffi-bindgen-react-native: "type" set to "commonjs"');
    }
} catch (e) {
    // Package not installed yet — skip silently
}
