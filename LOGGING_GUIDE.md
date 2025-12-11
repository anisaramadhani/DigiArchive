# 📊 Setup Logging & Debugging dengan Grafana + Loki

## 🎯 Tujuan
Implementasi sistem logging dan debugging menggunakan Grafana + Loki untuk memenuhi requirement **D. Logging & Debugging (15%)**

---

## 📋 Komponen yang Diimplementasikan

### 1. **Custom Logger** (`lib/logger.ts`)
- Support 4 level log: `info`, `warn`, `error`, `debug`
- Format log terstruktur dengan timestamp, level, dan context
- Automatic push ke Loki (jika dikonfigurasi)
- Color-coded console output

### 2. **Grafana + Loki Stack** (Docker Compose)
- **Loki**: Log aggregation dan storage
- **Grafana**: Dashboard dan visualisasi
- **Promtail**: Log collector (optional)

### 3. **API Logging Integration**
Sudah diintegrasikan di:
- ✅ Auth API (`/api/auth/login`)
- ✅ Document API (`/api/documents/add`)
- ✅ Share API (`/api/documents/share`)

---

## 🚀 Cara Setup

### Step 1: Install Dependencies
Tidak perlu install package tambahan, sudah menggunakan native fetch API.

### Step 2: Jalankan Grafana + Loki
```bash
# Di folder root project
docker-compose -f docker-compose.logging.yml up -d
```

Tunggu beberapa detik sampai semua container running.

### Step 3: Konfigurasi Environment (Optional)
Tambahkan di `.env.local`:
```env
LOKI_URL=http://localhost:3100
NODE_ENV=development
```

### Step 4: Jalankan Aplikasi Next.js
```bash
npm run dev
```

### Step 5: Akses Grafana Dashboard
1. Buka browser: **http://localhost:3001**
2. Login dengan:
   - Username: `admin`
   - Password: `admin123`
3. Grafana akan otomatis terhubung dengan Loki

---

## 📊 Cara Melihat Log di Grafana

### 1. Buka Explore
- Klik menu **Explore** (ikon kompas) di sidebar kiri
- Pilih data source: **Loki**

### 2. Query Log
Contoh query LogQL:

#### Semua log dari aplikasi:
```logql
{job="digiarchive"}
```

#### Filter by level:
```logql
{job="digiarchive", level="error"}
{job="digiarchive", level="warn"}
{job="digiarchive", level="info"}
```

#### Filter by context:
```logql
{job="digiarchive", context="Auth"}
{job="digiarchive", context="Document"}
{job="digiarchive", context="Share"}
```

#### Kombinasi filter:
```logql
{job="digiarchive", level="error", context="Auth"}
```

#### Search log message:
```logql
{job="digiarchive"} |= "Login failed"
{job="digiarchive"} |= "Document uploaded"
```

---

## 🔍 3 Contoh Kasus Debugging

### **KASUS 1: Login Gagal - User Not Found**

**Situasi**: User mengeluh tidak bisa login, meskipun NPM sudah benar.

**Langkah Debugging dengan Log**:

1. **Cek log di Grafana**:
```logql
{job="digiarchive", context="Auth"} |= "Login failed"
```

2. **Temuan di log**:
```json
{
  "message": "Login failed: User not found",
  "level": "warn",
  "context": "Auth",
  "npm": "2106123456",
  "timestamp": "2025-12-11T10:30:45.123Z"
}
```

3. **Analisis**:
   - Log level: `WARN` (bukan error database)
   - NPM yang diinput: `2106123456`
   - User tidak ditemukan di database

4. **Root Cause**: User belum register atau NPM salah ketik

5. **Solusi**: 
   - Verifikasi NPM user di database
   - Instruksikan user untuk register terlebih dahulu
   - Atau perbaiki typo di NPM

---

### **KASUS 2: Upload Dokumen Lambat**

**Situasi**: User komplain upload dokumen memakan waktu lama (>5 detik).

**Langkah Debugging dengan Log**:

1. **Cek log upload**:
```logql
{job="digiarchive", context="Document"} |= "Document upload"
```

2. **Filter by duration** (manual review):
```logql
{job="digiarchive", context="Document"} |= "duration"
```

3. **Temuan di log**:
```json
{
  "message": "Document uploaded successfully",
  "npm": "2106789012",
  "fileName": "proposal.pdf",
  "fileSize": "8523KB",
  "duration": "6840ms",
  "context": "Document"
}
```

4. **Analisis**:
   - Duration: **6840ms (6.8 detik)** ❌ terlalu lama
   - File size: **8523KB (8.5MB)** 🔥 file besar!
   - Tidak ada error, hanya lambat

5. **Root Cause**: File size terlalu besar untuk upload base64

6. **Solusi yang bisa diimplementasikan**:
   - Tambahkan file size limit (max 5MB)
   - Implementasi file compression di client-side
   - Gunakan multipart upload untuk file besar
   - Migrate ke cloud storage (AWS S3, Cloudinary)

---

### **KASUS 3: Share Dokumen Error - Database Connection**

**Situasi**: User tidak bisa share dokumen ke teman, selalu error 500.

**Langkah Debugging dengan Log**:

1. **Cek error logs**:
```logql
{job="digiarchive", level="error"}
```

2. **Filter specific to Share API**:
```logql
{job="digiarchive", context="Share", level="error"}
```

3. **Temuan di log**:
```json
{
  "message": "Share document failed",
  "level": "error",
  "context": "Share",
  "documentId": "674abc123def456789",
  "shareWithNpm": "2106555666",
  "duration": "15230ms",
  "error": "MongoNetworkError: connection timed out",
  "stack": "MongoNetworkError: connection timed out\n    at ...",
  "timestamp": "2025-12-11T14:22:10.456Z"
}
```

4. **Analisis**:
   - Error type: `MongoNetworkError`
   - Error message: **connection timed out**
   - Duration: 15230ms (15 detik timeout)
   - Terjadi saat query ke database

5. **Root Cause**: MongoDB connection pool habis atau database tidak responsif

6. **Debugging Lanjutan**:
   - Cek semua operation ke database dalam timeframe yang sama:
   ```logql
   {job="digiarchive"} |= "database" | logfmt | duration > 5000
   ```
   
7. **Solusi**:
   - Restart MongoDB container
   - Increase connection pool size di mongodb.ts
   - Tambahkan connection retry logic
   - Monitor database performance

---

## 📈 Monitoring Best Practices

### Dashboard yang Disarankan

1. **Error Rate Dashboard**
   - Count error logs per hour
   - Alert jika error > 10 per menit

2. **Performance Dashboard**
   - Average response time per API endpoint
   - P95, P99 latency

3. **User Activity Dashboard**
   - Login attempts (success vs failed)
   - Document uploads per hour
   - Share activity

### Alert Rules (Optional)

Set up alert di Grafana untuk:
- Error rate > threshold
- High latency (>3 detik)
- Failed login attempts spike (brute force detection)

---

## 🎓 Logs yang Dihasilkan

### Level INFO (Success Operations)
- Login successful
- Document uploaded successfully
- Document shared successfully
- User registered

### Level WARN (Potential Issues)
- Login failed: Invalid password
- Login failed: User not found
- Share failed: Already shared
- Share failed: Target user not found

### Level ERROR (Critical Failures)
- Database connection failed
- Upload failed
- Share document failed
- Internal server errors

### Level DEBUG (Development Only)
- Database query details
- Function parameters
- State transitions

---

## 🔧 Maintenance

### Melihat Container Logs
```bash
# Loki logs
docker logs digiarchive-loki

# Grafana logs
docker logs digiarchive-grafana
```

### Stop Logging Stack
```bash
docker-compose -f docker-compose.logging.yml down
```

### Remove Volumes (Clean Slate)
```bash
docker-compose -f docker-compose.logging.yml down -v
```

---

## 📝 Checklist untuk Presentasi

- ✅ Custom logger implemented dengan 4 log levels
- ✅ Grafana + Loki running via Docker
- ✅ Logging terintegrasi di 3+ API endpoints
- ✅ Log menampilkan: timestamp, level, context, metadata
- ✅ 3 contoh kasus debugging terdokumentasi
- ✅ Dashboard Grafana accessible (localhost:3001)
- ✅ Query LogQL untuk filtering logs

---

## 🎯 Kesimpulan

Sistem logging dengan Grafana + Loki memberikan:
1. **Visibility**: Semua operasi tercatat dengan detail
2. **Debugging**: Mudah trace error dari log
3. **Monitoring**: Real-time monitoring performa aplikasi
4. **Alerting**: Bisa setup alert untuk anomali
5. **Audit Trail**: History semua aktivitas user

**Total Coverage**: 15% ✅

---

## 📞 Troubleshooting

### Loki tidak menerima log
- Cek `LOKI_URL` di environment
- Pastikan Loki container running: `docker ps`
- Test Loki endpoint: `curl http://localhost:3100/ready`

### Grafana tidak bisa login
- Default credentials: `admin` / `admin123`
- Reset password: hapus volume dan restart

### Log tidak muncul di Grafana
- Tunggu 10-30 detik (ada delay)
- Refresh query di Explore
- Cek time range selector (set ke "Last 1 hour")
