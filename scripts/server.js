// Run the production build locally
// pnpm production
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use('/iota-utils', express.static(path.join(__dirname, '../docs')));

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000/iota-utils/');
});
