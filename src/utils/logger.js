/**
 * Simple Logger utility for the browser.
 * Stores logs in localStorage and provides methods to retrieve/clear them.
 */

const LOG_KEY = 'app_logs';
const MAX_LOGS = 100;

const LogLevel = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
};

const getLogs = () => {
    try {
        const logs = localStorage.getItem(LOG_KEY);
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

    try {
        localStorage.setItem(LOG_KEY, JSON.stringify(updatedLogs));
    } catch (e) {
        console.error('Failed to save log to localStorage', e);
    }

    // Also output to console for development
    const color = level === LogLevel.ERROR ? 'color: red' : level === LogLevel.WARN ? 'color: orange' : 'color: gray';
    console.log(`%c[${level}] ${message}`, color, data || '');
};

export const logger = {
    info: (message, data) => saveLog(LogLevel.INFO, message, data),
    warn: (message, data) => saveLog(LogLevel.WARN, message, data),
    error: (message, data) => saveLog(LogLevel.ERROR, message, data),
    getLogs,
    clearLogs: () => localStorage.removeItem(LOG_KEY),
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
    }
};

export default logger;
