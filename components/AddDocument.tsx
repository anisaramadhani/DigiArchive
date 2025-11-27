"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Menggunakan Link dari next/link untuk navigasi
import '../style/AddDocument.css';

export default function AddDocument() {
  const [stream, setStream] = useState<MediaStream | null>(null);  
  const [photoDataUrl, setPhotoDataUrl] = useState<string>('');  
  const [error, setError] = useState<string>(''); 
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Kategori');
  const [title, setTitle] = useState<string>('');
  const router = useRouter();  

  // Fungsi untuk logout dan kembali ke landing page
  const handleLogout = () => {
    localStorage.clear(); 
    sessionStorage.clear(); 
    router.push('/'); 
  };

  const categories = ['Proposal', 'Keuangan', 'Rapat', 'Surat', 'Lainnya'];

  const startCamera = async () => {
    setError('');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Perangkat tidak mendukung akses kamera.');
        return;
      }
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      setStream(s);
      const videoEl = document.getElementById('adddoc-video') as HTMLVideoElement;
      if (videoEl) {
        try {
          videoEl.srcObject = s;
          await videoEl.play();
        } catch (e) { /* ignore play error */ }
      }
    } catch (err) {
      console.error('startCamera error', err);
      setError('Tidak dapat mengakses kamera. Periksa izin atau perangkat kamera.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
    try {
      const videoEl = document.getElementById('adddoc-video') as HTMLVideoElement;
      if (videoEl) videoEl.srcObject = null;
    } catch (e) {}
  };

  const takePhoto = () => {
    const video = document.getElementById('adddoc-video') as HTMLVideoElement;
    const canvas = document.getElementById('adddoc-canvas') as HTMLCanvasElement;
    if (!video || !canvas) return;
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setPhotoDataUrl(dataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
  setError('');
  setSuccessMessage('');

  if (!photoDataUrl) {
    setError('Ambil foto atau unggah gambar terlebih dahulu');
    return;
  }

  try {
    // Prepare payload to send to server
    const payload = {
      title: title || `Dokumen ${new Date().toLocaleString()}`,
      category: selectedCategory === 'Kategori' ? 'Lainnya' : selectedCategory,
      image: photoDataUrl,
    };

    const userId = localStorage.getItem('userId') || undefined;

    // Try to save to server; fallback to localStorage if server fails
    fetch('/api/documents/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(userId ? { 'x-user-id': userId } : {}),
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          throw new Error(txt || `Server returned ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setPhotoDataUrl('');
        stopCamera();
        setTitle('');
        setSuccessMessage('Dokumen berhasil disimpan ke server!');
      })
      .catch((err) => {
        console.warn('API save failed, fallback to localStorage:', err);
        const storeKey = 'digiarchive_local_arsip';
        const existing = JSON.parse(localStorage.getItem(storeKey) || '[]');
        const item = {
          id: Date.now(),
          title: title || `Dokumen ${new Date().toLocaleString()}`,
          category: selectedCategory,
          image: photoDataUrl,
          createdAt: new Date().toISOString(),
          _savedToServer: false,
        };
        existing.unshift(item);
        localStorage.setItem(storeKey, JSON.stringify(existing));

        setPhotoDataUrl('');
        stopCamera();
        setTitle('');
        setSuccessMessage('Dokumen disimpan secara lokal (offline).');
      });
  } catch (err) {
    console.error(err);
    setError('Gagal menyimpan dokumen.');
  }
};


  return (
    <div className="app">
      {/* Sidebar */}
      <nav className="sidebar" id="sidebar">
        <div className="sidebar-header">
          <h1><i className="fas fa-archive"></i> DigiArchive</h1>
          <p>Sistem Pengelolaan Arsip Digital</p>
        </div>
        <div className="sidebar-nav">
          <Link href="/dashboard" className="nav-item"><i className="fa-solid fa-layer-group"></i> Dashboard</Link>
          <Link href="/tambah-dokumen" className="nav-item active"><i className="fa fa-camera"></i> Tambah Dokumen</Link>
          <Link href="/arsip" className="nav-item"><i className="fas fa-folder-open"></i> Daftar Arsip</Link>
          <Link href="/recycle-bin" className="nav-item"><i className="fas fa-trash"></i> Recycle Bin</Link>
          <Link href="/profile" className="nav-item"><i className="fas fa-user"></i> Profile</Link>
        </div>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content flex-1 bg-gray-50 min-h-screen">
        <div className="top-bar flex items-center justify-between p-4 bg-white shadow">
          <button className="menu-toggle text-xl">
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="page-title text-lg font-semibold">Tambah Dokumen</h1>
        </div>

        <div className="content-card p-6">
          <div className="add-document-page p-0 bg-transparent">
            <h2 className="text-2xl font-semibold mb-3">Tambah Dokumen (Foto)</h2>
            <p className="text-sm text-gray-600 mb-4">Ambil foto dokumen langsung dari kamera atau unggah gambar.</p>

            <div className="add-document-controls">
              {!stream && <button onClick={startCamera} className="btn btn-primary">Buka Kamera</button>}
              {stream && <button onClick={takePhoto} className="btn btn-success">Ambil Foto</button>}
              {stream && <button onClick={stopCamera} className="btn btn-muted">Tutup Kamera</button>}
              <label className="text-sm text-gray-600">atau unggah gambar:</label>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="add-document-file" />
            </div>

            {error && <p className="error">{error}</p>}
            {successMessage && (
              <p className="success-message" style={{ color: 'green', marginTop: '8px' }}>
                {successMessage}
              </p>
            )}

            <div className="add-document-layout">
              <div>
                <div className="video-wrapper">
                  <video id="adddoc-video" autoPlay playsInline style={{width:'100%'}} />
                </div>
                <canvas id="adddoc-canvas" style={{display:'none'}} />
              </div>

              <div>
                <div className="preview-box">
                  {photoDataUrl ? (
                    <img src={photoDataUrl} alt="preview" />
                  ) : (
                    <div className="text-gray-400 text-center">Preview foto akan muncul di sini</div>
                  )}
                </div>

                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Judul dokumen"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ padding: '8px', marginRight: '8px', flex: 1 }}
                  />
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button onClick={handleSave} className="save-btn">Simpan Dokumen</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
