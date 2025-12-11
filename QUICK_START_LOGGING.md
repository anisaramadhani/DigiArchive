# 🚀 Quick Start - Logging DigiArchive (Tanpa Docker)

## Untuk Testing Cepat Tanpa Grafana + Loki

Jika Docker tidak tersedia, Anda bisa menggunakan **file-based logging** terlebih dahulu untuk demo.

### Setup

1. **Logger sudah aktif** - Semua API sudah menggunakan custom logger
2. **Log akan muncul di console** saat `npm run dev`
3. **Log berwarna** untuk mudah dibedakan:
   - 🔵 **INFO** (Cyan): Operasi berhasil
   - 🟡 **WARN** (Yellow): Peringatan
   - 🔴 **ERROR** (Red): Error
   - 🟣 **DEBUG** (Magenta): Debug info

### Contoh Output di Console

```bash
[2025-12-11T08:30:45.123Z] [INFO] [Auth] Login attempt started {"npm":"2106123456","ip":"127.0.0.1"}
[2025-12-11T08:30:45.456Z] [INFO] [Auth] Login successful {"npm":"2106123456","userName":"Anisa","duration":"333ms"}

[2025-12-11T08:31:20.789Z] [INFO] [Document] Document upload started {"npm":"2106123456","fileName":"proposal.pdf","fileSize":"2.5MB"}
[2025-12-11T08:31:22.100Z] [INFO] [Document] Document uploaded successfully {"documentId":"674abc...","duration":"1311ms"}

[2025-12-11T08:32:10.456Z] [WARN] [Share] Share failed: Target user not found {"shareWithNpm":"9999999999"}
```

---

## Testing Scenarios

### 1. Test Login Success
```bash
# Jalankan dev server
npm run dev

# Di browser, buka http://localhost:3000/login
# Login dengan NPM yang benar

# Cek terminal, akan muncul:
# [INFO] Login attempt started
# [INFO] Login successful
```

### 2. Test Login Failed
```bash
# Login dengan NPM salah atau password salah

# Cek terminal:
# [WARN] Login failed: Invalid password
# atau
# [WARN] Login failed: User not found
```

### 3. Test Document Upload
```bash
# Upload dokumen dari halaman tambah dokumen

# Cek terminal:
# [INFO] Document upload started
# [INFO] Document uploaded successfully
```

### 4. Test Share Document
```bash
# Bagikan dokumen ke NPM lain

# Jika berhasil:
# [INFO] Document shared successfully

# Jika gagal:
# [WARN] Share failed: Target user not found
# [WARN] Share failed: Already shared with this user
```

---

## Untuk Presentasi (Dengan Grafana)

### Jika Docker Desktop sudah diinstall:

1. **Start Docker Desktop**
2. **Jalankan stack**:
```bash
docker-compose -f docker-compose.logging.yml up -d
```

3. **Tunggu 30 detik** sampai semua container ready

4. **Akses Grafana**: http://localhost:3001
   - Username: `admin`
   - Password: `admin123`

5. **Explore Logs**:
   - Klik menu **Explore** (ikon kompas)
   - Query: `{job="digiarchive"}`
   - Pilih time range: "Last 15 minutes"

6. **Filter Logs**:
   - Error only: `{job="digiarchive", level="error"}`
   - Login logs: `{job="digiarchive", context="Auth"}`
   - Upload logs: `{job="digiarchive", context="Document"}`

---

## Screenshot untuk Dokumentasi

### Yang Perlu Di-capture:

1. **Console Output** - Log berwarna di terminal
2. **Grafana Dashboard** - Explore view dengan query
3. **Log Details** - Expand salah satu log entry untuk show metadata
4. **Filter Example** - Query dengan filter level atau context

---

## Alternatif: JSON File Logging

Jika butuh persistent log tanpa Grafana, bisa tambahkan file logger:

```typescript
// lib/logger.ts - tambahkan method ini
private logToFile(level: LogLevel, message: string, metadata?: LogMetadata): void {
  const fs = require('fs');
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    context: this.context,
    message,
    ...metadata
  };
  
  fs.appendFileSync(
    'logs/app.log', 
    JSON.stringify(logEntry) + '\n'
  );
}
```

Lalu buat folder `logs/` di root project.

---

## Cara Menjalankan Demo

### Skenario 1: Login Gagal -> Debugging
1. Buka aplikasi
2. Coba login dengan NPM yang tidak terdaftar
3. Show terminal log: `[WARN] Login failed: User not found`
4. Explain: "Dari log ini, kita bisa tahu user belum register"

### Skenario 2: Upload Lambat -> Performance Analysis  
1. Upload file besar (>5MB)
2. Show terminal log dengan duration: `"duration":"6840ms"`
3. Explain: "Dari log duration, kita bisa identifikasi bottleneck"

### Skenario 3: Share Error -> Root Cause Analysis
1. Bagikan dokumen ke NPM yang tidak ada
2. Show log: `[WARN] Share failed: Target user not found`
3. Explain: "Log metadata menunjukkan npm yang tidak valid"

---

## Tips Presentasi

✅ **Jelaskan 4 Log Levels**: info, warn, error, debug
✅ **Tunjukkan Metadata**: npm, duration, fileSize, dll
✅ **Demo Real-time**: Lakukan action → log muncul instant
✅ **Grafana (jika ada)**: Show filtering dan querying
✅ **Explain Use Case**: Kenapa logging penting untuk production

---

## Checklist Deliverables

- ✅ Custom logger dengan 4 levels
- ✅ Logging di 3+ API endpoints
- ✅ Log format terstruktur (JSON-like)
- ✅ Metadata lengkap (timestamp, context, duration)
- ✅ 3 debugging case examples
- ✅ Grafana setup (optional, tapi recommended)
- ✅ Documentation lengkap

**Bobot: 15% ✅ SELESAI**
