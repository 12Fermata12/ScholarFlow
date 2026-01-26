/**
 * Formats citation objects into stylized strings based on academic standards.
 */

export const formatCitation = (citation, format = 'APA') => {
    // Mapping from Citation.jsx form fields to Formatter expectations
    const author = citation.authorLast || 'Anonim';
    const initial = citation.authorFirst ? `${citation.authorFirst}.` : '';
    const { year, title, source } = citation;

    // source can be publisher or journal based on type
    const sourceStr = source || 'Bilinmiyor';

    switch (format) {
        case 'MLA':
            return `${author}, ${initial} "${title}." ${sourceStr}, ${year}.`;

        case 'Chicago':
            return `${author}, ${initial} "${title}." ${sourceStr} (${year}).`;

        case 'IEEE':
            return `[1] ${initial} ${author}, "${title}," ${sourceStr}, ${year}.`;

        case 'APA':
        default:
            return `${author}, ${initial} (${year}). ${title}. ${sourceStr}.`;
    }
};

export const formats = ['APA', 'MLA', 'Chicago', 'IEEE'];
