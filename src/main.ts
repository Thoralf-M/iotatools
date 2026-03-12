import './app.css';

// Initialize WASM SDK BEFORE any app imports — static imports are hoisted
// and their module-level code (including Svelte store init that calls into
// the WASM SDK) would run before top-level await. Dynamic imports ensure
// the entire app import tree loads only after WASM is ready.
import { initWasmSdk } from './lib/utils/wasm-init';

await initWasmSdk();

const { mount } = await import('svelte');
const { default: App } = await import('./App.svelte');
const { initQueryParamHandling } = await import('./lib/utils/query-param-store');

initQueryParamHandling();

const target = document.getElementById('app')!;
const app = mount(App, { target });

export default app;
