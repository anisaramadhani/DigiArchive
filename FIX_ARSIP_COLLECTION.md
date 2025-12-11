# 🔧 Fix MongoDB Collection "arsip"

## Masalah
Collection `arsip` tidak bisa diakses di MongoDB Atlas, sedangkan collection `users` bisa.

## Penyebab
Collection `arsip` belum dibuat atau tidak ada data di dalamnya.

## Solusi

### Cara 1: Buat Collection Lewat MongoDB Atlas (Recommended)

1. **Buka MongoDB Atlas** (https://cloud.mongodb.com)
2. **Login** dengan akun Anda
3. **Pilih Cluster** → DigiArchive
4. **Klik "Browse Collections"**
5. **Klik "+ Create Database"** atau **"Add My Own Data"**
   - Database Name: `digiarchive`
   - Collection Name: `arsip`
6. **Klik Create**

### Cara 2: Collection Akan Auto-Create Saat Insert Pertama

Collection akan otomatis dibuat saat ada data pertama yang di-insert. Jadi:

1. **Jalankan aplikasi**: `npm run dev`
2. **Login** ke aplikasi
3. **Upload dokumen pertama** dari halaman "Tambah Dokumen"
4. Collection `arsip` akan otomatis dibuat

### Cara 3: Buat via MongoDB Compass (Alternative)

1. **Download MongoDB Compass**: https://www.mongodb.com/products/compass
2. **Connect** dengan connection string:
   ```
   mongodb+srv://DigiArchive:digiarchive12345@digiarchive.7bcihka.mongodb.net/
   ```
3. **Pilih database**: `digiarchive`
4. **Create Collection**: `arsip`

---

## Struktur Collection yang Dibutuhkan

### Collection: `users`
```javascript
{
  "_id": ObjectId,
  "npm": "2308107010008",
  "name": "Anisa Ramadhani",
  "email": "anisa@email.com",
  "password": "password123",
  "jurusan": "Informatika",
  "createdAt": ISODate
}
```

### Collection: `arsip`
```javascript
{
  "_id": ObjectId,
  "npm": "2308107010008",
  "title": "Proposal Tugas Akhir",
  "category": "Proposal",
  "image": "data:image/jpeg;base64,...", // Base64 encoded file
  "fileName": "proposal.pdf",
  "fileType": "application/pdf",
  "deleted": false,
  "sharedWith": [],
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

---

## Verifikasi

Setelah collection dibuat, cek di MongoDB Atlas:

1. **Browse Collections** → `digiarchive` → `arsip`
2. Pastikan collection muncul di list
3. Jika ada data, akan terlihat document count

---

## Testing

1. **Restart aplikasi**: `Ctrl + C` lalu `npm run dev`
2. **Buka browser**: http://localhost:3000
3. **Login**
4. **Buka halaman "Daftar Arsip"**
5. **Seharusnya tidak error lagi**

---

## Error yang Mungkin Muncul

### "Collection not found"
- Collection belum dibuat
- Solusi: Buat manual atau upload dokumen pertama

### "Unauthorized"
- User MongoDB tidak punya akses ke collection
- Solusi: Cek Database Access di MongoDB Atlas

### "Connection timeout"
- MongoDB Atlas IP whitelist
- Solusi: Add IP address 0.0.0.0/0 (allow all) di Network Access

---

## Quick Fix Script

Jika ingin buat collection via script, jalankan ini di MongoDB Shell:

```javascript
use digiarchive
db.createCollection("arsip")
db.arsip.createIndex({ npm: 1 })
db.arsip.createIndex({ createdAt: -1 })
db.arsip.createIndex({ deleted: 1 })
```

Indexes ini akan mempercepat query.
