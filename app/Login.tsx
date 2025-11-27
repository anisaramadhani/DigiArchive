"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '../style/login.css';

const Login: React.FC = () => {
  const [npm, setNpm] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'npm') {
      setNpm(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!npm || !password) {
      setErrors(['NPM dan Password harus diisi']);
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ npm, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors([data?.message || 'Login failed']);
        return;
      }

      // Simpan token dan user data
      if (data?.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      router.push('/dashboard');
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
          <div className="logo-img">
            <Image src="/images/Logo 2.png" alt="Logo DigiArchive" width={150} height={150} />
          </div>
          <h1>DigiArchive</h1>
          <p>Masuk ke sistem pengelolaan arsip digital yang modern dan efisien</p>
        </div>
        <div className="register-right">
          <form className="register-form" onSubmit={handleSubmit}>
            <h2>Login</h2>
            <p className="subtitle">Masuk ke akun DigiArchive Anda</p>

            {errors.length > 0 && (
              <div className="alert">
                {errors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
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
                  placeholder="NPM Anda"
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
            <button type="submit" className="btn-register" disabled={loading}>
              {loading ? 'Sedang masuk...' : 'Masuk'}
            </button>
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
