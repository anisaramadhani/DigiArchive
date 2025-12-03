"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use app-router navigation
import Link from 'next/link'; // Link works with className in App Router
import Image from 'next/image';
import '../style/Archive.css';

type DashboardProps = {
  totalArsip?: number;
  totalArsipHariIni?: number;
  arsipBulanIni?: number;
};

const Dashboard: React.FC<DashboardProps> = ({ totalArsip, totalArsipHariIni, arsipBulanIni }) => {
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter(); // Menggunakan router Next.js untuk pengalihan

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
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
          <Link href="/dashboard" className="nav-item active"><i className="fa-solid fa-layer-group"></i> Beranda</Link>
          <Link href="/tambah-dokumen" className="nav-item"><i className="fa fa-camera"></i> Tambah Dokumen</Link>
          <Link href="/arsip" className="nav-item"><i className="fas fa-folder-open"></i> Daftar Arsip</Link>
          <Link href="/kolaborasi" className="nav-item"><i className="fas fa-users"></i> Kolaborasi</Link>
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
          <button className="menu-toggle">
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="page-title">Beranda</h1>
        </div>

        <div className="content-card">
          <div className="archive-header">
            <h2>Beranda</h2>
          </div>

          {/* Dashboard Cards */}
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <div className="dashboard-card-value">{totalArsip}</div>
              <div className="dashboard-card-label">Total Arsip</div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-value">{totalArsipHariIni}</div>
              <div className="dashboard-card-label">Arsip Hari Ini</div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-value">{arsipBulanIni}</div>
              <div className="dashboard-card-label">Arsip Bulan Ini</div>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Selamat Datang di DigiArchive!</h3>
            <p style={{ color: 'var(--text-dark)', fontSize: '1rem' }}>
              Sistem manajemen arsip digital yang membantu Anda mengorganisir dan mengelola dokumen dengan mudah.
              Navigasikan ke menu "Daftar Arsip" untuk mulai mengelola arsip Anda.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
