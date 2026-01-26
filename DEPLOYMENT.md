# 🚀 ScholarFlow - Ubuntu Sunucu Kurulum Rehberi

Bu rehber, **ScholarFlow** uygulamasını sıfırdan bir Ubuntu sunucusuna kurmanız için gereken tüm adımları içerir.

---

## 📋 Özet Adımlar
1. Node.js ve npm kurulumu
2. Projeyi GitHub'dan çekme (Clone)
3. Bağımlılıkları yükleme
4. Build alma
5. Uygulamayı başlatma

---

## 🛠️ Adım 1: Sunucu Hazırlığı (Node.js Kurulumu)
Eğer sunucunuzda Node.js yüklü değilse, aşağıdaki komutlarla en güncel LTS sürümünü kurun:

```bash
# Sistem paketlerini güncelle
sudo apt update && sudo apt upgrade -y

# Node.js 20.x sürümünü ekle
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Node.js'i kur
sudo apt install -y nodejs

# Kurulumu doğrula
node -v
npm -v
# (v20.x.x ve v10.x.x gibi versiyonlar görmelisiniz)
```

---

## 📥 Adım 2: Projeyi İndirme (Git Clone)
Şu an yaşadığınız **"no such file or directory"** hatasının nedeni projenin sunucuda olmamasıdır. Aşağıdaki komutla projeyi indirin:

```bash
# Projeyi ana dizine (veya istediğiniz yere) çekin
cd ~
git clone https://github.com/mefkuz/ScholarFlow.git

# Proje klasörüne girin (BU ADIM ÇOK ÖNEMLİ!)
cd ScholarFlow
```

---

## 📦 Adım 3: Bağımlılıkları Yükleme
Proje klasörünün içindeyken (`/root/ScholarFlow` gibi görünmeli), bağımlılıkları yükleyin:

```bash
npm install
```
*Bu işlem birkaç dakika sürebilir ve `node_modules` klasörünü oluşturur.*

---

## 🏗️ Adım 4: Build Alma (Production İçin)
Kodları optimize edilmiş üretim sürümüne dönüştürmek için:

```bash
npm run build
```
*Başarılı olursa `dist/` klasörü oluşacaktır.*

---

## 🚀 Adım 5: Uygulamayı Başlatma

### Seçenek A: Hızlı Önizleme (Test Amaçlı)
```bash
npm run preview -- --host
```
*Bu komut sonrası http://SUNUCU-IP-ADRESI:4173 adresinden erişebilirsiniz.*

### Seçenek B: Kalıcı Çalıştırma (PM2 ile - ÖNERİLEN)
Uygulamanın terminal kapansa bile çalışmaya devam etmesi için `pm2` kullanın:

```bash
# 1. Web sunucusunu kur (basit bir static server)
npm install -g serve pm2

# 2. Uygulamayı pm2 ile başlat (port 3000'de çalışır)
pm2 start serve --name "scholarflow" -- -s dist -l 3000

# 3. Başlangıçta otomatik açılması için kaydet
pm2 save
pm2 startup
```
*Artık http://SUNUCU-IP-ADRESI:3000 adresinden erişebilirsiniz.*

---

## ❓ Sık Karşılaşılan Hatalar

**Hata:** `npm error code ENOENT ... open '/root/package.json'`  
**Çözüm:** Yanlış klasördesiniz. `cd ScholarFlow` komutunu çalıştırıp tekrar deneyin.

**Hata:** `Permission denied`  
**Çözüm:** Komutların başına `sudo` ekleyin.

**Hata:** Siteye ulaşılamıyor.  
**Çözüm:** Sunucunuzun güvenlik duvarında (firewall) port 3000'in açık olduğundan emin olun:
```bash
sudo ufw allow 3000
```
