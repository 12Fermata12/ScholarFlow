/**
 * Simple Logger utility for the browser.
 * Stores logs in localStorage and provides methods to retrieve/clear them.
 * Now with automatic cleanup and safe storage operations.
 */

import { safeSetItem, safeGetItem, cleanOldLogs } from './storageHelper';

const LOG_KEY = 'app_logs';
const MAX_LOGS = 50; // Reduced from 100 to save memory
const CLEANUP_INTERVAL = 1000 * 60 * 30; // Clean every 30 minutes

const LogLevel = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
};

// Auto-cleanup timer
let cleanupTimer = null;

const startAutoCleanup = () => {
    if (cleanupTimer) return; // Already running

    cleanupTimer = setInterval(() => {
        cleanOldLogs();
    }, CLEANUP_INTERVAL);
};

const stopAutoCleanup = () => {
    if (cleanupTimer) {
        clearInterval(cleanupTimer);
        cleanupTimer = null;
    }
};

const getLogs = () => {
    try {
        const logs = safeGetItem(LOG_KEY);
        return logs ? JSON.parse(logs) : [];
    } catch (e) {
        console.error('Failed to parse logs from localStorage', e);
        return [];
    }
};

const saveLog = (level, message, data = null) => {
    const logs = getLogs();
    const newEntry = {
        timestamp: new Date().toISOString(),
        id: crypto.randomUUID(),
        level,
        message,
        data,
    };

    // Keep only the last MAX_LOGS
    const updatedLogs = [newEntry, ...logs].slice(0, MAX_LOGS);

    // Use safe storage operation
    safeSetItem(LOG_KEY, JSON.stringify(updatedLogs));

    // Also output to console for development
    const color = level === LogLevel.ERROR ? 'color: red' : level === LogLevel.WARN ? 'color: orange' : 'color: gray';
    console.log(`%c[${level}] ${message}`, color, data || '');
};

// Start auto-cleanup when logger is imported
startAutoCleanup();

export const logger = {
    info: (message, data) => saveLog(LogLevel.INFO, message, data),
    warn: (message, data) => saveLog(LogLevel.WARN, message, data),
    error: (message, data) => saveLog(LogLevel.ERROR, message, data),
    getLogs,
    clearLogs: () => {
        safeSetItem(LOG_KEY, JSON.stringify([]));
    },
    downloadLogs: () => {
        const logs = getLogs();
        const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `app-logs-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
    startAutoCleanup,
    stopAutoCleanup
};

export default logger;
