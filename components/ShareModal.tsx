"use client";
import { useState } from 'react';
import '../style/Archive.css';

type ShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  documentName: string;
  sharedWith: Array<{ npm: string; name: string; permission: string }>;
  onRefresh: () => void;
};

const ShareModal: React.FC<ShareModalProps> = ({ 
  isOpen, 
  onClose, 
  documentId,
  documentName,
  sharedWith,
  onRefresh
}) => {
  const [shareNpm, setShareNpm] = useState('');
  const [permission, setPermission] = useState('view');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleShare = async () => {
    if (!shareNpm.trim()) {
      setError('NPM tidak boleh kosong');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/documents/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          documentId,
          shareWithNpm: shareNpm,
          permission: permission,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setShareNpm('');
        setPermission('view');
        setTimeout(() => {
          onRefresh();
        }, 1000);
      } else {
        setError(data.error || 'Gagal membagikan dokumen');
      }
    } catch (err: any) {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (npm: string) => {
    if (!confirm('Hapus akses user ini?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/documents/share?documentId=${documentId}&npm=${npm}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setTimeout(() => {
          onRefresh();
        }, 1000);
      } else {
        setError(data.error || 'Gagal menghapus akses');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    }
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <i className="fas fa-share-alt"></i> Bagikan Dokumen
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div style={{ marginBottom: '1.5rem', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '8px' }}>
          <p style={{ color: 'var(--text-dark)', fontSize: '0.9rem' }}>
            <strong>Dokumen:</strong> {documentName}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div style={{ 
            background: '#f0fdf4', 
            color: '#16a34a', 
            padding: '0.75rem 1rem', 
            borderRadius: '8px', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <i className="fas fa-check-circle"></i> {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{ 
            background: '#fef2f2', 
            color: '#dc2626', 
            padding: '0.75rem 1rem', 
            borderRadius: '8px', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        {/* Share Form */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-dark)', fontWeight: 600 }}>
            Bagikan ke Mahasiswa Lain
          </h3>
          
          <div className="form-group">
            <label htmlFor="shareNpm" className="form-label">NPM Mahasiswa</label>
            <input
              id="shareNpm"
              type="text"
              className="form-input"
              placeholder="Contoh: 2023110008"
              value={shareNpm}
              onChange={(e) => setShareNpm(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="permission" className="form-label">Permission</label>
            <select
              id="permission"
              className="form-select"
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
            >
              <option value="view">👁️ View Only - Hanya bisa lihat</option>
              <option value="download">📥 Download - Bisa lihat & download</option>
              <option value="edit">✏️ Edit - Bisa lihat, download & edit</option>
            </select>
          </div>

          <button 
            className="btn-primary"
            onClick={handleShare}
            disabled={loading}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {loading ? '⏳ Membagikan...' : '🚀 Bagikan Dokumen'}
          </button>
        </div>

        {/* Shared With List */}
        {sharedWith && sharedWith.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-dark)', fontWeight: 600 }}>
              Dibagikan ke ({sharedWith.length} user)
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {sharedWith.map((share) => (
                <div 
                  key={share.npm} 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1rem'
                    }}>
                      <i className="fas fa-user"></i>
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.25rem' }}>
                        {share.name}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                        NPM: {share.npm}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      padding: '0.4rem 0.8rem',
                      background: share.permission === 'view' ? 'rgba(59, 130, 246, 0.1)' : 
                                  share.permission === 'download' ? 'rgba(16, 185, 129, 0.1)' : 
                                  'rgba(245, 158, 11, 0.1)',
                      color: share.permission === 'view' ? '#2563eb' : 
                             share.permission === 'download' ? '#059669' : 
                             '#d97706',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>
                      {share.permission === 'view' && '👁️ View'}
                      {share.permission === 'download' && '📥 Download'}
                      {share.permission === 'edit' && '✏️ Edit'}
                    </span>
                    <button 
                      onClick={() => handleRemove(share.npm)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: 'none',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        color: '#dc2626',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#dc2626';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                        e.currentTarget.style.color = '#dc2626';
                      }}
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
  );
};

export default ShareModal;
