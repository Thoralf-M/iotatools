/**
 * Tests for the IotaAmountInput component
 *
 * Tests nano input, IOTA conversion display, and input handling.
 */

import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

import IotaAmountInput from './IotaAmountInput.svelte';

describe('IotaAmountInput', () => {
    it('should render with default label', () => {
        render(IotaAmountInput, { props: { value: 0 } });
        expect(screen.getByText('Amount')).toBeInTheDocument();
    });

    it('should render with custom label', () => {
        render(IotaAmountInput, { props: { value: 0, label: 'Custom Amount' } });
        expect(screen.getByText('Custom Amount')).toBeInTheDocument();
    });

    it('should display NANO suffix', () => {
        render(IotaAmountInput, { props: { value: 0 } });
        expect(screen.getByText('NANO')).toBeInTheDocument();
    });

    it('should render input field with placeholder', () => {
        render(IotaAmountInput, { props: { value: 0, placeholder: '0' } });
        const input = screen.getByPlaceholderText('0');
        expect(input).toBeInTheDocument();
    });

    it('should show IOTA equivalent when nano value is entered', async () => {
        render(IotaAmountInput, { props: { value: 0 } });

        const input = screen.getByPlaceholderText('0') as HTMLInputElement;
        // Simulate typing by setting value and firing input event
        input.value = '1000000000';
        await fireEvent.input(input);

        // Should show IOTA label when value is present
        expect(screen.getByText('IOTA')).toBeInTheDocument();
    });

    it('should show IOTA display when initialised with nonzero value', () => {
        render(IotaAmountInput, { props: { value: 1000000000 } });

        // With a nonzero initial value, IOTA label should be present
        expect(screen.getByText('IOTA')).toBeInTheDocument();
    });

    it('should accept numeric input', async () => {
        render(IotaAmountInput, { props: { value: 0 } });

        const input = screen.getByPlaceholderText('0') as HTMLInputElement;
        input.value = '5000';
        await fireEvent.input(input);

        expect(input.value).toBe('5000');
    });
});
