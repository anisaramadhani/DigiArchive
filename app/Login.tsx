"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use app-router navigation
import Image from 'next/image';
import '../style/Register.css';

const Login: React.FC = () => {
  // State untuk mengelola input formulir
  const [npm, setNpm] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  // Inisialisasi useRouter untuk pengalihan (app router)
  const router = useRouter();

  // Menangani perubahan input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'npm') {
      setNpm(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  // Menangani pengiriman formulir
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!npm || !password) {
      setErrors(['NPM dan Password harus diisi']);
      return;
    }

    setErrors([]);

    // Call demo API route
    (async () => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ npm, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrors([data?.error || 'Login failed']);
          return;
        }

        // store demo token and redirect
        if (data?.token) {
          localStorage.setItem('token', data.token);
        }
        router.push('/dashboard');
      } catch (err) {
        setErrors(['Network error']);
      }
    })();
  };

  return (
    <div className="page-center">
      <div className="register-wrapper">
        <div className="register-left">
          <div className="logo-img">
            <Image src="/images/Logo 2.png" alt="Logo DigiArchive" className="logo-img" width={100} height={100} />
          </div>
          <h1>DigiArchive</h1>
          <p>Masuk ke sistem pengelolaan arsip digital yang modern dan efisien</p>
        </div>
        <div className="register-right">
          <form className="register-form" onSubmit={handleSubmit}>
            <h2>Login</h2>
            <p className="subtitle">Masuk ke akun DigiArchive Anda</p>

            {/* Menampilkan error jika ada */}
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
                <label htmlFor="npm">NPM</label>
                <input
                  type="text"
                  name="npm"
                  id="npm"
                  value={npm}
                  onChange={handleInputChange}
                  placeholder="NPM"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-register">Masuk</button>
            <p className="back-link">
              Belum punya akun? <a href="/register">Daftar di sini</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
