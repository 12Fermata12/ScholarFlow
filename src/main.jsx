import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'
import logger from './utils/logger'
import './index.css'

// Global error handlers
window.onerror = (message, source, lineno, colno, error) => {
    logger.error(`Global Error: ${message}`, {
        source,
        lineno,
        colno,
        stack: error?.stack
    });
};

window.onunhandledrejection = (event) => {
    logger.error(`Unhandled Rejection: ${event.reason?.message || event.reason}`, {
        stack: event.reason?.stack
    });
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <AppProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </AppProvider>
        </ErrorBoundary>
    </React.StrictMode>,
)
