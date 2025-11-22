"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// Navbar
const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <button className="logo" onClick={() => window.location.href = "/"} aria-label="Kembali ke halaman utama">
          <i className="fas fa-archive"></i> DigiArchive
        </button>
        
        <div className={`nav-links ${menuOpen ? 'open' : ''}`} id="navLinks">
          <a href="#fitur">Fitur</a>
          <a href="#tim">Tim</a>
          <a href="#tentang">Tentang</a>
        </div>

        <div className="auth-buttons">
          <a href="/login" className="btn btn-outline">
            <i className="fas fa-sign-in-alt"></i> Masuk
          </a>
          <a href="/register" className="btn btn-primary">
            <i className="fas fa-user-plus"></i> Daftar
          </a>
        </div>

        <div className="mobile-menu-toggle" onClick={toggleMenu} id="mobileMenuToggle">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

// Hero
const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1>Selamat Datang di DigiArchive</h1>
          <p>
            Sistem Pengelolaan Arsip Digital yang Mudah, Aman, dan Modern. Kelola semua dokumen penting Anda dengan teknologi terdepan.
          </p>
          <div className="hero-buttons">
            <Link href="/register" className="btn btn-primary btn-hero">
              <i className="fas fa-rocket"></i> Mulai Sekarang
            </Link>
            <a href="#fitur" className="btn btn-outline btn-hero">
              <i className="fas fa-info-circle"></i> Pelajari Lebih
            </a>
          </div>
        </div>
        <div className="hero-image">
          <Image src="/images/landing-hero.png" alt="Tampilan Dashboard DigiArchive" width={640} height={420} />
        </div>
      </div>
    </section>
  );
};

// Features
const Features: React.FC = () => {
  return (
    <section className="features" id="fitur">
      <div className="features-container">
        <div className="section-title">
          <h2>Fitur Unggulan</h2>
          <p>Nikmati berbagai fitur canggih yang memudahkan pengelolaan arsip digital Anda</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-cloud-upload-alt"></i>
            </div>
            <h3>Upload Arsip Mudah</h3>
            <p>Unggah dan kelola arsip digital Anda dengan cepat dan aman. Drag & drop untuk kemudahan maksimal.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-search"></i>
            </div>
            <h3>Pencarian Cepat</h3>
            <p>Cari arsip dengan mudah menggunakan fitur pencarian canggih berbasis AI dan filter otomatis.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3>Keamanan Data</h3>
            <p>Data arsip Anda terenkripsi end-to-end dan hanya bisa diakses oleh pengguna yang terotorisasi.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// About
const About: React.FC = () => {
  return (
    <section className="about" id="tentang">
      <div className="about-container">
        <h2>Tentang DigiArchive</h2>
        <p>
          DigiArchive adalah solusi pengelolaan arsip digital terdepan untuk organisasi modern. Dengan teknologi cloud
          computing dan artificial intelligence, kami menghadirkan pengalaman pengarsipan yang lebih efisien, aman, dan
          mudah diakses kapan saja, di mana saja. Bergabunglah dengan ribuan organisasi yang telah mempercayai DigiArchive
          untuk mengelola aset digital mereka.
        </p>
      </div>
    </section>
  );
};

// Team
const Team: React.FC = () => {
  return (
    <section className="team" id="tim">
      <div className="team-container">
        <div className="section-title">
          <h2>Tim Pengembang</h2>
          <p>Kenali tim profesional di balik DigiArchive</p>
        </div>
        <div className="team-grid">
          {/* Anggota Tim 1 */}
          <div className="team-card">
            <img src="/images/imageAnisa.png" alt="Anisa" className="team-photo" />
            <h3>Anisa Ramadhani</h3>
            <p>Frontend Developer & UI/UX Designer</p>
          </div>

          {/* Anggota Tim 2 */}
          <div className="team-card">
            <img src="/images/imageBunga.jpg" alt="Budi Santoso" className="team-photo" />
            <h3>Bunga Rasikhah Haya</h3>
            <p>Backend Developer</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main Landing Page
const Home: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <About />
      <Team />
    </div>
  );
};

export default Home;
