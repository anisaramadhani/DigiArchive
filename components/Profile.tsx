"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../style/Profile.css";

interface User {
  nama?: string;
  email?: string;
  npm?: string;
  jurusan?: string;
  foto?: string;
  created_at?: string;
}

interface ProfileProps {
  user?: User;
  successMessage?: string;
  errorMessage?: string;
  handleLogout?: (e: FormEvent<HTMLFormElement>) => void;
  handlePasswordChange?: (data: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<void>;
}

const Profile: React.FC<ProfileProps> = ({
  user = {},
  successMessage,
  errorMessage,
  handleLogout,
  handlePasswordChange,
}) => {
  const router = useRouter();
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSubmitPasswordChange = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Password baru dan konfirmasi password tidak cocok");
      return;
    }

    if (!handlePasswordChange) return;

    try {
      await handlePasswordChange(passwordData);
      router.push("/profile");
    } catch (error: any) {
      alert("Gagal mengubah password: " + error.message);
    }
  };

  return (
    <div>
      <nav className="sidebar" id="sidebar">
        <div className="sidebar-header">
          <h1><i className="fas fa-archive"></i> DigiArchive</h1>
          <p>Sistem Pengelolaan Arsip Digital</p>
        </div>
        <div className="sidebar-nav">
          <Link href="/dashboard" className="nav-item"><i className="fa-solid fa-layer-group"></i> Dashboard</Link>
          <Link href="/tambah-dokumen" className="nav-item"><i className="fa fa-camera"></i> Tambah Dokumen</Link>
          <Link href="/arsip" className="nav-item"><i className="fas fa-folder-open"></i> Daftar Arsip</Link>
          <Link href="/recycle-bin" className="nav-item"><i className="fas fa-trash"></i> Recycle Bin</Link>
          <Link href="/profile" className="nav-item active"><i className="fas fa-user"></i> Profile</Link>
        </div>
        <div className="sidebar-footer">
          <form onSubmit={handleLogout}>
            <button className="logout-btn">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </form>
        </div>
      </nav>

      <main className="main-content" id="mainContent">
        <div className="top-bar">
          <button className="menu-toggle" id="menuToggle">
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="page-title" id="pageTitle">Profile</h1>
        </div>

        <div className="content-card profile-view-card">
          <h2 className="profile-title">Profile</h2>

          {successMessage && <div className="alert-success">{successMessage}</div>}
          {errorMessage && <div className="alert-error">{errorMessage}</div>}

          <div className="profile-avatar-section">
            <div className="profile-avatar" style={{ marginBottom: "0.7rem" }}>
              {user?.foto ? (
                <img src={`/${user.foto}`} alt="Foto Profil" />
              ) : (
                <i className="fas fa-user"></i>
              )}
            </div>
            <div className="profile-identity">
              <div className="profile-name">{user?.nama}</div>
              <div className="profile-email">{user?.email}</div>
            </div>
          </div>

          <div className="profile-info-section">
            <div className="profile-info-title">Informasi Akun</div>
            <div className="profile-info-fields">
              <div className="profile-info-field">
                <label>Nama:</label>
                <div className="profile-info-value">{user?.nama}</div>
              </div>
              <div className="profile-info-field">
                <label>NPM:</label>
                <div className="profile-info-value">{user?.npm}</div>
              </div>
              <div className="profile-info-field">
                <label>Email:</label>
                <div className="profile-info-value">{user?.email}</div>
              </div>
              <div className="profile-info-field">
                <label>Jurusan:</label>
                <div className="profile-info-value">{user?.jurusan}</div>
              </div>
              <div className="profile-info-field">
                <label>Bergabung:</label>
                <div className="profile-info-value">
                  {user?.created_at && new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
                </div>
              </div>
            </div>
          </div>

          <div className="profile-password-section" style={{ marginTop: "2.5rem" }}>
            <div className="profile-password-title">Ubah Password</div>
            <form onSubmit={handleSubmitPasswordChange} className="profile-form" id="passwordForm">
              <div className="form-group">
                <label htmlFor="password_lama" className="form-label">Password Lama</label>
                <input
                  type="password"
                  name="oldPassword"
                  id="password_lama"
                  className="form-input"
                  value={passwordData.oldPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password Baru</label>
                <input
                  type="password"
                  name="newPassword"
                  id="password"
                  className="form-input"
                  value={passwordData.newPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password_confirmation" className="form-label">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="password_confirmation"
                  className="form-input"
                  value={passwordData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="modal-actions" style={{ marginTop: "1.5rem" }}>
                <button type="submit" className="btn-primary"><i className="fas fa-key"></i> Ubah Password</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
