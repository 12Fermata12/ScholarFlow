import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
    Play,
    Pause,
    RotateCcw,
    CloudRain,
    Waves,
    Waves as NoiseIcon,
    Volume2,
    Clock
} from 'lucide-react';

const Pomodoro = () => {
    const { incrementPomodoro, dailyPomodoros, t, currentLang } = useApp();
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [initialTime, setInitialTime] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [timerMode, setTimerMode] = useState('pomodoro');
    const [activeSound, setActiveSound] = useState(null);
    const [volume, setVolume] = useState(0.5);

    const audioCtxRef = useRef(null);
    const noiseSourceRef = useRef(null);
    const audioRefs = {
        rain: useRef(new Audio('https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg')),
        ocean: useRef(new Audio('https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg'))
    };

    useEffect(() => {
        Object.values(audioRefs).forEach(ref => {
            if (ref.current) {
                ref.current.loop = true;
                ref.current.volume = volume;
            }
        });
    }, [volume]);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play();
            if (timerMode === 'pomodoro') incrementPomodoro();
            alert(t('toast_time_up'));
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, timerMode]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(initialTime);
    };

    const setMode = (mode, minutes) => {
        setTimerMode(mode);
        setInitialTime(minutes * 60);
        setTimeLeft(minutes * 60);
        setIsActive(false);
    };

    const toggleSound = (type) => {
        if (activeSound === type) {
            stopAllSounds();
            setActiveSound(null);
        } else {
            stopAllSounds();
            if (type === 'white') {
                startWhiteNoise();
            } else {
                audioRefs[type].current.play();
            }
            setActiveSound(type);
        }
    };

    const stopAllSounds = () => {
        Object.values(audioRefs).forEach(ref => {
            ref.current.pause();
            ref.current.currentTime = 0;
        });
        if (noiseSourceRef.current) {
            noiseSourceRef.current.stop();
            noiseSourceRef.current = null;
        }
    };

    const startWhiteNoise = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        const gainNode = ctx.createGain();
        gainNode.gain.value = volume * 0.1;
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        noise.start();
        noiseSourceRef.current = noise;
    };

    const progress = (timeLeft / initialTime) * 283;

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 py-8">
            <header>
                <h2 className="text-3xl font-serif text-white flex items-center gap-4">
                    <Clock className="text-slate-400" size={28} />
                    {t('menu_focus')}
                </h2>
                <p className="text-slate-500 mt-2">{t('focus_subtitle')}</p>
            </header>

            <div className="grid md:grid-cols-2 gap-12 items-start">
                {/* Timer Card */}
                <div className="glass-panel p-12 rounded-3xl flex flex-col items-center justify-center space-y-10 relative overflow-hidden bg-[#111114]/40 border-white/5">
                    <div className="relative w-72 h-72">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle className="text-slate-800 stroke-current" strokeWidth="3" cx="50" cy="50" r="45" fill="transparent"></circle>
                            <circle
                                className="text-white progress-ring__circle stroke-current transition-all duration-300"
                                strokeWidth="3"
                                strokeLinecap="round"
                                cx="50" cy="50" r="45" fill="transparent"
                                strokeDasharray="283"
                                style={{ strokeDashoffset: 283 - progress }}
                            ></circle>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-7xl font-mono font-bold text-white tracking-tighter">{formatTime(timeLeft)}</span>
                            <span className="text-[10px] text-slate-400 mt-3 font-black uppercase tracking-[0.3em]">
                                {isActive ? (currentLang === 'tr' ? 'Odaklanılıyor' : 'Focusing') : (currentLang === 'tr' ? 'Duraklatıldı' : 'Paused')}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 z-10">
                        <button
                            onClick={toggleTimer}
                            className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:bg-slate-200 transition-all shadow-xl active:scale-95"
                        >
                            {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                        </button>
                        <button
                            onClick={resetTimer}
                            className="w-12 h-12 rounded-full bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                        >
                            <RotateCcw size={20} />
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <ModeBtn active={timerMode === 'pomodoro'} onClick={() => setMode('pomodoro', 25)} label="25m" />
                        <ModeBtn active={timerMode === 'short'} onClick={() => setMode('short', 5)} label="5m" />
                        <ModeBtn active={timerMode === 'long'} onClick={() => setMode('long', 15)} label="15m" />
                    </div>
                </div>

                {/* Side Controls */}
                <div className="space-y-6">
                    <div className="glass-panel p-8 rounded-3xl border-white/5">
                        <h3 className="text-white font-medium mb-6 flex items-center gap-2">
                            <Volume2 size={18} className="text-slate-500" />
                            <span className="text-sm font-semibold tracking-wide uppercase">{t('bg_sounds')}</span>
                        </h3>
                        <div className="space-y-3">
                            <SoundItem
                                icon={<CloudRain size={16} />}
                                active={activeSound === 'rain'}
                                onClick={() => toggleSound('rain')}
                                label={t('sound_rain')}
                            />
                            <SoundItem
                                icon={<Waves size={16} />}
                                active={activeSound === 'ocean'}
                                onClick={() => toggleSound('ocean')}
                                label={t('sound_ocean')}
                            />
                            <SoundItem
                                icon={<NoiseIcon size={16} />}
                                active={activeSound === 'white'}
                                onClick={() => toggleSound('white')}
                                label={t('sound_white')}
                            />
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-4">
                            <Volume2 size={14} className="text-slate-500" />
                            <input
                                type="range"
                                min="0" max="1" step="0.01"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="flex-1 accent-white h-0.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="glass-panel p-8 rounded-3xl border-white/5">
                        <h3 className="text-white font-medium mb-4 text-sm font-semibold uppercase tracking-wide">{t('daily_goal')}</h3>
                        <div className="flex justify-between text-xs text-slate-500 mb-3 font-bold uppercase tracking-widest">
                            <span>{t('goal_completed')}: <span className="text-white">{dailyPomodoros}</span></span>
                            <span>{t('goal_target')}: 8</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                                style={{ width: `${Math.min((dailyPomodoros / 8) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ModeBtn = ({ active, onClick, label }) => (
    <button
        onClick={onClick}
        className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${active ? 'bg-white text-black border-white shadow-lg shadow-white/5' : 'bg-white/5 text-slate-500 border-transparent hover:text-slate-300'}`}
    >
        {label}
    </button>
);

const SoundItem = ({ icon, active, onClick, label }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group border ${active ? 'bg-white/5 border-white/10 shadow-lg' : 'bg-transparent border-transparent hover:bg-white/[0.02]'}`}
    >
        <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-lg border transition-colors ${active ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-slate-500 group-hover:text-white group-hover:border-white/10'}`}>
                {icon}
            </div>
            <span className={`text-sm font-medium transition-colors ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{label}</span>
        </div>
        <div className={`w-1.2 h-1.2 rounded-full transition-all ${active ? 'bg-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.6)]' : 'bg-transparent'}`}></div>
    </button>
);

export default Pomodoro;
