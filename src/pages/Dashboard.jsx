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
    const { t } = useApp();

    return (
        <section className="min-h-full flex flex-col justify-center py-12 md:py-24 text-center md:text-left">
            <div className="space-y-10">
                <div className="space-y-6">
                    <span className="inline-block py-1 px-4 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">
                        ScholarFlow Academic v3.1
                    </span>

                    <h1 className="text-5xl md:text-8xl font-serif font-medium text-white leading-[1.1] tracking-tight">
                        {t('hero_title').split(' ').map((word, i) => (
                            word.toLowerCase() === 'bizzat' || word.toLowerCase() === 'personally.' ?
                                <span key={i} className="text-slate-500 italic block md:inline">{word} </span> :
                                <span key={i}>{word} </span>
                        ))}
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

                    <NavLink to="/reading" className="px-8 py-4 bg-transparent border border-white/10 text-white rounded-xl font-bold hover:bg-white/5 transition flex items-center gap-2 active:scale-95">
                        <span>{t('menu_reading')}</span>
                    </NavLink>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-20 border-t border-white/5 mt-12">
                    <FeatureCard
                        icon={<ListTodo size={20} />}
                        title={t('hero_feat_1_title')}
                        desc={t('hero_feat_1_desc')}
                    />
                    <FeatureCard
                        icon={<BookOpen size={20} />}
                        title={t('hero_feat_2_title')}
                        desc={t('hero_feat_2_desc')}
                    />
                    <FeatureCard
                        icon={<StickyNote size={20} />}
                        title={t('hero_feat_3_title')}
                        desc={t('hero_feat_3_desc')}
                    />
                </div>

                {/* Decorative background pulse */}
                <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-white/[0.01] rounded-full blur-[120px] -z-10 pointer-events-none" />
            </div>
        </section>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="space-y-3 group text-left">
        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
            {icon}
        </div>
        <h3 className="text-white font-semibold text-lg">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">
            {desc}
        </p>
    </div>
);

export default Dashboard;
