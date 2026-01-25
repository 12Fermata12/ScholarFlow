import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Scorecard from '../components/Scorecard';
import { Sparkles, FileText, AlertCircle } from 'lucide-react';
import { analyzeText } from '../utils/textAnalysis';
import { getGeminiSuggestions } from '../utils/geminiApi';

const AiScorecard = () => {
    const { t, apiKey } = useApp();
    const [inputText, setInputText] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [error, setError] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = async () => {
        setError('');
        setIsAnalyzing(true);

        if (!inputText.trim()) {
            setError(t('score_error_empty'));
            setIsAnalyzing(false);
            return;
        }

        if (inputText.trim().length < 50) {
            setError(t('score_error_short'));
            setIsAnalyzing(false);
            return;
        }

        try {
            const result = analyzeText(inputText);

            if (!result) {
                setError(t('score_error_failed'));
                setIsAnalyzing(false);
                return;
            }

            let finalSuggestions = result.suggestions;
            let apiError = false;

            if (apiKey && apiKey.trim().length > 0) {
                try {
                    const geminiSuggestions = await getGeminiSuggestions(inputText, apiKey);
                    if (geminiSuggestions && geminiSuggestions.length > 0) {
                        finalSuggestions = geminiSuggestions;
                    } else {
                        apiError = true;
                    }
                } catch (apiErr) {
                    console.error('Gemini API Error:', apiErr);
                    apiError = true;
                }
            }

            setAnalysisResult({
                ...result,
                suggestions: finalSuggestions,
                apiError: apiError && apiKey
            });
        } catch (err) {
            console.error('Analysis error:', err);
            setError(t('score_error_generic'));
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleReset = () => {
        setInputText('');
        setAnalysisResult(null);
        setError('');
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 py-8 px-4">
            <header className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/5">
                        <Sparkles className="text-white" size={28} />
                    </div>
                    <h1 className="text-3xl font-serif text-white">{t('ai_score_title')}</h1>
                </div>
                <p className="text-slate-500 text-sm">{t('ai_score_subtitle')}</p>
            </header>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="glass-panel p-6 rounded-2xl border-white/5 bg-[#111114]/60 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <FileText className="text-slate-400" size={18} />
                            <h2 className="text-white font-semibold text-sm">{t('score_input_label')}</h2>
                        </div>
                        {analysisResult && (
                            <button
                                onClick={handleReset}
                                className="text-xs text-slate-500 hover:text-white transition-colors"
                            >
                                {t('score_reset_btn')}
                            </button>
                        )}
                    </div>

                    <textarea
                        value={inputText}
                        onChange={(e) => {
                            setInputText(e.target.value);
                            setError('');
                        }}
                        placeholder={t('ai_sample_text')}
                        className="w-full h-64 bg-black/30 border border-white/10 rounded-xl p-4 text-slate-300 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none transition-all"
                    />

                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <AlertCircle className="text-red-400" size={16} />
                            <p className="text-xs text-red-300">{error}</p>
                        </div>
                    )}

                    <button
                        onClick={handleAnalyze}
                        disabled={!inputText.trim() || isAnalyzing}
                        className="w-full h-12 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <Sparkles size={16} className={isAnalyzing ? 'animate-spin' : ''} />
                            {isAnalyzing ? t('score_analyzing') : t('score_analyze_btn')}
                        </span>
                    </button>

                    <div className="pt-2 border-t border-white/5 space-y-1">
                        <p className="text-[10px] text-slate-600 leading-relaxed">
                            {t('score_stats_info').replace('{chars}', inputText.length).replace('{words}', inputText.split(/\s+/).filter(w => w.length > 0).length)}
                        </p>
                        {apiKey ? (
                            <p className="text-[10px] text-emerald-500 leading-relaxed flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                {t('score_ai_active')}
                            </p>
                        ) : (
                            <p className="text-[10px] text-slate-600 leading-relaxed">
                                {t('score_local_active')}
                            </p>
                        )}
                    </div>
                </div>

                {/* Results Section */}
                <div className={`transition-all duration-500 ${analysisResult ? 'opacity-100 scale-100' : 'opacity-40 scale-95'}`}>
                    {analysisResult ? (
                        <>
                            <Scorecard
                                score={analysisResult.overallScore}
                                metrics={[
                                    { label: t('ai_metric_lang'), value: analysisResult.academicScore },
                                    { label: t('ai_metric_read'), value: analysisResult.readabilityScore },
                                    { label: t('ai_metric_ref'), value: analysisResult.referenceScore }
                                ]}
                                suggestions={analysisResult.suggestions.map(text => ({ text: t(text) }))}
                            />
                            {analysisResult.apiError && (
                                <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                                    <p className="text-xs text-yellow-200 flex items-center gap-2">
                                        <AlertCircle size={14} />
                                        <span>{t('score_api_error')}</span>
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="glass-panel p-8 rounded-2xl border-white/5 bg-[#111114]/60 h-full flex items-center justify-center">
                            <div className="text-center space-y-3">
                                <Sparkles className="mx-auto text-slate-700" size={48} />
                                <p className="text-slate-600 text-xs uppercase tracking-widest font-bold">
                                    {t('score_no_results')}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AiScorecard;
