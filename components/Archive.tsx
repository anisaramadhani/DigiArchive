"use client";
import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../style/Archive.css";

interface ArchiveItem {
  id: string | number;
  title: string;
  category: string;
  image: string;
  createdAt: string;
}

const Archive: React.FC = () => {
  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const [search, setSearch] = useState<string>("");
  const [kategori, setKategori] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [selectedArchive, setSelectedArchive] = useState<ArchiveItem | null>(null);

  const router = useRouter();

  // Load arsip dari localStorage saat component mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('digiarchive_local_arsip') || '[]';
      const docs = JSON.parse(raw) as ArchiveItem[];
      setArchives(docs || []);
    } catch (err) {
      console.error('Error loading archives:', err);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Untuk sekarang, arahkan ke halaman tambah dokumen
    // Karena arsip ditambah melalui kamera di halaman tambah dokumen
    setShowModal(false);
    router.push("/tambah-dokumen");
  };

  const handleDelete = (id: string | number) => {
    try {
      const itemToDelete = archives.find(a => a.id === id);
      if (!itemToDelete) return;

      // Pindahkan ke recycle bin (soft delete) - simpan tanpa image untuk hemat storage
      const recycleBin = JSON.parse(localStorage.getItem('digiarchive_recycle_bin') || '[]');
      recycleBin.push({
        id: itemToDelete.id,
        title: itemToDelete.title,
        category: itemToDelete.category,
        createdAt: itemToDelete.createdAt,
        deletedAt: new Date().toISOString()
        // Jangan simpan image di recycle bin untuk hemat storage
      });
      localStorage.setItem('digiarchive_recycle_bin', JSON.stringify(recycleBin));

      // Hapus dari arsip
      const updated = archives.filter(a => a.id !== id);
      setArchives(updated);
      localStorage.setItem('digiarchive_local_arsip', JSON.stringify(updated));
    } catch (err) {
      console.error('Error deleting archive:', err);
      alert('Gagal menghapus arsip. Storage mungkin penuh.');
    }
  };

  const filteredArchives = archives.filter(archive => {
    const matchSearch = archive.title.toLowerCase().includes(search.toLowerCase()) || 
                       archive.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !kategori || archive.category === kategori;
    return matchSearch && matchCategory;
  });

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
          <Link href="/tambah-dokumen" className="nav-item"><i className="fa fa-camera"></i> Tambah Dokumen</Link>
          <Link href="/archive" className="nav-item active"><i className="fas fa-folder-open"></i> Daftar Arsip</Link>
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
      <main className="main-content">
        <div className="top-bar">
          <button className="menu-toggle"><i className="fas fa-bars"></i></button>
          <h1 className="page-title">Daftar Arsip</h1>
        </div>

        <div className="content-card">
          <div className="archive-header">
            <h2>Manajemen Arsip</h2>
            <button className="btn-primary" onClick={() => router.push('/tambah-dokumen')}>
              <i className="fas fa-plus"></i> Tambah Dokumen
            </button>
          </div>

          {/* Info */}
          <div style={{ background: "#e3f2fd", color: "#1976d2", padding: "10px 20px", borderRadius: "8px", marginBottom: "1rem" }}>
            💡 Semua arsip disimpan secara lokal di perangkat ini. Data akan hilang jika cache browser dihapus.
          </div>

          {/* Search */}
          <div className="search-container">
            <form style={{ display: "flex", gap: "1rem", width: "100%" }} onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                className="search-input"
                placeholder="Cari arsip berdasarkan judul atau kategori..."
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              />
              <select className="category-filter" value={kategori} onChange={(e: ChangeEvent<HTMLSelectElement>) => setKategori(e.target.value)}>
                <option value="">Semua Kategori</option>
                <option value="Proposal">Proposal</option>
                <option value="Keuangan">Keuangan</option>
                <option value="Rapat">Rapat</option>
                <option value="Surat">Surat</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              <button className="btn-primary" type="submit"><i className="fas fa-search"></i> Cari</button>
            </form>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="archive-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Judul</th>
                  <th>Kategori</th>
                  <th>Preview</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredArchives.length > 0 ? (
                  filteredArchives.map((archive, index) => (
                    <tr key={archive.id}>
                      <td>{index + 1}</td>
                      <td>{archive.title}</td>
                      <td>
                        <span className={`category-badge category-${archive.category?.toLowerCase()}`}>
                          {archive.category}
                        </span>
                      </td>
                      <td>
                        <img src={archive.image} alt={archive.title} style={{ maxWidth: '50px', maxHeight: '50px', cursor: 'pointer' }}
                          onClick={() => { setSelectedArchive(archive); setShowDetail(true); }} />
                      </td>
                      <td>{new Date(archive.createdAt).toLocaleDateString('id-ID')}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="btn-action view"
                            onClick={() => { setSelectedArchive(archive); setShowDetail(true); }}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            type="button"
                            className="btn-action delete"
                            onClick={() => handleDelete(archive.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty-state">
                        <i className="fas fa-folder-open"></i>
                        <h3>Belum ada arsip ditemukan</h3>
                        <p>Silakan tambah dokumen melalui halaman Tambah Dokumen.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Detail Arsip */}
      {showDetail && selectedArchive && (
        <div className={`modal-overlay ${showDetail ? 'active' : ''}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Detail Arsip</h2>
              <button className="modal-close" onClick={() => setShowDetail(false)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Judul</label>
                <div>{selectedArchive.title}</div>
              </div>
              <div className="form-group">
                <label>Kategori</label>
                <div>{selectedArchive.category}</div>
              </div>
              <div className="form-group">
                <label>Preview</label>
                <div>
                  <img src={selectedArchive.image} alt={selectedArchive.title} style={{ maxWidth: '100%', borderRadius: '8px' }} />
                </div>
              </div>
              <div className="form-group">
                <label>Tanggal</label>
                <div>{new Date(selectedArchive.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDetail(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Archive;
