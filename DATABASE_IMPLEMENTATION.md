# Database Implementation Summary - DigiArchive

## ✅ Completed Setup

### 1. Database Models Created
- **`lib/models/User.ts`** - User schema dengan username, email, password
- **`lib/models/Document.ts`** - Document schema untuk menyimpan dokumen dengan metadata
- **`lib/models/DeletedDocument.ts`** - DeletedDocument schema dengan TTL index 30 hari

### 2. API Routes Implemented

#### `/api/documents/add` (POST)
- Tambah dokumen baru ke database
- Menyimpan image dalam Base64 format
- Returns: success status dan document data

#### `/api/documents` (GET, POST, DELETE)
- **GET**: Ambil semua dokumen user yang tidak dihapus
- **POST**: Tambah dokumen (alternatif untuk add route)
- **DELETE**: Soft delete dokumen (move to recycle bin)

#### `/api/documents/recycle-bin` (GET, PATCH, DELETE)
- **GET**: Ambil semua dokumen terhapus dalam 30 hari
- **PATCH**: Restore dokumen dari recycle bin
- **DELETE**: Permanent delete (hard delete)

### 3. Frontend Integration
- **`app/recycle-bin/page.tsx`** - Updated untuk fetch dari database
- **`components/DeletedDocument.tsx`** - UI untuk recycle bin (sudah ada)
- **`style/DeletedDocument.css`** - CSS di-merge ke globals.css

### 4. DeletedDocument CSS Applied
Semua styling DeletedDocument sudah di-merge ke `app/globals.css`:
- Table styling dengan gradient header
- Action buttons (Restore & Delete)
- Warning states untuk dokumen yang hampir expired
- Responsive design untuk mobile

### 5. Configuration Files
- **`.env.local.example`** - Template untuk MongoDB connection
- **`DATABASE_SETUP.md`** - Dokumentasi lengkap setup database
- **`package.json`** - Sudah include mongoose v9.0.0

## 🗄️ Database Collections

### users
```
_id: ObjectId
username: string (unique)
email: string (unique)
password: string
createdAt: Date
updatedAt: Date
```

### documents
```
_id: ObjectId
userId: ObjectId
title: string
description: string
category: "Proposal" | "Keuangan" | "Rapat" | "Surat" | "Lainnya"
imageData: string (Base64)
fileName: string
fileSize: number
tags: [string]
isDeleted: boolean
deletedAt: Date | null
createdAt: Date
updatedAt: Date
```

### deleted_documents
```
_id: ObjectId
userId: ObjectId
documentId: ObjectId (references documents)
title: string
category: string
imageData: string (Base64)
deletedAt: Date (auto-set saat soft delete)
expiresAt: Date (30 hari setelah deletedAt - TTL index)
createdAt: Date
updatedAt: Date
```

## 🚀 How to Start

### 1. Setup MongoDB
Copy template dan update credentials:
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
# Untuk MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/digiarchive?retryWrites=true&w=majority
MONGODB_DB=digiarchive

# Atau untuk Local MongoDB:
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=digiarchive
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Dev Server
```bash
npm run dev
```

Server akan run di `http://localhost:3000`

## 📋 Features

### Document Management
✅ Tambah dokumen baru (dengan foto/upload)
✅ List dokumen arsip
✅ Soft delete dokumen (move to recycle bin)
✅ Auto-delete setelah 30 hari

### Recycle Bin
✅ View dokumen terhapus dengan sisa hari
✅ Restore dokumen dalam 30 hari
✅ Permanent delete
✅ Responsive table dengan styling

### Database Features
✅ Mongoose connection pooling & caching
✅ TTL Index untuk auto-delete
✅ User isolation (setiap user hanya lihat data mereka)
✅ Timestamp tracking (createdAt, updatedAt)

## 🔄 API Examples

### Tambah Dokumen
```bash
POST /api/documents/add
Content-Type: application/json

{
  "title": "Proposal Tahun 2024",
  "category": "Proposal",
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA..."
}
```

### List Dokumen Terhapus
```bash
GET /api/documents/recycle-bin
```

### Restore Dokumen
```bash
PATCH /api/documents/recycle-bin
Content-Type: application/json

{
  "documentId": "507f1f77bcf86cd799439011"
}
```

### Delete Permanent
```bash
DELETE /api/documents/recycle-bin?id=507f1f77bcf86cd799439011
```

## ⚠️ Penting

### Sebelum Production
1. **Setup proper authentication** - Sekarang menggunakan demo-user, ganti dengan session/JWT
2. **Add password hashing** - Implement bcrypt untuk password
3. **Move to file storage** - Base64 di database bukan ideal, gunakan cloud storage
4. **Add validation** - Validate file type, size, user input
5. **Add error handling** - Better error messages dan logging
6. **Security** - HTTPS, CSRF protection, rate limiting

### Next Steps
1. Integrate dengan login system yang proper
2. Add user session management
3. Implement file upload ke cloud storage (S3, Cloudinary, dll)
4. Add search dan filter untuk documents
5. Add audit logging
6. Setup backup strategy

## 📁 File Structure
```
lib/
├── models/
│   ├── User.ts
│   ├── Document.ts
│   └── DeletedDocument.ts
└── mongodb.ts (connection helper)

app/
├── api/documents/
│   ├── add/route.ts
│   ├── recycle-bin/route.ts
│   └── route.ts
└── recycle-bin/page.tsx

.env.local.example
DATABASE_SETUP.md
```

## ✨ Status
- ✅ Database models created
- ✅ API routes implemented
- ✅ Frontend integrated
- ✅ CSS styling applied
- ✅ TypeScript compilation successful
- ✅ Dev server running

---
**Last Updated**: November 26, 2025
**Project**: DigiArchive v0.1.0
