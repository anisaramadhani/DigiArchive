"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DeletedDocuments from "../../components/DeletedDocument";

interface DeletedDocument {
  id: number;
  judul: string;
  title: string;
  file: string;
  deletedAt: number;
}

export default function RecycleBinPage() {
  const router = useRouter();
  const [deletedDocs, setDeletedDocs] = useState<DeletedDocument[]>([]);

  // Fetch data dari backend
  const fetchDeletedDocs = async () => {
    const userDataStr = localStorage.getItem('user');
    if (!userDataStr) return;

    const userData = JSON.parse(userDataStr);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`/api/recycle-bin?npm=${userData.npm}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setDeletedDocs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }
    fetchDeletedDocs();
  }, [router]);

  // Restore dokumen
  const handleRestore = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/recycle-bin`, {
        method: "PUT",
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id: id.toString() })
      });
      
      if (!res.ok) throw new Error("Gagal restore dokumen");
      
      // Refresh list
      fetchDeletedDocs();
      alert('Dokumen berhasil dipulihkan!');
    } catch (err) {
      console.error(err);
      alert('Gagal restore dokumen');
    }
  };

  // Hapus permanen dokumen
  const handlePermanentDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/recycle-bin?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error("Gagal hapus dokumen");
      
      // Refresh list
      fetchDeletedDocs();
      alert('Dokumen berhasil dihapus permanen!');
    } catch (err) {
      console.error(err);
      alert('Gagal hapus dokumen');
    }
  };

  return (
    <DeletedDocuments
      deletedDocs={deletedDocs}
      onRestore={handleRestore}
      onPermanentDelete={handlePermanentDelete}
    />
  );
}
