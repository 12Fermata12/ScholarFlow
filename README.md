# Akıllı Akademik Araçlar (Smart Academic Tools)

Google Gemini destekli, üretkenlik ve akademik yazım asistanı.

## Özellikler

- **Konu Sihirbazı**: Araştırma konuları için APA kaynak önerileri.
- **Yazma Asistanı**: Okunabilirlik ve akademik ton analizi.
- **Pomodoro**: Odaklanma zamanlayıcısı ve ambiyans sesleri (White Noise, Yağmur, Okyanus).
- **Kütüphane**: Kaynakça yönetimi.

## Kurulum ve Çalıştırma

Bu proje React ve Vite ile hazırlanmıştır. Çalıştırmak için Node.js gereklidir.

1. Proje klasörüne gidin:
   ```bash
   cd smart-academic-tools
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. Uygulamayı başlatın:
   ```bash
   npm run dev -- --host
   ```
   
4. Tarayıcıda açılan linke tıklayın (Genellikle `http://localhost:5173`).

## API Anahtarı

Uygulamanın AI özelliklerini kullanmak için bir Google Gemini API anahtarına ihtiyacınız vardır.
1. [Google AI Studio](https://aistudio.google.com/) adresinden API anahtarı alın.
2. Uygulama içinde **Ayarlar** menüsüne giderek anahtarınızı kaydedin.

## Teknoloji

- React
- Tailwind CSS
- Google Generative AI SDK
- Web Audio API
