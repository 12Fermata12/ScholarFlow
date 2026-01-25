import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
    Plus,
    BookOpen,
    Trash2,
    ExternalLink,
    CheckCircle2,
    Timer,
    CircleDot
} from 'lucide-react';

const ReadingList = () => {
    const { readingList, addReadingItem, updateReadingStatus, removeReadingItem, t, currentLang } = useApp();
    const [form, setForm] = useState({ title: '', author: '', url: '' });

    const handleAdd = (e) => {
        e.preventDefault();
        if (!form.title) return;
        addReadingItem({ ...form, status: 'todo' });
        setForm({ title: '', author: '', url: '' });
    };

    const statusIcons = {
        todo: <CircleDot size={14} className="text-slate-500" />,
        reading: <Timer size={14} className="text-blue-400" />,
        done: <CheckCircle2 size={14} className="text-emerald-500" />
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 py-8">
            <header>
                <h2 className="text-3xl font-serif text-white flex items-center gap-4">
                    <BookOpen className="text-slate-400" size={28} />
                    {t('menu_reading')}
                </h2>
                <p className="text-slate-500 mt-2">{t('reading_subtitle')}</p>
            </header>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Form Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-panel p-8 rounded-[2.5rem] bg-[#111114]/60 border-white/5">
                        <form onSubmit={handleAdd} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
                                    {currentLang === 'tr' ? 'Eser Adı' : 'Title'}
                                </label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    placeholder={currentLang === 'tr' ? "Örn: Bilimsel Devrimlerin Yapısı" : "Ex: The Structure of Scientific Revolutions"}
                                    className="w-full h-12 bg-white/5 border border-white/5 rounded-xl px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
                                    {currentLang === 'tr' ? 'Yazar / Kaynak' : 'Author / source'}
                                </label>
                                <input
                                    type="text"
                                    value={form.author}
                                    onChange={e => setForm({ ...form, author: e.target.value })}
                                    placeholder="Thomas Kuhn"
                                    className="w-full h-12 bg-white/5 border border-white/5 rounded-xl px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">URL ({currentLang === 'tr' ? 'İsteğe Bağlı' : 'Optional'})</label>
                                <input
                                    type="text"
                                    value={form.url}
                                    onChange={e => setForm({ ...form, url: e.target.value })}
                                    placeholder="https://scholar.google.com/..."
                                    className="w-full h-12 bg-white/5 border border-white/5 rounded-xl px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all font-medium"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full h-14 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 hover:bg-slate-200 active:scale-95 mt-4"
                            >
                                <Plus size={16} />
                                {t('btn_add')}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Area */}
                <div className="lg:col-span-2 space-y-4">
                    {readingList.length === 0 ? (
                        <div className="py-32 text-center glass-panel rounded-[2.5rem] opacity-20">
                            <BookOpen size={64} className="mx-auto mb-6" />
                            <p className="text-sm font-medium uppercase tracking-widest">{t('library_empty')}</p>
                        </div>
                    ) : (
                        readingList.map((item, idx) => (
                            <div key={idx} className="group glass-panel p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/[0.02] border-white/5 hover:border-white/10 transition-all">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1 px-2 rounded-md bg-white/5 border border-white/10 flex items-center gap-2">
                                            {statusIcons[item.status]}
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{t(`status_${item.status}`)}</span>
                                        </div>
                                        {item.url && (
                                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-1 rounded bg-white/5 border border-white/10 text-slate-500 hover:text-white transition-colors">
                                                <ExternalLink size={12} />
                                            </a>
                                        )}
                                    </div>
                                    <h4 className="text-lg font-serif text-white">{item.title}</h4>
                                    <p className="text-xs text-slate-500 uppercase font-black tracking-widest">{item.author}</p>
                                </div>

                                <div className="flex items-center gap-2 self-end md:self-auto">
                                    <StatusBtn active={item.status === 'todo'} onClick={() => updateReadingStatus(idx, 'todo')} label={t('status_todo')} />
                                    <StatusBtn active={item.status === 'reading'} onClick={() => updateReadingStatus(idx, 'reading')} label={t('status_reading')} />
                                    <StatusBtn active={item.status === 'done'} onClick={() => updateReadingStatus(idx, 'done')} label={t('status_done')} />
                                    <button
                                        onClick={() => removeReadingItem(idx)}
                                        className="ml-2 p-2.5 rounded-lg text-slate-700 hover:text-rose-500 hover:bg-rose-500/5 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const StatusBtn = ({ active, onClick, label }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter border transition-all ${active ? 'bg-white text-black border-white' : 'bg-white/5 text-slate-600 border-transparent hover:text-slate-400'}`}
    >
        {label}
    </button>
);

export default ReadingList;
