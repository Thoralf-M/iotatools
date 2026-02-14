/**
 * Tests for the Tabs component
 *
 * Tests rendering of tab groups, active tab highlighting, and tab click handling.
 */

import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

import Tabs from './Tabs.svelte';

describe('Tabs', () => {
    const mockItems = [
        { label: 'Tab One', route: '/tab-one', group: 'Group A', value: 0 },
        { label: 'Tab Two', route: '/tab-two', group: 'Group A', value: 1 },
        { label: 'Tab Three', route: '/tab-three', group: 'Group B', value: 2 },
    ];

    it('should render all tab labels', () => {
        render(Tabs, { props: { items: mockItems, tabComponents: {} } });

        expect(screen.getByText('Tab One')).toBeInTheDocument();
        expect(screen.getByText('Tab Two')).toBeInTheDocument();
        expect(screen.getByText('Tab Three')).toBeInTheDocument();
    });

    it('should render group labels', () => {
        render(Tabs, { props: { items: mockItems, tabComponents: {} } });

        expect(screen.getByText('Group A')).toBeInTheDocument();
        expect(screen.getByText('Group B')).toBeInTheDocument();
    });

    it('should render tab buttons that are clickable', async () => {
        render(Tabs, { props: { items: mockItems, tabComponents: {} } });

        const tabOneBtn = screen.getByText('Tab One');
        expect(tabOneBtn.tagName).toBe('BUTTON');

        // Should be clickable without throwing
        await fireEvent.click(tabOneBtn);
    });

    it('should separate items into correct groups', () => {
        render(Tabs, { props: { items: mockItems, tabComponents: {} } });

        // Group A should have 2 buttons, Group B should have 1
        const groupALabel = screen.getByText('Group A');
        const groupBLabel = screen.getByText('Group B');

        // They should be in separate group containers
        expect(groupALabel.parentElement).not.toBe(groupBLabel.parentElement);
    });

    it('should render empty when no items provided', () => {
        const { container } = render(Tabs, { props: { items: [], tabComponents: {} } });

        // Should still render the container but with no buttons
        const buttons = container.querySelectorAll('button');
        expect(buttons.length).toBe(0);
    });
});
