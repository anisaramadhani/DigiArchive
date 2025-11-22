"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use app-router navigation
import Link from 'next/link'; // Link works with className in App Router
import Image from 'next/image';

type DashboardProps = {
  totalArsip?: number;
  totalArsipHariIni?: number;
  arsipBulanIni?: number;
};

const Dashboard: React.FC<DashboardProps> = ({ totalArsip, totalArsipHariIni, arsipBulanIni }) => {
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter(); // Menggunakan router Next.js untuk pengalihan

  const handleLogout = () => {
    router.push('/'); // Balik ke halaman landing page setelah logout
  };

  return (
    <div className="dashboard-container flex">
      {/* Sidebar */}
      <nav className="sidebar w-64 bg-gray-900 text-white flex flex-col justify-between">
        <div>
          <div className="sidebar-header p-4">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <i className="fas fa-archive"></i> DigiArchive
            </h1>
            <p className="text-sm opacity-75">Sistem Pengelolaan Arsip Digital</p>
          </div>
          <div className="sidebar-nav flex flex-col mt-6">
            {/* Menggunakan Link untuk routing */}
            <Link href="/dashboard" className="nav-item active p-3 flex items-center gap-2 bg-indigo-600 rounded-md m-2">
              <i className="fa-solid fa-layer-group"></i> Dashboard
            </Link>
            <Link href="/tambah-dokumen" className="nav-item p-3 flex items-center gap-2 hover:bg-indigo-500 rounded-md m-2">
              <i className="fa fa-camera"></i> Tambah Dokumen
            </Link>
            <Link href="/arsip" className="nav-item p-3 flex items-center gap-2 hover:bg-indigo-500 rounded-md m-2">
              <i className="fas fa-folder-open"></i> Daftar Arsip
            </Link>
            <Link href="/recycle-bin" className="nav-item p-3 flex items-center gap-2 hover:bg-indigo-500 rounded-md m-2">
              <i className="fas fa-trash"></i> Recycle Bin
            </Link>
            <Link href="/profile" className="nav-item p-3 flex items-center gap-2 hover:bg-indigo-500 rounded-md m-2">
              <i className="fas fa-user"></i> Profile
            </Link>
          </div>
        </div>
        <div className="sidebar-footer p-4">
          <button
            onClick={handleLogout}
            className="logout-btn w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 p-2 rounded-md"
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content flex-1 bg-gray-50 min-h-screen">
        <div className="top-bar flex items-center justify-between p-4 bg-white shadow">
          <button className="menu-toggle text-xl">
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="page-title text-lg font-semibold">Dashboard</h1>
        </div>

        <div className="content-card p-6">
          <div className="archive-header mb-10">
            <h2 className="text-2xl font-bold">Dashboard</h2>
          </div>

          {/* Dashboard Cards */}
          <div className="dashboard-cards flex flex-wrap gap-6 mb-10">
            <div
              className="dashboard-card flex-1 min-w-[180px] text-center rounded-2xl shadow p-8 text-white"
              style={{ background: 'linear-gradient(135deg,#6a82fb 0%,#5b5fc7 100%)' }}
            >
              <div className="dashboard-card-value text-4xl font-bold mb-2">{totalArsip}</div>
              <div className="dashboard-card-label text-lg opacity-90">Total Arsip</div>
            </div>

            <div
              className="dashboard-card flex-1 min-w-[180px] text-center rounded-2xl shadow p-8 text-white"
              style={{ background: 'linear-gradient(135deg,#6a82fb 0%,#5b5fc7 100%)' }}
            >
              <div className="dashboard-card-value text-4xl font-bold mb-2">{totalArsipHariIni}</div>
              <div className="dashboard-card-label text-lg opacity-90">Arsip Hari Ini</div>
            </div>

            <div
              className="dashboard-card flex-1 min-w-[180px] text-center rounded-2xl shadow p-8 text-white"
              style={{ background: 'linear-gradient(135deg,#6a82fb 0%,#5b5fc7 100%)' }}
            >
              <div className="dashboard-card-value text-4xl font-bold mb-2">{arsipBulanIni}</div>
              <div className="dashboard-card-label text-lg opacity-90">Arsip Bulan Ini</div>
            </div>
          </div>

          <div>
            <h3 className="text-indigo-600 font-bold text-xl mb-2">Selamat Datang di DigiArchive!</h3>
            <p className="text-gray-700 text-base">
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
