import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Gemini API kullanarak metin analizi yapar ve öneriler üretir
 */
export const getGeminiSuggestions = async (text, apiKey) => {
    if (!apiKey || !text) {
        return null;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `Aşağıdaki akademik metni analiz et ve geliştirme önerileri sun. Öneriler kısa, net ve uygulanabilir olmalı. Her öneriyi tek bir cümle olarak yaz. En fazla 5 öneri ver.

Metin:
"${text}"

Şu konularda öneriler sun:
1. Akademik dil kullanımı
2. Cümle yapısı ve okunabilirlik
3. Referans ve kaynak kullanımı
4. Argüman geliştirme

Sadece önerileri madde madde listele, başka açıklama yapma. Her öneri tek satır olsun.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const suggestions = response.text();

        // Parse suggestions (her satır bir öneri)
        const suggestionList = suggestions
            .split('\n')
            .filter(line => line.trim().length > 0)
            .map(line => line.replace(/^[-*•]\s*/, '').trim())
            .filter(line => line.length > 10) // Çok kısa satırları filtrele
            .slice(0, 5); // Maksimum 5 öneri

        return suggestionList.length > 0 ? suggestionList : null;
    } catch (error) {
        console.error('Gemini API Error:', error);
        return null;
    }
};
