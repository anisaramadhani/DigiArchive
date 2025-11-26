# 🔗 Cara Menyambungkan ke MongoDB

## 📋 Step 1: Siapkan Connection String dari MongoDB

### Jika menggunakan MongoDB Atlas (Cloud):

1. **Login ke MongoDB Atlas**: https://www.mongodb.com/cloud/atlas/register
   - Buka dashboard Atlas
   - Pilih cluster yang ingin digunakan
   
2. **Ambil Connection String**:
   - Klik tombol **"Connect"** pada cluster
   - Pilih **"Drivers"**
   - Pilih **"Node.js"** dan versi **4.1 or later**
   - Copy connection string yang tampil

   Format-nya akan terlihat seperti ini:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/myDatabase?retryWrites=true&w=majority
   ```

3. **Ganti placeholder**:
   - `username` → Username database user MongoDB kamu
   - `password` → Password database user MongoDB kamu
   - `cluster0.xxxxx` → Nama cluster kamu
   - `myDatabase` → Nama database (default: `digiarchive`)

### Jika menggunakan MongoDB Local (Desktop):

Connection string-nya akan seperti ini:
```
mongodb://localhost:27017/digiarchive
```

---

## 📝 Step 2: Update `.env.local` File

Buka file `.env.local` yang ada di folder `DigiArchive/`:

### File Path:
```
D:\BUNGA\SEMESTER 5\POPL\Praktikum\UAS\DigiArchive\.env.local
```

### Update dengan connection string kamu:

**SEBELUM (Template):**
```dotenv
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/digiarchive?retryWrites=true&w=majority
MONGODB_DB=digiarchive
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
```

**SESUDAH (Contoh dengan Atlas):**
```dotenv
MONGODB_URI=mongodb+srv://anisa:MyPassword123@cluster0.abc123.mongodb.net/digiarchive?retryWrites=true&w=majority
MONGODB_DB=digiarchive
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
```

**ATAU Contoh dengan Local MongoDB:**
```dotenv
MONGODB_URI=mongodb://localhost:27017/digiarchive
MONGODB_DB=digiarchive
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
```

---

## ✅ Step 3: Verifikasi Connection String

### Pastikan format benar:

| Bagian | Contoh | Keterangan |
|--------|--------|-----------|
| Protocol | `mongodb+srv://` atau `mongodb://` | `+srv` untuk cloud, biasa untuk lokal |
| Username | `anisa` | Username database user |
| Password | `MyPassword123` | Password database user |
| Host | `cluster0.abc123.mongodb.net` | Domain/host cluster (cloud) |
| Database | `/digiarchive` | Nama database, diakhir URI |
| Options | `?retryWrites=true&w=majority` | Parameter koneksi (opsional) |

---

## 🚀 Step 4: Test Connection

### Option A: Restart Server Next.js

1. **Buka terminal** di folder `DigiArchive/`
2. **Hentikan server jika masih berjalan** (Ctrl+C)
3. **Jalankan dev server baru:**

```bash
npm run dev
```

4. **Lihat log server** untuk error MongoDB:

**Jika berhasil terkoneksi**, log akan menunjukkan:
```
✓ Ready in 2.5s
✓ Connected to MongoDB
```

**Jika masih error**, lihat error message-nya:
```
Error: querySrv ENOTFOUND
  → Connection string salah
  
Error: authentication failed
  → Username/password salah
  
Error: connect ECONNREFUSED
  → MongoDB service tidak jalan (jika local)
```

### Option B: Test dengan Postman

1. **Buka Postman**
2. **Create POST request:**
   - URL: `http://localhost:3000/api/auth/register`
   - Method: `POST`
   - Headers: `Content-Type: application/json`

3. **Body (JSON):**
```json
{
  "nama": "Test User",
  "email": "test@gmail.com",
  "npm": "1234567890",
  "jurusan": "Teknik Informatika",
  "password": "password123",
  "password_confirmation": "password123"
}
```

4. **Send dan lihat response:**

**Jika sukses (201):**
```json
{
  "success": true,
  "message": "Pendaftaran berhasil! Silakan login",
  "user": {
    "_id": "65f7c...",
    "nama": "Test User",
    "email": "test@gmail.com",
    "npm": "1234567890",
    "jurusan": "Teknik Informatika"
  }
}
```

**Jika MongoDB error (500):**
```json
{
  "success": false,
  "error": "Database connection failed"
}
```

---

## 🔍 Step 5: Verifikasi Data di MongoDB

### Jika menggunakan Atlas:

1. **Buka MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
2. **Klik cluster** → **"Browse Collections"**
3. **Lihat database `digiarchive`**
4. **Buka collection `users`**
5. **Cek data user yang baru didaftar:**

```javascript
{
  "_id": ObjectId("..."),
  "nama": "Test User",
  "email": "test@gmail.com",
  "npm": "1234567890",
  "jurusan": "Teknik Informatika",
  "password": "$2a$10$...", // hashed password
  "createdAt": ISODate("2025-11-26T..."),
  "updatedAt": ISODate("2025-11-26T...")
}
```

⚠️ **Password harus SELALU di-hash** (dimulai dengan `$2a$10$`). Jika tidak, ada masalah!

### Jika menggunakan Local MongoDB:

1. **Download MongoDB Compass**: https://www.mongodb.com/products/tools/compass
2. **Connect ke `mongodb://localhost:27017`**
3. **Buka database `digiarchive`**
4. **Cek collection `users`**

---

## 🎯 Common Issues & Solutions

### ❌ Error: "querySrv ENOTFOUND"

**Penyebab**: Connection string salah atau format salah

**Solusi**:
- Pastikan `mongodb+srv://` untuk cloud (bukan `mongodb://`)
- Copy langsung dari MongoDB Atlas Connect button
- Pastikan tidak ada typo di username/password/cluster name

---

### ❌ Error: "authentication failed"

**Penyebab**: Username atau password salah

**Solusi**:
- Verify username di MongoDB Atlas → Database Access
- Verify password → Cek saat membuat user
- Password harus di-encode jika mengandung special char (@, :, /, dll)
- Jika password: `my@pass:word` → encode jadi: `my%40pass%3Aword`

Gunakan URL encoder: https://www.urlencoder.org/

---

### ❌ Error: "connect ECONNREFUSED" (untuk local)

**Penyebab**: MongoDB service tidak berjalan

**Solusi**:
```bash
# Cek apakah MongoDB berjalan
mongosh

# Jika error, start MongoDB:
# Windows: 
mongod

# Atau jika pakai brew (Mac):
brew services start mongodb-community
```

---

### ❌ Error: "name or service not known"

**Penyebab**: Internet connection atau cluster name salah

**Solusi**:
- Pastikan internet connection aktif
- Cek cluster name di MongoDB Atlas
- Pastikan format: `mongodb+srv://user:pass@CLUSTER_NAME.mongodb.net/db`

---

## 📊 Step 6: Cek `.env.local` Ter-load dengan Benar

Next.js secara otomatis load `.env.local`. Untuk verify:

1. **Buat test file** `test-env.js`:
```javascript
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('MONGODB_DB:', process.env.MONGODB_DB);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
```

2. **Jalankan di terminal**:
```bash
node test-env.js
```

3. **Harus menampilkan nilai yang benar** (bukan `undefined`)

---

## ✨ Langkah Persiapan Singkat

Jika kamu terburu-buru, ikuti ini:

### ✅ Untuk Atlas (Cloud):
1. Buka https://www.mongodb.com/cloud/atlas
2. Login → Cluster → Connect → Drivers → Copy connection string
3. Edit `.env.local`, ganti `MONGODB_URI` dengan string kamu
4. Jalankan `npm run dev`
5. Test register dengan Postman

### ✅ Untuk Local:
1. Jalankan MongoDB service: `mongod` di terminal
2. Edit `.env.local`, ganti `MONGODB_URI` ke `mongodb://localhost:27017/digiarchive`
3. Jalankan `npm run dev`
4. Test register dengan Postman

---

## 🎓 Checklist

- [ ] Connection string dari MongoDB siap
- [ ] `.env.local` sudah diupdate dengan connection string
- [ ] `npm run dev` berjalan tanpa error MongoDB
- [ ] Test register dengan Postman sukses (HTTP 201)
- [ ] Data user muncul di MongoDB collection
- [ ] Password ter-hash dengan benar

Setelah semua checklist selesai, **Backend Login & Register sudah 100% CONNECTED! 🎉**
