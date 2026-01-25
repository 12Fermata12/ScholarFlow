import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    Clock,
    BookOpen,
    Settings,
    Menu,
    Globe,
    Home,
    ListTodo,
    StickyNote,
    LogOut
} from 'lucide-react';

const Layout = ({ children }) => {
    const { currentLang, toggleLanguage, t, user, logout } = useApp();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

    const navItems = [
        { to: "/", icon: <Home size={18} className="text-slate-400" />, label: 'Dashboard' },
        { to: "/planner", icon: <ListTodo size={18} className="text-slate-400" />, label: t('menu_planner') },
        { to: "/reading", icon: <BookOpen size={18} className="text-slate-400" />, label: t('menu_reading') },
        { to: "/citations", icon: <BookOpen size={18} className="text-slate-400" />, label: t('menu_citation') },
        { to: "/notes", icon: <StickyNote size={18} className="text-slate-400" />, label: t('menu_notes') },
        { to: "/pomodoro", icon: <Clock size={18} className="text-slate-400" />, label: t('menu_focus') },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0a0c] text-[#e2e8f0] overflow-hidden selection:bg-white/10 selection:text-white font-sans">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-[#0a0a0c]/95 backdrop-blur-md border-b border-white/5 h-16 flex-shrink-0">
                <div className="w-full px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="md:hidden text-slate-400 hover:text-white focus:outline-none p-2">
                            <Menu size={24} />
                        </button>

                        <NavLink to="/" className="flex items-center gap-3 group transition">
                            <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-serif font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">S</div>
                            <span className="text-lg font-semibold tracking-tight text-white group-hover:opacity-80 transition font-sans">ScholarFlow</span>
                        </NavLink>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-2 text-[10px] font-bold bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 transition text-slate-300 hover:text-white uppercase tracking-widest"
                        >
                            <Globe size={12} className="text-slate-500" /> <span>{currentLang?.toUpperCase()}</span>
                        </button>

                        <div className="h-5 w-px bg-white/10 mx-1"></div>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex flex-col items-end text-right">
                                    <span className="text-[10px] font-bold text-white leading-none">{user.name}</span>
                                    <span className="text-[8px] text-slate-500 uppercase tracking-widest mt-1">{t('label_academician')}</span>
                                </div>
                                <button onClick={handleLogout} className="text-slate-400 hover:text-rose-500 transition p-2" title={t('label_logout')}>
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <NavLink to="/login" className="text-xs font-bold text-white bg-white/5 px-4 py-2 rounded-lg hover:bg-white/10 transition">
                                {t('login_btn')}
                            </NavLink>
                        )}

                        <NavLink to="/settings" className="text-slate-400 hover:text-white transition p-2 hover:rotate-45 duration-500" title={t('settings_title')}>
                            <Settings size={20} />
                        </NavLink>
                    </div>
                </div>
            </nav>

            <div className="flex flex-grow h-[calc(100vh-4rem)] relative">
                {/* Sidebar */}
                <aside
                    className={`
                        absolute md:relative z-40 h-full bg-[#0a0a0a] border-r border-white/5 
                        flex flex-col transition-all duration-300 ease-in-out overflow-hidden
                        ${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-16 md:translate-x-0'}
                    `}
                >
                    <div className="flex-1 py-6 space-y-1 px-2.5 overflow-y-auto custom-scrollbar">
                        <div className={`px-4 pb-2 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                            {t('menu_tools')}
                        </div>

                        {navItems.map(item => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                                    ${isActive
                                        ? 'bg-white/10 text-white border-r-2 border-white/60 shadow-sm'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}
                                `}
                                title={!sidebarOpen ? item.label : ''}
                            >
                                <div className={`flex-shrink-0 transition-transform duration-300 ${!sidebarOpen ? 'mx-auto scale-110' : ''}`}>
                                    {item.icon}
                                </div>
                                <span className={`font-medium text-xs whitespace-nowrap transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 absolute left-full pointer-events-none'}`}>
                                    {item.label}
                                </span>
                            </NavLink>
                        ))}
                    </div>

                    <div className="p-4 border-t border-white/5">
                        <div className={`flex items-center gap-3 p-2 opacity-40 hover:opacity-100 transition duration-500 ${!sidebarOpen ? 'justify-center' : ''}`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            {sidebarOpen && <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{t('system_ready')}</span>}
                        </div>
                    </div>
                </aside>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/80 z-30 md:hidden backdrop-blur-sm"
                    />
                )}

                {/* Main Content */}
                <main className="flex-grow bg-[#0a0a0c] overflow-y-auto w-full scroll-smooth">
                    <div className="max-w-7xl mx-auto h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
