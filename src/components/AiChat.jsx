import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { MessageSquare, Send, X, Sparkles, User, Bot, Minimize2, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const AiChat = () => {
    const { t, apiKey, currentLang } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, role: 'bot', text: t('chat_welcome'), time: new Date() }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isFullScreen]);

    // Update welcome message when language changes if it's the only message
    useEffect(() => {
        if (messages.length === 1 && messages[0].role === 'bot') {
            setMessages([
                { ...messages[0], text: t('chat_welcome') }
            ]);
        }
    }, [currentLang, t]);

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMsg = { id: Date.now(), role: 'user', text: inputValue, time: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsLoading(true);

        if (!apiKey) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'bot',
                text: t('chat_api_needed'),
                time: new Date()
            }]);
            setIsLoading(false);
            return;
        }

        try {
            const prompt = `${t('chat_system_prompt')}
            
            Kullanıcı sorusu (${currentLang}): "${inputValue}"`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            const data = await response.json();
            const botText = data.candidates[0].content.parts[0].text;

            setMessages(prev => [...prev, {
                id: Date.now() + 2,
                role: 'bot',
                text: botText,
                time: new Date()
            }]);
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 3,
                role: 'bot',
                text: t('chat_error'),
                time: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const chatWindowStyle = isFullScreen
        ? {
            position: 'fixed',
            zIndex: 99999,
            top: '20px',
            left: '20px',
            right: '20px',
            bottom: '20px',
            backgroundColor: '#0a0a0c',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }
        : {
            position: 'fixed',
            zIndex: 99999,
            width: '400px',
            height: '600px',
            bottom: '100px',
            right: '30px',
            backgroundColor: '#0a0a0c',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        };

    return (
        <>
            {/* Chat Window - Portalled to body to avoid clipping */}
            {isOpen && createPortal(
                <div style={chatWindowStyle}>
                    {/* Header */}
                    <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white leading-tight">{t('chat_academic_partner')}</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold">{t('chat_online')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsFullScreen(!isFullScreen)}
                                className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
                                title={isFullScreen ? 'Küçült' : 'Tam Ekran'}
                            >
                                {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                            </button>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setIsFullScreen(false);
                                }}
                                className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-grow p-5 overflow-y-auto space-y-6 custom-scrollbar bg-[#0a0a0c]">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${msg.role === 'user' ? 'bg-white/10 text-slate-400' : 'bg-white text-black'}`}>
                                        {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                    </div>
                                    <div className={`
                                        p-4 rounded-2xl text-sm leading-relaxed font-['Inter',sans-serif]
                                        ${msg.role === 'user'
                                            ? 'bg-white text-black rounded-tr-none font-medium'
                                            : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none text-slate-300'}
                                    `}>
                                        <ReactMarkdown
                                            remarkPlugins={[remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                            components={{
                                                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                                                em: ({ children }) => <em className="italic text-slate-400">{children}</em>,
                                                ul: ({ children }) => <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>,
                                                ol: ({ children }) => <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>,
                                                li: ({ children }) => <li className="text-slate-300">{children}</li>,
                                                code: ({ inline, children }) => (
                                                    inline
                                                        ? <code className="bg-white/10 px-1 py-0.5 rounded text-pink-400 text-[13px]">{children}</code>
                                                        : <pre className="bg-black/50 p-3 rounded-lg border border-white/10 overflow-x-auto my-2 text-[13px] text-emerald-400"><code>{children}</code></pre>
                                                ),
                                            }}
                                        >
                                            {msg.text}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex gap-3 max-w-[85%]">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center">
                                        <Bot size={14} />
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 rounded-tl-none flex gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:0.2s]"></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:0.4s]"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-5 border-t border-white/5 bg-[#0a0a0c]">
                        <div className="flex gap-2 bg-white/5 rounded-2xl p-1 border border-white/5 focus-within:border-white/20 transition-all">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={t('chat_placeholder')}
                                className="flex-grow bg-transparent px-4 py-3 text-sm text-white focus:outline-none placeholder:text-slate-600"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim() || isLoading}
                                className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center hover:bg-slate-200 transition-colors disabled:opacity-20 flex-shrink-0"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Floating Bubble */}
            <div className="fixed bottom-6 right-6 z-[100] font-sans w-16 h-16 flex items-center justify-center">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
                        w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 active:scale-90
                        ${isOpen ? 'bg-white text-black rotate-90 scale-0' : 'bg-white text-black scale-100 hover:scale-110'}
                    `}
                >
                    <MessageSquare size={28} />
                </button>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
                        absolute top-0 left-0 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500
                        ${isOpen ? 'bg-white text-black scale-100 hover:scale-110 opacity-100' : 'bg-white text-black scale-0 opacity-0'}
                    `}
                >
                    <X size={28} />
                </button>
            </div>
        </>
    );
};

export default AiChat;
