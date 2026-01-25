/**
 * Gerçek metin analizi fonksiyonları
 * Mock veri kullanmadan metni analiz eder
 */

// Akademik kelime listesi (Türkçe)
const academicWords = [
    'araştırma', 'çalışma', 'analiz', 'sonuç', 'yöntem', 'bulgular', 'tartışma',
    'kavram', 'teori', 'hipotez', 'değerlendirme', 'inceleme', 'kapsamlı',
    'sistematik', 'objektif', 'kanıt', 'veri', 'literatür', 'referans', 'kaynak',
    'metodoloji', 'yaklaşım', 'perspektif', 'bağlam', 'kritik', 'önemli',
    'açıklama', 'tanımlama', 'sınıflandırma', 'karşılaştırma', 'değerlendirme'
];

// Bağlaç ve geçiş kelimeleri
const transitionWords = [
    'ancak', 'fakat', 'ayrıca', 'bunun yanında', 'dolayısıyla', 'bu nedenle',
    'sonuç olarak', 'öte yandan', 'buna karşın', 'örneğin', 'diğer bir deyişle',
    'şöyle ki', 'böylece', 'bu bağlamda', 'ilk olarak', 'son olarak'
];

// Referans göstergeleri
const referenceIndicators = [
    'göre', 'belirtir', 'belirtmiştir', 'ifade eder', 'vurgular', 'açıklar',
    '(', ')', '[', ']', 'et al.', 've ark.', 'vd.'
];

/**
 * Metni analiz eder ve akademik kalite skorları döndürür
 */
export const analyzeText = (text) => {
    if (!text || text.trim().length < 50) {
        return null; // Çok kısa metinler için analiz yapma
    }

    const cleanText = text.trim();

    // Temel metrikler
    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = cleanText.split(/\s+/).filter(w => w.length > 0);
    const avgWordsPerSentence = words.length / sentences.length;

    // Akademik Dil Skoru
    const academicScore = calculateAcademicLanguageScore(cleanText, words);

    // Okunabilirlik Skoru
    const readabilityScore = calculateReadabilityScore(avgWordsPerSentence, words, sentences);

    // Referans Kalitesi Skoru
    const referenceScore = calculateReferenceQualityScore(cleanText);

    // Genel skor (ağırlıklı ortalama)
    const overallScore = Math.round(
        (academicScore * 0.35) +
        (readabilityScore * 0.35) +
        (referenceScore * 0.30)
    );

    // Öneriler oluştur
    const suggestions = generateSuggestions({
        academicScore,
        readabilityScore,
        referenceScore,
        avgWordsPerSentence,
        text: cleanText,
        words,
        sentences
    });

    return {
        overallScore,
        academicScore,
        readabilityScore,
        referenceScore,
        suggestions
    };
};

/**
 * Akademik dil kullanımı skorunu hesaplar
 */
const calculateAcademicLanguageScore = (text, words) => {
    const textLower = text.toLowerCase();

    // Akademik kelime kullanımı
    const academicWordCount = academicWords.filter(word =>
        textLower.includes(word)
    ).length;

    // Geçiş kelimesi kullanımı
    const transitionWordCount = transitionWords.filter(word =>
        textLower.includes(word)
    ).length;

    // Akademik ton (pasif yapı, formal dil)
    const hasPassiveVoice = /(ilmektedir|edilmektedir|yapılmaktadır|olunmaktadır)/i.test(text);

    // Skor hesaplama
    let score = 50; // Base score

    // Akademik kelime yoğunluğu
    const academicDensity = (academicWordCount / words.length) * 100;
    score += Math.min(academicDensity * 5, 30);

    // Geçiş kelimesi kullanımı
    if (transitionWordCount >= 3) score += 10;
    else if (transitionWordCount >= 1) score += 5;

    // Pasif yapı kullanımı
    if (hasPassiveVoice) score += 10;

    return Math.min(Math.round(score), 100);
};

/**
 * Okunabilirlik skorunu hesaplar
 */
const calculateReadabilityScore = (avgWordsPerSentence, words, sentences) => {
    let score = 50; // Base score

    // İdeal cümle uzunluğu: 15-25 kelime
    if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 25) {
        score += 25;
    } else if (avgWordsPerSentence >= 10 && avgWordsPerSentence < 15) {
        score += 15;
    } else if (avgWordsPerSentence > 25 && avgWordsPerSentence <= 35) {
        score += 10;
    } else if (avgWordsPerSentence > 35) {
        score -= 10; // Çok uzun cümleler
    }

    // Paragraf sayısı ve yapısı (her 3-5 cümle bir paragraf ideal)
    const sentenceCount = sentences.length;
    if (sentenceCount >= 5) score += 15;
    else if (sentenceCount >= 3) score += 10;

    // Kelime tekrarı kontrolü
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const vocabularyRichness = (uniqueWords.size / words.length) * 100;
    if (vocabularyRichness > 70) score += 10;
    else if (vocabularyRichness > 50) score += 5;

    return Math.min(Math.round(score), 100);
};

/**
 * Referans kalitesi skorunu hesaplar
 */
const calculateReferenceQualityScore = (text) => {
    let score = 40; // Base score (referans olmadan da minimum skor)

    // Referans göstergelerini say
    const referenceCount = referenceIndicators.filter(indicator =>
        text.includes(indicator)
    ).length;

    // Parantez kullanımı (atıf göstergesi)
    const parenthesesCount = (text.match(/\([^)]+\)/g) || []).length;

    // Tarih formatları (ör: 2020, 2019-2021)
    const yearPattern = /\b(19|20)\d{2}\b/g;
    const yearMatches = (text.match(yearPattern) || []).length;

    // Skor hesaplama
    if (referenceCount >= 5) score += 25;
    else if (referenceCount >= 3) score += 15;
    else if (referenceCount >= 1) score += 10;

    if (parenthesesCount >= 3) score += 20;
    else if (parenthesesCount >= 1) score += 10;

    if (yearMatches >= 2) score += 15;
    else if (yearMatches >= 1) score += 5;

    return Math.min(Math.round(score), 100);
};

/**
 * Metne özgü geliştirme önerileri oluşturur
 */
const generateSuggestions = (analysis) => {
    const suggestions = [];

    // Akademik dil önerileri
    if (analysis.academicScore < 70) {
        suggestions.push('sugg_academic_low');
        if (!analysis.text.toLowerCase().includes('araştırma') &&
            !analysis.text.toLowerCase().includes('çalışma')) {
            suggestions.push('sugg_explain_terms');
        }
    }

    // Okunabilirlik önerileri
    if (analysis.avgWordsPerSentence > 30) {
        suggestions.push('sugg_shorter_sentences');
    } else if (analysis.avgWordsPerSentence < 10) {
        suggestions.push('sugg_longer_sentences');
    }

    if (analysis.sentences.length < 3) {
        suggestions.push('sugg_transitions');
    }

    // Referans önerileri
    if (analysis.referenceScore < 70) {
        suggestions.push('sugg_current_refs');
        suggestions.push('sugg_cite_lit');
    }

    // Genel öneri
    if (analysis.words.length < 100) {
        suggestions.push('sugg_more_examples');
    }

    // Başarılı yönler (pozitif geri bildirim)
    if (analysis.academicScore >= 80) {
        suggestions.push('sugg_academic_ok');
    }
    if (analysis.readabilityScore >= 80) {
        suggestions.push('sugg_readability_ok');
    }
    if (analysis.referenceScore >= 80) {
        suggestions.push('sugg_refs_ok');
    }

    return suggestions;
};
