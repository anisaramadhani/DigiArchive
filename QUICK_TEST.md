# ⚡ Quick Test - Login & Register Backend

## 🎯 TL;DR (Terlalu Panjang; Didahulukan Pembacaan)

### Backend Status Saat Ini:
✅ **API dapat diakses** - POST endpoints working
✅ **TypeScript compiles** - No errors
✅ **Validation logic** - Implemented
❌ **MongoDB connection** - Belum ada credentials

---

## 🚀 Quick Setup (15 menit)

### Step 1: Pilih MongoDB (Pick One)

#### A. MongoDB Atlas (Recommended - Cloud)
1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up (gratis)
3. Create Cluster (free tier)
4. Add Network: 0.0.0.0/0 (or your IP)
5. Create Database User
6. Copy Connection String

#### B. MongoDB Local
1. Download: https://www.mongodb.com/try/download/community
2. Install & start service
3. Connection string: `mongodb://localhost:27017`

---

### Step 2: Update `.env.local`

**File**: `D:\BUNGA\SEMESTER 5\POPL\Praktikum\UAS\DigiArchive\.env.local`

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xyz.mongodb.net/digiarchive?retryWrites=true&w=majority
MONGODB_DB=digiarchive
JWT_SECRET=my-super-secret-key-12345
```

Replace:
- `username` - Your MongoDB user
- `password` - Your MongoDB password
- `cluster0.xyz` - Your cluster name

---

### Step 3: Restart Dev Server

```bash
# Terminal di DigiArchive folder
npm run dev
```

Wait untuk "✓ Ready in X.Xs"

---

### Step 4: Test dengan Postman

**Download**: https://www.postman.com/downloads/

#### Test 1: Register
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

Body:
{
  "nama": "John Doe",
  "email": "john@test.com",
  "npm": "2024001",
  "jurusan": "Teknik Informatika",
  "password": "password123",
  "password_confirmation": "password123"
}
```

Expected Response:
```json
{
  "success": true,
  "message": "Pendaftaran berhasil! Silakan login",
  "user": {
    "_id": "...",
    "nama": "John Doe",
    "email": "john@test.com",
    "npm": "2024001",
    "jurusan": "Teknik Informatika",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### Test 2: Login
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

Body:
{
  "npm": "2024001",
  "password": "password123"
}
```

Expected Response:
```json
{
  "success": true,
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "nama": "John Doe",
    "email": "john@test.com",
    "npm": "2024001",
    "jurusan": "Teknik Informatika"
  }
}
```

---

### Step 5: Verifikasi di MongoDB

**Dengan MongoDB Compass:**
1. Download: https://www.mongodb.com/products/tools/compass
2. Paste connection string dari `.env.local`
3. Browse: `digiarchive` → `users`
4. Lihat user yang baru register

**Dengan MongoDB Atlas UI:**
1. Login ke https://www.mongodb.com/cloud/atlas
2. Click "Browse Collections"
3. Lihat data real-time

---

## ✅ Success Indicators

### Dari Server Logs:
```
✓ POST /api/auth/register 201 in XXs
✓ POST /api/auth/login 200 in XXs
```

### Dari Postman:
```
Status: 201 Created (register)
Status: 200 OK (login)
Response body: JSON dengan success: true
```

### Dari MongoDB:
```
Collection: users
Document: {
  _id: ObjectId(...),
  nama: "John Doe",
  email: "john@test.com",
  npm: "2024001",
  password: "$2a$10$..." // hashed password
}
```

---

## 🧪 Test Error Cases

### Wrong Password
```json
{
  "success": false,
  "message": "NPM atau Password salah"
}
```

### Email Already Registered
```json
{
  "success": false,
  "message": "Email sudah terdaftar"
}
```

### NPM Already Registered
```json
{
  "success": false,
  "message": "NPM sudah terdaftar"
}
```

### Password Mismatch
```json
{
  "success": false,
  "message": "Password tidak cocok"
}
```

---

## 🔗 API Endpoint Reference

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| POST | `/api/auth/register` | Daftar akun baru | ✅ Ready |
| POST | `/api/auth/login` | Login dengan npm+password | ✅ Ready |

---

## 📁 Key Files

```
lib/models/User.ts           → Database schema
app/api/auth/register/route.ts  → Register API
app/api/auth/login/route.ts     → Login API
components/RegisterForm.tsx     → Register UI
app/Login.tsx                   → Login UI
.env.local                      → Configuration
```

---

## 🎓 Arch Overview

```
Frontend (Register/Login Forms)
            ↓
    Backend API Routes
    /api/auth/register
    /api/auth/login
            ↓
    Input Validation
    Password Hashing (bcryptjs)
    JWT Generation
            ↓
    MongoDB Database
    users collection
            ↓
    Response to Frontend
    Token + User Data
```

---

## ✨ Done!

Backend siap untuk:
- ✅ Register dengan validation
- ✅ Login dengan JWT token
- ✅ Password hashing secure
- ✅ Database persistence

Tinggal setup MongoDB URI dan test!

**Refer to**: `VERIFICATION_GUIDE.md` untuk detailed testing guide
