"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Menggunakan Link dari next/link untuk routing internal
import Image from 'next/image';
import '../style/DeletedDocument.css';

// Fungsi untuk menghitung sisa hari
function daysLeft(deletedAt: number) {
  const now = Date.now();
  const millisLeft = Math.max(0, deletedAt + 30 * 24 * 60 * 60 * 1000 - now);
  return Math.ceil(millisLeft / (24 * 60 * 60 * 1000));
}

interface DeletedDocument {
  id: number;
  judul: string;
  title: string;
  file: string;
  deletedAt: number;
}

interface DeletedDocumentsProps {
  deletedDocs: DeletedDocument[];
  onRestore: (id: number) => void;
  onPermanentDelete: (id: number) => void;
}

const DeletedDocuments: React.FC<DeletedDocumentsProps> = ({ deletedDocs = [], onRestore, onPermanentDelete }) => {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [selectedDoc, setSelectedDoc] = useState<DeletedDocument | null>(null);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push('/');
  };

  const handleDeleteClick = (doc: DeletedDocument) => {
    setSelectedDoc(doc);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedDoc) {
      onPermanentDelete(selectedDoc.id);
    }
    setShowDeleteConfirm(false);
    setSelectedDoc(null);
  };

  return (
    <div className="app">;
      <nav className="sidebar" id="sidebar">
        <div className="sidebar-header">
          <h1>
            <i className="fas fa-archive"></i> DigiArchive
          </h1>
          <p>Sistem Pengelolaan Arsip Digital</p>
        </div>
        <div className="sidebar-nav">
          <Link href="/dashboard" className="nav-item">
            <i className="fa-solid fa-layer-group"></i> Beranda
          </Link>
          <Link href="/tambah-dokumen" className="nav-item">
            <i className="fa fa-camera"></i> Tambah Dokumen
          </Link>
          <Link href="/arsip" className="nav-item">
            <i className="fas fa-folder-open"></i> Daftar Arsip
          </Link>
          <Link href="/kolaborasi" className="nav-item">
            <i className="fas fa-users"></i> Bagikan
          </Link>
          <Link href="/recycle-bin" className="nav-item active">
            <i className="fas fa-trash"></i> Recycle Bin
          </Link>
          <Link href="/profile" className="nav-item">
            <i className="fas fa-user"></i> Profile
          </Link>
        </div>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </nav>

      <main className="main-content">
        <div className="top-bar">
          <button className="menu-toggle">
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="page-title">Recycle Bin</h1>
        </div>

        <div className="content-card">
          <div className="archive-header">
            <h2>Dokumen Terhapus</h2>
          </div>

          <div className="table-container">
            {deletedDocs.length === 0 ? (
              <p className="empty-message">Tidak ada dokumen terhapus.</p>
            ) : (
              <table className="deleted-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Judul Arsip</th>
                    <th>Tersisa</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedDocs.map((doc, idx) => (
                    <tr key={doc.id}>
                      <td>{idx + 1}</td>
                      <td>{doc.judul || doc.title || doc.file || '(tanpa nama)'}</td>
                      <td>
                        <span className={daysLeft(doc.deletedAt) <= 2 ? 'warning' : ''}>
                          {daysLeft(doc.deletedAt)} hari
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="restore-btn" onClick={() => onRestore(doc.id)}>
                            <i className="fas fa-undo"></i> Pulihkan
                          </button>
                          <button
                            className="permanent-delete-btn"
                            onClick={() => handleDeleteClick(doc)}
                          >
                            <i className="fas fa-trash-alt"></i> Hapus Permanen
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <p className="info">Dokumen akan terhapus permanen setelah 30 hari sejak dihapus.</p>
        </div>
      </main>

      {/* Modal Konfirmasi Hapus Permanen */}
      {showDeleteConfirm && selectedDoc && (
        <div className="modal-overlay active" style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            padding: '2rem', 
            maxWidth: '500px', 
            width: '90%',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                backgroundColor: '#fee2e2', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <i className="fas fa-exclamation-triangle" style={{ fontSize: '40px', color: '#dc2626' }}></i>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                Hapus Permanen?
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                Anda yakin ingin menghapus dokumen <strong>"{selectedDoc.judul || selectedDoc.title}"</strong> secara permanen?
              </p>
              <p style={{ color: '#dc2626', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: '500' }}>
                <i className="fas fa-info-circle"></i> Aksi ini tidak dapat dibatalkan!
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '2px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#374151',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <i className="fas fa-times"></i> Batal
              </button>
              <button 
                onClick={handleConfirmDelete}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              >
                <i className="fas fa-trash-alt"></i> Ya, Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeletedDocuments;
