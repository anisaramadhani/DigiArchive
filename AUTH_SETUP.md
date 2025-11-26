# 🔐 Authentication Setup - Login & Register dengan Database

## ✅ Sistem yang Sudah Dibuat

### 1. Database Models
- **User Model** - Dengan fields: nama, email, npm, jurusan, password
- Password hashing dengan bcryptjs (10 salt rounds)
- Method comparePassword untuk validasi login

### 2. API Routes

#### `/api/auth/register` (POST)
- Validasi input (semua field required)
- Check duplikasi email dan npm
- Hash password dengan bcryptjs
- Simpan user ke database
- Return: success message dan user data (tanpa password)

#### `/api/auth/login` (POST)
- Validasi npm dan password
- Query user dari database
- Compare password dengan yang disimpan
- Buat JWT token (7 hari expiry)
- Return: token dan user data

### 3. Frontend Components
- **RegisterForm** - Form daftar dengan validasi lengkap
- **Login** - Form login dengan error handling
- Both components terhubung ke API database

### 4. Security Features
✅ Password hashing dengan bcryptjs
✅ JWT token generation
✅ Input validation
✅ Error handling
✅ User data sanitization (password tidak dikembalikan)

## 📋 Database Schema

### users Collection
```
{
  _id: ObjectId
  nama: string (required)
  email: string (required, unique)
  npm: string (required, unique)
  jurusan: string (required)
  password: string (hashed, required)
  createdAt: Date
  updatedAt: Date
}
```

## 🚀 Cara Test

### 1. Jalankan Dev Server
```bash
npm run dev
```

### 2. Test Register
**URL**: `http://localhost:3000/register`

**Isi form:**
- Nama: John Doe
- Email: john@example.com
- NPM: 2024001
- Jurusan: Teknik Informatika
- Password: 12345678
- Confirm Password: 12345678

**Expected Result:**
- Success message
- Redirect ke login page

### 3. Test Login
**URL**: `http://localhost:3000/login`

**Isi form:**
- NPM: 2024001
- Password: 12345678

**Expected Result:**
- Login berhasil
- Token disimpan di localStorage
- Redirect ke dashboard

### 4. Test Error Cases

**Register dengan email duplikat:**
- Error: "Email sudah terdaftar"

**Register dengan npm duplikat:**
- Error: "NPM sudah terdaftar"

**Register password tidak cocok:**
- Error: "Password tidak cocok"

**Login dengan password salah:**
- Error: "NPM atau Password salah"

**Login dengan npm tidak terdaftar:**
- Error: "NPM atau Password salah"

## 🔧 API Testing dengan cURL

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "John Doe",
    "email": "john@example.com",
    "npm": "2024001",
    "jurusan": "Teknik Informatika",
    "password": "12345678",
    "password_confirmation": "12345678"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "npm": "2024001",
    "password": "12345678"
  }'
```

## 📁 Files yang Diubah/Dibuat

### Created:
- ✅ `/api/auth/register/route.ts` - Register API
- ✅ `.env.local` - Environment variables dengan JWT_SECRET

### Updated:
- ✅ `/api/auth/login/route.ts` - Login dengan database
- ✅ `lib/models/User.ts` - User schema dengan bcryptjs
- ✅ `app/Login.tsx` - Login component dengan database
- ✅ `components/RegisterForm.tsx` - Register form dengan database

### Installed:
- ✅ bcryptjs v2.4.3 - Password hashing
- ✅ jsonwebtoken v9.1.2 - JWT token generation
- ✅ @types/jsonwebtoken - TypeScript types

## 🔐 Security Considerations

### Current Implementation
✅ Passwords hashed dengan bcryptjs
✅ JWT tokens untuk session
✅ Unique email dan npm constraints
✅ Input validation
✅ Secure password comparison

### Production Checklist
- [ ] Change JWT_SECRET ke secret yang kuat
- [ ] Setup HTTPS untuk production
- [ ] Add rate limiting untuk prevent brute force
- [ ] Add CSRF protection
- [ ] Setup refresh tokens untuk long-term sessions
- [ ] Add password requirements (uppercase, special chars, etc)
- [ ] Setup email verification untuk new accounts
- [ ] Add 2FA (two-factor authentication)

## 💾 Informasi Database

### MongoDB Collections
- `users` - Menyimpan user account

### Indexes
- `email` - Unique index
- `npm` - Unique index

## 🔄 Authentication Flow

```
1. User buka http://localhost:3000/register
2. Isi form dan submit
3. Frontend POST ke /api/auth/register
4. API validate input
5. Check duplikasi email/npm
6. Hash password dengan bcryptjs
7. Simpan user ke database
8. Return success
9. Frontend redirect ke /login
10. User input npm + password
11. Frontend POST ke /api/auth/login
12. API query user dari database
13. Compare password
14. Generate JWT token
15. Return token + user data
16. Frontend simpan token ke localStorage
17. Frontend redirect ke /dashboard
18. Dashboard bisa akses token dari localStorage
```

## 📝 Variabel Environment

Edit `.env.local`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/digiarchive
MONGODB_DB=digiarchive
JWT_SECRET=your-super-secret-jwt-key-CHANGE-IN-PRODUCTION
```

## ✨ Next Steps

Fitur Authentication sudah ready! 

Langkah berikutnya:
1. Setup middleware untuk protect routes (cek JWT token)
2. Add logout functionality
3. Setup email verification
4. Add password reset flow
5. Setup refresh tokens
6. Add user profile page dengan edit data

---

**Status**: ✅ Login & Register dengan Database - COMPLETE!

Server running di: `http://localhost:3000`
