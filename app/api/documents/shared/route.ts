import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const npm = url.searchParams.get('npm');

    if (!npm) {
      return NextResponse.json({ 
        error: 'NPM required' 
      }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Get documents shared with this user
    const sharedDocuments = await db.collection('arsip')
      .find({ 
        'sharedWith.npm': npm,
        deleted: { $ne: true }
      })
      .sort({ createdAt: -1 })
      .toArray();

    // Format documents with permission info
    const formattedDocs = await Promise.all(sharedDocuments.map(async (doc) => {
      const shareInfo = doc.sharedWith?.find((share: any) => share.npm === npm);
      
      // Get owner name from users collection
      const owner = await db.collection('users').findOne({ npm: doc.npm });
      
      return {
        _id: doc._id.toString(),
        namaFile: doc.title || doc.namaFile || doc.judul || 'Dokumen',
        kategori: doc.category || doc.kategori || 'Lainnya',
        deskripsi: doc.description || doc.deskripsi || '',
        fileUrl: doc.image || doc.fileUrl || doc.file || '',
        fileName: doc.fileName || doc.file_asli || doc.title || 'file',
        fileType: doc.fileType || '',
        fileSize: doc.fileSize || 0,
        createdAt: doc.createdAt || doc.tanggal_upload || new Date(),
        myPermission: shareInfo?.permission || 'view',
        sharedBy: doc.npm,
        sharedByName: owner?.name || 'Unknown User',
        sharedAt: shareInfo?.sharedAt
      };
    }));

    return NextResponse.json({
      documents: formattedDocs
    }, { status: 200 });

  } catch (err) {
    console.error('Get shared documents error:', err);
    return NextResponse.json({ 
      error: 'Gagal mengambil dokumen yang dibagikan' 
    }, { status: 500 });
  }
}
