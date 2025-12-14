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
      router.replace("/login");
      return;
    }

    // Get user data from localStorage
    const userDataStr = localStorage.getItem("user");
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      
      // Fetch full user data from database
      fetch(`/api/auth/profile?npm=${userData.npm}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser(data.user);
          } else {
            // Fallback to localStorage data
            setUser(userData);
          }
        })
        .catch(() => {
          // Fallback to localStorage data
          setUser(userData);
          setErrorMessage("Gagal memuat data dari database, menggunakan data lokal");
        });
    } else {
      router.replace("/login");
    }
  }, [router]);

  const handleLogout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.clear();
    router.replace("/");
  };

  const handlePasswordChange = async (data: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
    const token = localStorage.getItem("token");
    const userDataStr = localStorage.getItem("user");
    
    if (!token || !userDataStr) throw new Error("User tidak login");

    const userData = JSON.parse(userDataStr);

    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        ...data,
        npm: userData.npm
      }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Gagal mengubah password");
    }

    setSuccessMessage("Password berhasil diubah");
    setErrorMessage("");
  };

  const handlePhotoUpload = async (photo: Blob) => {
    const token = localStorage.getItem("token");
    const userDataStr = localStorage.getItem("user");
    
    if (!token || !userDataStr) throw new Error("User tidak login");

    const userData = JSON.parse(userDataStr);

    // Create form data
    const formData = new FormData();
    formData.append("photo", photo, "profile.jpg");
    formData.append("npm", userData.npm);

    const res = await fetch("/api/auth/upload-photo", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Gagal mengupload foto");
    }

    const data = await res.json();
    
    // Update user state with new photo
    setUser(prev => prev ? { ...prev, foto: data.photoUrl } : null);
    setSuccessMessage("Foto profile berhasil diubah");
    setErrorMessage("");
    
    // Update localStorage
    const updatedUser = { ...userData, foto: data.photoUrl };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <Profile
      user={user || undefined}
      successMessage={successMessage}
      errorMessage={errorMessage}
      handleLogout={handleLogout}
      handlePasswordChange={handlePasswordChange}
      handlePhotoUpload={handlePhotoUpload}
    />
  );
}
