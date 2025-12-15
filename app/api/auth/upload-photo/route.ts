import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get form data
    const formData = await req.formData();
    const photo = formData.get('photo') as File;
    const npm = formData.get('npm') as string;

    if (!photo || !npm) {
      return NextResponse.json({ 
        error: 'Photo and NPM are required' 
      }, { status: 400 });
    }

    // Convert photo to buffer
    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Update database: store buffer in MongoDB
    const { db } = await connectToDatabase();
    await db.collection('users').updateOne(
      { npm: npm.toString() },
      {
        $set: {
          fotoBuffer: buffer,
          fotoType: photo.type,
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({
      message: 'Photo uploaded successfully'
    }, { status: 200 });

  } catch (err) {
    console.error('Upload photo error:', err);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// GET endpoint to retrieve profile photo
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
    const user = await db.collection('users').findOne({ npm: npm.toString() });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.fotoBuffer) {
      return NextResponse.json({ foto: null }, { status: 200 });
    }

    // Return base64 string and mime type
    const base64 = user.fotoBuffer.toString('base64');
    const mimeType = user.fotoType || 'image/jpeg';
    return NextResponse.json({
      foto: `data:${mimeType};base64,${base64}`
    }, { status: 200 });

  } catch (err) {
    console.error('Get photo error:', err);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
