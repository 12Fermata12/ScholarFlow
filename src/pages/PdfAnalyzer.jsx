import React, { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { useDropzone } from 'react-dropzone';
import { FileUp, FileSearch, Sparkles, CheckCircle2, Loader2, Key } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { getGeminiSuggestions } from '../utils/geminiApi';

// Set up PDF.js worker
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const PdfAnalyzer = () => {
    const { t, apiKey } = useApp();
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [activeTab, setActiveTab] = useState('summary');
    const [error, setError] = useState('');

    const extractTextFromPdf = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        // Extract from first 10 pages maximum to avoid token limits
        const maxPages = Math.min(pdf.numPages, 10);
        for (let i = 1; i <= maxPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }
        return fullText;
    };

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file || file.type !== 'application/pdf') {
            setError(t('pdf_error_invalid'));
            return;
        }

        if (!apiKey) {
            setError(t('pdf_error_api'));
            return;
        }

        setIsProcessing(true);
        setError('');
        setResult(null);

        try {
            const text = await extractTextFromPdf(file);

            // Prepare prompt for Gemini
            const prompt = `Aşağıdaki akademik metni (${currentLang}) analiz et. 
            Lütfen iki bölüm halinde yanıt ver:
            1. OKUNABİLİR ÖZET: Metnin ana argümanlarını, metodolojisini ve sonuçlarını içeren 2-3 paragraflık bir özet.
            2. ANAHTAR KELİMELER: Metni temsil eden en önemli 10 anahtar kelime (virgülle ayrılmış).

            Metin:
            "${text.substring(0, 15000)}"`;

            // We reuse getGeminiSuggestions but with a custom prompt logic here 
            // Better to have a direct call or update getGeminiSuggestions to be more flexible
            // For now, I'll implement a local fetch for speed or stick to the utility.
            // Let's use a raw fetch to ensure the exact prompt format for Summary/Keywords.

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            const data = await response.json();
            const aiResponse = data.candidates[0].content.parts[0].text;

            // Parse AI response (basic split for demo)
            const summaryMatch = aiResponse.match(/OKUNABİLİR ÖZET:?([\s\S]*?)(?=ANAHTAR KELİMELER|$)/i);
            const keywordsMatch = aiResponse.match(/ANAHTAR KELİMELER:?([\s\S]*)/i);

            setResult({
                summary: summaryMatch ? summaryMatch[1].trim() : aiResponse,
                keywords: keywordsMatch ? keywordsMatch[1].trim().split(',').map(k => k.trim()) : []
            });
        } catch (err) {
            console.error('PDF Analysis Error:', err);
            setError(t('pdf_error_generic'));
        } finally {
            setIsProcessing(false);
        }
    }, [apiKey]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    });

    return (
        <div className="max-w-5xl mx-auto space-y-8 py-8 px-4">
            <header className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/5">
                        <FileSearch className="text-white" size={28} />
                    </div>
                    <h1 className="text-3xl font-serif text-white">{t('pdf_analyzer_title')}</h1>
                </div>
                <p className="text-slate-500 text-sm">{t('pdf_analyzer_subtitle')}</p>
            </header>

            {!result && !isProcessing && (
                <div
                    {...getRootProps()}
                    className={`
                        glass-panel p-20 rounded-[2.5rem] border-2 border-dashed transition-all duration-300 cursor-pointer
                        flex flex-col items-center justify-center space-y-4
                        ${isDragActive ? 'border-white/40 bg-white/5' : 'border-white/5 hover:border-white/10 hover:bg-white/[0.02]'}
                    `}
                >
                    <input {...getInputProps()} />
                    <div className="p-6 rounded-full bg-white/5 text-slate-400">
                        <FileUp size={48} strokeWidth={1.5} />
                    </div>
                    <div className="text-center">
                        <p className="text-white font-medium">{t('pdf_drop_zone')}</p>
                        <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">PDF (MAX 10 PAGES)</p>
                    </div>
                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs mt-4">
                            <AlertCircle size={14} />
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            )}

            {isProcessing && (
                <div className="glass-panel p-20 rounded-[2.5rem] border-white/5 bg-[#111114]/60 flex flex-col items-center justify-center space-y-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full border-4 border-white/5 border-t-white animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="text-white animate-pulse" size={24} />
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-xl font-serif text-white">{t('pdf_processing')}</h2>
                        <p className="text-slate-500 text-xs animate-pulse lowercase tracking-widest">{t('pdf_processing_subtitle')}</p>
                    </div>
                </div>
            )}

            {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex gap-4 p-1 bg-white/5 rounded-2xl w-fit">
                        <TabBtn
                            active={activeTab === 'summary'}
                            onClick={() => setActiveTab('summary')}
                            label={t('pdf_summary')}
                        />
                        <TabBtn
                            active={activeTab === 'keywords'}
                            onClick={() => setActiveTab('keywords')}
                            label={t('pdf_keywords')}
                        />
                    </div>

                    <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 bg-[#111114]/60 min-h-[400px]">
                        {activeTab === 'summary' ? (
                            <div className="prose prose-invert max-w-none">
                                <div className="flex items-center gap-3 mb-6">
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                    <h3 className="text-lg font-serif text-white m-0">{t('pdf_summary_title')}</h3>
                                </div>
                                <div className="text-slate-300 leading-relaxed font-serif text-lg space-y-4 whitespace-pre-line">
                                    {result.summary}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                    <h3 className="text-lg font-serif text-white uppercase tracking-widest text-xs">{t('pdf_keywords_title')}</h3>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {result.keywords.map((kw, i) => (
                                        <span key={i} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors">
                                            # {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center">
                            <button
                                onClick={() => setResult(null)}
                                className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <FileUp size={14} /> {t('pdf_new_file')}
                            </button>
                            <p className="text-[10px] text-slate-700 uppercase tracking-widest">Analyzed by Gemini-2.5-Flash</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const TabBtn = ({ active, onClick, label }) => (
    <button
        onClick={onClick}
        className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${active ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
    >
        {label}
    </button>
);

const AlertCircle = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
);

export default PdfAnalyzer;
