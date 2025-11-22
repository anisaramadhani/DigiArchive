"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '../Dashboard';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.replace('/login');
  }, [router]);

  // You can pass real stats via props or fetch inside the Dashboard component
  return <Dashboard totalArsip={120} totalArsipHariIni={5} arsipBulanIni={30} />;
}
