"use client";
import { useState, useEffect } from 'react';
import '../style/ShareModal.css';

interface SharedUser {
  npm: string;
  name: string;
  permission: string;
  sharedAt: Date;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  documentName: string;
  sharedWith: SharedUser[];
  onRefresh: () => void;
}

const ShareModal = ({ isOpen, onClose, documentId, documentName, sharedWith, onRefresh }: ShareModalProps) => {
  const [npm, setNpm] = useState('');
  const [permission, setPermission] = useState('view');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (!isOpen) {
      setNpm('');
      setPermission('view');
      setMessage('');
    }
  }, [isOpen]);

  const handleShare = async () => {
    if (!npm.trim()) {
      setMessage('NPM tidak boleh kosong');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

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
          shareWithNpm: npm,
          permission,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Dokumen berhasil dibagikan');
        setMessageType('success');
        setNpm('');
        setPermission('view');
        onRefresh();
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        setMessage(data.error || 'Gagal membagikan dokumen');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Terjadi kesalahan saat membagikan dokumen');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAccess = async (userNpm: string) => {
    if (!confirm('Hapus akses user ini?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/documents/share?documentId=${documentId}&npm=${userNpm}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Akses berhasil dihapus');
        setMessageType('success');
        onRefresh();
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        setMessage(data.error || 'Gagal menghapus akses');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Terjadi kesalahan');
      setMessageType('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-share-alt"></i> Bagikan Dokumen
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="document-info">
            <i className="fas fa-file"></i>
            <span>{documentName}</span>
          </div>

          {message && (
            <div className={`message ${messageType}`}>
              <i className={`fas fa-${messageType === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
              {message}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="npm">NPM Mahasiswa</label>
            <input
              type="text"
              id="npm"
              value={npm}
              onChange={(e) => setNpm(e.target.value)}
              placeholder="Masukkan NPM mahasiswa"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="permission">Permission</label>
            <select
              id="permission"
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
              disabled={loading}
            >
              <option value="view">👁️ View Only - Hanya bisa melihat</option>
              <option value="download">📥 Download - Bisa melihat dan download</option>
              <option value="edit">✏️ Edit - Bisa melihat, download, dan edit</option>
            </select>
          </div>

          <button className="btn-share" onClick={handleShare} disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Membagikan...
              </>
            ) : (
              <>
                <i className="fas fa-share"></i> Bagikan Dokumen
              </>
            )}
          </button>

          {sharedWith && sharedWith.length > 0 && (
            <div className="shared-users">
              <h3>
                <i className="fas fa-users"></i> Dibagikan Kepada ({sharedWith.length})
              </h3>
              <div className="users-list">
                {sharedWith.map((user) => (
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
  );
};

export default ShareModal;
