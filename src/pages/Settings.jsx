import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Globe, Moon, ShieldCheck, Cpu, Download, Upload, Key } from 'lucide-react';

const Settings = () => {
    const { currentLang, setLanguage, t, apiKey, setApiKey, exportUserData, importUserData } = useApp();
    const [saved, setSaved] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const fileInputRef = useRef(null);
    const fileReaderRef = useRef(null);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 3000);
    };

    // Cleanup FileReader on unmount
    useEffect(() => {
        return () => {
            if (fileReaderRef.current) {
                try {
                    fileReaderRef.current.abort();
                } catch (e) {
                    console.warn('[Settings] FileReader abort failed:', e);
                }
                fileReaderRef.current = null;
            }
        };
    }, []);

    const handleExport = () => {
        exportUserData();
        showToast(t('toast_exported'));
    };

    const handleImport = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create and track FileReader
        const reader = new FileReader();
        fileReaderRef.current = reader;

        // Success handler
        reader.onload = (event) => {
            try {
                const success = importUserData(event.target.result);
                if (success) {
                    showToast(t('toast_imported'));
                } else {
                    showToast(t('toast_import_error'));
                }
            } catch (error) {
                console.error('[Settings] Import failed:', error);
                showToast(t('toast_import_error'));
            } finally {
                fileReaderRef.current = null;
            }
        };

        // Error handler
        reader.onerror = (error) => {
            console.error('[Settings] FileReader error:', error);
            showToast(t('toast_import_error'));
            fileReaderRef.current = null;
        };

        // Abort handler
        reader.onabort = () => {
            console.warn('[Settings] FileReader aborted');
            fileReaderRef.current = null;
        };

        reader.readAsText(file);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 py-8">
            <header className="space-y-2">
                <h1 className="text-3xl font-serif text-white">{t('settings_title')}</h1>
                <p className="text-slate-500">{t('settings_desc')}</p>
            </header>

            <div className="grid md:grid-cols-5 gap-8 items-start">
                <div className="md:col-span-3 space-y-8">
                    {/* Language Panel */}
                    <div className="glass-panel p-8 rounded-3xl border-white/5 space-y-6 bg-[#111114]/60">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-white/5 text-white">
                                <Globe size={20} />
                            </div>
                            <h2 className="text-white font-semibold">{t('settings_lang')}</h2>
                        </div>
                        <div className="flex gap-4">
                            <LangBtn active={currentLang === 'tr'} onClick={() => setLanguage('tr')} label="Türkçe" />
                            <LangBtn active={currentLang === 'en'} onClick={() => setLanguage('en')} label="English" />
                        </div>
                        <button
                            onClick={handleSave}
                            className={`w-full h-14 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${saved ? 'bg-emerald-500 text-white' : 'bg-white text-black hover:bg-slate-200'}`}
                        >
                            {saved ? t('toast_saved') : t('settings_save')}
                        </button>
                    </div>

                    {/* Data Panel */}
                    <div className="glass-panel p-8 rounded-3xl border-white/5 space-y-4 bg-[#111114]/60">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 rounded-xl bg-white/5 text-white">
                                <ShieldCheck size={20} />
                            </div>
                            <h2 className="text-white font-semibold">{t('settings_privacy')}</h2>
                        </div>
                        <p className="text-[10px] text-slate-600 leading-relaxed uppercase tracking-widest font-bold">
                            {t('settings_privacy_desc')}
                        </p>
                    </div>

                    {/* API Key Panel */}
                    <div className="glass-panel p-8 rounded-3xl border-white/5 space-y-4 bg-[#111114]/60">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 rounded-xl bg-white/5 text-white">
                                <Key size={20} />
                            </div>
                            <h2 className="text-white font-semibold">{t('settings_api_key')}</h2>
                        </div>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="sk-..."
                            className="w-full h-12 bg-black/30 border border-white/10 rounded-xl px-4 text-slate-300 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                    </div>

                    {/* Import/Export Panel */}
                    <div className="glass-panel p-8 rounded-3xl border-white/5 space-y-4 bg-[#111114]/60">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-white/5 text-white">
                                <Download size={20} />
                            </div>
                            <h2 className="text-white font-semibold">Veri Yönetimi</h2>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleExport}
                                className="flex-1 h-12 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                            >
                                <Download size={16} />
                                {t('settings_export')}
                            </button>
                            <button
                                onClick={handleImport}
                                className="flex-1 h-12 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                            >
                                <Upload size={16} />
                                {t('settings_import')}
                            </button>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                </div>

                <div className="md:col-span-2 space-y-8">
                    {/* Appearance Panel */}
                    <div className="glass-panel p-8 rounded-3xl border-white/5 space-y-6 bg-[#111114]/60">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 rounded-xl bg-slate-500/10 text-slate-400">
                                <Moon size={20} />
                            </div>
                            <h2 className="text-white font-semibold">{t('settings_appearance')}</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
                                <span className="text-sm text-slate-300 font-medium">ScholarFlow Dark</span>
                                <div className="w-8 h-4 rounded-full bg-white relative">
                                    <div className="absolute right-1 top-1 w-2 h-2 rounded-full bg-black"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Overview */}
                    <div className="glass-panel p-8 rounded-3xl border-white/5 bg-white/5 space-y-6">
                        <div className="flex items-center gap-3 text-slate-400">
                            <Cpu size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Environment Status</span>
                        </div>
                        <div className="space-y-3">
                            <StatusLine label="Build Version" value="3.1.0-stable" />
                            <StatusLine label="Data Engine" value="LocalStorage/V3" />
                            <StatusLine label="UI Engine" value="React/Tailwind" />
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <a
                                href="https://github.com/mefkuz1/scholarflow"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full h-12 bg-white/5 border border-white/10 text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 hover:bg-white/10 active:scale-[0.98] group"
                            >
                                <Download size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                                Github&apos;dan Güncelle (Manuel)
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-8 right-8 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20 font-bold text-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {toastMessage}
                </div>
            )}
        </div>
    );
};

const StatusLine = ({ label, value }) => (
    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
        <span className="text-slate-600 font-bold">{label}</span>
        <span className="text-slate-400 font-black">{value}</span>
    </div>
);

const LangBtn = ({ active, onClick, label }) => (
    <button
        onClick={onClick}
        className={`flex-1 h-12 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${active ? 'bg-white text-black border-white shadow-lg shadow-white/5' : 'bg-transparent border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10'}`}
    >
        {label}
    </button>
);

export default Settings;
