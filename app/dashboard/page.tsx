"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.replace('/login');
  };

  return (
    <div style={{ padding: 40, maxWidth: 960, margin: '0 auto' }}>
      <h1>Dashboard</h1>
      <p>Selamat datang di dashboard demo DigiArchive.</p>
      <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
    </div>
  );
}
