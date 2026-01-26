import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

describe('App Smoke Test', () => {
    it('renders without crashing', () => {
        render(
            <BrowserRouter>
                <AppProvider>
                    <App />
                </AppProvider>
            </BrowserRouter>
        );
        // If it renders without throwing, the test passes
        expect(true).toBe(true);
    });
});
