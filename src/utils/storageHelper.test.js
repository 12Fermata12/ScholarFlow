import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { safeSetItem, safeGetItem } from './storageHelper';

describe('storageHelper', () => {
    beforeEach(() => {
        vi.spyOn(Storage.prototype, 'setItem');
        vi.spyOn(Storage.prototype, 'getItem');
    });

    afterEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
    });

    it('safeSetItem sets item in localStorage', () => {
        safeSetItem('test-key', 'test-value');
        expect(localStorage.setItem).toHaveBeenCalledWith('test-key', 'test-value');
    });

    it('safeGetItem gets item from localStorage', () => {
        localStorage.setItem('test-key', 'test-value');
        const result = safeGetItem('test-key');
        expect(result).toBe('test-value');
        expect(localStorage.getItem).toHaveBeenCalledWith('test-key');
    });

    it('safeGetItem returns default value if item is missing', () => {
        const result = safeGetItem('missing-key', 'default');
        expect(result).toBe('default');
    });
});
