import React from 'react';
import logger from '../utils/logger';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorCode: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        const errorCode = crypto.randomUUID();
        this.setState({ errorCode });

        logger.error(`UI Crash: ${error.message}`, {
            errorCode,
            stack: error.stack,
            componentStack: errorInfo.componentStack
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-red-100">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 14c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Hata Oluştu</h1>
                        <p className="text-gray-600 mb-6">
                            Uygulama beklenmedik bir sorunla karşılaştı. Bu durum kaydedildi ve geliştiricilerimiz bilgilendirilecektir.
                        </p>
                        {this.state.errorCode && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-6 text-sm font-mono text-gray-500 break-all border border-gray-100">
                                Hata Kodu: {this.state.errorCode}
                            </div>
                        )}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                            >
                                Sayfayı Yenile
                            </button>
                            <button
                                onClick={() => logger.downloadLogs()}
                                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border border-gray-200 transition-colors"
                            >
                                Hata Loglarını İndir
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
