import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Document from '../../../lib/models/document';
import DeletedDocument from '../../../lib/models/deleteddocument';

// Connect to database
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

// GET all documents (not deleted)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get user ID from session/token (for now using demo user)
    const userId = request.headers.get('x-user-id') || 'demo-user';

    const documents = await Document.find({
      userId: userId,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch documents' }, { status: 500 });
  }
}

// POST add new document
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userId = request.headers.get('x-user-id') || 'demo-user';
    const body = await request.json();

    const { title, description, category, imageData, fileName } = body;

    if (!title || !imageData) {
      return NextResponse.json({ success: false, error: 'Title and image are required' }, { status: 400 });
    }

    const newDocument = new Document({
      userId,
      title: title || 'Untitled Document',
      description: description || '',
      category: category || 'Lainnya',
      imageData,
      fileName: fileName || `${Date.now()}.jpg`,
      fileSize: imageData.length,
    });

    await newDocument.save();

    return NextResponse.json({ success: true, data: newDocument }, { status: 201 });
  } catch (error) {
    console.error('Error adding document:', error);
    return NextResponse.json({ success: false, error: 'Failed to add document' }, { status: 500 });
  }
}

// DELETE document (soft delete - move to recycle bin)
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const userId = request.headers.get('x-user-id') || 'demo-user';
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');

    if (!documentId) {
      return NextResponse.json({ success: false, error: 'Document ID is required' }, { status: 400 });
    }

    // Find document
    const document = await Document.findById(documentId);
    if (!document || document.userId.toString() !== userId) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    // Create deleted document record
    const deletedDoc = new DeletedDocument({
      userId,
      documentId: document._id,
      title: document.title,
      category: document.category,
      imageData: document.imageData,
      deletedAt: new Date(),
    });

    await deletedDoc.save();

    // Mark original document as deleted
    document.isDeleted = true;
    document.deletedAt = new Date();
    await document.save();

    return NextResponse.json({ success: true, message: 'Document moved to recycle bin' });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete document' }, { status: 500 });
  }
}
