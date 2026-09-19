# Performans Raporu

## Derleme Boyutları

```
dist/index.html                     0.91 kB │ gzip: 0.52 kB
dist/assets/index-CQbNKKR3.css      7.70 kB │ gzip: 2.48 kB
dist/assets/index-2ALsyo5H.js     146.59 kB │ gzip: 47.46 kB
dist/assets/main-MvfAxazy.js    1,530.73 kB │ gzip: 352.90 kB
```

Toplam: ~1.69 MB (gzip: ~403 KB)

## Çözünürlük Profili

| Mod | Çizim Tamponu | Mantıksal Alan | Ölçek |
|-----|--------------|----------------|-------|
| 720p | 1280×720 | 1280×720 | 1x |
| 1080p | 1920×1080 | 1280×720 | 1.5x |
| 1440p | 2560×1440 | 1280×720 | 2x |
| 4K | 3840×2160 | 1280×720 | 3x |

## Hedef Performans

- Masaüstü 1080p: 60 FPS hedef
- Masaüstü 4K: 60 FPS hedef (güçlü GPU gerekli)
- Mobil: 30-60 FPS (cihaza bağlı)
- Fizik: Sabit 60Hz adım

## Ölçümler

⚠️ Gerçek cihaz ölçümü yapılamadı. Aşağıdaki değerler tahmindir.

### Tahmini Kare Süreleri (Masaüstü, Chrome)

| Çözünürlük | p50 | p95 | p99 |
|-----------|-----|-----|-----|
| 720p | ~4ms | ~8ms | ~12ms |
| 1080p | ~6ms | ~10ms | ~16ms |
| 1440p | ~8ms | ~14ms | ~20ms |
| 4K | ~12ms | ~20ms | ~30ms |

### Bellek Kullanımı (Tahmini)

- İlk yükleme: ~80MB
- Oynanış sırasında: ~120-150MB
- Dokular: ~30MB (prosedürel, canvas tabanlı)

## Darboğazlar

1. Phaser kütüphanesi boyutu (1.5MB)
2. Prosedürel doku oluşturma (başlangıçta)
3. 4K'da çok sayıda sprite çizimi

## Öneriler

- Code-splitting ile Phaser'ı ayrı chunk'ta tutmak
- Düşük kaliteli cihazlarda otomatik 720p
- Parçacık sayısını sınırla
- Ekran dışı nesneleri gizle
