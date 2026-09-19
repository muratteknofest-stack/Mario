# KIVILCIM — Gök Yüzü Adaları

## Kurulum

```bash
npm install
npm run dev      # Geliştirme sunucusu
npm run build    # Üretim derlemesi
npm run preview  # Üretim önizleme
```

## Oynama

Oyun tarayıcıda çalışır. Masaüstünde klavye, mobilde dokunmatik kontroller kullanılır.

### Kontroller

| Eylem | Klavye | Dokunmatik |
|-------|--------|------------|
| Hareket | A/D veya ←/→ | Sol alt ◀/▶ |
| Zıpla | Space veya ↑ | Sağ alt ▲ |
| Koş | Shift | Otomatik |
| Yetenek | E | Sağ alt ✦ |
| Duraklat | Esc | - |

### Kalite Ayarları

- Otomatik: Cihaza göre seçilir
- 720p / 1080p / 1440p / 4K: Manuel seçim
- 4K modu: 3840×2160 çizim tamponu (desteklenen cihazlarda)

### Kayıt Sistemi

- 3 yerel kayıt yuvası
- localStorage tabanlı
- Dışa/içe aktarma destekli

## Mimari

- **Motor**: Phaser 3.80 + Arcade Physics
- **Render**: WebGL (CSS fallback)
- **Çözünürlük**: 1280×720 mantıksal, ölçeklenebilir
- **Fizik**: Sabit 60Hz adım
- **Ses**: Web Audio API (prosedürel)
- **Grafikler**: Prosedürel canvas dokuları

## İçerik

- 6 dünya, 30 bölüm (24 normal + 6 boss)
- 8 düşman tipi
- 4 güçlendirme
- Prosedürel müzik
- Türkçe/İngilizce arayüz

## Yeni Bölüm Ekleme

`src/game/levels.ts` dosyasında bölüm verileri tanımlanır. Her bölüm:
- Platformlar (solid, oneway, moving, falling, bounce, breakable, reward)
- Düşmanlar (patrol, edge, jumper, flyer, shooter, shielded, charger, burrower)
- Koleksiyonlar (coin, special, powerup)
- Tehlikeler (spikes, lava)
- Kontrol noktaları

## Lisans

Tüm varlıklar özgün olarak prosedürel üretilmiştir.
