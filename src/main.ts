import './app.css';

import { mount } from 'svelte';

import App from './App.svelte';
import { initQueryParamHandling } from './lib/lib/query-param-store';

// Initialize query parameter handling
initQueryParamHandling();

const target = document.getElementById('app')!;
const app = mount(App, { target });

export default app;
