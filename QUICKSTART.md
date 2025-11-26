# 🚀 Quick Start Guide - DigiArchive Database

## 1️⃣ Setup MongoDB Connection (5 menit)

### Pilih salah satu:

**Option A: MongoDB Atlas (Cloud - Recommended)**
1. Buka https://www.mongodb.com/cloud/atlas
2. Sign up atau login
3. Create New Project
4. Build a Database (pilih Free tier)
5. Setup cluster security:
   - Create Username & Password
   - Add IP Address: 0.0.0.0/0 (untuk testing)
6. Click "Connect"
7. Copy connection string

**Option B: Local MongoDB**
1. Install dari https://www.mongodb.com/try/download/community
2. Jalankan MongoDB service
3. Connection string: `mongodb://localhost:27017`

### 2. Buat .env.local
```bash
# Di folder DigiArchive root
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
MONGODB_URI=mongodb+srv://yourname:yourpassword@cluster.mongodb.net/digiarchive?retryWrites=true&w=majority
MONGODB_DB=digiarchive
```

## 2️⃣ Install & Run (2 menit)

```bash
cd "d:\BUNGA\SEMESTER 5\POPL\Praktikum\UAS\DigiArchive"

# Install dependencies
npm install

# Run dev server
npm run dev
```

Server akan run di: `http://localhost:3000`

## 3️⃣ Test Features

### Test Landing Page
```
http://localhost:3000
```

### Test Register
```
http://localhost:3000/register
```

### Test Login
```
http://localhost:3000/login
Username/Email: test
Password: 123456
```

### Test Dashboard
```
http://localhost:3000/dashboard
```

### Test Add Document
```
http://localhost:3000/tambah-dokumen
- Click "Buka Kamera" atau upload gambar
- Select kategori
- Click "Simpan Dokumen"
```

### Test Recycle Bin
```
http://localhost:3000/recycle-bin
- Lihat dokumen yang dihapus
- Click "Pulihkan" atau "Hapus Permanen"
```

## 📊 Lihat Database

### Dengan MongoDB Compass (GUI)
1. Download: https://www.mongodb.com/products/tools/compass
2. Paste connection string
3. Explore collections

### Dengan MongoDB Atlas UI
1. Login ke Atlas
2. Browse Collections
3. Lihat data real-time

## ✅ Checklist

- [ ] MongoDB account/local setup
- [ ] `.env.local` dibuat dengan URI yang benar
- [ ] `npm install` berhasil
- [ ] `npm run dev` running tanpa error
- [ ] Landing page bisa dibuka
- [ ] Login bisa dikerjakan
- [ ] Dashboard muncul
- [ ] Tambah dokumen bisa disimpan ke database
- [ ] Lihat dokumen di recycle bin
- [ ] Bisa restore/delete dokumen

## 🐛 Troubleshooting

### Error: "Cannot find module 'mongoose'"
```bash
npm install mongoose@9.0.0
```

### Error: "Failed to connect to MongoDB"
- Check `.env.local` - apakah URI benar?
- Cek MongoDB Atlas - apakah IP whitelisted?
- Cek koneksi internet

### Dokumen tidak menyimpan
- Check browser console untuk error
- Lihat server logs di terminal
- Pastikan `.env.local` sudah diset

### Port 3000 sudah digunakan
```bash
npm run dev -- -p 3001
```

## 📚 Documentation Files

- **DATABASE_SETUP.md** - Setup guide lengkap
- **DATABASE_IMPLEMENTATION.md** - Implementation details
- **lib/models/** - Database schemas
- **app/api/documents/** - API routes

## 🎯 Next Steps

1. ✅ Database setup (sekarang)
2. Add authentication dengan password hashing
3. Setup file upload ke cloud storage
4. Add more document filters/search
5. Add user management
6. Deploy ke production

---

**Status**: Database setup complete! 🎉

Setiap kali dev server jalan, Anda bisa langsung test features.
