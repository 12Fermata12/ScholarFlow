import React from 'react';

const Scorecard = ({ score = 0, metrics = [], suggestions = [] }) => {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="glass-panel p-6 rounded-2xl border-white/5 bg-[#111114]/60 space-y-6">
            {/* Circular Score */}
            <div className="flex flex-col items-center justify-center space-y-3">
                <div className="relative w-36 h-36">
                    <svg className="transform -rotate-90 w-36 h-36">
                        {/* Background circle */}
                        <circle
                            cx="72"
                            cy="72"
                            r="45"
                            stroke="rgba(255, 255, 255, 0.05)"
                            strokeWidth="6"
                            fill="none"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="72"
                            cy="72"
                            r="45"
                            stroke="url(#scoreGradient)"
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="100%" stopColor="#64748b" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-white">{score}</span>
                        <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">/ 100</span>
                    </div>
                </div>
            </div>

            {/* Metrics Bars */}
            <div className="space-y-4">
                {metrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400 font-medium">{metric.label}</span>
                            <span className="text-[10px] text-slate-600 font-bold">{metric.value}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-white to-slate-400 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${metric.value}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Suggestions List */}
            {suggestions.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-white/5">
                    <h3 className="text-white font-semibold text-xs uppercase tracking-widest">
                        Geliştirme Önerileri
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-400 leading-relaxed">
                        {suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="text-slate-400 mt-0.5">•</span>
                                <span>{suggestion.text || suggestion}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Scorecard;
