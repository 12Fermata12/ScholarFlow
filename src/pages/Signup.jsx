import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.png';

const Signup = () => {
    const { signup, t } = useApp();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        try {
            signup(form.name, form.email, form.password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 glass-panel p-10 rounded-[2.5rem] bg-[#111114]/60 border-white/5 relative overflow-hidden">
                <div className="text-center relative z-10">
                    <img src={logo} alt="Logo" className="mx-auto h-16 w-16 bg-white rounded-2xl shadow-xl mb-6 p-3 object-contain" />
                    <h2 className="text-3xl font-serif text-white">{t('signup_title')}</h2>
                    <p className="mt-2 text-slate-500 text-sm">{t('signup_subtitle')}</p>
                </div>

                <form className="mt-8 space-y-5 relative z-10" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-xl flex items-center gap-3 text-sm animate-fade-in">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">{t('label_name')}</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                <input
                                    type="text"
                                    required
                                    className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all font-medium"
                                    placeholder="Ahmet Yılmaz"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">{t('label_email')}</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all font-medium"
                                    placeholder="ahmet@universite.edu.tr"
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
                        className="w-full h-14 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3 hover:bg-slate-200 active:scale-95 shadow-xl shadow-white/5 mt-6"
                    >
                        <UserPlus size={18} />
                        {t('signup_btn')}
                    </button>

                    <div className="text-center pt-4">
                        <p className="text-sm text-slate-500">
                            {t('signup_has_account')}{' '}
                            <NavLink to="/login" className="text-white font-bold hover:underline transition-all">
                                {t('signup_go_login')}
                            </NavLink>
                        </p>
                    </div>
                </form>

                {/* Visual Flair */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />
            </div>
        </div>
    );
};

export default Signup;
