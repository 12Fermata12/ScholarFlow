/**
 * LocalStorage Helper Utility
 * Provides safe localStorage operations with quota management and error handling
 */

const QUOTA_WARNING_THRESHOLD = 0.8; // 80% of quota
const STORAGE_TEST_KEY = '__storage_test__';

/**
 * Check if localStorage is available and working
 */
export const isStorageAvailable = () => {
    try {
        localStorage.setItem(STORAGE_TEST_KEY, 'test');
        localStorage.removeItem(STORAGE_TEST_KEY);
        return true;
    } catch (e) {
        return false;
    }
};

/**
 * Get approximate localStorage usage (in bytes)
 */
export const getStorageSize = () => {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length + key.length;
        }
    }
    return total;
};

/**
 * Get storage quota usage percentage (approximate)
 * Most browsers have 5-10MB limit
 */
export const getStorageUsagePercent = () => {
    const size = getStorageSize();
    const estimatedQuota = 5 * 1024 * 1024; // 5MB conservative estimate
    return size / estimatedQuota;
};

/**
 * Check if storage is near quota limit
 */
export const isStorageNearQuota = () => {
    return getStorageUsagePercent() > QUOTA_WARNING_THRESHOLD;
};

/**
 * Safely set item to localStorage with quota check
 */
export const safeSetItem = (key, value) => {
    try {
        // Check quota before writing
        if (isStorageNearQuota()) {
            console.warn('LocalStorage is near quota limit. Consider cleaning old data.');
            cleanOldLogs();
        }

        localStorage.setItem(key, value);
        return true;
    } catch (e) {
        if (e.name === 'QuotaExceededError' || e.code === 22) {
            console.error('LocalStorage quota exceeded. Attempting cleanup...');
            cleanOldLogs();

            // Try again after cleanup
            try {
                localStorage.setItem(key, value);
                return true;
            } catch (retryError) {
                console.error('Failed to save to localStorage even after cleanup:', retryError);
                return false;
            }
        } else {
            console.error('LocalStorage error:', e);
            return false;
        }
    }
};

/**
 * Safely get item from localStorage
 */
export const safeGetItem = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        return item !== null ? item : defaultValue;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return defaultValue;
    }
};

/**
 * Safely remove item from localStorage
 */
export const safeRemoveItem = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error('Error removing from localStorage:', e);
        return false;
    }
};

/**
 * Clean old logs (older than 7 days)
 */
export const cleanOldLogs = () => {
    try {
        const logsKey = 'app_logs';
        const logs = localStorage.getItem(logsKey);

        if (!logs) return;

        const parsedLogs = JSON.parse(logs);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const filteredLogs = parsedLogs.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate > sevenDaysAgo;
        });

        // Keep only 50 most recent logs
        const trimmedLogs = filteredLogs.slice(0, 50);

        localStorage.setItem(logsKey, JSON.stringify(trimmedLogs));
        console.log(`Cleaned logs: ${parsedLogs.length} -> ${trimmedLogs.length}`);
    } catch (e) {
        console.error('Error cleaning old logs:', e);
    }
};

/**
 * Debounce function to limit function calls
 * Returns a debounced function with a cancel method for cleanup
 */
export const debounce = (func, wait) => {
    let timeout;

    const executedFunction = function (...args) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(later, wait);
    };

    // Add cancel method for cleanup
    executedFunction.cancel = () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };

    return executedFunction;
};

/**
 * Get storage statistics
 */
export const getStorageStats = () => {
    const size = getStorageSize();
    const usage = getStorageUsagePercent();
    const itemCount = Object.keys(localStorage).length;

    return {
        sizeBytes: size,
        sizeKB: (size / 1024).toFixed(2),
        sizeMB: (size / (1024 * 1024)).toFixed(2),
        usagePercent: (usage * 100).toFixed(2),
        itemCount,
        isNearQuota: usage > QUOTA_WARNING_THRESHOLD
    };
};

export default {
    isStorageAvailable,
    getStorageSize,
    getStorageUsagePercent,
    isStorageNearQuota,
    safeSetItem,
    safeGetItem,
    safeRemoveItem,
    cleanOldLogs,
    debounce,
    getStorageStats
};
