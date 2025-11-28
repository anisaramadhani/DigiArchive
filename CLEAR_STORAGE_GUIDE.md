# Cara Clear localStorage

Jika Anda mendapat error "QuotaExceededError", ikuti langkah berikut:

## Cara 1: Melalui Browser DevTools (Rekomendasi)

1. Buka aplikasi di browser
2. Tekan **F12** atau **Ctrl+Shift+I** untuk membuka DevTools
3. Pergi ke tab **Application** (Chrome) atau **Storage** (Firefox)
4. Di sebelah kiri, pilih **Local Storage**
5. Klik kanan pada `http://localhost:3000` dan pilih **Clear**
6. Refresh halaman (**F5**)

## Cara 2: Melalui Console

1. Buka DevTools (**F12**)
2. Pergi ke tab **Console**
3. Paste perintah berikut:
```javascript
// Clear semua digiarchive data
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('digiarchive_')) {
    localStorage.removeItem(key);
  }
});
console.log('Storage cleared!');
```
4. Tekan Enter
5. Refresh halaman (**F5**)

## Mengapa Error Ini Terjadi?

- Setiap gambar yang diupload disimpan dalam format Base64 di localStorage
- Format Base64 menggunakan ~33% lebih banyak storage
- localStorage hanya memiliki ~5-10MB storage limit
- Beberapa browser lebih ketat dibanding yang lain

## Solusi untuk Kedepannya

Saya sudah update fitur agar:
- Gambar tidak disimpan di recycle bin (hanya metadata)
- Lebih hemat storage
- Preview di recycle bin menunjukkan placeholder jika tidak ada gambar

Mulai sekarang aplikasi lebih efisien dalam menggunakan storage!
