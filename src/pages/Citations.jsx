import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
    Copy,
    Bookmark,
    Trash2,
    BookOpen,
    Globe,
    FileText,
    Sparkles,
    CheckCircle2,
    ListFilter,
    Quote
} from 'lucide-react';
import { formatCitation, formats } from '../utils/citationFormatter';

const Citations = () => {
    const { addCitation, citations, removeCitation, clearCitations, t, currentLang } = useApp();
    const [citationFormat, setCitationFormat] = useState('APA');
    const [type, setType] = useState('book');
    const [form, setForm] = useState({
        authorLast: '',
        authorFirst: '',
        year: '',
        title: '',
        source: '',
        doi: '',
        url: ''
    });
    const [preview, setPreview] = useState('');
    const [toast, setToast] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const generateCitation = () => {
        if (!form.authorLast || !form.title) return;

        let result = "";
        if (type === 'book') {
            result = `${form.authorLast}, ${form.authorFirst} (${form.year}). ${form.title}. ${form.source}.`;
        } else if (type === 'article') {
            result = `${form.authorLast}, ${form.authorFirst} (${form.year}). ${form.title}. ${form.source}${form.doi ? '. https://doi.org/' + form.doi : '.'}`;
        } else {
            result = `${form.authorLast}, ${form.authorFirst} (${form.year}). ${form.title}. ${form.source}. ${form.url}`;
        }
        setPreview(result);
    };

    const handleCopy = () => {
        if (!preview) return;
        navigator.clipboard.writeText(preview.replace(/<[^>]*>/g, ''));
        setToast(t('toast_copied'));
        setTimeout(() => setToast(''), 2000);
    };

    const handleSave = () => {
        if (!form.authorLast || !form.title) return;
        addCitation({
            ...form,
            id: Date.now().toString(),
            citationType: type,
            dateAdded: new Date().toISOString()
        });
        setForm({
            authorLast: '',
            authorFirst: '',
            year: '',
            title: '',
            source: '',
            doi: '',
            url: ''
        });
        setPreview('');
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 py-8">
            <header>
                <h2 className="text-3xl font-serif text-white flex items-center gap-4">
                    <Quote className="text-slate-400 rotate-180" size={28} />
                    {t('menu_citation')}
                </h2>
                <p className="text-slate-500 mt-2">{t('citation_subtitle')}</p>
            </header>

            <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] border-white/5 bg-[#111114]/60">
                <div className="flex gap-6 mb-10 border-b border-white/5 pb-6">
                    <TypeBtn active={type === 'book'} onClick={() => setType('book')} label={t('cite_book')} icon={<BookOpen size={14} />} />
                    <TypeBtn active={type === 'article'} onClick={() => setType('article')} label={t('cite_article')} icon={<FileText size={14} />} />
                    <TypeBtn active={type === 'website'} onClick={() => setType('website')} label={t('cite_website')} icon={<Globe size={14} />} />
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Input label={t('cite_label_author')} value={form.authorLast} onChange={v => setForm({ ...form, authorLast: v })} />
                            <Input label={t('cite_label_initial')} value={form.authorFirst} onChange={v => setForm({ ...form, authorFirst: v })} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1">
                                <Input label={t('cite_label_year')} value={form.year} onChange={v => setForm({ ...form, year: v })} />
                            </div>
                            <div className="col-span-2">
                                <Input label={t('cite_label_title')} value={form.title} onChange={v => setForm({ ...form, title: v })} />
                            </div>
                        </div>

                        <Input
                            label={type === 'book' ? t('cite_label_publisher') : (type === 'article' ? t('cite_label_journal') : t('cite_label_site'))}
                            value={form.source} onChange={v => setForm({ ...form, source: v })}
                        />

                        {type === 'article' && <Input label="DOI" placeholder="10.xxxx/yyyy" value={form.doi} onChange={v => setForm({ ...form, doi: v })} />}
                        {type === 'website' && <Input label="URL" placeholder="https://..." value={form.url} onChange={v => setForm({ ...form, url: v })} />}

                        <button
                            onClick={generateCitation}
                            className="w-full h-14 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            <Sparkles size={16} />
                            {t('cite_btn_create')}
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-[#0a0a0c]/40 rounded-3xl p-8 border border-white/5 min-h-[250px] flex flex-col justify-between group">
                            <div>
                                <div className="flex items-center justify-between mb-8 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">APA 7th Edition</span>
                                    <CheckCircle2 size={14} className="text-white" />
                                </div>
                                <div className={`text-xl font-serif leading-relaxed transition-all duration-700 ${preview ? 'text-[#e2e8f0]' : 'text-slate-700 italic'}`}>
                                    {preview ? (
                                        <span dangerouslySetInnerHTML={{ __html: preview.replace(/\. (.+?)\./, '. <i>$1</i>.') }} />
                                    ) : (
                                        t('cite_placeholder')
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-10">
                                <button
                                    onClick={handleCopy}
                                    disabled={!preview}
                                    className="flex-1 h-12 rounded-lg border border-white/10 bg-white/5 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors disabled:opacity-20 flex items-center justify-center gap-2"
                                >
                                    <Copy size={14} /> {t('btn_copy')}
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={!preview}
                                    className="flex-1 h-12 rounded-lg bg-white overflow-hidden text-black text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors disabled:opacity-20 flex items-center justify-center gap-2"
                                >
                                    <Bookmark size={14} /> {t('btn_save')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Library Section */}
            <section className="space-y-8 pt-12">
                <header className="flex justify-between items-center border-b border-white/5 pb-6">
                    <h3 className="text-2xl font-serif text-white">{t('menu_library')}</h3>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
                            <ListFilter size={12} className="text-slate-500 ml-1" />
                            <select
                                value={citationFormat}
                                onChange={(e) => setCitationFormat(e.target.value)}
                                className="bg-transparent text-slate-300 text-[10px] font-bold focus:outline-none cursor-pointer pr-2 uppercase tracking-widest"
                            >
                                {formats.map(f => <option key={f} value={f} className="bg-[#0a0a0c]">{f}</option>)}
                            </select>
                        </div>
                        {citations.length > 0 && (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2"
                            >
                                <Trash2 size={12} /> {t('btn_clear')}
                            </button>
                        )}
                    </div>
                </header>

                <div className="grid gap-4">
                    {citations.length === 0 ? (
                        <div className="py-20 text-center glass-panel rounded-3xl opacity-40">
                            <BookOpen size={48} className="mx-auto mb-4 text-slate-800" />
                            <p className="text-sm font-medium tracking-widest uppercase">{t('library_empty')}</p>
                        </div>
                    ) : (
                        citations.map((cite, idx) => (
                            <div key={idx} className="group glass-panel p-6 rounded-2xl flex justify-between items-center bg-white/[0.02] border-white/[0.05] hover:border-white/10 transition-all">
                                <div className="font-serif text-slate-300 text-sm leading-relaxed pr-8">
                                    {typeof cite === 'string' ? (
                                        <div dangerouslySetInnerHTML={{ __html: cite }} />
                                    ) : (
                                        formatCitation(cite, citationFormat)
                                    )}
                                </div>
                                <button
                                    onClick={() => removeCitation(idx)}
                                    className="p-2.5 rounded-lg text-slate-600 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-8 right-8 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20 font-bold text-sm animate-in fade-in slide-in-from-bottom-4 duration-300 z-50">
                    {toast}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111114] border border-white/10 rounded-2xl p-8 max-w-md mx-4 space-y-6">
                        <h3 className="text-white text-lg font-semibold">
                            {currentLang === 'tr' ? 'Emin misiniz?' : 'Are you sure?'}
                        </h3>
                        <p className="text-slate-400 text-sm">
                            {currentLang === 'tr'
                                ? 'Tüm kaynakçalar kalıcı olarak silinecek.'
                                : 'All citations will be permanently deleted.'}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 h-12 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all text-xs font-bold uppercase"
                            >
                                {currentLang === 'tr' ? 'İptal' : 'Cancel'}
                            </button>
                            <button
                                onClick={() => {
                                    clearCitations();
                                    setShowDeleteConfirm(false);
                                }}
                                className="flex-1 h-12 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all text-xs font-bold uppercase"
                            >
                                {currentLang === 'tr' ? 'Sil' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const TypeBtn = ({ active, onClick, label, icon }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 pb-2 border-b-2 ${active ? 'text-white border-white' : 'text-slate-600 border-transparent hover:text-slate-400'}`}
    >
        {icon} <span>{label}</span>
    </button>
);

const Input = ({ label, value, onChange, placeholder = '' }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">{label}</label>
        <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-12 bg-white/5 border border-white/5 rounded-xl px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 focus:bg-white/[0.08] transition-all placeholder:text-slate-700"
        />
    </div>
);

export default Citations;
