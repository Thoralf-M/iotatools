/// <reference types="vitest/globals" />

/**
 * Global test setup for Vitest + @testing-library/svelte
 *
 * This file runs before every test file.
 * It sets up jest-dom matchers (toBeInTheDocument, toHaveTextContent, etc.)
 * and mocks browser APIs that jsdom does not provide.
 */

import '@testing-library/jest-dom/vitest';

// ---------------------------------------------------------------------------
// Mock browser APIs not available in jsdom
// ---------------------------------------------------------------------------

// localStorage is available in jsdom but let's ensure a clean slate
beforeEach(() => {
    localStorage.clear();
});

// Clipboard API - make it configurable so userEvent can override it
if (!navigator.clipboard) {
    Object.defineProperty(navigator, 'clipboard', {
        value: {
            writeText: vi.fn().mockResolvedValue(undefined),
            readText: vi.fn().mockResolvedValue(''),
        },
        writable: true,
        configurable: true,
    });
}

// window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// ResizeObserver
class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
}
window.ResizeObserver = ResizeObserverStub as any;

// IntersectionObserver
class IntersectionObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
}
window.IntersectionObserver = IntersectionObserverStub as any;

// HTMLCanvasElement.getContext (needed by QrGenerator)
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    fillStyle: '',
    strokeStyle: '',
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    arc: vi.fn(),
    drawImage: vi.fn(),
    putImageData: vi.fn(),
    getImageData: vi.fn().mockReturnValue({ data: [] }),
    createLinearGradient: vi.fn().mockReturnValue({ addColorStop: vi.fn() }),
    measureText: vi.fn().mockReturnValue({ width: 0 }),
    canvas: { width: 400, height: 400 },
}) as any;
