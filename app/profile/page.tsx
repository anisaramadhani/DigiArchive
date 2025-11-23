"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Profile from "../../components/Profile";

interface User {
  nama?: string;
  email?: string;
  npm?: string;
  jurusan?: string;
  foto?: string;
  created_at?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login"); // redirect ke login jika token tidak ada
      return;
    }

    // Fetch data user dari backend
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => setErrorMessage("Gagal memuat data user"));
  }, [router]);

  const handleLogout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.removeItem("token");
    router.replace("/login");
  };

  const handlePasswordChange = async (data: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User tidak login");

    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Gagal mengubah password");
    }

    setSuccessMessage("Password berhasil diubah");
    setErrorMessage("");
  };

  return (
    <Profile
      user={user || undefined}
      successMessage={successMessage}
      errorMessage={errorMessage}
      handleLogout={handleLogout}
      handlePasswordChange={handlePasswordChange}
    />
  );
}
