"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ShareModal from '../../components/ShareModal';
import '../../style/Archive.css';
import '../../style/Kolaborasi.css';

interface SharedDocument {
  _id: string;
  namaFile: string;
  kategori: string;
  deskripsi: string;
  fileUrl: string;
  fileSize: number;
  createdAt: string;
  myPermission: string;
  sharedBy: string;
  sharedByName: string;
}

const KolaborasiPage = () => {
  const router = useRouter();
  const [sharedDocs, setSharedDocs] = useState<SharedDocument[]>([]);
  const [myDocs, setMyDocs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'received' | 'share'>('share');
  const [loading, setLoading] = useState(true);
  const [userNpm, setUserNpm] = useState('');
  const [userName, setUserName] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userDataStr = localStorage.getItem('user');

    if (!token || !userDataStr) {
      router.replace('/login');
      return;
    }

    const userData = JSON.parse(userDataStr);
    const npm = userData.npm || localStorage.getItem('npm');

    if (!npm) {
      router.replace('/login');
      return;
    }

    setUserNpm(npm);
    setUserName(userData.name || 'User');

    if (activeTab === 'received') {
      fetchSharedDocuments(npm, token);
    } else {
      fetchMyDocuments(token);
    }
  }, [router, activeTab]);

  const fetchSharedDocuments = async (npm: string, token: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/documents/shared?npm=${npm}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSharedDocs(data.documents || []);
      }
    } catch (err) {
      console.error('Error fetching shared documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyDocuments = async (token: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/documents/list?npm=${userNpm}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data); // Debug
        
        // API mengembalikan { arsip: [...] }, bukan { documents: [...] }
        const documents = data.arsip || data.documents || [];
        
        // Format data agar sesuai dengan yang dibutuhkan
        const formattedDocs = documents.map((doc: any) => ({
          _id: doc.id || doc._id,
          namaFile: doc.judul || doc.namaFile || doc.title,
          kategori: doc.kategori || doc.category,
          fileUrl: doc.fileUrl || doc.image,
          createdAt: doc.tanggal_upload || doc.createdAt,
          sharedWith: doc.sharedWith || []
        }));
        
        setMyDocs(formattedDocs);
      }
    } catch (err) {
      console.error('Error fetching my documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const openShareModal = (doc: any) => {
    setSelectedDoc(doc);
    setShowShareModal(true);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setSelectedDoc(null);
  };

  const refreshDocuments = () => {
    const token = localStorage.getItem('token');
    if (token && activeTab === 'share') {
      fetchMyDocuments(token);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/documents/delete?id=${docId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Dokumen berhasil dihapus');
        refreshDocuments();
      } else {
        alert('Gagal menghapus dokumen');
      }
    } catch (err) {
      console.error('Error deleting document:', err);
      alert('Terjadi kesalahan saat menghapus dokumen');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push('/');
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getFileIcon = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'fa-file-pdf';
      case 'doc': case 'docx': return 'fa-file-word';
      case 'xls': case 'xlsx': return 'fa-file-excel';
      case 'ppt': case 'pptx': return 'fa-file-powerpoint';
      case 'jpg': case 'jpeg': case 'png': case 'gif': return 'fa-file-image';
      case 'zip': case 'rar': return 'fa-file-archive';
      default: return 'fa-file';
    }
  };

  const getPermissionBadge = (permission: string) => {
    switch (permission) {
      case 'view':
        return <span className="permission-badge permission-view">👁️ View Only</span>;
      case 'download':
        return <span className="permission-badge permission-download">📥 Download</span>;
      case 'edit':
        return <span className="permission-badge permission-edit">✏️ Edit</span>;
      default:
        return <span className="permission-badge permission-view">👁️ View</span>;
    }
  };

  const canDownload = (permission: string) => {
    return permission === 'download' || permission === 'edit';
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
        <main className="main-content">
          <div className="loading-state">
            <div className="spinner"></div>
            <p className="loading-text">Memuat dokumen...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-header">
          <h1><i className="fas fa-archive"></i> DigiArchive</h1>
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
          <Link href="/kolaborasi" className="nav-item active">
            <i className="fas fa-users"></i> Kolaborasi
          </Link>
          <Link href="/recycle-bin" className="nav-item">
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

      {/* Main Content */}
      <main className="main-content">
        <div className="top-bar">
          <button className="menu-toggle"><i className="fas fa-bars"></i></button>
          <h1 className="page-title">Kolaborasi</h1>
        </div>

        <div className="content-card">
          {/* Tabs Navigation */}
          <div className="tabs-container">
            <button 
              className={`tab-button ${activeTab === 'received' ? 'active' : ''}`}
              onClick={() => setActiveTab('received')}
            >
              <i className="fas fa-inbox"></i> Dibagikan ke Saya
            </button>
            <button 
              className={`tab-button ${activeTab === 'share' ? 'active' : ''}`}
              onClick={() => setActiveTab('share')}
            >
              <i className="fas fa-share-alt"></i> Bagikan Dokumen
            </button>
          </div>

          {/* Tab: Dibagikan ke Saya */}
          {activeTab === 'received' && (
            <>
              <div className="kolaborasi-header">
                <h2 className="kolaborasi-title">
                  <i className="fas fa-inbox"></i> Dokumen yang Dibagikan ke Saya
                </h2>
                <p className="kolaborasi-subtitle">
                  Dokumen yang dibagikan oleh user lain kepada <strong>{userName}</strong> (NPM: {userNpm})
                </p>
              </div>

              {sharedDocs.length === 0 ? (
                <div className="empty-state-collab">
                  <i className="fas fa-share-alt"></i>
                  <h3>Belum Ada Dokumen yang Dibagikan</h3>
                  <p>Ketika ada user yang membagikan dokumen kepada Anda, dokumen akan muncul di sini.</p>
                </div>
              ) : (
                <div className="documents-grid">
                  {sharedDocs.map((doc) => (
                    <div key={doc._id} className="document-card">
                      <div className="document-icon">
                        <i className={`fas ${getFileIcon(doc.namaFile)}`}></i>
                      </div>

                      <h3 className="document-title">{doc.namaFile}</h3>

                      <div className="document-category-badge">
                        <i className="fas fa-tag"></i> {doc.kategori}
                      </div>

                      <p className="document-description">
                        {doc.deskripsi || 'Tidak ada deskripsi'}
                      </p>

                      <div className="document-meta">
                        <span className="document-meta-item">
                          <i className="fas fa-hdd"></i> {formatFileSize(doc.fileSize)}
                        </span>
                        <span className="document-meta-item">
                          <i className="fas fa-calendar"></i> {formatDate(doc.createdAt)}
                        </span>
                      </div>

                      <div className="shared-info-section">
                        <span className="shared-by-info">
                          <i className="fas fa-user"></i> {doc.sharedByName || `NPM: ${doc.sharedBy}`}
                        </span>
                        {getPermissionBadge(doc.myPermission)}
                      </div>

                      <div className="document-actions">
                        <a 
                          href={doc.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-document-action btn-view"
                        >
                          <i className="fas fa-eye"></i> Lihat
                        </a>
                        {canDownload(doc.myPermission) && (
                          <a
                            href={doc.fileUrl}
                            download={doc.namaFile}
                            className="btn-document-action btn-download"
                          >
                            <i className="fas fa-download"></i> Download
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Tab: Bagikan Dokumen */}
          {activeTab === 'share' && (
            <>
              <div className="kolaborasi-header">
                <h2 className="kolaborasi-title">
                  <i className="fas fa-share-alt"></i> Bagikan Dokumen Saya
                </h2>
                <p className="kolaborasi-subtitle">
                  Pilih dokumen yang ingin Anda bagikan ke user lain
                </p>
              </div>

              {myDocs.length === 0 ? (
                <div className="empty-state-collab">
                  <i className="fas fa-folder-open"></i>
                  <h3>Belum Ada Dokumen</h3>
                  <p>Tambahkan dokumen terlebih dahulu untuk dapat membagikannya.</p>
                  <Link href="/tambah-dokumen" className="btn-primary">
                    <i className="fas fa-plus"></i> Tambah Dokumen
                  </Link>
                </div>
              ) : (
                <div className="table-container">
                  <table className="archive-table">
                    <thead>
                      <tr>
                        <th style={{ width: '50px' }}>No</th>
                        <th>Judul Dokumen</th>
                        <th>Kategori</th>
                        <th style={{ width: '120px' }}>Tanggal Upload</th>
                        <th style={{ width: '150px' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myDocs.map((doc, index) => (
                        <tr key={doc._id}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="doc-title-cell">
                              <i className={`fas ${getFileIcon(doc.namaFile)}`}></i>
                              {doc.namaFile}
                            </div>
                          </td>
                          <td>
                            <span className="category-badge">{doc.kategori}</span>
                          </td>
                          <td>{formatDate(doc.createdAt)}</td>
                          <td>
                            <div className="action-buttons">
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-action"
                                style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)' }}
                                title="Lihat"
                              >
                                <i className="fas fa-eye"></i>
                              </a>
                              <button
                                className="btn-action"
                                style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}
                                onClick={() => openShareModal(doc)}
                                title="Bagikan"
                              >
                                <i className="fas fa-share-alt"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        {/* Share Modal */}
        {showShareModal && selectedDoc && (
          <ShareModal
            isOpen={showShareModal}
            onClose={closeShareModal}
            documentId={selectedDoc._id?.toString() || selectedDoc.id?.toString()}
            documentName={selectedDoc.namaFile}
            sharedWith={selectedDoc.sharedWith || []}
            onRefresh={refreshDocuments}
          />
        )}
      </main>
    </div>
  );
};

export default KolaborasiPage;
