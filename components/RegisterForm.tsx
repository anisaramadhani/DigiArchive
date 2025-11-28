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
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi password
    if (formData.password !== formData.password_confirmation) {
      setErrors(['Password dan Konfirmasi Password tidak cocok']);
      return;
    }

    if (formData.password.length < 8) {
      setErrors(['Password minimal 8 karakter']);
      return;
    }

    setErrors([]);

    // Call register API
    (async () => {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            npm: formData.npm,
            name: formData.nama,
            email: formData.email,
            password: formData.password,
            jurusan: formData.jurusan,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrors([data?.error || 'Registrasi gagal']);
          return;
        }

        // Registrasi berhasil, langsung login
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            npm: formData.npm,
            password: formData.password,
          }),
        });

        const loginData = await loginRes.json();

        if (loginRes.ok && loginData?.token) {
          localStorage.setItem('token', loginData.token);
          if (loginData?.user) {
            localStorage.setItem('user', JSON.stringify(loginData.user));
          }
          router.push('/dashboard');
        } else {
          alert('Registrasi berhasil! Silakan login.');
          router.push('/login');
        }
      } catch (err) {
        setErrors(['Gagal terhubung ke server. Pastikan server berjalan.']);
      }
    })();
  };

  return (
    <div className="page-center">
      <div className="register-wrapper">
        <div className="register-left">
          <div className="logo-circle">
            <Image src="/images/landing-hero.png" alt="Logo DigiArchive" className="logo-img" width={100} height={100} />
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
                <ul>
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
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
                  placeholder="NPM"
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
                  placeholder="Minimal 8 karakter"
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

            <button type="submit" className="btn-register">Daftar Sekarang</button>
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
