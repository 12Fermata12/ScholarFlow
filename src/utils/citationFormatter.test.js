import { describe, it, expect } from 'vitest';
import { formatCitation } from './citationFormatter';

describe('citationFormatter', () => {
    const mockCitation = {
        authorLast: 'Yilmaz',
        authorFirst: 'A',
        year: '2023',
        title: 'Test Book',
        source: 'Test Publisher',
        url: 'https://example.com',
        doi: '10.1234/5678'
    };

    it('formats APA correctly', () => {
        const result = formatCitation(mockCitation, 'APA');
        expect(result).toBe('Yilmaz, A. (2023). Test Book. Test Publisher.');
    });

    it('formats MLA correctly', () => {
        const result = formatCitation(mockCitation, 'MLA');
        expect(result).toBe('Yilmaz, A. "Test Book." Test Publisher, 2023.');
    });

    it('formats Chicago correctly', () => {
        const result = formatCitation(mockCitation, 'Chicago');
        expect(result).toBe('Yilmaz, A. "Test Book." Test Publisher (2023).');
    });

    it('formats IEEE correctly', () => {
        const result = formatCitation(mockCitation, 'IEEE');
        expect(result).toBe('[1] A. Yilmaz, "Test Book," Test Publisher, 2023.');
    });

    it('handles missing author correctly', () => {
        const result = formatCitation({ ...mockCitation, authorLast: '' }, 'APA');
        expect(result).toBe('Anonim, A. (2023). Test Book. Test Publisher.');
    });
});
