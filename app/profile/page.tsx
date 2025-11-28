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
    const userData = localStorage.getItem("currentUser");
    if (!userData) {
      router.replace("/login");
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch {
      setErrorMessage("Gagal memuat data user");
    }
  }, [router]);

  const handleLogout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    router.replace("/login");
  };

  const handlePasswordChange = async (data: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
    const userData = localStorage.getItem("currentUser");
    if (!userData) throw new Error("User tidak login");

    try {
      const user = JSON.parse(userData);
      
      // Check old password
      if (user.password !== data.oldPassword) {
        throw new Error("Password lama tidak sesuai");
      }

      // Update password
      user.password = data.newPassword;
      localStorage.setItem("currentUser", JSON.stringify(user));
      
      // Update di users list
      const users = JSON.parse(localStorage.getItem("digiarchive_users") || "[]");
      const userIdx = users.findIndex((u: any) => u.email === user.email);
      if (userIdx !== -1) {
        users[userIdx].password = data.newPassword;
        localStorage.setItem("digiarchive_users", JSON.stringify(users));
      }

      setSuccessMessage("Password berhasil diubah");
      setErrorMessage("");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Gagal mengubah password");
    }
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
