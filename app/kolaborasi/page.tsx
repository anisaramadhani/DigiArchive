"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  const [loading, setLoading] = useState(false);
  const [userNpm, setUserNpm] = useState('');
  const [userName, setUserName] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Share modal states
  const [shareNpm, setShareNpm] = useState('');
  const [sharePermission, setSharePermission] = useState('view');
  const [shareLoading, setShareLoading] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [shareMessageType, setShareMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userDataStr = localStorage.getItem('user');

    if (!token || !userDataStr) {
      router.replace('/login');
      return;
    }

    const userData = JSON.parse(userDataStr);
    if (!userData.npm) {
      router.replace('/login');
      return;
    }

    setUserNpm(userData.npm);
    setUserName(userData.name || 'User');

    // Fetch both shared and my documents
    fetchSharedDocuments(userData.npm, token);
    fetchMyDocuments(token, userData.npm);
  }, [router]);

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

  const fetchMyDocuments = async (token: string, npm: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/documents/list?npm=${npm}`, {
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
    console.log('Opening share modal for document:', doc); // Debug
    console.log('Document ID:', doc._id || doc.id); // Debug
    console.log('showShareModal BEFORE:', showShareModal); // Debug
    setSelectedDoc(doc);
    setShowShareModal(true);
    setShareNpm('');
    setSharePermission('view');
    setShareMessage('');
    console.log('showShareModal AFTER set to true'); // Debug
    
    // Force re-render check
    setTimeout(() => {
      console.log('showShareModal state after timeout:', showShareModal);
    }, 100);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setSelectedDoc(null);
    setShareNpm('');
    setSharePermission('view');
    setShareMessage('');
  };

  const handleShare = async () => {
    if (!shareNpm.trim()) {
      setShareMessage('NPM tidak boleh kosong');
      setShareMessageType('error');
      return;
    }

    if (!selectedDoc || !selectedDoc._id) {
      setShareMessage('Dokumen tidak valid');
      setShareMessageType('error');
      return;
    }

    setShareLoading(true);
    setShareMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/documents/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          documentId: selectedDoc._id,
          shareWithNpm: shareNpm,
          permission: sharePermission,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShareMessage(data.message || 'Dokumen berhasil dibagikan');
        setShareMessageType('success');
        setShareNpm('');
        setSharePermission('view');
        refreshDocuments();
        setTimeout(() => {
          setShareMessage('');
          closeShareModal();
        }, 2000);
      } else {
        setShareMessage(data.error || 'Gagal membagikan dokumen');
        setShareMessageType('error');
      }
    } catch (err) {
      setShareMessage('Terjadi kesalahan saat membagikan dokumen');
      setShareMessageType('error');
    } finally {
      setShareLoading(false);
    }
  };

  const handleRemoveAccess = async (userNpm: string) => {
    if (!confirm('Hapus akses user ini?')) return;
    if (!selectedDoc || !selectedDoc._id) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/documents/share?documentId=${selectedDoc._id}&npm=${userNpm}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setShareMessage('Akses berhasil dihapus');
        setShareMessageType('success');
        refreshDocuments();
        setTimeout(() => {
          setShareMessage('');
        }, 2000);
      } else {
        setShareMessage(data.error || 'Gagal menghapus akses');
        setShareMessageType('error');
      }
    } catch (err) {
      setShareMessage('Terjadi kesalahan');
      setShareMessageType('error');
    }
  };

  const refreshDocuments = () => {
    const token = localStorage.getItem('token');
    const userDataStr = localStorage.getItem('user');
    if (token && userDataStr) {
      const userData = JSON.parse(userDataStr);
      const npm = userData.npm;
      if (npm) {
        fetchMyDocuments(token, npm);
      }
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

  // Statistics calculations
  const totalShared = myDocs.filter(doc => doc.sharedWith && doc.sharedWith.length > 0).length;
  const totalReceived = sharedDocs.length;
  const totalMyDocs = myDocs.length;

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
          {/* Statistics Cards */}
          <div className="stats-container">
            <div className="stat-card stat-total">
              <div className="stat-icon">
                <i className="fas fa-folder"></i>
              </div>
              <div className="stat-info">
                <h3>{totalMyDocs}</h3>
                <p>Total Dokumen Saya</p>
              </div>
            </div>
            <div className="stat-card stat-shared">
              <div className="stat-icon">
                <i className="fas fa-share-alt"></i>
              </div>
              <div className="stat-info">
                <h3>{totalShared}</h3>
                <p>Dokumen Dibagikan</p>
              </div>
            </div>
            <div className="stat-card stat-received">
              <div className="stat-icon">
                <i className="fas fa-inbox"></i>
              </div>
              <div className="stat-info">
                <h3>{totalReceived}</h3>
                <p>Diterima dari Lain</p>
              </div>
            </div>
          </div>

          {/* Dibagikan ke Saya Section */}
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">
                <i className="fas fa-inbox"></i> Dibagikan ke Saya
              </h2>
              <p className="section-subtitle">
                Dokumen yang dibagikan oleh user lain kepada Anda
              </p>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Memuat dokumen...</p>
              </div>
            ) : sharedDocs.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-inbox"></i>
                <h3>Belum Ada Dokumen</h3>
                <p>Ketika ada user yang membagikan dokumen kepada Anda, dokumen akan muncul di sini.</p>
              </div>
            ) : (
              <div className="documents-grid">
                {sharedDocs.map((doc) => (
                  <div key={doc._id} className="document-card">
                    <div className="document-header">
                      <div className="document-icon">
                        <i className={`fas ${getFileIcon(doc.namaFile)}`}></i>
                      </div>
                      {getPermissionBadge(doc.myPermission)}
                    </div>

                    <h3 className="document-title">{doc.namaFile}</h3>
                    
                    <div className="document-category">
                      <i className="fas fa-tag"></i> {doc.kategori}
                    </div>

                    <div className="document-meta">
                      <span><i className="fas fa-user"></i> {doc.sharedByName || doc.sharedBy}</span>
                      <span><i className="fas fa-calendar"></i> {formatDate(doc.createdAt)}</span>
                    </div>

                    <div className="document-actions">
                      <button 
                        onClick={() => { setSelectedDoc(doc); setShowDetailModal(true); }}
                        className="btn-action btn-view"
                      >
                        <i className="fas fa-eye"></i> Detail
                      </button>
                      {canDownload(doc.myPermission) && (
                        <a
                          href={doc.fileUrl}
                          download={doc.namaFile}
                          className="btn-action btn-download"
                        >
                          <i className="fas fa-download"></i>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dokumen Saya Section */}
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">
                <i className="fas fa-folder"></i> Dokumen Saya
              </h2>
              <p className="section-subtitle">
                Kelola dan bagikan dokumen Anda ke user lain
              </p>
            </div>

            {myDocs.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-folder-open"></i>
                <h3>Belum Ada Dokumen</h3>
                <p>Tambahkan dokumen terlebih dahulu untuk dapat membagikannya.</p>
                <Link href="/tambah-dokumen" className="btn-primary">
                  <i className="fas fa-plus"></i> Tambah Dokumen
                </Link>
              </div>
            ) : loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Memuat dokumen...</p>
              </div>
            ) : (
              <div className="documents-grid">
                {myDocs.map((doc) => (
                  <div key={doc._id} className="document-card my-document">
                    <div className="document-header">
                      <div className="document-icon">
                        <i className={`fas ${getFileIcon(doc.namaFile)}`}></i>
                      </div>
                      {doc.sharedWith && doc.sharedWith.length > 0 && (
                        <span className="shared-indicator">
                          <i className="fas fa-users"></i> {doc.sharedWith.length}
                        </span>
                      )}
                    </div>

                    <h3 className="document-title">{doc.namaFile}</h3>
                    
                    <div className="document-category">
                      <i className="fas fa-tag"></i> {doc.kategori}
                    </div>

                    <div className="document-meta">
                      <span><i className="fas fa-calendar"></i> {formatDate(doc.createdAt)}</span>
                    </div>

                    <div className="document-actions">
                      <button 
                        onClick={() => { setSelectedDoc(doc); setShowDetailModal(true); }}
                        className="btn-action btn-view"
                      >
                        <i className="fas fa-eye"></i> Detail
                      </button>
                      <button
                        onClick={() => openShareModal(doc)}
                        className="btn-action btn-share"
                      >
                        <i className="fas fa-share-alt"></i> Bagikan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Share Modal */}
        {console.log('Render check - showShareModal:', showShareModal, 'selectedDoc:', selectedDoc)}
        {showShareModal && selectedDoc ? (
          <div className="modal-overlay" onClick={closeShareModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  <i className="fas fa-share-alt"></i> Bagikan Dokumen
                </h2>
                <button className="modal-close" onClick={closeShareModal}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="modal-body">
                <div className="document-info">
                  <i className="fas fa-file"></i>
                  <span>{selectedDoc.namaFile}</span>
                </div>

                {shareMessage && (
                  <div className={`message ${shareMessageType}`}>
                    <i className={`fas fa-${shareMessageType === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
                    {shareMessage}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="npm">NPM Mahasiswa</label>
                  <input
                    type="text"
                    id="npm"
                    value={shareNpm}
                    onChange={(e) => setShareNpm(e.target.value)}
                    placeholder="Masukkan NPM mahasiswa"
                    disabled={shareLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="permission">Permission</label>
                  <select
                    id="permission"
                    value={sharePermission}
                    onChange={(e) => setSharePermission(e.target.value)}
                    disabled={shareLoading}
                  >
                    <option value="view">👁️ View Only - Hanya bisa melihat</option>
                    <option value="download">📥 Download - Bisa melihat dan download</option>
                    <option value="edit">✏️ Edit - Bisa melihat, download, dan edit</option>
                  </select>
                </div>

                <button className="btn-share" onClick={handleShare} disabled={shareLoading}>
                  {shareLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Membagikan...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-share"></i> Bagikan Dokumen
                    </>
                  )}
                </button>

                {selectedDoc.sharedWith && selectedDoc.sharedWith.length > 0 && (
                  <div className="shared-users">
                    <h3>
                      <i className="fas fa-users"></i> Dibagikan Kepada ({selectedDoc.sharedWith.length})
                    </h3>
                    <div className="users-list">
                      {selectedDoc.sharedWith.map((user: any) => (
                        <div key={user.npm} className="user-item">
                          <div className="user-info">
                            <i className="fas fa-user-circle"></i>
                            <div>
                              <strong>{user.name}</strong>
                              <span className="user-npm">NPM: {user.npm}</span>
                            </div>
                          </div>
                          <div className="user-actions">
                            <span className={`permission-tag permission-${user.permission}`}>
                              {user.permission === 'view' && '👁️ View'}
                              {user.permission === 'download' && '📥 Download'}
                              {user.permission === 'edit' && '✏️ Edit'}
                            </span>
                            <button
                              className="btn-remove"
                              onClick={() => handleRemoveAccess(user.npm)}
                              title="Hapus akses"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          console.log('Modal NOT rendered - showShareModal:', showShareModal, 'selectedDoc:', selectedDoc)
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedDoc && (
          <div className="modal-overlay active" onClick={() => setShowDetailModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Detail Arsip</h2>
                <button className="modal-close" onClick={() => setShowDetailModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Judul Arsip</label>
                  <div>{selectedDoc.namaFile}</div>
                </div>
                <div className="form-group">
                  <label>Kategori</label>
                  <div>{selectedDoc.kategori}</div>
                </div>
                <div className="form-group">
                  <label>File/Foto</label>
                  <div>
                    <a href={selectedDoc.fileUrl} target="_blank" rel="noopener noreferrer">
                      {selectedDoc.namaFile}
                    </a>
                  </div>
                </div>
                <div className="form-group">
                  <label>Tanggal Upload</label>
                  <div>{formatDate(selectedDoc.createdAt)}</div>
                </div>
                {selectedDoc.sharedByName && (
                  <div className="form-group">
                    <label>Dibagikan Oleh</label>
                    <div>{selectedDoc.sharedByName}</div>
                  </div>
                )}
                {selectedDoc.myPermission && (
                  <div className="form-group">
                    <label>Hak Akses</label>
                    <div>{getPermissionBadge(selectedDoc.myPermission)}</div>
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowDetailModal(false)}>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default KolaborasiPage;
