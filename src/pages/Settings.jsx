import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Globe, Moon, ShieldCheck, Cpu } from 'lucide-react';

const Settings = () => {
    const { currentLang, setLanguage, t } = useApp();
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
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
                    </div>
                </div>
            </div>
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
