import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
<<<<<<< HEAD
import DeletedDocument from '@/lib/models/DeletedDocument';
import Document from '@/lib/models/Document';
=======
import DeletedDocument from '../../../../lib/models/deleteddocument';
import Document from '../../../../lib/models/document';
>>>>>>> 3720c41f7b6f9f816a147b70cea4b23939feb66f

async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

// GET all deleted documents
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = request.headers.get('x-user-id') || 'demo-user';

    const deletedDocs = await DeletedDocument.find({ userId }).sort({ deletedAt: -1 });

    return NextResponse.json({ success: true, data: deletedDocs });
  } catch (error) {
    console.error('Error fetching deleted documents:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch deleted documents' }, { status: 500 });
  }
}

// PATCH restore document
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const userId = request.headers.get('x-user-id') || 'demo-user';
    const body = await request.json();
    const { documentId } = body;

    if (!documentId) {
      return NextResponse.json({ success: false, error: 'Document ID is required' }, { status: 400 });
    }

    // Find deleted document
    const deletedDoc = await DeletedDocument.findOne({
      documentId,
      userId,
    });

    if (!deletedDoc) {
      return NextResponse.json({ success: false, error: 'Deleted document not found' }, { status: 404 });
    }

    // Restore original document
    const document = await Document.findById(documentId);
    if (document) {
      document.isDeleted = false;
      document.deletedAt = null;
      await document.save();
    }

    // Remove from deleted documents
    await DeletedDocument.deleteOne({ _id: deletedDoc._id });

    return NextResponse.json({ success: true, message: 'Document restored successfully' });
  } catch (error) {
    console.error('Error restoring document:', error);
    return NextResponse.json({ success: false, error: 'Failed to restore document' }, { status: 500 });
  }
}

// DELETE permanently
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const userId = request.headers.get('x-user-id') || 'demo-user';
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');

    if (!documentId) {
      return NextResponse.json({ success: false, error: 'Document ID is required' }, { status: 400 });
    }

    // Find and delete the document record
    const document = await Document.findOne({ _id: documentId, userId });
    if (document) {
      await Document.deleteOne({ _id: documentId });
    }

    // Delete from recycle bin
    await DeletedDocument.deleteOne({ documentId, userId });

    return NextResponse.json({ success: true, message: 'Document permanently deleted' });
  } catch (error) {
    console.error('Error permanently deleting document:', error);
    return NextResponse.json({ success: false, error: 'Failed to permanently delete document' }, { status: 500 });
  }
}
