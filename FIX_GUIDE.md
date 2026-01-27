# 🔧 Çökme Sorunu Çözüm Rehberi

Uygulamanızın 1-2 saat sonra 502 hatası verip kapanması, **RAM (Bellek) yetersizliği** nedeniyle işletim sisteminin uygulamayı durdurmasından (OOM Kill) kaynaklanmaktadır. Bu durum özellikle Swap alanı olmayan VPS sunucularında çok yaygındır.

Aşağıdaki adımları sırayla uygulayarak bu sorunu tamamen çözün.

## 1. Adım: Swap Alanı (Sanal Bellek) Ekleyin
Sunucunuzda RAM dolduğunda diski RAM gibi kullanabilmesi için bu adımı **kesinlikle** uygulayın.

```bash
# 1. 2GB'lık bir swap dosyası oluşturun
sudo fallocate -l 2G /swapfile

# 2. Dosya izinlerini güvenli hale getirin
sudo chmod 600 /swapfile

# 3. Dosyayı swap alanı olarak biçimlendirin
sudo mkswap /swapfile

# 4. Swap alanını aktif edin
sudo swapon /swapfile

# 5. Sunucu yeniden başladığında silinmemesi için kaydedin
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 6. Kontrol edin (Swap kısmında değer görmelisiniz)
free -h
```

## 2. Adım: PM2 ile Güvenli Başlatma
Yeni oluşturduğum `ecosystem.config.cjs` dosyası, uygulamanın çok fazla RAM tüketmesi durumunda sunucuyu çökertmek yerine sadece uygulamayı hızlıca yeniden başlatmasını sağlar.

```bash
# Önce eski çalışan tüm süreçleri durdurun ve silin
pm2 delete all

# Yeni güvenli konfigürasyon ile başlatın
pm2 start ecosystem.config.cjs

# Bu ayarı kalıcı hale getirin
pm2 save
```

## 3. Adım: Kontrol Etme
Her şeyin yolunda olduğunu görmek için:

```bash
# Uygulama durumunu ve RAM kullanımını canlı izleyin
pm2 monit
```

Eğer uygulama kapanırsa artık loglara bakarak sebebini kesin olarak görebileceğiz:
```bash
# Hata kayıtlarını okuyun
cat ./logs/app-error.log
```

---
**Not:** Eğer bu işlemlerden sonra da sunucu tamamen donuyorsa, sunucu paketinizin RAM miktarını artırmanız gerekebilir, ancak yukarıdaki Takas (Swap) alanı işlemi %99 ihtimalle sorunu çözecektir.
