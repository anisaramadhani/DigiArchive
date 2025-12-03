import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// POST - Share document with another user
export async function POST(req: NextRequest) {
  try {
    const { documentId, shareWithNpm, permission } = await req.json();

    if (!documentId || !shareWithNpm || !permission) {
      return NextResponse.json(
        { error: 'Document ID, NPM, dan permission harus diisi' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Check if target user exists
    const targetUser = await db.collection('users').findOne({ npm: shareWithNpm });
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User dengan NPM tersebut tidak ditemukan' },
        { status: 404 }
      );
    }

    // Get the document
    const document = await db.collection('arsip').findOne({ 
      _id: new ObjectId(documentId) 
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Dokumen tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check if already shared with this user
    const alreadyShared = document.sharedWith?.some(
      (share: any) => share.npm === shareWithNpm
    );

    if (alreadyShared) {
      return NextResponse.json(
        { error: 'Dokumen sudah dibagikan ke user ini' },
        { status: 400 }
      );
    }

    // Add to sharedWith array
    await db.collection('arsip').updateOne(
      { _id: new ObjectId(documentId) },
      {
        $push: {
          sharedWith: {
            npm: shareWithNpm,
            name: targetUser.name,
            permission: permission,
            sharedAt: new Date()
          }
        } as any
      }
    );

    return NextResponse.json({
      message: `Dokumen berhasil dibagikan ke ${targetUser.name}`,
      success: true
    });

  } catch (err) {
    console.error('Share document error:', err);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// DELETE - Remove user access from document
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get('documentId');
    const npm = searchParams.get('npm');

    if (!documentId || !npm) {
      return NextResponse.json(
        { error: 'Document ID dan NPM harus diisi' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Remove from sharedWith array
    await db.collection('arsip').updateOne(
      { _id: new ObjectId(documentId) },
      {
        $pull: {
          sharedWith: { npm: npm } as any
        }
      }
    );

    return NextResponse.json({
      message: 'Akses user berhasil dihapus',
      success: true
    });

  } catch (err) {
    console.error('Remove access error:', err);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
