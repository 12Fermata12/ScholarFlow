import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
    const { login, t } = useApp();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        try {
            login(form.email, form.password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 glass-panel p-10 rounded-[2.5rem] bg-[#111114]/60 border-white/5">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-white text-black rounded-xl flex items-center justify-center font-serif font-bold text-2xl shadow-xl mb-6">S</div>
                    <h2 className="text-3xl font-serif text-white">{t('login_title')}</h2>
                    <p className="mt-2 text-slate-500 text-sm">{t('login_subtitle')}</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-xl flex items-center gap-3 text-sm animate-fade-in">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">{t('label_email')}</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all font-medium"
                                    placeholder="ornek@edu.tr"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">{t('label_password')}</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all font-medium"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full h-14 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3 hover:bg-slate-200 active:scale-95 shadow-xl shadow-white/5"
                    >
                        <LogIn size={18} />
                        {t('login_btn')}
                    </button>

                    <div className="text-center pt-4">
                        <p className="text-sm text-slate-500">
                            {t('login_no_account')}{' '}
                            <NavLink to="/signup" className="text-white font-bold hover:underline transition-all">
                                {t('login_go_signup')}
                            </NavLink>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
