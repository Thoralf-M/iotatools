/**
 * Tests for the JsonToggleView component
 *
 * Tests the toggle between JSON tree view and raw JSON display.
 */

import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import JsonToggleView from './JsonToggleView.svelte';

describe('JsonToggleView', () => {
    it('should render toggle button', () => {
        render(JsonToggleView, { props: { value: { key: 'val' } } });
        const toggleBtn = screen.getByText('toggle JSON tree');
        expect(toggleBtn).toBeInTheDocument();
    });

    it('should be hidden when value is empty object', () => {
        const { container } = render(JsonToggleView, { props: { value: {} } });
        const valueDiv = container.querySelector('.value');
        expect(valueDiv).toHaveAttribute('hidden');
    });

    it('should be visible when value has data', () => {
        const { container } = render(JsonToggleView, { props: { value: { a: 1 } } });
        const valueDiv = container.querySelector('.value');
        expect(valueDiv).not.toHaveAttribute('hidden');
    });

    it('should display raw JSON initially (tree hidden)', () => {
        const { container } = render(JsonToggleView, {
            props: { value: { name: 'test', count: 42 } },
        });

        // Pre element should be visible (not hidden)
        const pre = container.querySelector('pre');
        expect(pre).not.toHaveAttribute('hidden');
    });

    it('should toggle to tree view on button click', async () => {
        const user = userEvent.setup();
        const { container } = render(JsonToggleView, {
            props: { value: { name: 'test' } },
        });

        const toggleBtn = screen.getByText('toggle JSON tree');
        await user.click(toggleBtn);

        // After toggle, pre should be hidden
        const pre = container.querySelector('pre');
        expect(pre).toHaveAttribute('hidden');
    });

    it('should toggle back on second click', async () => {
        const user = userEvent.setup();
        const { container } = render(JsonToggleView, {
            props: { value: { name: 'test' } },
        });

        const toggleBtn = screen.getByText('toggle JSON tree');
        await user.click(toggleBtn);
        await user.click(toggleBtn);

        // After double toggle, pre should be visible again
        const pre = container.querySelector('pre');
        expect(pre).not.toHaveAttribute('hidden');
    });
});
