import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
    Plus,
    CheckCircle2,
    Circle,
    Trash2,
    ListTodo
} from 'lucide-react';

const Planner = () => {
    const { plannerItems, addPlannerItem, togglePlannerItem, removePlannerItem, t } = useApp();
    const [input, setInput] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        addPlannerItem({ text: input, completed: false });
        setInput('');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 py-8">
            <header>
                <h2 className="text-3xl font-serif text-white flex items-center gap-4">
                    <ListTodo className="text-slate-400" size={28} />
                    {t('menu_planner')}
                </h2>
                <p className="text-slate-500 mt-2">{t('planner_subtitle')}</p>
            </header>

            <div className="glass-panel p-8 rounded-[2.5rem] bg-[#111114]/60 border-white/5 space-y-8">
                <form onSubmit={handleAdd} className="flex gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder={t('currentLang') === 'tr' ? 'Örn: Literatür taramasını tamamla...' : 'Ex: Complete literature review...'}
                        className="flex-1 h-14 bg-[#0a0a0c] border border-white/5 rounded-2xl px-6 text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all font-medium"
                    />
                    <button
                        type="submit"
                        className="h-14 px-8 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 hover:bg-slate-200 active:scale-95"
                    >
                        <Plus size={16} />
                        {t('btn_add')}
                    </button>
                </form>

                <div className="space-y-3">
                    {plannerItems.length === 0 ? (
                        <div className="py-20 text-center opacity-20">
                            <ListTodo size={64} className="mx-auto mb-6" />
                            <p className="text-sm font-medium uppercase tracking-widest">
                                {t('currentLang') === 'tr' ? 'Henüz bir hedef eklemediniz' : 'You haven\'t added any goals yet'}
                            </p>
                        </div>
                    ) : (
                        plannerItems.map((item, idx) => (
                            <div key={idx} className="group glass-panel p-5 rounded-2xl flex justify-between items-center transition-all bg-white/[0.02] border-white/5 hover:border-white/10">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => togglePlannerItem(idx)}
                                        className={`transition-colors ${item.completed ? 'text-emerald-500' : 'text-slate-600 hover:text-slate-400'}`}
                                    >
                                        {item.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                    </button>
                                    <span className={`text-lg font-medium transition-all ${item.completed ? 'text-slate-500 line-through opacity-50' : 'text-slate-200'}`}>
                                        {item.text}
                                    </span>
                                </div>
                                <button
                                    onClick={() => removePlannerItem(idx)}
                                    className="p-2 text-slate-700 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Progress Overview */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-panel p-8 rounded-3xl border-white/5 flex flex-col justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        {t('currentLang') === 'tr' ? 'Tamamlanma Oranı' : 'Completion Rate'}
                    </span>
                    <div className="flex items-end gap-4 mt-4">
                        <span className="text-5xl font-serif text-white">
                            {plannerItems.length > 0 ? Math.round((plannerItems.filter(i => i.completed).length / plannerItems.length) * 100) : 0}%
                        </span>
                        <div className="h-2 flex-1 bg-white/5 rounded-full overflow-hidden mb-3">
                            <div
                                className="h-full bg-white transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                                style={{ width: `${plannerItems.length > 0 ? (plannerItems.filter(i => i.completed).length / plannerItems.length) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Planner;
