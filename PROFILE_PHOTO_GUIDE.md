# Fitur Upload Foto Profile

## Fitur
✅ Upload foto dari file sistem
✅ Ambil foto langsung dari kamera
✅ Crop dan sesuaikan area foto (zoom & drag)
✅ Preview berbentuk bulat
✅ Auto-save ke database

## Cara Menggunakan
1. Klik tombol kamera di pojok kanan bawah avatar
2. Pilih "Ambil Foto" (kamera) atau "Upload File"
3. Sesuaikan foto dengan drag & zoom
4. Klik Simpan

## File yang Dibuat/Dimodifikasi
- ✅ components/ImageCropper.tsx (baru)
- ✅ style/ImageCropper.css (baru)
- ✅ app/api/auth/upload-photo/route.ts (baru)
- ✅ components/Profile.tsx (diupdate)
- ✅ style/Profile.css (diupdate)
- ✅ app/profile/page.tsx (diupdate)
- ✅ app/api/auth/profile/route.ts (diupdate)

## Library
- react-easy-crop: sudah terinstall

Foto disimpan di: `/public/images/profile-{npm}-{timestamp}.jpg`
