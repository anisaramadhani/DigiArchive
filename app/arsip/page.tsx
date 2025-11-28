"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Archive from '../../components/Archive';
import '../../style/Archive.css';

interface ArchiveItem {
  id: string | number;
  judul: string;
  kategori: string;
  file?: string;
  file_asli?: string;
  fileUrl?: string;
  tanggal_upload?: string;
}

const ArsipPage = () => {
  const router = useRouter();
  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const [success, setSuccess] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);

  const fetchArchives = async () => {
    const userDataStr = localStorage.getItem('user');
    if (!userDataStr) return;

    const userData = JSON.parse(userDataStr);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`/api/documents/list?npm=${userData.npm}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.arsip) {
        setArchives(data.arsip);
      }
    } catch (err) {
      console.error('Error fetching archives:', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }
    fetchArchives();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push('/');
  };

  const handleAddArchive = async (form: FormData) => {
    const userDataStr = localStorage.getItem('user');
    if (!userDataStr) return;

    const userData = JSON.parse(userDataStr);
    const token = localStorage.getItem('token');

    const judul = form.get('judul') as string;
    const kategori = form.get('kategori') as string;
    const file = form.get('file') as File;

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch('/api/documents/add', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            title: judul,
            category: kategori,
            image: reader.result,
            fileName: file.name, // Simpan nama file asli
            fileType: file.type, // Simpan tipe file
            npm: userData.npm,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setSuccess('Arsip berhasil ditambahkan!');
          setErrors([]);
          fetchArchives();
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setErrors([data.message || 'Gagal menambahkan arsip']);
        }
      } catch (err) {
        setErrors(['Gagal terhubung ke server']);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteArchive = async (id: string | number) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/documents/delete?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('Arsip berhasil dihapus!');
        setErrors([]);
        fetchArchives();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setErrors([data.error || 'Gagal menghapus arsip']);
      }
    } catch (err) {
      setErrors(['Gagal terhubung ke server']);
    }
  };

  const handleUpdateArchive = async (id: string | number, form: FormData) => {
    const token = localStorage.getItem('token');
    const judul = form.get('judul') as string;
    const kategori = form.get('kategori') as string;
    const file = form.get('file') as File;

    const updateData: any = {
      id,
      title: judul,
      category: kategori,
    };

    if (file && file.size > 0) {
      const reader = new FileReader();
      reader.onload = async () => {
        updateData.image = reader.result;
        await sendUpdate();
      };
      reader.readAsDataURL(file);
    } else {
      await sendUpdate();
    }

    async function sendUpdate() {
      try {
        const res = await fetch('/api/documents/update', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(updateData),
        });

        const data = await res.json();
        if (res.ok) {
          setSuccess('Arsip berhasil diupdate!');
          setErrors([]);
          fetchArchives();
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setErrors([data.error || 'Gagal mengupdate arsip']);
        }
      } catch (err) {
        setErrors(['Gagal terhubung ke server']);
      }
    }
  };

  return (
    <Archive
      archives={archives}
      success={success}
      errors={errors}
      onLogout={handleLogout}
      onAddArchive={handleAddArchive}
      onDeleteArchive={handleDeleteArchive}
      onUpdateArchive={handleUpdateArchive}
    />
  );
};

export default ArsipPage;
