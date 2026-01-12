import { writable } from 'svelte/store';

// Store for the current active tab route
export const activeTabRoute = writable(window.location.pathname);

// Listen for popstate to update the store on browser navigation
window.addEventListener('popstate', () => {
    activeTabRoute.set(window.location.pathname);
});
