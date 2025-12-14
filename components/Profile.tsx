"use client";
import React, { useState, ChangeEvent, FormEvent, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ImageCropper from "./ImageCropper";
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
  handlePhotoUpload?: (photo: Blob) => Promise<void>;
}

const Profile: React.FC<ProfileProps> = ({
  user = {},
  successMessage,
  errorMessage,
  handleLogout,
  handlePasswordChange,
  handlePhotoUpload,
}) => {
  const router = useRouter();
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setShowCropper(true);
        setShowPhotoOptions(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedImage: Blob) => {
    if (handlePhotoUpload) {
      try {
        await handlePhotoUpload(croppedImage);
        setShowCropper(false);
        setSelectedImage(null);
      } catch (error: any) {
        alert("Gagal mengupload foto: " + error.message);
      }
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setSelectedImage(null);
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
    setShowPhotoOptions(false);
  };

  const openCamera = async () => {
    setShowPhotoOptions(false);
    setShowCameraModal(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.');
      setShowCameraModal(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      
      // Stop camera stream
      stopCamera();
      
      // Open cropper with captured image
      setSelectedImage(imageData);
      setShowCropper(true);
      setShowCameraModal(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const closeCameraModal = () => {
    stopCamera();
    setShowCameraModal(false);
  };

  return (
    <div>
      <nav className="sidebar" id="sidebar">
        <div className="sidebar-header">
          <h1><i className="fas fa-archive"></i> DigiArchive</h1>
          <p>Sistem Pengelolaan Arsip Digital</p>
        </div>
        <div className="sidebar-nav">
          <Link href="/dashboard" className="nav-item"><i className="fa-solid fa-layer-group"></i> Beranda</Link>
          <Link href="/tambah-dokumen" className="nav-item"><i className="fa fa-camera"></i> Tambah Dokumen</Link>
          <Link href="/arsip" className="nav-item"><i className="fas fa-folder-open"></i> Daftar Arsip</Link>
          <Link href="/kolaborasi" className="nav-item"><i className="fas fa-users"></i> Bagikan</Link>
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
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar" style={{ marginBottom: "0.7rem" }}>
                {user?.foto ? (
                  <img src={user.foto} alt="Foto Profil" />
                ) : (
                  <i className="fas fa-user"></i>
                )}
              </div>
              <button 
                className="change-photo-btn" 
                onClick={() => setShowPhotoOptions(!showPhotoOptions)}
                title="Ubah Foto Profile"
              >
                <i className="fas fa-camera"></i>
              </button>
              
              {showPhotoOptions && (
                <div className="photo-options-menu">
                  <button onClick={openCamera} className="photo-option">
                    <i className="fas fa-camera"></i> Ambil Foto
                  </button>
                  <button onClick={openFileSelector} className="photo-option">
                    <i className="fas fa-upload"></i> Upload File
                  </button>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
            </div>
            <div className="profile-identity">
              <div className="profile-name">{user?.nama}</div>
              <div className="profile-email">{user?.email}</div>
            </div>
          </div>
          
          {showCropper && selectedImage && (
            <ImageCropper
              image={selectedImage}
              onCropComplete={handleCropComplete}
              onCancel={handleCropCancel}
            />
          )}

          <div className="profile-info-section">
            <div className="profile-info-title">Informasi Akun</div>
            <div className="profile-info-fields">
              <div className="profile-info-field">
                <label>Nama:</label>
                <div className="profile-info-value">{user?.nama}</div>
              </div>
              <div className="profile-info-field">
          {showCameraModal && (
            <div className="camera-modal">
              <div className="camera-modal-content">
                <h3 className="camera-title">Ambil Foto Profile</h3>
                <div className="camera-preview">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline
                    className="camera-video"
                  />
                </div>
                <div className="camera-actions">
                  <button onClick={closeCameraModal} className="btn-cancel">
                    <i className="fas fa-times"></i> Batal
                  </button>
                  <button onClick={capturePhoto} className="btn-capture">
                    <i className="fas fa-camera"></i> Ambil Foto
                  </button>
                </div>
              </div>
            </div>
          )}

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
