# Lasera Medya - Çekiliş Sistemi

React + Vite ile geliştirilmiş, modern ve kullanımı kolay bir çekiliş uygulaması.

## Özellikler

- Excel / CSV dosyasından katılımcı yükleme (.xlsx, .xls, .csv)
- Manuel isim girişi (satır satır)
- Ayarlanabilir yedek kazanan sayısı (0-10)
- Animasyonlu çekiliş efekti + confetti
- Yedek kazananları tek tek açma (gizli/göster)

## Kurulum

```bash
npm install
npm run dev
```

## Proje Yapısı

```
src/
├── App.jsx                 # Ana bileşen - state yönetimi ve çekiliş mantığı
├── App.css                 # Tüm stiller
├── main.jsx                # Uygulama giriş noktası
├── utils.js                # Yardımcı fonksiyonlar (shuffle, confetti, parseFile)
└── components/
    ├── InputSection.jsx    # Sekmeler + dosya yükleme + manuel giriş
    └── WinnerSection.jsx   # Kazanan kutusu + yedek kazananlar listesi
```

## Teknolojiler

- **React 19** - UI framework
- **Vite** - Build tool
- **SheetJS (xlsx)** - Excel/CSV dosya okuma
