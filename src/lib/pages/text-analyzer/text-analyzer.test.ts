/**
 * Tests for the TextAnalyzer page component
 *
 * Tests the text analysis functionality: character counting, word counting,
 * format detection, and other text metrics.
 */

import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

import TextAnalyzer from './TextAnalyzer.svelte';

describe('TextAnalyzer', () => {
    it('should render the text input area', () => {
        render(TextAnalyzer);
        const textarea = screen.getByPlaceholderText(/paste your text here/i);
        expect(textarea).toBeInTheDocument();
    });

    it('should render metric sections', () => {
        render(TextAnalyzer);
        expect(screen.getByText('Basic Metrics')).toBeInTheDocument();
        expect(screen.getByText('Character Analysis')).toBeInTheDocument();
        expect(screen.getByText('Format Detection')).toBeInTheDocument();
    });

    it('should show zero total characters with empty input', () => {
        const { container } = render(TextAnalyzer);
        // Look for "Total Characters: 0" pattern in the Basic Metrics section
        const totalCharsText = container.textContent;
        expect(totalCharsText).toContain('Total Characters:');
        // Multiple metrics show '0' – just verify Total Characters row
        const metricDivs = container.querySelectorAll('.metric-content div');
        const totalCharsDiv = Array.from(metricDivs).find((d) =>
            d.textContent?.includes('Total Characters:'),
        );
        expect(totalCharsDiv?.querySelector('strong')?.textContent).toBe('0');
    });

    it('should count characters after input', async () => {
        render(TextAnalyzer);

        const textarea = screen.getByPlaceholderText(/paste your text here/i) as HTMLTextAreaElement;
        // Use fireEvent to simulate input
        textarea.value = 'Hello World';
        await fireEvent.input(textarea);

        // 11 characters
        expect(screen.getByText('11')).toBeInTheDocument();
        // 10 characters without spaces
        expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('should count words correctly', async () => {
        const { container } = render(TextAnalyzer);

        const textarea = screen.getByPlaceholderText(/paste your text here/i) as HTMLTextAreaElement;
        textarea.value = 'one two three';
        await fireEvent.input(textarea);

        // Find the Words metric
        const metricDivs = container.querySelectorAll('.metric-content div');
        const wordsDiv = Array.from(metricDivs).find((d) => d.textContent?.startsWith('Words:'));
        expect(wordsDiv?.querySelector('strong')?.textContent).toBe('3');
    });

    it('should detect valid JSON', async () => {
        render(TextAnalyzer);

        const textarea = screen.getByPlaceholderText(/paste your text here/i) as HTMLTextAreaElement;
        textarea.value = '{"key":"value"}';
        await fireEvent.input(textarea);

        // Should show "Yes" for Valid JSON
        const yesElements = screen.getAllByText('Yes');
        expect(yesElements.length).toBeGreaterThanOrEqual(1);
    });

    it('should detect valid hex strings', async () => {
        render(TextAnalyzer);

        const textarea = screen.getByPlaceholderText(/paste your text here/i) as HTMLTextAreaElement;
        textarea.value = '0xdeadbeef';
        await fireEvent.input(textarea);

        const yesElements = screen.getAllByText('Yes');
        expect(yesElements.length).toBeGreaterThanOrEqual(1);
    });

    it('should have a limit input for character preview', () => {
        render(TextAnalyzer);
        const limitInput = screen.getByLabelText(/show first/i);
        expect(limitInput).toBeInTheDocument();
    });

    it('should detect format changes from invalid to valid', async () => {
        const { container } = render(TextAnalyzer);
        const textarea = screen.getByPlaceholderText(/paste your text here/i) as HTMLTextAreaElement;

        // Initially all formats should be "No"
        textarea.value = 'not json';
        await fireEvent.input(textarea);
        const noElements = screen.getAllByText('No');
        expect(noElements.length).toBeGreaterThanOrEqual(3); // JSON, Base64, Hex, Bytes

        // Switch to valid base64
        textarea.value = 'SGVsbG8=';
        await fireEvent.input(textarea);
        const yesElements = screen.getAllByText('Yes');
        expect(yesElements.length).toBeGreaterThanOrEqual(1);
    });
});
