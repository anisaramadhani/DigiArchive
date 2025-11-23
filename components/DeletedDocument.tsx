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
  return (
    <div className="app">
      <nav className="sidebar" id="sidebar">
        <div className="sidebar-header">
          <h1>
            <i className="fas fa-archive"></i> DigiArchive
          </h1>
          <p>Sistem Pengelolaan Arsip Digital</p>
        </div>
        <div className="sidebar-nav">
          <Link href="/dashboard" className="nav-item">
            <i className="fa-solid fa-layer-group"></i> Dashboard
          </Link>
          <Link href="/tambah-dokumen" className="nav-item">
            <i className="fa fa-camera"></i> Tambah Dokumen
          </Link>
          <Link href="/arsip" className="nav-item">
            <i className="fas fa-folder-open"></i> Daftar Arsip
          </Link>
          <Link href="/recycle-bin" className="nav-item active">
            <i className="fas fa-trash"></i> Recycle Bin
          </Link>
          <Link href="/profile" className="nav-item">
            <i className="fas fa-user"></i> Profile
          </Link>
        </div>
        <div className="sidebar-footer">
          <button className="logout-btn">
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
                    <th>Nama Dokumen</th>
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
                            Pulihkan
                          </button>
                          <button
                            className="permanent-delete-btn"
                            onClick={() => {
                              if (window.confirm('Hapus permanen dokumen ini?')) onPermanentDelete(doc.id);
                            }}
                          >
                            Hapus Permanen
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
    </div>
  );
};

export default DeletedDocuments;
