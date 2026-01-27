import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Gemini API kullanarak metin analizi yapar ve öneriler üretir
 */
export const getGeminiSuggestions = async (text, apiKey) => {
    if (!apiKey || !text) {
        return null;
    }

    // Track timeout ID for cleanup
    let timeoutId = null;

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Aşağıdaki akademik metni analiz et ve geliştirme önerileri sun. Öneriler kısa, net ve uygulanabilir olmalı. Her öneriyi tek bir cümle olarak yaz. En fazla 5 öneri ver.

Metin:
"${text}"

Şu konularda öneriler sun:
1. Akademik dil kullanımı
2. Cümle yapısı ve okunabilirlik
3. Referans ve kaynak kullanımı
4. Argüman geliştirme

Sadece önerileri madde madde listele, başka açıklama yapma. Her öneri tek satır olsun.`;

        // Create timeout promise with cleanup
        const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
                reject(new Error('API request timeout after 30 seconds'));
            }, 30000);
        });

        // Race between API call and timeout
        const result = await Promise.race([
            model.generateContent(prompt),
            timeoutPromise
        ]);

        // Clear timeout on success
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }

        const response = await result.response;

        // Validate response
        if (!response || !response.text) {
            console.error('[GeminiAPI] Invalid API response:', response);
            return null;
        }

        const suggestions = response.text();

        // Parse suggestions (her satır bir öneri)
        const suggestionList = suggestions
            .split('\n')
            .filter(line => line.trim().length > 0)
            .map(line => line.replace(/^[-*•\d.]\s*/, '').trim())
            .filter(line => line.length > 10) // Çok kısa satırları filtrele
            .slice(0, 5); // Maksimum 5 öneri

        return suggestionList.length > 0 ? suggestionList : null;
    } catch (error) {
        // Always clean up timeout
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }

        console.error('[GeminiAPI] Error:', error);

        // More specific error logging
        if (error.message?.includes('timeout')) {
            console.error('[GeminiAPI] Request timed out');
        } else if (error.message?.includes('quota')) {
            console.error('[GeminiAPI] API quota exceeded');
        } else if (error.message?.includes('key')) {
            console.error('[GeminiAPI] Invalid API key');
        } else {
            console.error('[GeminiAPI] Unknown error:', error.message);
        }

        return null;
    }
};
