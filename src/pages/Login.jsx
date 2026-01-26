import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.png';

const Login = () => {
    const { login, importUserData, t } = useApp();
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
                    <img src={logo} alt="Logo" className="mx-auto h-20 w-20 bg-white rounded-3xl shadow-2xl shadow-white/10 mb-8 p-4 object-contain" />
                    <h2 className="text-4xl font-serif text-white tracking-tight">{t('login_title')}</h2>
                    <p className="mt-3 text-slate-400 text-sm font-medium tracking-wide">{t('login_subtitle')}</p>
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
                                    placeholder={t('label_email_placeholder')}
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

                    <div className="flex flex-col gap-3">
                        <button
                            type="submit"
                            className="w-full h-14 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-3 hover:bg-slate-200 hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/10"
                        >
                            <LogIn size={18} strokeWidth={2.5} />
                            {t('login_btn')}
                        </button>

                        <label className="w-full h-14 bg-white/5 border border-white/10 text-slate-300 rounded-2xl font-bold uppercase tracking-[0.15em] text-[10px] transition-all flex items-center justify-center gap-3 hover:bg-white/10 hover:text-white hover:border-white/20 active:scale-95 cursor-pointer group">
                            <LogIn size={18} className="rotate-90 text-slate-500 group-hover:text-white transition-colors" />
                            {t('login_btn_import')}
                            <input
                                type="file"
                                accept=".json"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (f) => {
                                            const success = importUserData(f.target.result);
                                            if (success) {
                                                navigate('/');
                                            } else {
                                                setError(t('toast_import_error'));
                                            }
                                        };
                                        reader.readAsText(file);
                                    }
                                }}
                            />
                        </label>
                    </div>

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
