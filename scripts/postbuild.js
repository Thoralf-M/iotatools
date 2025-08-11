import { execSync } from "child_process";

try {
    execSync("rm -rf docs && mv dist docs");
    // Paths need to be without dot
    execSync("sed -i 's|/assets|./assets|g' docs/index.html");
    execSync("sed -i 's|import \"\./|import \"/|g' docs/assets/*.js");
    execSync("sed -i 's|from \"\./|from \"/|g' docs/assets/*.js");
    // ledger nano dependency needs debug module fixed
    execSync("sed -i 's|module.exports = debug;||g' docs/assets/*.js");
    execSync("sed -i 's|debug2(|JSON.stringify(|g' docs/assets/*.js");
    console.log("Post-build steps completed.");
} catch (err) {
    console.error("Post-build error:", err);
    process.exit(1);
}
