"use client";
import React, { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../style/Archive.css";

interface ArchiveItem {
  id: string | number;
  judul: string;
  kategori: string;
  file?: string;
  file_asli?: string;
  fileUrl?: string;
  tanggal_upload?: string;
}

interface ArchiveProps {
  archives?: ArchiveItem[];
  success?: string;
  errors?: string[];
  onLogout?: () => void;
  onAddArchive?: (form: FormData) => void;
  onDeleteArchive?: (id: string | number) => void;
  onUpdateArchive?: (id: string | number, form: FormData) => void;
}

const Archive: React.FC<ArchiveProps> = ({
  archives = [],
  success,
  errors = [],
  onLogout,
  onAddArchive,
  onDeleteArchive,
  onUpdateArchive,
}) => {
  const [search, setSearch] = useState<string>("");
  const [kategori, setKategori] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [selectedArchive, setSelectedArchive] = useState<ArchiveItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ArchiveItem | null>(null);

  const router = useRouter();

  const handleLogout = () => {
    if (onLogout) onLogout();
    router.push("/");
  };

  const handleAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (onAddArchive) onAddArchive(form);
    setShowModal(false);
  };

  const handleEdit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (onUpdateArchive && selectedArchive) {
      onUpdateArchive(selectedArchive.id, form);
    }
    setShowEdit(false);
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
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              <i className="fas fa-plus"></i> Tambah Arsip
            </button>
          </div>

          {/* Alerts */}
          {success && (
            <div style={{ background: "#e8f5e8", color: "#27ae60", padding: "10px 20px", borderRadius: "8px", marginBottom: "1rem" }}>
              {success}
            </div>
          )}
          {errors.length > 0 && (
            <div style={{ background: "#f8d7da", color: "#dc3545", padding: "10px 20px", borderRadius: "8px", marginBottom: "1rem" }}>
              <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
                {errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}

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
                  <th>Judul Arsip</th>
                  <th>Kategori</th>
                  <th>File/Foto</th>
                  <th>Tanggal Upload</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {archives.length > 0 ? (
                  archives.map((archive, index) => (
                    <tr key={archive.id}>
                      <td>{index + 1}</td>
                      <td>{archive.judul}</td>
                      <td>
                        <span className={`category-badge category-${archive.kategori?.toLowerCase()}`}>
                          {archive.kategori}
                        </span>
                      </td>
                      <td>
                        <a href={archive.fileUrl} className="file-link" target="_blank" rel="noreferrer">
                          <i className="fas fa-file"></i> {archive.file_asli || archive.file}
                        </a>
                      </td>
                      <td>{archive.tanggal_upload}</td>
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
                            className="btn-action edit"
                            onClick={() => { setSelectedArchive(archive); setShowEdit(true); }}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            type="button"
                            className="btn-action delete"
                            onClick={() => setDeleteTarget(archive)}
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
                        <p>Silakan tambah arsip baru atau ubah filter pencarian.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Tambah Arsip */}
      {showModal && (
        <div className={`modal-overlay ${showModal ? 'active' : ''}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Tambah Arsip</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label className="form-label">Judul Arsip</label>
                <input type="text" className="form-input" name="judul" required />
              </div>
              <div className="form-group">
                <label className="form-label">Kategori</label>
                <select className="form-select" name="kategori" required>
                  <option value="">Pilih Kategori</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Keuangan">Keuangan</option>
                  <option value="Rapat">Rapat</option>
                  <option value="Surat">Surat</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Upload File/Foto</label>
                <input type="file" className="form-input file-input" name="file" required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn-primary"><i className="fas fa-save"></i> Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Arsip */}
      {showDetail && selectedArchive && (
        <div className={`modal-overlay ${showDetail ? 'active' : ''}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Detail Arsip</h2>
              <button className="modal-close" onClick={() => setShowDetail(false)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label>Judul Arsip</label><div>{selectedArchive.judul}</div></div>
              <div className="form-group"><label>Kategori</label><div>{selectedArchive.kategori}</div></div>
              <div className="form-group"><label>File/Foto</label><div><a href={selectedArchive.fileUrl} target="_blank" rel="noreferrer">{selectedArchive.file}</a></div></div>
              <div className="form-group"><label>Tanggal Upload</label><div>{selectedArchive.tanggal_upload}</div></div>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDetail(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteTarget && (
        <div className={`modal-overlay active`}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Hapus Arsip</h2>
              <button className="modal-close" onClick={() => setDeleteTarget(null)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-body">
              <p>Yakin ingin menghapus arsip "{deleteTarget.judul}"? Aksi ini akan memindahkan arsip ke Recycle Bin.</p>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteTarget(null)}>Batal</button>
              <button className="btn-primary" onClick={() => { if (onDeleteArchive) onDeleteArchive(deleteTarget.id); setDeleteTarget(null); }}>Yakin</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Arsip */}
      {showEdit && selectedArchive && (
        <div className={`modal-overlay ${showEdit ? 'active' : ''}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Edit Arsip</h2>
              <button className="modal-close" onClick={() => setShowEdit(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleEdit}>
              <div className="form-group">
                <label className="form-label">Judul Arsip</label>
                <input type="text" className="form-input" name="judul" defaultValue={selectedArchive.judul} required />
              </div>
              <div className="form-group">
                <label className="form-label">Kategori</label>
                <select className="form-select" name="kategori" defaultValue={selectedArchive.kategori} required>
                  <option value="Proposal">Proposal</option>
                  <option value="Keuangan">Keuangan</option>
                  <option value="Rapat">Rapat</option>
                  <option value="Surat">Surat</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">File/Foto (opsional)</label>
                <input type="file" className="form-input file-input" name="file" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowEdit(false)}>Batal</button>
                <button type="submit" className="btn-primary"><i className="fas fa-save"></i> Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Archive;
