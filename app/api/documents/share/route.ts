import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Share dokumen ke user lain
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { documentId, shareWithNpm, permission } = body;

    if (!documentId || !shareWithNpm || !permission) {
      return NextResponse.json({ 
        error: 'Document ID, NPM, dan permission wajib diisi' 
      }, { status: 400 });
    }

    // Validasi permission
    if (!['view', 'download', 'edit'].includes(permission)) {
      return NextResponse.json({ 
        error: 'Permission harus: view, download, atau edit' 
      }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Cek apakah user yang akan di-share ada di database
    const targetUser = await db.collection('users').findOne({ npm: shareWithNpm });
    if (!targetUser) {
      return NextResponse.json({ 
        error: 'User dengan NPM tersebut tidak ditemukan' 
      }, { status: 404 });
    }

    // Cek apakah dokumen ada
    const document = await db.collection('arsip').findOne({ 
      _id: new ObjectId(documentId)
    });

    if (!document) {
      return NextResponse.json({ 
        error: 'Dokumen tidak ditemukan' 
      }, { status: 404 });
    }

    // Update dokumen dengan shared info
    const sharedWith = document.sharedWith || [];
    
    // Cek apakah sudah pernah di-share ke user ini
    const existingShareIndex = sharedWith.findIndex((share: any) => share.npm === shareWithNpm);
    
    if (existingShareIndex !== -1) {
      // Update permission yang sudah ada
      sharedWith[existingShareIndex] = {
        npm: shareWithNpm,
        name: targetUser.name,
        permission: permission,
        sharedAt: new Date()
      };
    } else {
      // Tambah user baru
      sharedWith.push({
        npm: shareWithNpm,
        name: targetUser.name,
        permission: permission,
        sharedAt: new Date()
      });
    }

    await db.collection('arsip').updateOne(
      { _id: new ObjectId(documentId) },
      { $set: { sharedWith: sharedWith } }
    );

    return NextResponse.json({
      success: true,
      message: `Dokumen berhasil dibagikan ke ${targetUser.name} dengan permission ${permission}`
    }, { status: 200 });

  } catch (err) {
    console.error('Share document error:', err);
    return NextResponse.json({ 
      error: 'Gagal membagikan dokumen' 
    }, { status: 500 });
  }
}

// Hapus akses user dari dokumen
export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const documentId = url.searchParams.get('documentId');
    const npm = url.searchParams.get('npm');

    if (!documentId || !npm) {
      return NextResponse.json({ 
        error: 'Document ID dan NPM wajib diisi' 
      }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const result = await db.collection('arsip').updateOne(
      { _id: new ObjectId(documentId) },
      { 
        $pull: { 
          sharedWith: { npm: npm } as any
        } 
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Akses berhasil dihapus'
    }, { status: 200 });

  } catch (err) {
    console.error('Remove access error:', err);
    return NextResponse.json({ 
      error: 'Gagal menghapus akses' 
    }, { status: 500 });
  }
}
