# DataMatrix Multi Scan (Production-Ready PWA)

Endüstriyel çoklu DataMatrix okutma için Next.js tabanlý mobil web uygulamasý.

## Mimari

- `app/`: Next.js App Router sayfalarý
- `components/`: UI bileþenleri (wizard, dashboard)
- `hooks/`: tarama ve state lifecycle
- `services/camera`: WebRTC kamera optimizasyonu
- `services/decoder`: worker tabanlý decode orchestrator
- `workers/`: WASM decode thread
- `services/storage`: IndexedDB (Dexie)
- `services/export`: Excel export (SheetJS)
- `types/`: domain modelleri
- `docs/`: deployment, test ve operasyon rehberi

## Kurulum

```bash
pnpm install
pnpm --filter datamatrix-multi-scan dev
```

## Build

```bash
pnpm --filter datamatrix-multi-scan build
pnpm --filter datamatrix-multi-scan start
```

## Zorunlu HTTPS

- Kamera API (`getUserMedia`) mobil tarayýcýlarda HTTPS ister.
- Lokal aðda test için self-signed veya reverse proxy TLS kullanýn.

## Android Tablet Test

1. PC ve tablet ayný Wi-Fi aðýna baðlanýr.
2. Uygulama host bind ile çalýþtýrýlýr (`next dev -H 0.0.0.0 -p 3100`).
3. Tablette `https://<pc-local-ip>:3100` açýlýr.
4. Kamera izinleri `Allow` verilir.

## iOS Safari Kamera Ýzinleri

- `Ayarlar > Safari > Kamera` izni etkin olmalý.
- URL mutlaka HTTPS olmalý.
- iOS düþük güç modunda FPS düþebilir; termal throttling göstergesini izleyin.

## Local Network Test

- Öneri: Caddy/Nginx ile local TLS.
- Alternatif: Cloud tunnel (staging doðrulama).

## Deployment Karþýlaþtýrma

1. **Vercel (Önerilen)**
- Next.js native optimize
- hýzlý CI/CD
- edge/cache yönetimi güçlü
- PWA servis worker daðýtýmý sorunsuz

2. **Netlify**
- iyi static/worker daðýtýmý
- Next runtime uyumluluðu Vercel kadar doðal deðil

3. **Firebase Hosting**
- CDN hýzlý
- Next SSR setup daha operasyonel efor ister

4. **Local Docker**
- fabrikada offline edge node için ideal
- DevOps ve güncelleme süreçleri sizde

5. **Android WebView wrapper**
- MDM ile cihaz yönetimi kolay
- kamera davranýþý tarayýcýya göre daha deðiþken

6. **Capacitor native build**
- donaným API’lerine daha iyi eriþim
- release pipeline daha karmaþýk

## En Uygun Seçim

- Kurumsal web rollout için: **Vercel**
- Tam offline fabrika edge için: **Local Docker + PWA cache**
- Cihaz seviyesinde kiosk senaryosu için: **Capacitor**

## Performans Raporlama

Uygulama canlý gösterir:
- FPS
- Ortalama decode süresi (ms)
- aktif çözünürlük
- OK/NOK/Duplicate sayýlarý

Önerilen baþlangýç çözünürlüðü:
- 1920x1080 (çoðu cihazda en iyi denge)
- Yeterli ýþýkta 4K yalnýzca gerektiðinde

Tavsiye edilen cihaz sýnýfý:
- Snapdragon 8-serisi veya Apple A15+
- 6GB+ RAM
- OIS destekli arka kamera

## Endüstriyel Öneriler

- Sabit çalýþma mesafesi için fiziksel jig kullanýn.
- Yansýma azaltmak için diffused ýþýk kullanýn.
- Operatör baþýna günlük lens temizlik checklist’i uygulayýn.
- Koli içi kod yerleþimini homojenleþtirerek motion blur etkisini düþürün.
