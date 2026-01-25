import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const DEFAULT_KEY = "AIzaSyC70OpCzgI013zA0vpUSPuxiTzIyZKELR4";

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
            toast_saved: "Kaydedildi."
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
            toast_saved: "Saved."
        }
    };

    const t = (key) => translations[language][key] || key;

    return (
        <AppContext.Provider value={{
            user, signup, login, logout,
            currentLang: language, setLanguage, toggleLanguage,
            theme, setTheme,
            citations, addCitation, removeCitation, clearCitations,
            readingList, addReadingItem, updateReadingStatus, removeReadingItem,
            plannerItems, addPlannerItem, togglePlannerItem, removePlannerItem,
            notes, addNote, removeNote,
            dailyPomodoros, incrementPomodoro,
            t
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
