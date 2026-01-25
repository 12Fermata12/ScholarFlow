import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
    Plus,
    StickyNote,
    Trash2,
    Clock
} from 'lucide-react';

const Notes = () => {
    const { notes, addNote, removeNote, t, currentLang } = useApp();
    const [isCreating, setIsCreating] = useState(false);
    const [form, setForm] = useState({ title: '', content: '' });

    const handleSave = (e) => {
        e.preventDefault();
        if (!form.title || !form.content) return;
        addNote({
            ...form,
            date: new Date().toLocaleDateString(currentLang === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })
        });
        setForm({ title: '', content: '' });
        setIsCreating(false);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 py-8">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-serif text-white flex items-center gap-4">
                        <StickyNote className="text-slate-400" size={28} />
                        {t('menu_notes')}
                    </h2>
                    <p className="text-slate-500 mt-2">{t('notes_subtitle')}</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="h-12 px-6 bg-white text-black rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 hover:bg-slate-200 active:scale-95"
                >
                    <Plus size={14} /> {t('btn_add')}
                </button>
            </header>

            {isCreating && (
                <div className="glass-panel p-8 rounded-[2.5rem] bg-[#111114] border-white/10 animate-fade-in">
                    <form onSubmit={handleSave} className="space-y-6">
                        <input
                            type="text"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            placeholder={currentLang === 'tr' ? "Not Başlığı..." : "Note Title..."}
                            className="w-full bg-transparent border-none text-2xl font-serif text-white placeholder:text-slate-800 focus:ring-0 px-0"
                            autoFocus
                        />
                        <textarea
                            value={form.content}
                            onChange={e => setForm({ ...form, content: e.target.value })}
                            placeholder={currentLang === 'tr' ? "Düşüncelerinizi buraya yazın..." : "Write your thoughts here..."}
                            className="w-full min-h-[300px] bg-transparent border-none text-[#cbd5e1] text-lg leading-relaxed placeholder:text-slate-800 focus:ring-0 px-0 resize-none"
                        />
                        <div className="flex gap-4 border-t border-white/5 pt-6">
                            <button
                                type="submit"
                                className="px-8 h-12 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                            >
                                {t('btn_save')}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="px-8 h-12 bg-transparent text-slate-500 hover:text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                            >
                                {currentLang === 'tr' ? 'İptal' : 'Cancel'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.length === 0 && !isCreating ? (
                    <div className="md:col-span-3 py-32 text-center glass-panel rounded-[2.5rem] opacity-20 border-white/5 bg-[#111114]/60">
                        <StickyNote size={64} className="mx-auto mb-6" />
                        <p className="text-sm font-medium uppercase tracking-widest">
                            {currentLang === 'tr' ? 'Henüz bir not almadınız' : 'You haven\'t taken any notes yet'}
                        </p>
                    </div>
                ) : (
                    notes.map((note, idx) => (
                        <div key={idx} className="group glass-panel p-8 rounded-3xl bg-[#111114]/60 border-white/5 hover:border-white/10 transition-all flex flex-col justify-between min-h-[250px]">
                            <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                    <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500 bg-white/5 px-2 py-1 rounded">
                                        <Clock size={10} /> {note.date}
                                    </span>
                                    <button
                                        onClick={() => removeNote(idx)}
                                        className="text-slate-800 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <h3 className="text-xl font-serif text-white">{note.title}</h3>
                                <p className="text-sm text-slate-400 line-clamp-4 leading-relaxed font-light">
                                    {note.content}
                                </p>
                            </div>
                            <div className="pt-6 border-t border-white/5 flex items-center gap-2 group-hover:gap-3 transition-all cursor-pointer">
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                                    {currentLang === 'tr' ? 'Notu Görüntüle' : 'View Note'}
                                </span>
                                <Plus size={14} className="text-slate-700 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notes;
