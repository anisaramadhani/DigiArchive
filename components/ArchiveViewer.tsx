"use client";
import React, { useEffect, useState } from "react";

type ServerDoc = {
  _id: string;
  title: string;
  category?: string;
  imageData: string;
  createdAt?: string;
};

type LocalDoc = {
  id: number;
  title?: string;
  category?: string;
  image: string;
  createdAt?: string;
  _savedToServer?: boolean;
};

export default function ArchiveViewer() {
  const [serverDocs, setServerDocs] = useState<ServerDoc[]>([]);
  const [localDocs, setLocalDocs] = useState<LocalDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);

      // Fetch server-side documents
      try {
        const res = await fetch('/api/documents');
        if (res.ok) {
          const json = await res.json();
          if (mounted && json && Array.isArray(json.data)) {
            setServerDocs(json.data);
          }
        } else {
          // treat as no server docs
          console.warn('Failed fetching server docs', res.status);
        }
      } catch (err) {
        console.warn('Error fetching server docs', err);
      }

      // Load localStorage fallback
      try {
        const raw = localStorage.getItem('digiarchive_local_arsip') || '[]';
        const parsed = JSON.parse(raw) as LocalDoc[];
        if (mounted) setLocalDocs(parsed || []);
      } catch (err) {
        console.warn('Error reading local docs', err);
        setLocalDocs([]);
      }

      setLoading(false);
    }

    load();
    return () => { mounted = false; };
  }, []);

  // Combine server and local docs: include local items that are not saved to server
  const merged = [
    ...serverDocs.map(d => ({
      id: d._id,
      title: d.title,
      category: d.category,
      image: d.imageData,
      createdAt: d.createdAt || '',
      _savedToServer: true,
    })),
    ...localDocs.filter(ld => !ld._savedToServer).map(ld => ({
      id: String(ld.id),
      title: ld.title || 'Dokumen Lokal',
      category: ld.category,
      image: ld.image,
      createdAt: ld.createdAt || '',
      _savedToServer: false,
    }))
  ];

  return (
    <div className="archive-list">
      <div className="archive-header flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Daftar Arsip</h2>
      </div>

      {loading && <p>Memuat arsip...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && merged.length === 0 && (
        <p className="text-gray-600">Belum ada arsip. Tambah dokumen terlebih dahulu.</p>
      )}

      <div className="archive-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {merged.map(item => (
          <div key={item.id} className="archive-card p-2 border rounded">
            <div className="archive-thumb mb-2" style={{height:180, overflow:'hidden'}}>
              <img src={item.image} alt={item.title} style={{width:'100%', objectFit:'cover'}} />
            </div>
            <div className="archive-meta">
              <div className="font-semibold">{item.title}</div>
              <div className="text-sm text-gray-500">{item.category || 'Lainnya'}</div>
              <div className="text-xs text-gray-400">{item._savedToServer ? 'Tersimpan (server)' : 'Tersimpan (lokal)'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
