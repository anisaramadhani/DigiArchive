"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '../Dashboard';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalArsip: 0,
    totalArsipHariIni: 0,
    arsipBulanIni: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    // Get user data
    const userDataStr = localStorage.getItem('user');
    if (!userDataStr) {
      router.replace('/login');
      return;
    }

    const userData = JSON.parse(userDataStr);

    // Fetch dashboard stats
    fetch(`/api/dashboard/stats?npm=${userData.npm}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error('Error fetching stats:', data.error);
        } else {
          setStats({
            totalArsip: data.totalArsip || 0,
            totalArsipHariIni: data.totalArsipHariIni || 0,
            arsipBulanIni: data.arsipBulanIni || 0
          });
        }
      })
      .catch(err => {
        console.error('Error:', err);
      });
  }, [router]);

  return <Dashboard totalArsip={stats.totalArsip} totalArsipHariIni={stats.totalArsipHariIni} arsipBulanIni={stats.arsipBulanIni} />;
}
