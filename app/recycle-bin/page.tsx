"use client";
import { useEffect, useState } from "react";
import DeletedDocuments from "../../components/DeletedDocument";

interface DeletedDoc {
  _id: string;
  documentId: string;
  title: string;
  category: string;
  deletedAt: string;
}

interface DeletedDocument {
  id: number;
  judul: string;
  title: string;
  file: string;
  deletedAt: number;
}

export default function RecycleBinPage() {
  const [deletedDocs, setDeletedDocs] = useState<DeletedDocument[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data dari backend (API Route Next.js)
  useEffect(() => {
    async function fetchDeletedDocs() {
      try {
        const res = await fetch("/api/documents/recycle-bin");
        if (!res.ok) throw new Error("Gagal mengambil data");
        const data = await res.json();
        
        if (data.success && data.data) {
          const formattedDocs = data.data.map((doc: DeletedDoc, idx: number) => ({
            id: idx,
            judul: doc.title,
            title: doc.title,
            file: doc.title,
            deletedAt: new Date(doc.deletedAt).getTime(),
          }));
          setDeletedDocs(formattedDocs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDeletedDocs();
  }, []);

  // Restore dokumen
  const handleRestore = async (id: number) => {
    try {
      const doc = deletedDocs[id];
      const res = await fetch(`/api/documents/recycle-bin`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: doc.file }),
      });
      if (!res.ok) throw new Error("Gagal restore dokumen");
      setDeletedDocs(deletedDocs.filter((_, idx) => idx !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Hapus permanen dokumen
  const handlePermanentDelete = async (id: number) => {
    try {
      const doc = deletedDocs[id];
      const res = await fetch(`/api/documents/recycle-bin?id=${doc.file}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal hapus dokumen");
      setDeletedDocs(deletedDocs.filter((_, idx) => idx !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <nav className="sidebar">
          <div className="sidebar-header">
            <h1><i className="fas fa-archive"></i> DigiArchive</h1>
          </div>
        </nav>
        <main className="main-content" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <DeletedDocuments
      deletedDocs={deletedDocs}
      onRestore={handleRestore}
      onPermanentDelete={handlePermanentDelete}
    />
  );
}
