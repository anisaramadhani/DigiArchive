"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../../style/DeletedDocument.css";

interface DeletedDoc {
  id: string | number;
  title: string;
  category: string;
  createdAt: string;
  deletedAt: string;
  image?: string; // optional, mungkin tidak ada di recycle bin untuk hemat storage
}

export default function RecycleBinPage() {
  const [deletedDocs, setDeletedDocs] = useState<DeletedDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load deleted items dari localStorage saat component mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('digiarchive_recycle_bin') || '[]';
      const docs = JSON.parse(raw) as DeletedDoc[];
      setDeletedDocs(docs || []);
    } catch (err) {
      console.error('Error loading recycle bin:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    router.push("/");
  };

  // Pulihkan dokumen
  const handleRestore = (id: string | number) => {
    try {
      const docToRestore = deletedDocs.find(d => d.id === id);
      if (!docToRestore) return;

      // Hapus deletedAt dan tambahkan kembali ke arsip
      const { deletedAt, ...originalDoc } = docToRestore;
      const arsip = JSON.parse(localStorage.getItem('digiarchive_local_arsip') || '[]');
      arsip.unshift(originalDoc);
      localStorage.setItem('digiarchive_local_arsip', JSON.stringify(arsip));

      // Hapus dari recycle bin
      const updated = deletedDocs.filter(d => d.id !== id);
      setDeletedDocs(updated);
      localStorage.setItem('digiarchive_recycle_bin', JSON.stringify(updated));

      alert('Dokumen berhasil dipulihkan!');
    } catch (err) {
      console.error('Error restoring document:', err);
      alert('Gagal memulihkan dokumen');
    }
  };

  // Hapus permanen
  const handlePermanentDelete = (id: string | number) => {
    if (!confirm('Yakin ingin menghapus dokumen secara permanen? Aksi ini tidak dapat dibatalkan.')) {
      return;
    }

    try {
      const updated = deletedDocs.filter(d => d.id !== id);
      setDeletedDocs(updated);
      localStorage.setItem('digiarchive_recycle_bin', JSON.stringify(updated));
      alert('Dokumen berhasil dihapus secara permanen!');
    } catch (err) {
      console.error('Error permanently deleting document:', err);
      alert('Gagal menghapus dokumen');
    }
  };

  if (loading) {
    return (
      <div className="app">
        <nav className="sidebar">
          <div className="sidebar-header">
            <h1><i className="fas fa-archive"></i> DigiArchive</h1>
            <p>Sistem Pengelolaan Arsip Digital</p>
          </div>
        </nav>
        <main className="main-content" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p>Memuat...</p>
        </main>
      </div>
    );
  }

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
          <Link href="/arsip" className="nav-item"><i className="fas fa-folder-open"></i> Daftar Arsip</Link>
          <Link href="/recycle-bin" className="nav-item active"><i className="fas fa-trash"></i> Recycle Bin</Link>
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
          <h1 className="page-title">Recycle Bin</h1>
        </div>

        <div className="content-card">
          <div className="deleted-header">
            <h2>Dokumen yang Dihapus</h2>
          </div>

          {deletedDocs.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-trash"></i>
              <h3>Recycle Bin Kosong</h3>
              <p>Dokumen yang dihapus akan muncul di sini.</p>
            </div>
          ) : (
            <div className="deleted-container">
              <div className="info-box">
                💡 Total dokumen dalam recycle bin: <strong>{deletedDocs.length}</strong>
              </div>

              <div className="deleted-table-container">
                <table className="deleted-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Judul</th>
                      <th>Kategori</th>
                      <th>Preview</th>
                      <th>Tanggal Dihapus</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deletedDocs.map((doc, index) => (
                      <tr key={doc.id}>
                        <td>{index + 1}</td>
                        <td>{doc.title}</td>
                        <td>
                          <span className={`category-badge category-${doc.category?.toLowerCase()}`}>
                            {doc.category}
                          </span>
                        </td>
                        <td>
                          {doc.image ? (
                            <img src={doc.image} alt={doc.title} style={{ maxWidth: '50px', maxHeight: '50px' }} />
                          ) : (
                            <div style={{ width: '50px', height: '50px', backgroundColor: '#e0e0e0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#999' }}>
                              Tidak ada
                            </div>
                          )}
                        </td>
                        <td>{new Date(doc.deletedAt).toLocaleDateString('id-ID')}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              type="button"
                              className="btn-action restore"
                              onClick={() => handleRestore(doc.id)}
                              title="Pulihkan dokumen"
                            >
                              <i className="fas fa-undo"></i>
                            </button>
                            <button
                              type="button"
                              className="btn-action delete"
                              onClick={() => handlePermanentDelete(doc.id)}
                              title="Hapus secara permanen"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
