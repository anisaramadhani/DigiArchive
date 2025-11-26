"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '../style/Register.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    npm: '',
    jurusan: '',
    password: '',
    password_confirmation: '',
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    // Validasi
    if (!formData.nama) newErrors.push('Nama lengkap harus diisi');
    if (!formData.email) newErrors.push('Email harus diisi');
    if (!formData.npm) newErrors.push('NPM harus diisi');
    if (!formData.jurusan) newErrors.push('Jurusan harus diisi');
    if (!formData.password) newErrors.push('Password harus diisi');
    if (formData.password.length < 6) newErrors.push('Password minimal 6 karakter');
    if (formData.password !== formData.password_confirmation) newErrors.push('Password tidak cocok');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: formData.nama,
          email: formData.email,
          npm: formData.npm,
          jurusan: formData.jurusan,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors([data?.message || 'Registrasi gagal']);
        return;
      }

      // Registrasi berhasil, redirect ke login
      alert('Pendaftaran berhasil! Silakan login dengan akun Anda.');
      router.push('/login');
    } catch (err) {
      setErrors(['Terjadi kesalahan network']);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="register-wrapper">
        <div className="register-left">
          <div className="logo-circle">
            <Image src="/images/landing-hero.png" alt="Logo DigiArchive" width={150} height={150} />
          </div>
          <h1>DigiArchive</h1>
          <p>Bergabunglah dengan sistem pengelolaan arsip digital yang modern dan efisien</p>
        </div>
        <div className="register-right">
          <form className="register-form" onSubmit={handleSubmit}>
            <h2>Daftar Akun</h2>
            <p className="subtitle">Buat akun DigiArchive baru</p>

            {errors.length > 0 && (
              <div className="alert">
                {errors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nama">Nama Lengkap</label>
                <input
                  type="text"
                  name="nama"
                  id="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  placeholder="Nama lengkap"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email aktif"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="npm">NPM</label>
                <input
                  type="text"
                  name="npm"
                  id="npm"
                  value={formData.npm}
                  onChange={handleInputChange}
                  placeholder="NPM Anda"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="jurusan">Jurusan</label>
                <input
                  type="text"
                  name="jurusan"
                  id="jurusan"
                  value={formData.jurusan}
                  onChange={handleInputChange}
                  placeholder="Jurusan"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Minimal 6 karakter"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password_confirmation">Konfirmasi Password</label>
                <input
                  type="password"
                  name="password_confirmation"
                  id="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  placeholder="Ulangi password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-register" disabled={loading}>
              {loading ? 'Sedang mendaftar...' : 'Daftar Sekarang'}
            </button>
            <p className="back-link">
              Sudah punya akun? <a href="/login">Masuk di sini</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
