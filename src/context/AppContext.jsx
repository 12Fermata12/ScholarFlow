import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const DEFAULT_KEY = "AIzaSyB1poU2jWhtxbuinfE0-Zm9gMVBUUgo7Ro";

export const AppProvider = ({ children }) => {
    // Auth & Settings
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('app_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [registeredUsers, setRegisteredUsers] = useState(() => {
        const saved = localStorage.getItem('registered_users');
        return saved ? JSON.parse(saved) : [];
    });
    const [language, setLanguage] = useState(() => localStorage.getItem('app_language') || 'tr');
    const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || 'dark');
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('app_apikey') || DEFAULT_KEY);

    // Data - Partitioned by user ID
    const [citations, setCitations] = useState([]);
    const [readingList, setReadingList] = useState([]);
    const [plannerItems, setPlannerItems] = useState([]);
    const [notes, setNotes] = useState([]);
    const [dailyPomodoros, setDailyPomodoros] = useState(0);

    // Sync data when user changes
    useEffect(() => {
        if (user) {
            const suffix = `_${user.id}`;
            const savedCites = localStorage.getItem(`citations${suffix}`);
            const savedRead = localStorage.getItem(`reading_list${suffix}`);
            const savedPlan = localStorage.getItem(`planner_items${suffix}`);
            const savedNotes = localStorage.getItem(`research_notes${suffix}`);
            const savedPom = localStorage.getItem(`pomodoro_stats${suffix}`);

            setCitations(savedCites ? JSON.parse(savedCites) : []);
            setReadingList(savedRead ? JSON.parse(savedRead) : []);
            setPlannerItems(savedPlan ? JSON.parse(savedPlan) : []);
            setNotes(savedNotes ? JSON.parse(savedNotes) : []);

            if (savedPom) {
                const parsed = JSON.parse(savedPom);
                if (parsed.date === new Date().toISOString().split('T')[0]) {
                    setDailyPomodoros(parsed.count);
                } else {
                    setDailyPomodoros(0);
                }
            } else {
                setDailyPomodoros(0);
            }
        } else {
            // Clear current state if logged out
            setCitations([]);
            setReadingList([]);
            setPlannerItems([]);
            setNotes([]);
            setDailyPomodoros(0);
        }
    }, [user]);

    // Persistent Sync
    useEffect(() => localStorage.setItem('app_user', JSON.stringify(user)), [user]);
    useEffect(() => localStorage.setItem('registered_users', JSON.stringify(registeredUsers)), [registeredUsers]);
    useEffect(() => localStorage.setItem('app_language', language), [language]);
    useEffect(() => localStorage.setItem('app_apikey', apiKey), [apiKey]);

    useEffect(() => {
        if (user) {
            const suffix = `_${user.id}`;
            localStorage.setItem(`citations${suffix}`, JSON.stringify(citations));
            localStorage.setItem(`reading_list${suffix}`, JSON.stringify(readingList));
            localStorage.setItem(`planner_items${suffix}`, JSON.stringify(plannerItems));
            localStorage.setItem(`research_notes${suffix}`, JSON.stringify(notes));
            localStorage.setItem(`pomodoro_stats${suffix}`, JSON.stringify({
                date: new Date().toISOString().split('T')[0],
                count: dailyPomodoros
            }));
        }
    }, [citations, readingList, plannerItems, notes, dailyPomodoros, user]);

    // Auth Actions
    const signup = (name, email, password) => {
        if (registeredUsers.find(u => u.email === email)) throw new Error(t('err_email_used'));
        const newUser = { id: Date.now().toString(), name, email, password };
        setRegisteredUsers(prev => [...prev, newUser]);
        setUser(newUser);
        return newUser;
    };

    const login = (email, password) => {
        const found = registeredUsers.find(u => u.email === email && u.password === password);
        if (!found) throw new Error(t('err_invalid_login'));
        setUser(found);
        return found;
    };

    const logout = () => {
        setUser(null);
    };

    // Actions
    const addCitation = (citation) => setCitations(prev => [citation, ...prev]);
    const removeCitation = (index) => setCitations(prev => prev.filter((_, i) => i !== index));
    const clearCitations = () => setCitations([]);

    const addReadingItem = (item) => setReadingList(prev => [item, ...prev]);
    const updateReadingStatus = (index, status) => setReadingList(prev => prev.map((item, i) => i === index ? { ...item, status } : item));
    const removeReadingItem = (index) => setReadingList(prev => prev.filter((_, i) => i !== index));

    const addPlannerItem = (item) => setPlannerItems(prev => [...prev, item]);
    const togglePlannerItem = (index) => setPlannerItems(prev => prev.map((item, i) => i === index ? { ...item, completed: !item.completed } : item));
    const removePlannerItem = (index) => setPlannerItems(prev => prev.filter((_, i) => i !== index));

    const addNote = (note) => setNotes(prev => [note, ...prev]);
    const removeNote = (index) => setNotes(prev => prev.filter((_, i) => i !== index));

    const incrementPomodoro = () => setDailyPomodoros(prev => prev + 1);
    const toggleLanguage = () => setLanguage(prev => prev === 'tr' ? 'en' : 'tr');

    // Import/Export Functions
    const exportUserData = () => {
        const exportData = {
            version: '2.0',
            exportDate: new Date().toISOString(),
            // User & Auth
            user: user,
            registeredUsers: registeredUsers, // Backup all accounts
            apiKey: apiKey,
            // App State
            language: language,
            theme: theme,
            // Data
            citations: citations,
            readingList: readingList,
            plannerItems: plannerItems,
            notes: notes,
            dailyPomodoros: dailyPomodoros
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scholarflow_full_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const importUserData = (fileContent) => {
        try {
            const data = JSON.parse(fileContent);

            // Restore Auth & Settings
            if (data.user) setUser(data.user);
            if (data.registeredUsers) setRegisteredUsers(data.registeredUsers);
            if (data.apiKey) setApiKey(data.apiKey);
            if (data.language) setLanguage(data.language);
            if (data.theme) setTheme(data.theme);

            // Restore Data
            if (data.citations) setCitations(data.citations);
            if (data.readingList) setReadingList(data.readingList);
            if (data.plannerItems) setPlannerItems(data.plannerItems);
            if (data.notes) setNotes(data.notes);
            if (data.dailyPomodoros !== undefined) setDailyPomodoros(data.dailyPomodoros);

            return true;
        } catch (error) {
            console.error('Import error:', error);
            return false;
        }
    };

    const translations = {
        tr: {
            menu_tools: "Araçlar",
            menu_focus: "Odak Modu",
            menu_citation: "Alıntı Yöneticisi",
            menu_library: "Kaynak Kütüphanesi",
            menu_planner: "Araştırma Planlayıcı",
            menu_reading: "Okuma Listesi",
            menu_notes: "Akademik Notlar",
            system_ready: "Sistem Hazır",
            hero_title: "Araştırmanızı Bizzat Tasarlayın.",
            hero_desc: "Yapay zekanın sınırlarına takılmayın. Akıllı planlayıcı, kapsamlı okuma listesi ve not yönetim araçları ile akademik sürecinizi %100 kontrol altında tutun.",
            hero_btn_start: "Planlamaya Başla",
            hero_feat_1_title: "Yapısal Planlama",
            hero_feat_1_desc: "Araştırmanızın her aşamasını, bölüm bölüm tasarlayın ve ilerlemenizi anlık olarak takip edin.",
            hero_feat_2_title: "Literatür Takibi",
            hero_feat_2_desc: "Okuduğunuz veya okuyacağınız tüm kaynakları, durumlarıyla birlikte tek bir merkezden yönetin.",
            hero_feat_3_title: "Kalıcı Notlar",
            hero_feat_3_desc: "Eleştirel düşüncelerinizi ve literatür notlarınızı, kaybolmayacak şekilde akademik kütüphanenize kaydedin.",
            focus_subtitle: "Dış dünyayı sessize alın.",
            timer_focus: "Odaklan",
            timer_break: "Mola Ver",
            bg_sounds: "Arka Plan Sesleri",
            sound_rain: "Yağmurlu Gün",
            sound_ocean: "Okyanus Sesi",
            sound_white: "Beyaz Gürültü",
            daily_goal: "Günlük Hedef",
            goal_completed: "Tamamlanan",
            goal_target: "Hedef",
            citation_subtitle: "Akademik dürüstlük için kesin kaynakçalar.",
            cite_book: "Kitap",
            cite_article: "Makale",
            cite_website: "Web Sitesi",
            cite_label_author: "Yazar Soyadı",
            cite_label_initial: "Adı (Baş Harf)",
            cite_label_year: "Yıl",
            cite_label_title: "Eser Başlığı",
            cite_label_publisher: "Yayınevi",
            cite_label_journal: "Dergi Adı",
            cite_label_site: "Site Adı",
            cite_btn_create: "Kaynakça Oluştur",
            cite_placeholder: "Bilgileri doldurup oluştur butonuna basın...",
            btn_copy: "Kopyala",
            btn_save: "Kaydet",
            btn_clear: "Kütüphaneyi Sıfırla",
            btn_add: "Ekle",
            planner_subtitle: "Projenizin ana hatlarını ve hedeflerini belirleyin.",
            reading_subtitle: "Akademik literatür takvimi ve durum takibi.",
            notes_subtitle: "Araştırma sırasında aldığınız kritik düşünceler.",
            status_todo: "Okunacak",
            status_reading: "Okunuyor",
            status_done: "Tamamlandı",
            library_empty: "Kütüphaneniz Henüz Boş",
            settings_title: "Ayarlar",
            settings_desc: "Sistem ve Kişiselleştirme Yapılandırması",
            settings_lang: "Dil ve Bölge",
            settings_privacy: "Gizlilik ve Veri",
            settings_privacy_desc: "Tüm verileriniz (notlar, planlar ve okuma listesi) yalnızca bu tarayıcıda saklanır.",
            settings_appearance: "Görünüm",
            settings_save: "Tercihleri Kaydet",
            login_title: "Tekrar Hoş Geldiniz",
            login_subtitle: "Akademik yolculuğunuza devam edin.",
            login_btn: "Giriş Yap",
            login_btn_import: "Verileri İçe Aktar",
            login_no_account: "Hesabınız yok mu?",
            login_go_signup: "Hemen Kaydolun",
            signup_title: "Hesap Oluştur",
            signup_subtitle: "ScholarFlow akademik topluluğuna katılın.",
            signup_btn: "Hesap Oluştur",
            signup_has_account: "Zaten hesabınız var mı?",
            signup_go_login: "Giriş Yapın",
            label_name: "Ad Soyad",
            label_email: "E-posta",
            label_password: "Şifre",
            label_academician: "Akademisyen",
            label_logout: "Çıkış Yap",
            err_email_used: "Bu e-posta zaten kullanımda.",
            err_invalid_login: "E-posta veya şifre hatalı.",
            toast_copied: "Kopyalandı!",
            toast_time_up: "Süre doldu!",
            toast_saved: "Kaydedildi.",
            menu_ai_score: "AI Puanlama",
            ai_score_title: "AI Akademik Puanlama",
            ai_score_subtitle: "Metninizin akademik kalitesini yapay zeka ile değerlendirin.",
            ai_metric_lang: "Akademik Dil",
            ai_metric_read: "Okunabilirlik",
            ai_metric_ref: "Referans Kalitesi",
            ai_suggestions: "Geliştirme Önerileri",
            ai_overall_score: "Genel Puan",
            settings_api_key: "AI API Anahtarı",
            settings_export: "Verileri Dışa Aktar",
            settings_import: "Verileri İçe Aktar",
            toast_exported: "Veriler başarıyla dışa aktarıldı!",
            toast_imported: "Veriler başarıyla içe aktarıldı!",
            toast_import_error: "İçe aktarma hatası!",
            ai_sample_text: "Analiz etmek istediğiniz metni buraya yapıştırın...",
            menu_pdf_analyzer: "PDF Analizcisi",
            pdf_analyzer_title: "PDF Akademik Analiz",
            pdf_analyzer_subtitle: "PDF dosyalarınızdan özet ve anahtar kelimeler oluşturun.",
            pdf_drop_zone: "Dosyaları buraya sürükleyin veya seçmek için tıklayın",
            pdf_processing: "PDF İşleniyor...",
            pdf_summary: "Özet",
            pdf_keywords: "Anahtar Kelimeler",
            pdf_no_file: "Henüz bir dosya seçilmedi.",
            chat_welcome: "Merhaba! Ben akademik araştırma partnerinizim. Size nasıl yardımcı olabilirim?",
            chat_api_needed: "Sohbet etmek için lütfen ayarlardan Gemini API anahtarınızı girin.",
            chat_system_prompt: "Sen bilgili, nazik ve profesyonel bir akademik araştırma partnerisin. Kullanıcıya tez yazımı, literatür taraması, metodoloji tasarımı ve akademik dil konusunda yardımcı oluyorsun. Yanıtların akademik bir tonda olmalı ama anlaşılır kalmalı.",
            chat_error: "Üzgünüm, bir hata oluştu. Lütfen API anahtarınızı kontrol edin.",
            chat_placeholder: "Mesajınızı yazın...",
            chat_academic_partner: "Akademik Partner",
            chat_online: "Çevrimiçi",
            score_input_label: "Metin Girişi",
            score_reset_btn: "Temizle",
            score_error_empty: "Lütfen analiz edilecek bir metin girin.",
            score_error_short: "Metin çok kısa. En az 50 karakter giriniz.",
            score_error_failed: "Metin analiz edilemedi. Lütfen daha uzun bir metin girin.",
            score_error_generic: "Analiz sırasında bir hata oluştu.",
            score_analyzing: "Analiz Ediliyor...",
            score_analyze_btn: "Analiz Et",
            score_stats_info: "{chars} karakter • {words} kelime",
            score_ai_active: "Gemini AI önerileri aktif",
            score_local_active: "API anahtarı girilmedi - yerel analiz kullanılıyor",
            score_api_error: "Gemini API'ye bağlanılamadı. Lütfen API anahtarınızı kontrol edin. Yerel öneriler gösteriliyor.",
            score_no_results: "Analiz sonuçları burada görünecek",
            pdf_error_invalid: "Lütfen geçerli bir PDF dosyası yükleyin.",
            pdf_error_api: "PDF analizi için lütfen ayarlardan Gemini API anahtarınızı girin.",
            pdf_error_generic: "Analiz sırasında bir hata oluştu. Lütfen API anahtarınızı kontrol edin.",
            pdf_processing_subtitle: "Akademik içgörüler oluşturuluyor...",
            pdf_summary_title: "Metin Özeti",
            pdf_keywords_title: "Anahtar Kavramlar",
            pdf_new_file: "Yeni Dosya Yükle",
            view_details: "Detayları Gör",
            app_title: "ScholarFlow - Akademik Üretkenlik Paketi",
            label_email_placeholder: "ornek@edu.tr",
            sugg_academic_low: "Daha fazla akademik terim ve kavram kullanarak metninizi güçlendirebilirsiniz.",
            sugg_explain_terms: "Teknik terimlerin tanımlarını ilk kullanımda açıklayın.",
            sugg_shorter_sentences: "Bazı cümleleri daha kısa ve öz hale getirerek okunabilirliği artırabilirsiniz.",
            sugg_longer_sentences: "Cümlelerinizi biraz daha detaylandırarak akademik derinliği artırabilirsiniz.",
            sugg_transitions: "Metninizde paragraf geçişlerinde tutarlı bağlaçlar kullanın.",
            sugg_current_refs: "Güncel kaynakları referans olarak eklemek metninizi güçlendirir.",
            sugg_cite_lit: "İddialarınızı desteklemek için literatürdeki ilgili çalışmalara atıfta bulunun.",
            sugg_more_examples: "Argümanlarınızı daha kapsamlı örneklerle destekleyebilirsiniz.",
            sugg_academic_ok: "✓ Akademik dil kullanımınız başarılı, devam edin.",
            sugg_readability_ok: "✓ Metniniz akıcı ve okunabilir bir yapıda.",
            sugg_refs_ok: "✓ Referans kullanımınız akademik standartlara uygun."
        },
        en: {
            menu_tools: "Tools",
            menu_focus: "Focus Mode",
            menu_citation: "Citation Manager",
            menu_library: "Source Library",
            menu_planner: "Research Planner",
            menu_reading: "Reading List",
            menu_notes: "Academic Notes",
            system_ready: "System Ready",
            hero_title: "Design Your Research Personally.",
            hero_desc: "Don't get stuck by AI limits. Keep 100% control of your academic process with a smart planner, volume reading list, and note management tools.",
            hero_btn_start: "Start Planning",
            hero_feat_1_title: "Structural Planning",
            hero_feat_1_desc: "Design every stage of your research, chapter by chapter, and track your progress instantly.",
            hero_feat_2_title: "Literature Tracking",
            hero_feat_2_desc: "Manage all sources you read or will read from a single center, with their statuses.",
            hero_feat_3_title: "Permanent Notes",
            hero_feat_3_desc: "Capture your critical thoughts and literature notes in your academic library permanently.",
            focus_subtitle: "Silence the outside world.",
            timer_focus: "Focus",
            timer_break: "Break",
            bg_sounds: "Background Sounds",
            sound_rain: "Rainy Day",
            sound_ocean: "Ocean Sound",
            sound_white: "White Noise",
            daily_goal: "Daily Goal",
            goal_completed: "Completed",
            goal_target: "Target",
            citation_subtitle: "Precise citations for academic integrity.",
            cite_book: "Book",
            cite_article: "Article",
            cite_website: "Website",
            cite_label_author: "Author Last Name",
            cite_label_initial: "Initial",
            cite_label_year: "Year",
            cite_label_title: "Title",
            cite_label_publisher: "Publisher",
            cite_label_journal: "Journal Name",
            cite_label_site: "Site Name",
            cite_btn_create: "Generate Citation",
            cite_placeholder: "Fill in the details and click generate...",
            btn_copy: "Copy",
            btn_save: "Save",
            btn_clear: "Reset Library",
            btn_add: "Add",
            planner_subtitle: "Define your project outline and goals.",
            reading_subtitle: "Academic literature schedule and status tracking.",
            notes_subtitle: "Critical thoughts captured during research.",
            status_todo: "To Read",
            status_reading: "Reading",
            status_done: "Finished",
            library_empty: "Your Library is empty",
            settings_title: "Settings",
            settings_desc: "System and Personalization Configuration",
            settings_lang: "Language & Region",
            settings_privacy: "Privacy & Data",
            settings_privacy_desc: "All your data (notes, plans, and reading list) is stored only in this browser.",
            settings_appearance: "Appearance",
            settings_save: "Save Preferences",
            login_title: "Welcome Back",
            login_subtitle: "Continue your academic journey.",
            login_btn: "Login",
            login_btn_import: "Import Data",
            login_no_account: "Don't have an account?",
            login_go_signup: "Sign up now",
            signup_title: "Create Account",
            signup_subtitle: "Join the ScholarFlow academic community.",
            signup_btn: "Create Account",
            signup_has_account: "Already have an account?",
            signup_go_login: "Log in",
            label_name: "Full Name",
            label_email: "Email",
            label_password: "Password",
            label_academician: "Academician",
            label_logout: "Log Out",
            err_email_used: "This email is already in use.",
            err_invalid_login: "Invalid email or password.",
            toast_copied: "Copied!",
            toast_time_up: "Time's up!",
            toast_saved: "Saved.",
            menu_ai_score: "AI Scoring",
            ai_score_title: "AI Academic Scoring",
            ai_score_subtitle: "Evaluate your text's academic quality with AI.",
            ai_metric_lang: "Academic Language",
            ai_metric_read: "Readability",
            ai_metric_ref: "Reference Quality",
            ai_suggestions: "Improvement Suggestions",
            ai_overall_score: "Overall Score",
            settings_api_key: "AI API Key",
            settings_export: "Export Data",
            settings_import: "Import Data",
            toast_exported: "Data exported successfully!",
            toast_imported: "Data imported successfully!",
            toast_import_error: "Import error!",
            ai_sample_text: "Paste the text you want to analyze here...",
            menu_pdf_analyzer: "PDF Analyzer",
            pdf_analyzer_title: "PDF Academic Analysis",
            pdf_analyzer_subtitle: "Generate summary and keywords from your PDF files.",
            pdf_drop_zone: "Drag & drop files here, or click to select",
            pdf_processing: "Processing PDF...",
            pdf_summary: "Summary",
            pdf_keywords: "Keywords",
            pdf_no_file: "No file selected yet.",
            chat_welcome: "Hello! I am your academic research partner. How can I help you?",
            chat_api_needed: "Please enter your Gemini API key in settings to chat.",
            chat_system_prompt: "You are a knowledgeable, polite, and professional academic research partner. You help the user with thesis writing, literature review, methodology design, and academic language. Your responses should be in an academic tone but remain understandable.",
            chat_error: "Sorry, an error occurred. Please check your API key.",
            chat_placeholder: "Type your message...",
            chat_academic_partner: "Academic Partner",
            chat_online: "Online",
            score_input_label: "Text Input",
            score_reset_btn: "Clear",
            score_error_empty: "Please enter a text to analyze.",
            score_error_short: "Text is too short. Please enter at least 50 characters.",
            score_error_failed: "Text could not be analyzed. Please enter a longer text.",
            score_error_generic: "An error occurred during analysis.",
            score_analyzing: "Analyzing...",
            score_analyze_btn: "Analyze",
            score_stats_info: "{chars} characters • {words} words",
            score_ai_active: "Gemini AI suggestions active",
            score_local_active: "API key not entered - using local analysis",
            score_api_error: "Could not connect to Gemini API. Please check your API key. Local suggestions are shown.",
            score_no_results: "Analysis results will appear here",
            pdf_error_invalid: "Please upload a valid PDF file.",
            pdf_error_api: "Please enter your Gemini API key in settings for PDF analysis.",
            pdf_error_generic: "An error occurred during analysis. Please check your API key.",
            pdf_processing_subtitle: "Generating academic insights...",
            pdf_summary_title: "Text Summary",
            pdf_keywords_title: "Key Concepts",
            pdf_new_file: "Upload New File",
            view_details: "View Details",
            app_title: "ScholarFlow - Academic Productivity Suite",
            label_email_placeholder: "example@edu.tr",
            sugg_academic_low: "You can strengthen your text by using more academic terms and concepts.",
            sugg_explain_terms: "Explain the definitions of technical terms on their first use.",
            sugg_shorter_sentences: "You can improve readability by making some sentences shorter and more concise.",
            sugg_longer_sentences: "You can increase academic depth by elaborating on your sentences a bit more.",
            sugg_transitions: "Use consistent transitions in paragraph transitions in your text.",
            sugg_current_refs: "Adding current sources as references strengthens your text.",
            sugg_cite_lit: "Cite relevant studies in the literature to support your claims.",
            sugg_more_examples: "You can support your arguments with more comprehensive examples.",
            sugg_academic_ok: "✓ Your academic language usage is successful, keep it up.",
            sugg_readability_ok: "✓ Your text has a fluid and readable structure.",
            sugg_refs_ok: "✓ Your reference usage complies with academic standards."
        }
    };

    const t = (key) => translations[language][key] || key;

    return (
        <AppContext.Provider value={{
            user, signup, login, logout,
            currentLang: language, setLanguage, toggleLanguage,
            theme, setTheme,
            apiKey, setApiKey,
            citations, addCitation, removeCitation, clearCitations,
            readingList, addReadingItem, updateReadingStatus, removeReadingItem,
            plannerItems, addPlannerItem, togglePlannerItem, removePlannerItem,
            notes, addNote, removeNote,
            dailyPomodoros, incrementPomodoro,
            exportUserData, importUserData,
            t
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
