import React from 'react';
import { useApp } from '../context/AppContext';
import { NavLink } from 'react-router-dom';
import {
    CheckCircle2,
    Play,
    ArrowRight,
    ListTodo,
    BookOpen,
    StickyNote
} from 'lucide-react';

const Dashboard = () => {
    const { t, citations, readingList, notes } = useApp();

    return (
        <section className="min-h-full flex flex-col justify-center py-12 md:py-24 text-center md:text-left">
            <div className="space-y-10">
                <div className="space-y-6">
                    <span className="inline-block py-1 px-4 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">
                        ScholarFlow Academic v3.1
                    </span>

                    <h1 className="text-5xl md:text-8xl font-serif font-medium text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-500 leading-[1.1] tracking-tight pb-2">
                        {t('hero_title')}
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed font-light">
                        {t('hero_desc')}
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
                    <NavLink to="/planner" className="px-8 py-4 bg-white text-black rounded-xl font-bold hover:bg-slate-200 transition flex items-center gap-3 group shadow-xl shadow-white/5 active:scale-95">
                        <ListTodo size={14} fill="currentColor" />
                        <span>{t('hero_btn_start')}</span>
                        <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                    </NavLink>

                    <NavLink to="/reading" className="px-8 py-4 bg-transparent border border-white/10 text-white rounded-xl font-bold hover:bg-white/5 hover:border-white/20 transition-all flex items-center gap-2 active:scale-95">
                        <span>{t('menu_reading')}</span>
                    </NavLink>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-20 border-t border-white/5 mt-12 mb-20">
                    <StatCard
                        label={t('menu_citation')}
                        value={citations.length}
                        icon={<BookOpen size={16} />}
                        to="/citations"
                    />
                    <StatCard
                        label={t('menu_reading')}
                        value={readingList.length}
                        icon={<ListTodo size={16} />}
                        to="/reading"
                    />
                    <StatCard
                        label={t('menu_notes')}
                        value={notes.length}
                        icon={<StickyNote size={16} />}
                        to="/notes"
                    />
                </div>

                {/* Decorative background pulse */}
                <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-white/[0.01] rounded-full blur-[120px] -z-10 pointer-events-none" />
            </div>
        </section>
    );
};

const StatCard = ({ label, value, icon, to }) => {
    const { t } = useApp();
    return (
        <NavLink to={to} className="glass-panel p-8 rounded-3xl border border-white/5 bg-[#111114]/60 hover:bg-[#111114]/80 hover:border-white/20 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-2xl bg-white/5 text-slate-400 border border-white/5 group-hover:text-white group-hover:border-white/20 transition-all duration-500">
                        {icon}
                    </div>
                    <span className="text-4xl font-serif text-white tracking-tight">{value}</span>
                </div>
                <div className="space-y-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-300 transition-colors">{label}</h3>
                    <div className="flex items-center gap-2 text-[9px] text-emerald-500 uppercase tracking-widest font-bold pt-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                        <span>{t('view_details')}</span> <ArrowRight size={12} />
                    </div>
                </div>
            </div>
        </NavLink>
    );
};

export default Dashboard;
