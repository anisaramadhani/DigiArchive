# Database Setup Guide untuk DigiArchive

## Teknologi Database
- **Database**: MongoDB (Cloud atau Local)
- **ORM**: Mongoose
- **Models**: User, Document, DeletedDocument

## Instalasi

### 1. Install Dependencies
Dependencies sudah ada di `package.json`. Pastikan sudah jalankan:

```bash
npm install
```

### 2. Setup MongoDB Connection

#### Opsi A: MongoDB Atlas (Cloud)
1. Buat akun di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Buat cluster baru
3. Dapatkan connection string
4. Update `.env.local` dengan format:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/digiarchive?retryWrites=true&w=majority
MONGODB_DB=digiarchive
```

#### Opsi B: MongoDB Local
1. Install MongoDB Community Edition
2. Update `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=digiarchive
```

### 3. Buat File `.env.local`
Copy dari template dan isi dengan credentials Anda:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` dengan MongoDB connection string Anda.

## Database Models

### User Collection
```typescript
{
  _id: ObjectId,
  username: string,
  email: string,
  password: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Document Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  title: string,
  description: string,
  category: "Proposal" | "Keuangan" | "Rapat" | "Surat" | "Lainnya",
  imageData: string (Base64),
  fileName: string,
  fileSize: number,
  tags: string[],
  isDeleted: boolean,
  deletedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### DeletedDocument Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  documentId: ObjectId,
  title: string,
  category: string,
  imageData: string,
  deletedAt: Date,
  expiresAt: Date (30 hari setelah deletedAt),
  createdAt: Date,
  updatedAt: Date
}
```

## API Routes

### Dokumen
- `POST /api/documents/add` - Tambah dokumen baru
- `GET /api/documents` - Ambil semua dokumen
- `DELETE /api/documents?id={id}` - Soft delete dokumen

### Recycle Bin
- `GET /api/documents/recycle-bin` - Ambil semua dokumen terhapus
- `PATCH /api/documents/recycle-bin` - Restore dokumen
- `DELETE /api/documents/recycle-bin?id={id}` - Hapus permanen

## Fitur Database

### Soft Delete
Ketika dokumen dihapus:
1. Document di-mark dengan `isDeleted: true` dan `deletedAt` diset
2. Record baru dibuat di DeletedDocument collection
3. User bisa restore dalam 30 hari

### TTL Index (Auto Delete)
DeletedDocument otomatis dihapus setelah 30 hari dengan MongoDB TTL index.

## Testing Database

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test Endpoints dengan Postman atau cURL

**Tambah Dokumen:**
```bash
curl -X POST http://localhost:3000/api/documents/add \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Dokumen Saya",
    "category": "Proposal",
    "image": "data:image/jpeg;base64,..."
  }'
```

**Lihat Dokumen Terhapus:**
```bash
curl http://localhost:3000/api/documents/recycle-bin
```

**Restore Dokumen:**
```bash
curl -X PATCH http://localhost:3000/api/documents/recycle-bin \
  -H "Content-Type: application/json" \
  -d '{"documentId": "..."}'
```

## Troubleshooting

### Koneksi MongoDB Gagal
- Pastikan MongoDB URI benar di `.env.local`
- Pastikan IP address sudah whitelisted di MongoDB Atlas
- Check console untuk error messages

### Dokumen Tidak Menyimpan
- Check apakah userId ada di header atau session
- Verifikasi imageData dalam format Base64 yang valid

### TTL Index Tidak Bekerja
- MongoDB TTL index membutuhkan waktu hingga 1 menit untuk proses
- Pastikan `expiresAt` field ada di DeletedDocument

## Next Steps
1. Integrate dengan authentication system yang proper (sekarang menggunakan demo-user)
2. Add user session management dengan secure cookies
3. Add file upload/storage (sekarang menggunakan Base64)
4. Add search dan filter untuk documents
