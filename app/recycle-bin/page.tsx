"use client";
import { useEffect, useState } from "react";
import DeletedDocuments from "../../components/DeletedDocument";

interface DeletedDocument {
  id: number;
  judul: string;
  title: string;
  file: string;
  deletedAt: number;
}

export default function RecycleBinPage() {
  const [deletedDocs, setDeletedDocs] = useState<DeletedDocument[]>([]);

  // Fetch data dari backend (API Route Next.js)
  useEffect(() => {
    async function fetchDeletedDocs() {
      try {
        const res = await fetch("/api/deleted-docs");
        if (!res.ok) throw new Error("Gagal mengambil data");
        const data = await res.json();
        setDeletedDocs(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchDeletedDocs();
  }, []);

  // Restore dokumen
  const handleRestore = async (id: number) => {
    try {
      const res = await fetch(`/api/deleted-docs/restore/${id}`, { method: "PUT" });
      if (!res.ok) throw new Error("Gagal restore dokumen");
      setDeletedDocs(deletedDocs.filter(doc => doc.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Hapus permanen dokumen
  const handlePermanentDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/deleted-docs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal hapus dokumen");
      setDeletedDocs(deletedDocs.filter(doc => doc.id !== id));
    } catch (err) {
      console.error(err);
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
